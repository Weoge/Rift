from django.contrib import admin
from properties.models import *
from chats.models import *

@admin.register(Avatar)
class AvatarAdmin(admin.ModelAdmin):
    list_display = ('user', 'image')
    search_fields = ('user__username',)

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('first_user', 'second_user', 'create_time')
    search_fields = ('first_user__username', 'second_user__username')

@admin.register(Messege)
class MessegeAdmin(admin.ModelAdmin):
    list_display = ('chat', 'sender', 'text', 'create_time', 'message_type')
    search_fields = ('chat__id', 'sender__username', 'text')
    list_editable = ('text',)
