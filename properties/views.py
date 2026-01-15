from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from properties.forms import *
from properties.models import Avatar
from authentication.models import User
from secrets import token_hex

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
