from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EnergyLogViewSet,
    EvaluateDayView,
    ProgressSeriesView,
    ResultsSummaryView,
    MorningCheckInViewSet,
    EveningReflectionViewSet,
    FutureSelfGoalViewSet,
    GrowthSnapshotView,
)

router = DefaultRouter()
router.register(r'logs', EnergyLogViewSet, basename='energylog')
router.register(r'morning-checkins', MorningCheckInViewSet, basename='morning-checkin')
router.register(r'reflections', EveningReflectionViewSet, basename='reflection')
router.register(r'future-goals', FutureSelfGoalViewSet, basename='future-goal')

urlpatterns = [
    path('', include(router.urls)),
    path('evaluate/', EvaluateDayView.as_view(), name='evaluate_day'),
    path('progress/', ProgressSeriesView.as_view(), name='progress_series'),
    path('results/', ResultsSummaryView.as_view(), name='results_summary'),
    path('growth-snapshot/', GrowthSnapshotView.as_view(), name='growth_snapshot'),
]
