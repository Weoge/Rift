from django.contrib import admin
from django.urls import path
from django.urls import include
from Rift.settings import DEBUG
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.conf import settings
from django.views.i18n import JavaScriptCatalog
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include('chats.urls', namespace="chats")),
    path('auth/', include('authentication.urls', namespace="authentication")),
    path('properties/', include('properties.urls', namespace="properties")),
    path('', include('main.urls', namespace="main")),
    path('lang/', include('lang.urls', namespace="lang")),
    path('jsi18n/', JavaScriptCatalog.as_view(), name='locale'),
    path('service-worker.js', serve, {'path': 'service-worker.js', 'document_root': settings.BASE_DIR}),
    path('manifest.json', serve, {'path': 'manifest.json', 'document_root': settings.BASE_DIR}),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
