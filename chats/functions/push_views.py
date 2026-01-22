from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from chats.models import PushSubscription
import json
import logging

logger = logging.getLogger(__name__)

@login_required
@csrf_exempt
def subscribe_push(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            subscription = data.get('subscription')
            
            if not subscription or not subscription.get('endpoint'):
                return JsonResponse({'error': 'Invalid subscription'}, status=400)
            
            PushSubscription.objects.update_or_create(
                user=request.user,
                endpoint=subscription['endpoint'],
                defaults={
                    'p256dh': subscription['keys']['p256dh'],
                    'auth': subscription['keys']['auth']
                }
            )
            logger.info(f'Push subscription created for {request.user.username}')
            return JsonResponse({'status': 'success'})
        except Exception as e:
            logger.error(f'Push subscription error: {e}')
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)
