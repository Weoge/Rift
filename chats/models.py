from django.db import models
from authentication.models import User
from properties.models import Avatar

class Chat(models.Model):
    first_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='first_user')
    second_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='second_user')
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat between {self.first_user.username} and {self.second_user.username}"
    
    def get_last_message_text(self):
        last_message = Messege.objects.filter(chat=self).order_by('-create_time').first()
        return last_message.text if last_message else 'Нет сообщений'
    
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
    message_type = models.CharField(max_length=100, default='text')

    def __str__(self):
        return f"Message from {self.sender.username} in chat {self.chat.id}"

    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
