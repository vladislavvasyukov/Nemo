from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import static, staticfiles_urlpatterns

from core import endpoints


urlpatterns = []
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    path('admin/', admin.site.urls),
    path('api/', include(endpoints)),
    path('api/auth/', include('knox.urls')),
    path('', TemplateView.as_view(template_name="core/index.html")),
]
