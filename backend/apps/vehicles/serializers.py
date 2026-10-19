from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            "id",
            "owner",
            "nickname",
            "make",
            "model",
            "vehicle_type",
            "connector_types",
            "battery_capacity_kwh",
            "estimated_battery_percent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def validate_connector_types(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError("At least one connector type must be selected.")
        valid_connectors = [c[0] for c in Vehicle.CONNECTOR_CHOICES]
        for conn in value:
            if conn not in valid_connectors:
                raise serializers.ValidationError(f"Invalid connector type: {conn}")
        return value
