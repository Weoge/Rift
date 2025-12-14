import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'call_{self.room_name}'
        
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {'type': 'user_joined', 'channel_name': self.channel_name}
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_send(
            self.room_group_name,
            {'type': 'user_left', 'channel_name': self.channel_name}
        )
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room_group_name,
            {'type': 'webrtc_signal', 'data': data, 'sender': self.channel_name}
        )

    async def webrtc_signal(self, event):
        if event['sender'] != self.channel_name:
            await self.send(text_data=json.dumps(event['data']))
    
    async def user_joined(self, event):
        if event['channel_name'] != self.channel_name:
            await self.send(text_data=json.dumps({'type': 'user_joined'}))

    async def user_left(self, event):
        if event['channel_name'] != self.channel_name:
            await self.send(text_data=json.dumps({'type': 'user_left'}))
