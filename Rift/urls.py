from django.contrib import admin
from django.urls import path
from django.urls import include
from Rift.settings import DEBUG
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include('chats.urls', namespace="chats")),
    path('auth/', include('authentication.urls', namespace="authentication")),
    path('', include('main.urls', namespace="main")),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
