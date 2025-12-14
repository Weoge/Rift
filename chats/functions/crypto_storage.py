from django.db import models
from authentication.models import User
from chats.models import Chat
import base64

class UserKeys(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='crypto_keys')
    private_key = models.TextField()
    public_key = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'User Keys'
        verbose_name_plural = 'User Keys'

class ChatKeys(models.Model):
    chat = models.OneToOneField(Chat, on_delete=models.CASCADE, related_name='crypto_keys')
    symmetric_key = models.TextField()
    symmetric_key_second = models.TextField()
    salt = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Chat Keys'
        verbose_name_plural = 'Chat Keys'

def save_user_keys(user, private_key: bytes, public_key: bytes):
    UserKeys.objects.update_or_create(
        user=user,
        defaults={
            'private_key': base64.b64encode(private_key).decode(),
            'public_key': base64.b64encode(public_key).decode()
        }
    )

def get_user_keys(user):
    try:
        keys = UserKeys.objects.get(user=user)
        return (
            base64.b64decode(keys.private_key),
            base64.b64decode(keys.public_key)
        )
    except UserKeys.DoesNotExist:
        return None, None

def save_chat_keys(chat, key: bytes, salt: bytes, key_encrypted_first: str, key_encrypted_second: str):
    ChatKeys.objects.update_or_create(
        chat=chat,
        defaults={
            'symmetric_key': key_encrypted_first,
            'symmetric_key_second': key_encrypted_second,
            'salt': base64.b64encode(salt).decode()
        }
    )

def get_chat_keys(chat, user):
    try:
        chat_keys = ChatKeys.objects.get(chat=chat)
        encrypted_key = chat_keys.symmetric_key if user == chat.first_user else chat_keys.symmetric_key_second
        salt = base64.b64decode(chat_keys.salt)
        return encrypted_key, salt
    except ChatKeys.DoesNotExist:
        return None, None
