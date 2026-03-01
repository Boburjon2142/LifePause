from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyPlanViewSet, RecurringPlanViewSet

router = DefaultRouter()
router.register(r'plans', DailyPlanViewSet, basename='plan')
router.register(r'recurring-plans', RecurringPlanViewSet, basename='recurring-plan')

urlpatterns = [
    path('', include(router.urls)),
]
