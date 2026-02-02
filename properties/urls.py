from django.urls import path
from . import views

app_name = 'properties'

urlpatterns = [
    path('change_username/<int:user_id>', views.changeUsername, name='change_username'),
    path('update_avatar/<int:user_id>', views.update_avatar, name='update_avatar'),
    path('block/<int:user_id>/', views.block_user, name='block_user'),
    path('unblock/<int:user_id>/', views.unblock_user, name='unblock_user'),
    path('check_blocked/<int:user_id>/', views.check_blocked, name='check_blocked'),
]
