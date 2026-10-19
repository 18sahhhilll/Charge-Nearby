from django.contrib import admin
from .models import Booking, ChargingSession

class ChargingSessionInline(admin.StackedInline):
    model = ChargingSession
    extra = 0

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "charger",
        "driver",
        "status",
        "booking_type",
        "quoted_amount",
        "currency",
        "requested_start_at",
        "created_at",
    )
    list_filter = ("status", "booking_type")
    search_fields = ("id", "charger__title", "driver__email", "driver__full_name")
    inlines = [ChargingSessionInline]

@admin.register(ChargingSession)
class ChargingSessionAdmin(admin.ModelAdmin):
    list_display = ("booking", "started_at", "ended_at", "energy_delivered_kwh", "completion_method")
