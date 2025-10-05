import django.urls
from . import views
from django.urls import path

app_name = 'main'

urlpatterns = [
    path('', views.main_page, name='main_page')
]
