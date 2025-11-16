from django.urls import path
from . import views

app_name = 'chats'

urlpatterns = [
    path('', views.chats, name='chats'),
    path('messages/<int:chat_id>/', views.get_chat_messages, name='get_chat_messages'),
    path('messages/<int:chat_id>/send/', views.send_message, name='send_message'),
    path('search/', views.search_chats, name='search_chats'),
    path('profile/<int:user_id>/', views.get_profile, name='profile')
]
