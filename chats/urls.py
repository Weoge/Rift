from django.urls import path
from . import views

app_name = 'chats'

urlpatterns = [
    path('', views.chats, name='chats'),
    path('messages/<int:user_id>/create/', views.create_chat, name='create_chat'),
    path('messages/<int:chat_id>/', views.get_chat_messages, name='get_chat_messages'),
    path('messages/<int:chat_id>/send/', views.send_message, name='send_message'),
    path('search/', views.search_chats, name='search_chats'),
    path('profile/<int:user_id>/', views.get_profile, name='profile'),
    path('list/', views.get_chats_list, name='get_chats_list'),
    path('call/<int:chat_id>/initiate/', views.initiate_call, name='initiate_call'),
    path('settings/', views.get_settings_data, name='settings')
]
