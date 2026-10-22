from rest_framework import serializers
from .models import TrackingConfig


class TrackingConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingConfig
        fields = ["platform", "tracking_id", "is_enabled", "required_consent"]
