from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyPlanViewSet

router = DefaultRouter()
router.register(r'plans', DailyPlanViewSet, basename='plan')

urlpatterns = [
    path('', include(router.urls)),
]
