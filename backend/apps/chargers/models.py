import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone

class Charger(models.Model):
    CHARGER_TYPE_CHOICES = [
        ("AC", "AC Charger"),
        ("DC", "DC Fast Charger"),
    ]

    CONNECTOR_CHOICES = [
        ("TYPE2", "Type 2 (Mennekes AC)"),
        ("CCS2", "CCS 2 DC"),
        ("CHADEMO", "CHAdeMO DC"),
        ("GB_T", "GB/T"),
        ("15A_3PIN", "15A 3-Pin Socket AC"),
        ("OTHER", "Other"),
    ]

    PRICING_MODEL_CHOICES = [
        ("PER_KWH", "Per kWh Delivered"),
        ("PER_MINUTE", "Per Minute Connected"),
        ("FIXED_SESSION", "Fixed Session Price"),
    ]

    AVAILABILITY_STATUS_CHOICES = [
        ("AVAILABLE", "Available (Confirmed)"),
        ("UNCONFIRMED", "Unconfirmed Availability"),
        ("UNAVAILABLE", "Unavailable"),
    ]

    VERIFICATION_STATUS_CHOICES = [
        ("PENDING", "Pending Verification"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("SUSPENDED", "Suspended"),
    ]

    PARKING_ACCESS_CHOICES = [
        ("DEDICATED_DRIVEWAY", "Private Dedicated Driveway"),
        ("GARAGE", "Enclosed Private Garage"),
        ("STREET_FRONT", "Street-facing Bungalow Gate"),
        ("SOCIETY_PARKING", "Apartment Society Visitor Bay"),
        ("COMMERCIAL_LOT", "Commercial Office / Business Lot"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chargers"
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    charger_type = models.CharField(max_length=10, choices=CHARGER_TYPE_CHOICES, default="AC")
    connector_types = models.JSONField(
        default=list,
        help_text="List of supported connectors, e.g. ['TYPE2', '15A_3PIN']"
    )
    max_power_kw = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("1.0"))],
        help_text="Maximum output power in kW"
    )
    
    pricing_model = models.CharField(
        max_length=20,
        choices=PRICING_MODEL_CHOICES,
        default="PER_KWH"
    )
    price_per_kwh = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.0"))]
    )
    price_per_minute = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.0"))]
    )
    session_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.0"))]
    )
    currency = models.CharField(max_length=3, default="INR", editable=False)

    # Location (SRID 4326 coords with spatial indices)
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        db_index=True,
        validators=[MinValueValidator(Decimal("-90.0")), MaxValueValidator(Decimal("90.0"))]
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        db_index=True,
        validators=[MinValueValidator(Decimal("-180.0")), MaxValueValidator(Decimal("180.0"))]
    )
    # Public locality e.g. "Koregaon Park, Pune"
    locality = models.CharField(max_length=150, help_text="Public neighbourhood/locality")

    # PRIVATE LOCATION & INSTRUCTIONS (Restricted to confirmed bookings)
    exact_address = models.CharField(
        max_length=255,
        help_text="Private full street/flat address - never exposed publicly"
    )
    access_instructions = models.TextField(
        blank=True,
        default="",
        help_text="Private gate/parking/socket instructions - never exposed publicly"
    )

    parking_access = models.CharField(
        max_length=30,
        choices=PARKING_ACCESS_CHOICES,
        default="DEDICATED_DRIVEWAY"
    )

    availability_status = models.CharField(
        max_length=20,
        choices=AVAILABILITY_STATUS_CHOICES,
        default="UNCONFIRMED"
    )
    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_STATUS_CHOICES,
        default="PENDING",
        db_index=True
    )
    last_confirmed_available_at = models.DateTimeField(null=True, blank=True)
    admin_review_notes = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "chargers"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["verification_status", "availability_status"]),
            models.Index(fields=["latitude", "longitude"]),
        ]

    def clean(self):
        super().clean()
        # Enforce that selected pricing model has the corresponding rate set
        if self.pricing_model == "PER_KWH" and (self.price_per_kwh is None or self.price_per_kwh < 0):
            raise ValidationError({"price_per_kwh": "price_per_kwh is required when pricing model is PER_KWH."})
        elif self.pricing_model == "PER_MINUTE" and (self.price_per_minute is None or self.price_per_minute < 0):
            raise ValidationError({"price_per_minute": "price_per_minute is required when pricing model is PER_MINUTE."})
        elif self.pricing_model == "FIXED_SESSION" and (self.session_price is None or self.session_price < 0):
            raise ValidationError({"session_price": "session_price is required when pricing model is FIXED_SESSION."})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.locality}) - {self.verification_status}"

class AvailabilityWindow(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    charger = models.ForeignKey(
        Charger,
        on_delete=models.CASCADE,
        related_name="availability_windows"
    )
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    is_available = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "availability_windows"
        ordering = ["start_at"]

    def clean(self):
        if self.end_at <= self.start_at:
            raise ValidationError({"end_at": "end_at must be strictly after start_at."})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.charger.title}: {self.start_at} - {self.end_at} ({'Available' if self.is_available else 'Blocked'})"

def validate_photo_file(image):
    max_size_bytes = 5 * 1024 * 1024  # 5MB
    if image.size > max_size_bytes:
        raise ValidationError(f"Image file too large ({image.size / (1024*1024):.1f}MB). Maximum allowed size is 5MB.")
    
    valid_extensions = ['.jpg', '.jpeg', '.png', '.webp']
    import os
    ext = os.path.splitext(image.name)[1].lower()
    if ext not in valid_extensions:
        raise ValidationError(f"Unsupported image format '{ext}'. Allowed formats: JPG, PNG, WEBP.")

class ChargerPhoto(models.Model):
    PHOTO_TYPE_CHOICES = [
        ("CHARGER", "Charging Equipment / Wallbox"),
        ("PARKING_BAY", "Parking Bay / Driveway Access"),
        ("CIRCUIT_BREAKER", "Electrical MCB / Switchboard"),
        ("OTHER", "Other Detail"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    charger = models.ForeignKey(
        Charger,
        on_delete=models.CASCADE,
        related_name="photos"
    )
    image = models.ImageField(
        upload_to="chargers/%Y/%m/",
        validators=[validate_photo_file]
    )
    caption = models.CharField(max_length=200, blank=True, default="")
    photo_type = models.CharField(
        max_length=30,
        choices=PHOTO_TYPE_CHOICES,
        default="CHARGER"
    )
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "charger_photos"
        ordering = ["-is_primary", "-uploaded_at"]

    def __str__(self):
        return f"Photo for {self.charger.title} [{self.photo_type}]"
