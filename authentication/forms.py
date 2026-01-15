from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from django import forms
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class UserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    avatar_image = forms.ImageField(required=False, label="Аватар")
    
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("avatar_image", "username", "email", "password1", "password2")
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'minlength': '3',
            'maxlength': '15',
            'pattern': '[A-Za-z0-9_]*'
        })
