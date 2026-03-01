from rest_framework import serializers
from .models import DailyPlan

class DailyPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyPlan
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
