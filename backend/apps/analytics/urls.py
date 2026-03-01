from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnergyLogViewSet, EvaluateDayView, ProgressSeriesView, ResultsSummaryView

router = DefaultRouter()
router.register(r'logs', EnergyLogViewSet, basename='energylog')

urlpatterns = [
    path('', include(router.urls)),
    path('evaluate/', EvaluateDayView.as_view(), name='evaluate_day'),
    path('progress/', ProgressSeriesView.as_view(), name='progress_series'),
    path('results/', ResultsSummaryView.as_view(), name='results_summary'),
]
