from pywebpush import webpush, WebPushException
from django.conf import settings
from chats.models import PushSubscription
import json

def send_push_notification(user, title, body, icon=None, chat_id=None, notification_type='message'):
    subscriptions = PushSubscription.objects.filter(user=user)
    
    payload = json.dumps({
        'title': title,
        'body': body,
        'icon': icon or '/static/images/icon-192x192.png',
        'chatId': chat_id,
        'type': notification_type
    })
    
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
                data=payload,
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims=settings.VAPID_CLAIMS
            )
        except WebPushException as e:
            if e.response.status_code in [404, 410]:
                subscription.delete()
