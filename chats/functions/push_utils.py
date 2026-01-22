from pywebpush import webpush, WebPushException
from django.conf import settings
from chats.models import PushSubscription
import json
import logging

logger = logging.getLogger(__name__)

def send_push_notification(user, title, body, url='/app', tag='default', icon=None, chat_id=None, notification_type='message'):
    subscriptions = PushSubscription.objects.filter(user=user)
    
    payload = {
        'title': title,
        'body': body,
        'icon': icon or '/static/images/icon-192x192.png',
        'badge': '/static/images/icon-192x192.png',
        'data': {
            'url': url,
            'chat_id': chat_id,
            'type': notification_type
        },
        'tag': tag,
        'requireInteraction': notification_type == 'call',
        'vibrate': [500, 200, 500, 200, 500] if notification_type == 'call' else [200, 100, 200]
    }
    
    for subscription in subscriptions:
        try:
            webpush(
                subscription_info={
                    'endpoint': subscription.endpoint,
                    'keys': {
                        'p256dh': subscription.p256dh,
                        'auth': subscription.auth
                    }
                },
                data=json.dumps(payload),
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims=settings.VAPID_CLAIMS,
                ttl=3600
            )
            logger.info(f'Push sent to {user.username}')
        except WebPushException as e:
            logger.error(f'Push failed for {user.username}: {e}')
            if e.response and e.response.status_code in [404, 410]:
                subscription.delete()
        except Exception as e:
            logger.error(f'Unexpected error sending push: {e}')
