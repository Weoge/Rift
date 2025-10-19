from django.urls import path
from . import views
from .views import *
from django.contrib.auth import views as auth_views

app_name = 'authentication'

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name="login"),
    path('signup/', Signup.as_view(), name="signup"),
    path('logout/', views.signout_view, name="logout"),
]
