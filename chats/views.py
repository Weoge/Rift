from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.db import models
from django.http import JsonResponse
from properties.forms import *
from properties.models import Avatar
from chats.models import Chat, Messege, MessageImage
from authentication.models import User
from chats.functions.message_hashator import encrypt_message_for_chat, decrypt_message_from_chat
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils.translation import gettext as _

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
        last_msg_text = _("Нет сообщений")
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

    searchHtml = f"""
        <div class="element">
            <label for="search" name="search_chats" class="label">{_("Поиск:")}</label>
            <input type="text" name="search" class="input">
        </div>
        <div class="founded_elements">
            
        </div>
    """

    settingsHtml = f"""
        <div class="settings_category btn flex">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p>Аккаунт</p>
        </div>
        <div class="settings_category btn flex">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 10V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V10M12 14.5V16.5M8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.7202 10 16.8802 10 15.2 10H8.8C7.11984 10 6.27976 10 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p>Безопасность</p>
        </div>
        <div class="settings_category btn flex">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 17.5228 6.47715 22 12 22C13.6569 22 15 20.6569 15 19V18.5C15 18.0356 15 17.8034 15.0257 17.6084C15.2029 16.2622 16.2622 15.2029 17.6084 15.0257C17.8034 15 18.0356 15 18.5 15H19C20.6569 15 22 13.6569 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 13C7.55228 13 8 12.5523 8 12C8 11.4477 7.55228 11 7 11C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 9C16.5523 9 17 8.55228 17 8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8C15 8.55228 15.4477 9 16 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 8C10.5523 8 11 7.55228 11 7C11 6.44772 10.5523 6 10 6C9.44772 6 9 6.44772 9 7C9 7.55228 9.44772 8 10 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p>Оформление</p>
        </div>
    """

    return render(request, 'chats.html', {
        'chats': chat_data, 
        'messages': messages,
        'selected_chat_id': selected_chat_id,
        'avatar': user_avatar,
        'searchHtml': searchHtml,
        'settingsHtml': settingsHtml
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
            
            message_images = [img.image.url for img in message.messageimage_set.all()]
            
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
                        'time': message.create_time.strftime('%H:%M'),
                        'images': message_images
                    }
                }
            )
            
            return JsonResponse({
                'status': 'success',
                'message': {
                    'text': text,
                    'sender': request.user.username,
                    'sender_avatar': request.user.avatar.image.url if hasattr(request.user, 'avatar') else None,
                    'is_own': True,
                    'time': message.create_time.strftime('%H:%M'),
                    'images': message_images
                }
            })
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
            'last_login': user.last_login.strftime('%d.%m.%Y %H:%M') if user.last_login else f'{_("очень давно")}',
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

@login_required(login_url='/auth/login/')
def initiate_call(request, chat_id):
    try:
        chat = Chat.objects.get(id=chat_id)
        if chat.first_user != request.user and chat.second_user != request.user:
            return JsonResponse({'error': 'Access denied'}, status=403)
        
        talker = chat.get_talker(request.user)
        channel_layer = get_channel_layer()
        
        async_to_sync(channel_layer.group_send)(
            f'user_{talker.id}',
            {
                'type': 'incoming_call',
                'caller': request.user.username,
                'chat_id': chat_id
            }
        )
        
        return JsonResponse({'status': 'success'})
    except Chat.DoesNotExist:
        return JsonResponse({'error': 'Chat not found'}, status=404)
