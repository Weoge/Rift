from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import logout, login
from django.contrib.auth.forms import AuthenticationForm
from .forms import UserCreationForm
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from chats.functions.key_exchange import generate_keypair
from chats.functions.crypto_storage import save_user_keys
import secrets
from properties.models import Avatar

class Signup(View):
    template_name = "registration/signup.html"

    def get(self, request):
        if request.user.is_authenticated:
            return redirect('/app')
        context = {
            'form': UserCreationForm()
        }
        return render(request, self.template_name, context)

    def post(self, request):
        form = UserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            private_key, public_key = generate_keypair()
            save_user_keys(user, private_key, public_key)
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            avatar_image = form.cleaned_data.get('avatar_image')
            avatar_image.name = f"{secrets.token_hex(64)}.png"
            if avatar_image:
                Avatar.objects.create(user=user, image=avatar_image)
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('/')
        context = {
            'form': form
        }
        return render(request, self.template_name, context)

@login_required(login_url='/auth/login/')
def signout_view(request):
    logout(request)
    return redirect('/')

class CustomLoginView(LoginView):
    template_name = 'registration/login.html'
    def get(self, request):
        context = {
            "form": AuthenticationForm()
        }
        if request.user.is_authenticated:
            return redirect('/app')
        return render(request, self.template_name, context)
