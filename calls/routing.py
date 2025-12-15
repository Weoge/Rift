from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/call/<str:room_name>/', consumers.CallConsumer.as_asgi()),
    path('ws/chat/', consumers.ChatConsumer.as_asgi()),
]
