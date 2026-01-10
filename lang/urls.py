from django.urls import path
from . import views

app_name = 'lang'

urlpatterns = [
    path('set_language/', views.set_language, name='set_language')
]
