from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.db import models
from django.http import JsonResponse
from properties.forms import *
from properties.models import Avatar
from chats.models import Chat, Messege, MessageImage
from authentication.models import User
import json
from chats.functions.message_hashator import encrypt_message_for_chat, decrypt_message_from_chat
from chats.functions.key_exchange import generate_keypair
from chats.functions.crypto_storage import save_user_keys
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@login_required(login_url='/auth/login/')
def chats(request):
    user_chats = Chat.objects.filter(
        models.Q(first_user=request.user) | models.Q(second_user=request.user)
    )
    
    chat_data = []
    for chat in user_chats:
        talker = chat.get_talker(request.user)
        try:
            talker_avatar = talker.avatar.image.url
        except:
            talker_avatar = None
        last_message = chat.messege_set.order_by('-create_time').first()
        last_message = chat.messege_set.order_by('-create_time').first()
        last_msg_text = "Нет сообщений"
        if last_message:
            try:
                last_msg_text = decrypt_message_from_chat(last_message.text, chat, request.user)
            except:
                last_msg_text = last_message.text
        chat_data.append({
            'chat': chat,
            'talker': talker,
            'talker_avatar': talker_avatar,
            'last_message': last_msg_text
        })
    
    selected_chat_id = request.GET.get('chat_id')
    messages = []
    if selected_chat_id:
        try:
            selected_chat = Chat.objects.get(id=selected_chat_id)
            if (selected_chat.first_user == request.user or selected_chat.second_user == request.user):
                raw_messages = selected_chat.messege_set.order_by('create_time')
                messages = []
                for msg in raw_messages:
                    try:
                        msg.decrypted_text = decrypt_message_from_chat(msg.text, selected_chat, request.user)
                    except:
                        msg.decrypted_text = msg.text
                    messages.append(msg)
        except Chat.DoesNotExist:
            pass
    
    user_avatar = Avatar.objects.get(user=request.user).image.url if hasattr(request.user, 'avatar') else None

    searchHtml = """
        <div class="element">
            <label for="search" name="search_chats" class="label">Поиск:</label>
            <input type="text" name="search" class="input">
        </div>
        <div class="founded_elements">
            
        </div>
    """

    settings_categories = [
        "Аккаунт",
        "Оформление",
        "Помощь",
        "Выйти"
    ]

    return render(request, 'chats.html', {
        'chats': chat_data, 
        'messages': messages,
        'selected_chat_id': selected_chat_id,
        'avatar': user_avatar,
        'searchHtml': searchHtml,
        'settings_categories': settings_categories
    })

@login_required(login_url='/auth/login/')
def get_chat_messages(request, chat_id):
    try:
        chat = Chat.objects.get(id=chat_id)
        if chat.first_user != request.user and chat.second_user != request.user:
            return JsonResponse({'error': 'Access denied'}, status=403)
        
        messages = chat.messege_set.order_by('create_time')
        messages_data = []
        for message in messages:
            try:
                decrypted_text = decrypt_message_from_chat(message.text, chat, request.user)
            except:
                decrypted_text = message.text
            
            images = [img.image.url for img in message.messageimage_set.all()]
            
            messages_data.append({
                'text': decrypted_text,
                'sender': message.sender.username,
                'sender_id': message.sender.id,
                'sender_avatar': message.sender.avatar.image.url if hasattr(message.sender, 'avatar') else None,
                'user_avatar': request.user.avatar.image.url if hasattr(request.user, 'avatar') else None,
                'is_own': message.sender == request.user,
                'time': message.create_time.strftime('%H:%M'),
                'images': images
            })
        
        return JsonResponse({'messages': messages_data})
    except Chat.DoesNotExist:
        return JsonResponse({'error': 'Chat not found'}, status=404)

@login_required(login_url='/auth/login/')
def send_message(request, chat_id):
    if request.method == 'POST':
        try:
            chat = Chat.objects.get(id=chat_id)
            if chat.first_user != request.user and chat.second_user != request.user:
                return JsonResponse({'error': 'Access denied'}, status=403)
            
            text = request.POST.get('message', '')
            images = request.FILES.getlist('images')
            
            if not text and not images:
                return JsonResponse({'error': 'Message or image is required'}, status=400)
            
            if not text:
                text = ''
            
            try:
                encrypted_text = encrypt_message_for_chat(text, chat, request.user) if text else ''
            except:
                encrypted_text = text
            
            message = Messege.objects.create(chat=chat, sender=request.user, text=encrypted_text)
            
            for image in images:
                MessageImage.objects.create(message=message, image=image)
            
            channel_layer = get_channel_layer()
            talker = chat.get_talker(request.user)

            async_to_sync(channel_layer.group_send)(
                f'user_{talker.id}',
                {
                    'type': 'new_message',
                    'message': {
                        'chat_id': chat.id,
                        'text': text,
                        'sender': request.user.username,
                        'sender_avatar': request.user.avatar.image.url if hasattr(request.user, 'avatar') else None,
                        'is_own': False,
                        'time': message.create_time.strftime('%H:%M')
                    }
                }
            )
            
            return JsonResponse({'status': 'success'})
        except Chat.DoesNotExist:
            return JsonResponse({'error': 'Chat not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@login_required(login_url='/auth/login/')
def search_chats(request):
    query = request.GET.get('q', '').strip()
    
    if not query:
        return JsonResponse({'results': []})
    
    all_users = User.objects.all()
    
    results = []
    for user in all_users:
        if query.lower() in user.username.lower():
            try:
                user_avatar = user.avatar.image.url
            except:
                user_avatar = None

            if user.username == request.user.username:
                continue
            results.append({
                'username': user.username,
                'user_id': user.id,
                'avatar': user_avatar
            })
    
    return JsonResponse({'results': results})

@login_required(login_url='/auth/login/')
def get_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        return JsonResponse({
            'user_id': user_id,
            'username': user.username,
            'last_login': user.last_login.strftime('%d.%m.%Y %H:%M') if user.last_login else 'очень давно',
            'date_joined': user.date_joined.strftime('%d.%m.%Y'),
            'avatar': user.avatar.image.url if hasattr(user, 'avatar') else None
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

@login_required(login_url='/auth/login/')
def create_chat(request, user_id):
    try:
        if user_id == request.user.id:
            return JsonResponse({'error': 'Cannot create chat with yourself'}, status=400)
        second_user = User.objects.get(id=user_id)
        existing_chat = Chat.objects.filter(
            models.Q(first_user=request.user, second_user=second_user) |
            models.Q(first_user=second_user, second_user=request.user)
        ).first()
        
        if existing_chat:
            return JsonResponse({'chat_id': existing_chat.id})
        
        new_chat = Chat.objects.create(first_user=request.user, second_user=second_user)
        return JsonResponse({'chat_id': new_chat.id})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required(login_url='/auth/login/')
def get_chats_list(request):
    user_chats = Chat.objects.filter(
        models.Q(first_user=request.user) | models.Q(second_user=request.user)
    )
    
    chats_data = []
    for chat in user_chats:
        talker = chat.get_talker(request.user)
        last_message = chat.messege_set.order_by('-create_time').first()
        last_msg_text = 'Нет сообщений'
        last_message_sender = None
        if last_message:
            try:
                last_msg_text = decrypt_message_from_chat(last_message.text, chat, request.user)
            except:
                last_msg_text = last_message.text
            last_message_sender = last_message.sender
        chats_data.append({
            'chat_id': chat.id,
            'talker_id': talker.id,
            'talker_username': talker.username,
            'talker_avatar': talker.avatar.image.url if hasattr(talker, 'avatar') else None,
            'last_message_text': last_msg_text,
            'last_message_sender': last_message_sender.username + ":" if last_message_sender else ""
        })
    
    return JsonResponse({'chats': chats_data})
