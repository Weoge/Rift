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
