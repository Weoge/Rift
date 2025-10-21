from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from authentication.forms import UserCreationForm

def main_page(request):
    if request.user.is_authenticated:
        return redirect('/app')
    context = {
        "login_form": AuthenticationForm(),
        "signup_form": UserCreationForm()
    }
    return render(request, 'index.html', context)