from django.contrib import admin
from properties.models import *
from chats.models import *
from chats.functions.crypto_storage import UserKeys, ChatKeys

class MessageImageInline(admin.TabularInline):
    model = MessageImage
    extra = 1

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
    list_display = ('chat', 'sender', 'text', 'create_time')
    search_fields = ('chat__id', 'sender__username', 'text')
    list_editable = ('text',)
    inlines = [MessageImageInline]

@admin.register(MessageImage)
class MessageImageAdmin(admin.ModelAdmin):
    list_display = ('message', 'image')
    search_fields = ('message__id',)

@admin.register(UserKeys)
class UserKeysAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__username',)

@admin.register(ChatKeys)
class ChatKeysAdmin(admin.ModelAdmin):
    list_display = ('chat', 'created_at')
    search_fields = ('chat__id',)

@admin.register(PushSubscription)
class PushSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
