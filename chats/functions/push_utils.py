from pywebpush import webpush, WebPushException
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)

def send_push_notification(user, title, body, icon=None, chat_id=None, notification_type='message'):
    from chats.models import PushSubscription
    
    subscriptions = PushSubscription.objects.filter(user=user)
    logger.info(f'Sending push to {user.username}, found {subscriptions.count()} subscriptions')
    
    if not subscriptions.exists():
        logger.warning(f'No push subscriptions found for user {user.username}')
        return
    
    payload = json.dumps({
        'title': title,
        'body': body,
        'icon': icon or '/static/images/icon-192x192.png',
        'chatId': chat_id,
        'type': notification_type
    })
    
    for subscription in subscriptions:
        try:
            logger.info(f'Sending to endpoint: {subscription.endpoint[:50]}...')
            webpush(
                subscription_info={
                    'endpoint': subscription.endpoint,
                    'keys': {
                        'p256dh': subscription.p256dh,
                        'auth': subscription.auth
                    }
                },
                data=payload,
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims=settings.VAPID_CLAIMS
            )
            logger.info('Push sent successfully')
        except WebPushException as e:
            logger.error(f'WebPushException: {e}, status: {e.response.status_code if hasattr(e, "response") else "unknown"}')
            if hasattr(e, 'response') and e.response.status_code in [404, 410]:
                subscription.delete()
        except Exception as e:
            logger.error(f'Failed to send push: {e}')
