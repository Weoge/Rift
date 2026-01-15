from django.urls import path
from . import views

app_name = 'properties'

urlpatterns = [
    path('change_username/<int:user_id>', views.changeUsername, name='change_username'),
    path('update_avatar/<int:user_id>', views.update_avatar, name='update_avatar'),
]
