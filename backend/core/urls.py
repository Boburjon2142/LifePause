from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/planning/', include('apps.planning.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/ai/', include('apps.ai.urls')),
]
