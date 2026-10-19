from rest_framework import serializers
from .models import Charger, AvailabilityWindow, ChargerPhoto

class ChargerPhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ChargerPhoto
        fields = [
            "id",
            "charger",
            "image",
            "image_url",
            "caption",
            "photo_type",
            "is_primary",
            "uploaded_at",
        ]
        read_only_fields = ["id", "charger", "image_url", "uploaded_at"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class PublicChargerSerializer(serializers.ModelSerializer):
    """
    Public listing representation.
    CRITICAL: Never exposes exact_address or access_instructions.
    Only approved, non-suspended chargers are returned publicly.
    """
    host_display_name = serializers.SerializerMethodField()
    photos = ChargerPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Charger
        fields = [
            "id",
            "title",
            "description",
            "charger_type",
            "connector_types",
            "max_power_kw",
            "pricing_model",
            "price_per_kwh",
            "price_per_minute",
            "session_price",
            "currency",
            "latitude",
            "longitude",
            "locality",
            "parking_access",
            "availability_status",
            "verification_status",
            "last_confirmed_available_at",
            "host_display_name",
            "photos",
            "created_at",
        ]
        read_only_fields = fields

    def get_host_display_name(self, obj):
        if obj.host:
            names = obj.host.full_name.split()
            # Privacy safe: e.g. "Sahil M."
            if len(names) > 1:
                return f"{names[0]} {names[-1][0]}."
            return names[0]
        return "Host"

class HostChargerSerializer(serializers.ModelSerializer):
    """
    Full charger representation for the host who owns the listing.
    Includes exact address and private access instructions.
    """
    photos = ChargerPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Charger
        fields = [
            "id",
            "host",
            "title",
            "description",
            "charger_type",
            "connector_types",
            "max_power_kw",
            "pricing_model",
            "price_per_kwh",
            "price_per_minute",
            "session_price",
            "currency",
            "latitude",
            "longitude",
            "locality",
            "exact_address",
            "access_instructions",
            "parking_access",
            "availability_status",
            "verification_status",
            "last_confirmed_available_at",
            "admin_review_notes",
            "photos",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "host",
            "currency",
            "verification_status",
            "last_confirmed_available_at",
            "admin_review_notes",
            "photos",
            "created_at",
            "updated_at",
        ]

    def validate_connector_types(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError("At least one connector type must be selected.")
        valid_connectors = [c[0] for c in Charger.CONNECTOR_CHOICES]
        for conn in value:
            if conn not in valid_connectors:
                raise serializers.ValidationError(f"Invalid connector type: {conn}")
        return value

class AvailabilityWindowSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityWindow
        fields = [
            "id",
            "charger",
            "start_at",
            "end_at",
            "is_available",
            "created_by",
            "created_at"
        ]
        read_only_fields = ["id", "charger", "created_by", "created_at"]
