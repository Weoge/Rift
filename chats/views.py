from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.db import models
from django.http import JsonResponse
from properties.forms import *
from properties.models import Avatar
from chats.models import Chat, Messege
import json

@login_required(login_url='/auth/login/')
def chats(request):
    if request.method == 'POST':
        form = UploadAvatarForm(request.POST, request.FILES)
        if form.is_valid():
            avatar, created = Avatar.objects.get_or_create(user=request.user)
            avatar.image = form.cleaned_data['image']
            avatar.save()
            return redirect('chats:chats')
        return render(request, 'chats.html', {'first_login': True, 'avatar_form': form})
    
    # Проверяем нужно ли показать форму аватара
    try:
        request.user.avatar
        has_avatar = True
    except Avatar.DoesNotExist:
        has_avatar = False
    
    if not has_avatar:
        return render(request, 'chats.html', {'first_login': True, 'avatar_form': UploadAvatarForm()})
    
    # Получаем чаты пользователя
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
        chat_data.append({
            'chat': chat,
            'talker': talker,
            'talker_avatar': talker_avatar,
            'last_message': last_message
        })
    
    selected_chat_id = request.GET.get('chat_id')
    messages = []
    if selected_chat_id:
        try:
            selected_chat = Chat.objects.get(id=selected_chat_id)
            if (selected_chat.first_user == request.user or selected_chat.second_user == request.user):
                messages = selected_chat.messege_set.order_by('create_time')
        except Chat.DoesNotExist:
            pass
    
    user_avatar = Avatar.objects.get(user=request.user).image.url

    return render(request, 'chats.html', {
        'first_login': False, 
        'chats': chat_data, 
        'messages': messages,
        'selected_chat_id': selected_chat_id,
        'avatar': user_avatar
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
            messages_data.append({
                'text': message.text,
                'sender': message.sender.username,
                'sender_avatar': message.sender.avatar.image.url if message.sender.avatar else None,
                'user_avatar': request.user.avatar.image.url if request.user.avatar else None,
                'is_own': message.sender == request.user,
                'time': message.create_time.strftime('%H:%M')
            })
        
        return JsonResponse({'messages': messages_data})
    except Chat.DoesNotExist:
        return JsonResponse({'error': 'Chat not found'}, status=404)

@login_required(login_url='/auth/login/')
def send_message(request, chat_id):
    if request.method == 'POST':
        try:
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                text = data.get('message')
            else:
                text = request.POST.get('message')
            if not text:
                return JsonResponse({'error': 'Message is required'}, status=400)
            chat = Chat.objects.get(id=chat_id)
            if chat.first_user != request.user and chat.second_user != request.user:
                return JsonResponse({'error': 'Access denied'}, status=403)
            message = Messege.objects.create(chat=chat, sender=request.user, text=text)
            return JsonResponse({'status': 'success'})
        except Chat.DoesNotExist:
            return JsonResponse({'error': 'Chat not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)
