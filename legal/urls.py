from django.urls import path
from . import views

app_name = 'legal'

urlpatterns = [
    path('privacy_policy/', views.privacy_policy_view, name='privacy_policy'),
    path('terms_of_use/', views.terms_of_use_view, name='terms_of_use')
]