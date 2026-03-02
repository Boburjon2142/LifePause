from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import EnergyLog
from .serializers import EnergyLogSerializer
from .services import evaluate_day, get_progress_series, get_results_summary

class EnergyLogViewSet(viewsets.ModelViewSet):
    serializer_class = EnergyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EnergyLog.objects.filter(plan__user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        plan = serializer.validated_data["plan"]
        if plan.user_id != self.request.user.id:
            raise PermissionDenied("Faqat o'zingizning rejalaringiz uchun log qo'sha olasiz.")
        serializer.save()

class EvaluateDayView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        evaluation = evaluate_day(request.user)
        return Response(evaluation)


class ProgressSeriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get("days", 7))
        days = min(max(days, 1), 366)
        data = get_progress_series(request.user, days=days)
        return Response(data)


class ResultsSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get("days", 14))
        days = min(max(days, 1), 2000)
        data = get_results_summary(request.user, days=days)
        return Response(data)
