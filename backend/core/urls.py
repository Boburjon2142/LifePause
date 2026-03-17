from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.urls import re_path

from core.views import FrontendAppView


def api_root(_request):
    return JsonResponse({
        "status": "ok",
        "service": "LifePause API",
        "endpoints": [
            "/api/auth/",
            "/api/planning/",
            "/api/analytics/",
            "/api/ai/",
        ],
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/planning/', include('apps.planning.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/ai/', include('apps.ai.urls')),
    re_path(r'^(?!api/|admin/|static/).*$',
            FrontendAppView.as_view(),
            name='frontend'),
]
