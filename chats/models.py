from django.db import models
from authentication.models import User
from properties.models import Avatar
from chats.functions.message_hashator import decrypt_message_from_chat

class Chat(models.Model):
    first_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='first_user')
    second_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='second_user')
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat between {self.first_user.username} and {self.second_user.username}"
    
    def get_last_message_text(self, user):
        last_message = Messege.objects.filter(chat=self).order_by('-create_time').first()
        if not last_message:
            return 'Нет сообщений'
        try:
            decrypted = decrypt_message_from_chat(last_message.text, self, user)
            return decrypted if decrypted else last_message.text
        except Exception as e:
            print(f"Ошибка расшифровки: {e}")
            return last_message.text


    
    def get_last_message_sender(self):
        last_message = Messege.objects.filter(chat=self).order_by('-create_time').first()
        return f"{last_message.sender.username}:" if last_message else ""
    
    def get_talker(self, current_user):
        if current_user == self.first_user:
            return self.second_user
        return self.first_user
    
    def get_talker_avatar(self, current_user):
        talker = self.get_talker(current_user)
        avatar = Avatar.objects.filter(user=talker).first()
        return avatar.image.url if avatar else None
    
    def get_chat(self):
        return self
    
    class Meta:
        verbose_name = 'Chat'
        verbose_name_plural = 'Chats'

class Messege(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} in chat {self.chat.id}"

    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'

class MessageImage(models.Model):
    message = models.ForeignKey(Messege, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='message_images/')

    def __str__(self):
        return f"Image for message {self.message.id}"

    class Meta:
        verbose_name = 'Message Image'
        verbose_name_plural = 'Message Images'
