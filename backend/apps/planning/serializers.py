from rest_framework import serializers
from .models import DailyPlan, RecurringPlan

class DailyPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyPlan
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class RecurringPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringPlan
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
