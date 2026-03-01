from django.db import models
from django.conf import settings

class RecurringPlan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recurring_plans')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField(default=60)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (every day) - {self.user.username}"


class DailyPlan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='plans')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    recurring_source = models.ForeignKey(RecurringPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name='generated_plans')
    completed = models.BooleanField(default=False)
    focus_seconds = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"
