from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import DailyPlan
from .serializers import DailyPlanSerializer

class DailyPlanViewSet(viewsets.ModelViewSet):
    serializer_class = DailyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyPlan.objects.filter(user=self.request.user).order_by('start_time')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
