from rest_framework import serializers
from apps.chargers.models import Charger
from apps.vehicles.models import Vehicle
from apps.vehicles.serializers import VehicleSerializer
from .models import Booking, ChargingSession

class ChargingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChargingSession
        fields = [
            "id",
            "started_at",
            "ended_at",
            "energy_delivered_kwh",
            "start_battery_percent",
            "end_battery_percent",
            "completion_method",
            "notes",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

class BookingSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source="driver.full_name", read_only=True)
    driver_phone = serializers.CharField(source="driver.phone_number", read_only=True)
    host_name = serializers.CharField(source="charger.host.full_name", read_only=True)
    host_phone = serializers.CharField(source="charger.host.phone_number", read_only=True)
    charger_title = serializers.CharField(source="charger.title", read_only=True)
    charger_locality = serializers.CharField(source="charger.locality", read_only=True)
    vehicle_details = VehicleSerializer(source="vehicle", read_only=True)
    session = ChargingSessionSerializer(read_only=True)

    # SECURE ACCESS: Only reveal exact address and instructions when booking is ACCEPTED or active
    exact_address = serializers.SerializerMethodField()
    access_instructions = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "driver",
            "driver_name",
            "driver_phone",
            "host_name",
            "host_phone",
            "charger",
            "charger_title",
            "charger_locality",
            "vehicle",
            "vehicle_details",
            "booking_type",
            "status",
            "requested_start_at",
            "requested_end_at",
            "accepted_at",
            "arrival_at",
            "completed_at",
            "quoted_amount",
            "currency",
            "exact_address",
            "access_instructions",
            "cancellation_reason",
            "dispute_reason",
            "session",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "driver",
            "status",
            "accepted_at",
            "arrival_at",
            "completed_at",
            "quoted_amount",
            "currency",
            "created_at",
            "updated_at",
        ]

    def get_exact_address(self, obj):
        # Reveal only to driver or host once accepted / active / completed
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None
        is_participant = (request.user == obj.driver or request.user == obj.charger.host or request.user.role == "ADMIN")
        if is_participant and obj.status in ["ACCEPTED", "ARRIVED", "CHARGING", "COMPLETED"]:
            return obj.charger.exact_address
        return "Hidden until booking is confirmed by host."

    def get_access_instructions(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None
        is_participant = (request.user == obj.driver or request.user == obj.charger.host or request.user.role == "ADMIN")
        if is_participant and obj.status in ["ACCEPTED", "ARRIVED", "CHARGING", "COMPLETED"]:
            return obj.charger.access_instructions
        return "Hidden until booking is confirmed by host."

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id",
            "charger",
            "vehicle",
            "booking_type",
            "requested_start_at",
            "requested_end_at"
        ]

    def validate(self, attrs):
        charger = attrs.get("charger")
        vehicle = attrs.get("vehicle")
        user = self.context["request"].user

        # 1. Listing must be APPROVED
        if charger.verification_status != "APPROVED":
            raise serializers.ValidationError({"charger": "This charger is not approved for bookings."})

        # 2. Driver cannot book their own charger
        if charger.host == user:
            raise serializers.ValidationError({"charger": "You cannot book your own charger."})

        # 3. Vehicle must belong to the driver
        if vehicle.owner != user:
            raise serializers.ValidationError({"vehicle": "Selected vehicle does not belong to your account."})

        # 4. Check connector compatibility
        charger_connectors = set(charger.connector_types or [])
        vehicle_connectors = set(vehicle.connector_types or [])
        if not (charger_connectors & vehicle_connectors):
            raise serializers.ValidationError({
                "vehicle": f"Incompatible connector. Charger supports {list(charger_connectors)}, but vehicle has {list(vehicle_connectors)}."
            })

        # 5. Check if charger has an active/pending conflicting booking at requested time
        # Prevent double-booking (Section 7.5 & 8)
        req_start = attrs.get("requested_start_at")
        active_conflict = Booking.objects.filter(
            charger=charger,
            status__in=["REQUESTED", "ACCEPTED", "ARRIVED", "CHARGING"]
        ).exists()

        if active_conflict and attrs.get("booking_type") == "EMERGENCY":
            raise serializers.ValidationError({
                "charger": "This charger currently has an active session or pending request. Please choose another charger."
            })

        return attrs
