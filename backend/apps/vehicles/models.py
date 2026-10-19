from decimal import Decimal
import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class Vehicle(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ("CAR", "4-Wheeler Car"),
        ("TWO_WHEELER", "2-Wheeler (Scooter/Bike)"),
        ("THREE_WHEELER", "3-Wheeler (Auto/Cargo)"),
        ("OTHER", "Other Electric Vehicle"),
    ]

    CONNECTOR_CHOICES = [
        ("TYPE2", "Type 2 (Mennekes AC)"),
        ("CCS2", "CCS 2 (Combined Charging System DC)"),
        ("CHADEMO", "CHAdeMO DC"),
        ("GB_T", "GB/T"),
        ("15A_3PIN", "15A 3-Pin Home Socket AC"),
        ("OTHER", "Other Connector"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vehicles"
    )
    nickname = models.CharField(max_length=100, blank=True, null=True)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    vehicle_type = models.CharField(
        max_length=20,
        choices=VEHICLE_TYPE_CHOICES,
        default="CAR"
    )
    # Store connector types as a list of strings
    connector_types = models.JSONField(
        default=list,
        help_text="Supported connector types, e.g. ['TYPE2', 'CCS2']"
    )
    battery_capacity_kwh = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.5"))]
    )
    estimated_battery_percent = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="User-reported current battery percentage (0-100)"
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "vehicles"
        ordering = ["-created_at"]

    def __str__(self):
        name = self.nickname if self.nickname else f"{self.make} {self.model}"
        return f"{name} ({self.owner.full_name})"
