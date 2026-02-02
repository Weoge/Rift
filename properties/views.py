from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from properties.forms import *
from properties.models import Avatar
from authentication.models import User
from secrets import token_hex
from .models import *

@login_required(login_url='/auth/login/')
def changeUsername(request, user_id):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            user = User.objects.get(id=user_id)
            user.username = username
            user.save()
            return JsonResponse({'success': True})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid method'})

@login_required(login_url='/auth/login/')
def update_avatar(request, user_id):
    if request.method == 'POST' and request.FILES.get('avatar_image'):
        try:
            user = User.objects.get(id=user_id)
            if user != request.user:
                return JsonResponse({'success': False, 'error': 'Unauthorized'})
            
            avatar, created = Avatar.objects.get_or_create(user=user)
            old_avatar = avatar.image
            if old_avatar and 'avatars/default' not in old_avatar.name:
                old_avatar.delete(save=False)
            avatar_image = request.FILES['avatar_image']
            avatar_image.name = f'{token_hex(64)}.png'
            avatar.image = avatar_image
            avatar.save()
            return JsonResponse({'success': True, 'avatar_url': avatar.image.url})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid request.'})

@login_required(login_url='/auth/login/')
def block_user(request, user_id):
    if request.method == 'POST':
        try:
            user_to_block = User.objects.get(id=user_id)
            blocked_users, created = BlockedUsers.objects.get_or_create(blocker=request.user)
            blocked_users.blocked.add(user_to_block)
            return JsonResponse({'success': True})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid method'})

@login_required(login_url='/auth/login/')
def unblock_user(request, user_id):
    if request.method == 'POST':
        try:
            user_to_unblock = User.objects.get(id=user_id)
            blocked_users = BlockedUsers.objects.get(blocker=request.user)
            blocked_users.blocked.remove(user_to_unblock)
            return JsonResponse({'success': True})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid method'})

@login_required(login_url='/auth/login/')
def check_blocked(request, user_id):
    from properties.models import BlockedUsers
    try:
        blocked_users = BlockedUsers.objects.filter(blocker=request.user).first()
        is_blocked = blocked_users and blocked_users.blocked.filter(id=user_id).exists() if blocked_users else False
        return JsonResponse({'is_blocked': is_blocked})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

