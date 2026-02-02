from django.db import models
from authentication.models import User

class Avatar(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return f"Avatar for {self.user.username}"

    class Meta:
        verbose_name = 'Avatar'
        verbose_name_plural = 'Avatars'

class BlockedUsers(models.Model):
    blocker = models.OneToOneField(User, on_delete=models.CASCADE, related_name='blocking')
    blocked = models.ManyToManyField(User, related_name='blocked_by', blank=True)

    def __str__(self):
        return f"{self.blocker.username} blocks {self.blocked.count()} users"
    
    class Meta:
        verbose_name = 'Blocked User'
        verbose_name_plural = 'Blocked Users'
