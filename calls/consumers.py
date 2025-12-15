import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

# WebSocket для видеозвонков (WebRTC сигналинг)
class CallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Получаем ID чата из URL
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'call_{self.room_name}'
        
        # Добавляем пользователя в группу звонка
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
        # Уведомляем других участников о подключении
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'message': 'User joined the call'
            }
        )

    async def disconnect(self, close_code):
        # Уведомляем о выходе
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_left',
                'message': 'User left the call'
            }
        )
        
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Получаем WebRTC сигналы (offer, answer, ICE candidates)
    async def receive(self, text_data):
        data = json.loads(text_data)
        
        # Пересылаем сигнал всем участникам звонка
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'webrtc_signal',
                'data': data
            }
        )

    # Отправляем WebRTC сигнал клиенту
    async def webrtc_signal(self, event):
        await self.send(text_data=json.dumps(event['data']))

    async def user_joined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_joined',
            'message': event['message']
        }))

    async def user_left(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_left',
            'message': event['message']
        }))


# WebSocket для чатов (сообщения в реальном времени)
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        
        # Проверяем аутентификацию
        if not self.user.is_authenticated:
            await self.close()
            return
        
        # Создаем персональную группу для пользователя
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

    # Получаем сообщение от клиента
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'ping':
            # Heartbeat для поддержания соединения
            await self.send(text_data=json.dumps({'type': 'pong'}))

    # Отправляем новое сообщение клиенту
    async def new_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_message',
            'message': event['message']
        }))
    
    # Обновление списка чатов
    async def chat_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_update',
            'data': event['data']
        }))
