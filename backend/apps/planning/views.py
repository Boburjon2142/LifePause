from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime, timedelta
from .models import DailyPlan, RecurringPlan
from .serializers import DailyPlanSerializer, RecurringPlanSerializer


def ensure_daily_recurring_plans(user):
    today = timezone.localdate()
    today_weekday = today.weekday()  # 0=Mon ... 6=Sun
    recurring_plans = RecurringPlan.objects.filter(user=user, is_active=True)

    for recurring in recurring_plans:
        if recurring.repeat_days and today_weekday not in recurring.repeat_days:
            continue

        exists = DailyPlan.objects.filter(
            user=user,
            recurring_source=recurring,
            start_time__date=today,
        ).exists()
        if exists:
            continue

        naive_start = datetime.combine(today, recurring.start_time)
        start_dt = timezone.make_aware(naive_start, timezone.get_current_timezone())
        end_dt = start_dt + timedelta(minutes=recurring.duration_minutes)

        DailyPlan.objects.create(
            user=user,
            title=recurring.title,
            description=recurring.description,
            start_time=start_dt,
            end_time=end_dt,
            recurring_source=recurring,
        )

class DailyPlanViewSet(viewsets.ModelViewSet):
    serializer_class = DailyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ensure_daily_recurring_plans(self.request.user)
        requested_date = self.request.query_params.get("date")
        target_date = timezone.localdate()
        if requested_date:
            try:
                target_date = datetime.strptime(requested_date, "%Y-%m-%d").date()
            except ValueError:
                target_date = timezone.localdate()

        return DailyPlan.objects.filter(
            user=self.request.user,
            start_time__date=target_date,
        ).order_by('start_time')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecurringPlanViewSet(viewsets.ModelViewSet):
    serializer_class = RecurringPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RecurringPlan.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
