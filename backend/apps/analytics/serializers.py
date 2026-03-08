from rest_framework import serializers
from .models import EnergyLog, MorningCheckIn, EveningReflection, FutureSelfGoal

class EnergyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyLog
        fields = '__all__'
        read_only_fields = ('timestamp',)


class MorningCheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = MorningCheckIn
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class EveningReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EveningReflection
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class FutureSelfGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = FutureSelfGoal
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')
