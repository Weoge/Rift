import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

logger = logging.getLogger(__name__)

class CallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'call_{self.room_name}'
        
        logger.info(f'User connecting to room: {self.room_group_name}')
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'message': 'User joined the call',
                'sender_channel': self.channel_name
            }
        )
        logger.info(f'User joined room: {self.room_group_name}')

    async def disconnect(self, close_code):
        logger.info(f'User disconnecting from room: {self.room_group_name}')
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_left',
                'message': 'User left the call',
                'sender_channel': self.channel_name
            }
        )
        
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        logger.info(f'Received signal: {data.get("type")} in room {self.room_group_name}')
        data['sender_channel'] = self.channel_name
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'webrtc_signal',
                'data': data
            }
        )

    async def webrtc_signal(self, event):
        if event['data'].get('sender_channel') != self.channel_name:
            data = event['data'].copy()
            data.pop('sender_channel', None)
            logger.info(f'Forwarding signal: {data.get("type")}')
            await self.send(text_data=json.dumps(data))

    async def user_joined(self, event):
        if event.get('sender_channel') != self.channel_name:
            logger.info('Sending user_joined notification')
            await self.send(text_data=json.dumps({
                'type': 'user_joined',
                'message': event['message']
            }))

    async def user_left(self, event):
        if event.get('sender_channel') != self.channel_name:
            logger.info('Sending user_left notification')
            await self.send(text_data=json.dumps({
                'type': 'user_left',
                'message': event['message']
            }))


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.is_active = True
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.user_group_name = f'user_{self.user.id}'
        
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        self.is_active = False
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'ping':
            await self.send(text_data=json.dumps({'type': 'pong'}))
        elif message_type == 'set_active':
            self.is_active = data.get('active', True)

    async def new_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_message',
            'message': event['message']
        }))
        
        if not self.is_active:
            try:
                from chats.functions.push_utils import send_push_notification
                message = event['message']
                await database_sync_to_async(send_push_notification)(
                    user=self.user,
                    title=message.get('sender', ''),
                    body=message.get('text', ''),
                    url=f'/app?chat_id={message.get("chat_id")}',
                    tag=f'chat_{message.get("chat_id")}',
                    icon=message.get('sender_avatar'),
                    chat_id=message.get('chat_id'),
                    notification_type='message'
                )
            except Exception as e:
                logger.error(f'Failed to send push notification: {e}')
    
    async def chat_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_update',
            'data': event['data']
        }))
    
    async def incoming_call(self, event):
        caller = event.get('caller', {})
        caller_name = caller.get('username', 'Неизвестный') if isinstance(caller, dict) else str(caller)
        caller_avatar = caller.get('avatar', {}).get('url') if isinstance(caller, dict) else None
        logger.info(f'Incoming call for user {self.user.username} from {caller_name}')
        
        await self.send(text_data=json.dumps({
            'type': 'incoming_call',
            'caller': event['caller'],
            'chat_id': event['chat_id']
        }))
        
        if not self.is_active:
            try:
                from chats.functions.push_utils import send_push_notification
                logger.info(f'Sending push notification to {self.user.username}')
                await database_sync_to_async(send_push_notification)(
                    user=self.user,
                    title=caller_name,
                    body='Звонит вам',
                    url=f'/app?chat_id={event["chat_id"]}',
                    tag=f'call_{event["chat_id"]}',
                    icon=caller_avatar,
                    chat_id=event['chat_id'],
                    notification_type='call'
                )
                logger.info('Push notification sent successfully')
            except Exception as e:
                logger.error(f'Failed to send push notification: {e}')
