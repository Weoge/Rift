from django.shortcuts import render
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
import os

def get_vapid_public_key(request):
    from django.conf import settings
    return JsonResponse({'vapid_public_key': settings.VAPID_PUBLIC_KEY})

@login_required(login_url='/auth/login/')
def get_settings_data(request):
    user_avatar = Avatar.objects.get(user=request.user).image.url if hasattr(request.user, 'avatar') else None
    blur_effect_checked = 'checked' if request.COOKIES.get('blur_effect') == 'on' else ''
    bg_anim_checked = 'checked' if request.COOKIES.get('bg_anim') == 'on' else ''
    accountSettingsHtml = f"""
        <div class="accountSettings">
            <form enctype="multipart/form-data" method="post" id="avatar-form">
                <label for="avatar-input" class="avatar-upload-container" style="cursor: pointer;">
                    <div class="avatar_container_mid" id="avatar-preview" style="margin: 10px;">
                        <img class="talker" src="{user_avatar}" id="avatar-img">
                        <div class="avatar-overlay">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>{_('Изменить аватар')}</span>
                        </div>
                    </div>
                    <input type="file" id="avatar-input" name="avatar_image" accept="image/*" style="display: none;" data-user-id="{request.user.id}">
                </label>
            </form>
            <div class="change_username flex">
                <p class="username">{request.user.username}</p>
                <button class="smaller" onclick="showContextMenu('change_username', 'change_username_content', '{request.user.id}')">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10L14 6M2.49997 21.5L5.88434 21.124C6.29783 21.078 6.50457 21.055 6.69782 20.9925C6.86926 20.937 7.03242 20.8586 7.18286 20.7594C7.35242 20.6475 7.49951 20.5005 7.7937 20.2063L21 7C22.1046 5.89543 22.1046 4.10457 21 3C19.8954 1.89543 18.1046 1.89543 17 3L3.7937 16.2063C3.49952 16.5005 3.35242 16.6475 3.24061 16.8171C3.1414 16.9676 3.06298 17.1307 3.00748 17.3022C2.94493 17.4954 2.92195 17.7021 2.87601 18.1156L2.49997 21.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
            <div class="btn_red flex logout_btn" onclick="logout()">
                <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 16.9999L21 11.9999M21 11.9999L16 6.99994M21 11.9999H9M12 16.9999C12 17.2955 12 17.4433 11.989 17.5713C11.8748 18.9019 10.8949 19.9968 9.58503 20.2572C9.45903 20.2823 9.31202 20.2986 9.01835 20.3312L7.99694 20.4447C6.46248 20.6152 5.69521 20.7005 5.08566 20.5054C4.27293 20.2453 3.60942 19.6515 3.26118 18.8724C3 18.2881 3 17.5162 3 15.9722V8.02764C3 6.4837 3 5.71174 3.26118 5.12746C3.60942 4.34842 4.27293 3.75454 5.08566 3.49447C5.69521 3.29941 6.46246 3.38466 7.99694 3.55516L9.01835 3.66865C9.31212 3.70129 9.45901 3.71761 9.58503 3.74267C10.8949 4.0031 11.8748 5.09798 11.989 6.42855C12 6.55657 12 6.70436 12 6.99994" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {_("Выйти")}
            </div>
        </div>
    """

    securitySettingsHtml = f"""
        <div class="securitySettings">
            222
        </div>
    """

    styleSettingsHtml = f"""
        <div class="styleSettings">
            <div class="flex">
                <div class="check bg_anim_toggle">
                    <div class="status"></div>
                    <input type="checkbox" id="bg_anim" name="bg_anim" onchange="toggleBgAnim(this.checked)" {bg_anim_checked}>
                </div>
                <label for="bg_anim">{_("Анимация фона")}</label>
            </div>
            <div class="flex">
                <div class="check blur_effect_toggle">
                    <div class="status"></div>
                    <input type="checkbox" id="blur_effect" name="blur_effect" onchange="toggleBlurEffect(this.checked)" {blur_effect_checked}>
                </div>
                <label for="blur_effect">{_("Эффект размытия")}</label>
            </div>
            <p style="text-align: center; font-size: 12px;" class="text_warn">{_("Вызывает лаги и разряд батареи на мобильных устройствах")}</p>
            <div class="btn flex change_lang_btn" onclick="showContextMenu('lang_settings', 'lang_content', '{request.user.id}');">
                <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.913 17H20.087M12.913 17L11 21M12.913 17L15.7783 11.009C16.0092 10.5263 16.1246 10.2849 16.2826 10.2086C16.4199 10.1423 16.5801 10.1423 16.7174 10.2086C16.8754 10.2849 16.9908 10.5263 17.2217 11.009L20.087 17M20.087 17L22 21M2 5H8M8 5H11.5M8 5V3M11.5 5H14M11.5 5C11.0039 7.95729 9.85259 10.6362 8.16555 12.8844M10 14C9.38747 13.7248 8.76265 13.3421 8.16555 12.8844M8.16555 12.8844C6.81302 11.8478 5.60276 10.4266 5 9M8.16555 12.8844C6.56086 15.0229 4.47143 16.7718 2 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {_("Язык")}
                <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
        </div>
    """

    return JsonResponse({
        'account': accountSettingsHtml,
        'account_title': _("Аккаунт"),
        'security': securitySettingsHtml,
        'security_title': _("Безопасность"),
        'style': styleSettingsHtml,
        'style_title': _("Оформление")
    })

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

    # <div class="settings_category btn flex" onclick="openSettings('security');">
    #     <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 10V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V10M12 14.5V16.5M8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.7202 10 16.8802 10 15.2 10H8.8C7.11984 10 6.27976 10 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    #     <p>{_("Безопасность")}</p>
    # </div>
    settingsHtml = f"""
        <div class="settings_category btn flex" onclick="openSettings('account');">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p>{_("Аккаунт")}</p>
        </div>
        <div class="settings_category btn flex" onclick="openSettings('style');">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 17.5228 6.47715 22 12 22C13.6569 22 15 20.6569 15 19V18.5C15 18.0356 15 17.8034 15.0257 17.6084C15.2029 16.2622 16.2622 15.2029 17.6084 15.0257C17.8034 15 18.0356 15 18.5 15H19C20.6569 15 22 13.6569 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 13C7.55228 13 8 12.5523 8 12C8 11.4477 7.55228 11 7 11C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 9C16.5523 9 17 8.55228 17 8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8C15 8.55228 15.4477 9 16 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 8C10.5523 8 11 7.55228 11 7C11 6.44772 10.5523 6 10 6C9.44772 6 9 6.44772 9 7C9 7.55228 9.44772 8 10 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p>{_("Оформление")}</p>
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
        last_login_text = user.last_login.strftime('%d.%m.%Y %H:%M') if user.last_login else f'{_("очень давно")}'
        return JsonResponse({
            'user_id': user_id,
            'username': user.username,
            'last_login': last_login_text,
            'last_login_text': f'{_("Был(а)")} {last_login_text}',
            'date_joined': user.date_joined.strftime('%d.%m.%Y'),
            'date_joined_text': f'{_("Дата регистрации:")} {user.date_joined.strftime("%d.%m.%Y")}',
            'avatar': user.avatar.image.url if hasattr(user, 'avatar') else None,
            'profile_title': _("Профиль")
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
        
        caller_data = {
            'username': request.user.username,
            'avatar': {
                'url': request.user.avatar.image.url if hasattr(request.user, 'avatar') else None
            }
        }
        
        async_to_sync(channel_layer.group_send)(
            f'user_{talker.id}',
            {
                'type': 'incoming_call',
                'caller': caller_data,
                'chat_id': chat_id
            }
        )
        
        return JsonResponse({'status': 'success'})
    except Chat.DoesNotExist:
        return JsonResponse({'error': 'Chat not found'}, status=404)
