from django.db import models
from apps.planning.models import DailyPlan

class EnergyLog(models.Model):
    # energy, focus, stress from 1-5
    plan = models.ForeignKey(DailyPlan, on_delete=models.CASCADE, related_name='energy_logs')
    energy = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    focus = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    stress = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Energiya: {self.energy} - Diqqat: {self.focus} - Zo'riqish: {self.stress}"
