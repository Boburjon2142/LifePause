from django.db import models
from apps.planning.models import DailyPlan
from django.conf import settings


GOAL_HORIZON_CHOICES = [
    ('1d', '1 day'),
    ('1w', '1 week'),
    ('1m', '1 month'),
    ('1y', '1 year'),
]

class EnergyLog(models.Model):
    # energy, focus, stress from 1-5
    plan = models.ForeignKey(DailyPlan, on_delete=models.CASCADE, related_name='energy_logs')
    energy = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    focus = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    stress = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Energiya: {self.energy} - Diqqat: {self.focus} - Zo'riqish: {self.stress}"


class MorningCheckIn(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='morning_checkins')
    date = models.DateField()
    main_focus = models.CharField(max_length=255)
    priority_habit = models.CharField(max_length=255)
    energy_level = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date')
        ordering = ['-date']


class EveningReflection(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='evening_reflections')
    date = models.DateField()
    prompt = models.CharField(max_length=255)
    response = models.TextField()
    mood = models.CharField(max_length=32, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date')
        ordering = ['-date']


class FutureSelfGoal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='future_goals')
    horizon = models.CharField(max_length=2, choices=GOAL_HORIZON_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'horizon')
        ordering = ['created_at']
