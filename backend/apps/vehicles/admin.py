from django.contrib import admin
from .models import Vehicle

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ("make", "model", "vehicle_type", "owner", "battery_capacity_kwh", "estimated_battery_percent", "created_at")
    list_filter = ("vehicle_type",)
    search_fields = ("make", "model", "nickname", "owner__email", "owner__full_name")
