from django import forms
from properties.models import Avatar

class UploadAvatarForm(forms.ModelForm):
    class Meta:
        model = Avatar
        fields = ('image',)