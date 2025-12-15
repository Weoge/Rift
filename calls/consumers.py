import json
from channels.generic.websocket import AsyncWebsocketConsumer

# WebSocket для видеозвонков (WebRTC сигналинг)
class CallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'call_{self.room_name}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
        # Уведомляем ДРУГИХ участников о подключении
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'message': 'User joined the call',
                'sender_channel': self.channel_name
            }
        )

    async def disconnect(self, close_code):
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
        data['sender_channel'] = self.channel_name
        
        # Пересылаем сигнал всем участникам
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'webrtc_signal',
                'data': data
            }
        )

    async def webrtc_signal(self, event):
        # НЕ отправляем сигнал обратно отправителю
        if event['data'].get('sender_channel') != self.channel_name:
            data = event['data'].copy()
            data.pop('sender_channel', None)
            await self.send(text_data=json.dumps(data))

    async def user_joined(self, event):
        # НЕ отправляем уведомление самому себе
        if event.get('sender_channel') != self.channel_name:
            await self.send(text_data=json.dumps({
                'type': 'user_joined',
                'message': event['message']
            }))

    async def user_left(self, event):
        # НЕ отправляем уведомление самому себе
        if event.get('sender_channel') != self.channel_name:
            await self.send(text_data=json.dumps({
                'type': 'user_left',
                'message': event['message']
            }))


# WebSocket для чатов (сообщения в реальном времени)
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        
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

    async def new_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_message',
            'message': event['message']
        }))
    
    async def chat_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_update',
            'data': event['data']
        }))
    
    async def incoming_call(self, event):
        await self.send(text_data=json.dumps({
            'type': 'incoming_call',
            'caller': event['caller'],
            'chat_id': event['chat_id']
        }))
