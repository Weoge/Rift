from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import logout, login
from django.contrib.auth.forms import AuthenticationForm
from .forms import UserCreationForm
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView

def assistant_view(request):
    if request.user.is_authenticated:
        return redirect('/app')
    return render(request, 'assistant.html')

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
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
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
