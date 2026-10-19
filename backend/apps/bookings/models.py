import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from apps.chargers.models import Charger
from apps.vehicles.models import Vehicle

class Booking(models.Model):
    BOOKING_TYPE_CHOICES = [
        ("EMERGENCY", "Emergency Discovery Booking"),
        ("SCHEDULED", "Scheduled Booking"),
    ]

    STATUS_CHOICES = [
        ("REQUESTED", "Requested (Awaiting Host)"),
        ("ACCEPTED", "Accepted (Active)"),
        ("DECLINED", "Declined by Host"),
        ("CANCELLED", "Cancelled"),
        ("ARRIVED", "Driver Arrived"),
        ("CHARGING", "Charging Session Active"),
        ("COMPLETED", "Completed"),
        ("DISPUTED", "Disputed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    driver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="driver_bookings"
    )
    charger = models.ForeignKey(
        Charger,
        on_delete=models.CASCADE,
        related_name="charger_bookings"
    )
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="vehicle_bookings"
    )
    booking_type = models.CharField(
        max_length=20,
        choices=BOOKING_TYPE_CHOICES,
        default="EMERGENCY"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="REQUESTED",
        db_index=True
    )
    requested_start_at = models.DateTimeField(default=timezone.now)
    requested_end_at = models.DateTimeField(null=True, blank=True)

    accepted_at = models.DateTimeField(null=True, blank=True)
    arrival_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Price snapshot agreed upon request (Section 7.5: immutable after creation)
    quoted_amount = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.0"))]
    )
    currency = models.CharField(max_length=3, default="INR", editable=False)

    cancellation_reason = models.TextField(blank=True, default="")
    dispute_reason = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bookings"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["driver", "status"]),
            models.Index(fields=["charger", "status"]),
            models.Index(fields=["status", "requested_start_at"]),
        ]

    def clean(self):
        super().clean()
        # Validation: driver cannot book their own charger
        if self.charger.host_id == self.driver_id:
            raise ValidationError({"charger": "You cannot book your own charger."})
        # Validation: vehicle must belong to the driver
        if self.vehicle.owner_id != self.driver_id:
            raise ValidationError({"vehicle": "The selected vehicle does not belong to you."})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking {self.id} [{self.status}] - {self.charger.title}"

class ChargingSession(models.Model):
    COMPLETION_METHOD_CHOICES = [
        ("HOST", "Host Confirmed"),
        ("DRIVER", "Driver Confirmed"),
        ("ADMIN", "Admin Resolved"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name="session"
    )
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    energy_delivered_kwh = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.0"))],
        help_text="Manually reported or metered energy delivered"
    )
    start_battery_percent = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    end_battery_percent = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    completion_method = models.CharField(
        max_length=20,
        choices=COMPLETION_METHOD_CHOICES,
        default="HOST"
    )
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "charging_sessions"

    def __str__(self):
        return f"Session for Booking {self.booking_id} ({self.energy_delivered_kwh or 0} kWh)"
