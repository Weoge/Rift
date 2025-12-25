from django.contrib import admin
from django.urls import path
from django.urls import include
from Rift.settings import DEBUG
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.conf import settings
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include('chats.urls', namespace="chats")),
    path('auth/', include('authentication.urls', namespace="authentication")),
    path('', include('main.urls', namespace="main")),
    path('service_worker.js', serve, {'path': 'service_worker.js', 'document_root': settings.BASE_DIR}),
    path('manifest.json', serve, {'path': 'manifest.json', 'document_root': settings.BASE_DIR}),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
