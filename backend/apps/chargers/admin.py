from django.contrib import admin
from .models import Charger, AvailabilityWindow

@admin.action(description="Approve selected charger listings")
def approve_chargers(modeladmin, request, queryset):
    queryset.update(verification_status="APPROVED", admin_review_notes="Approved via Django Admin batch action.")

@admin.action(description="Reject selected charger listings")
def reject_chargers(modeladmin, request, queryset):
    queryset.update(verification_status="REJECTED", admin_review_notes="Rejected via Django Admin batch action.")

@admin.action(description="Suspend selected charger listings")
def suspend_chargers(modeladmin, request, queryset):
    queryset.update(verification_status="SUSPENDED", admin_review_notes="Suspended via Django Admin batch action.")

@admin.register(Charger)
class ChargerAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "locality",
        "host",
        "charger_type",
        "max_power_kw",
        "pricing_model",
        "availability_status",
        "verification_status",
        "created_at",
    )
    list_filter = ("verification_status", "availability_status", "charger_type", "pricing_model")
    search_fields = ("title", "locality", "exact_address", "host__email", "host__full_name")
    actions = [approve_chargers, reject_chargers, suspend_chargers]

@admin.register(AvailabilityWindow)
class AvailabilityWindowAdmin(admin.ModelAdmin):
    list_display = ("charger", "start_at", "end_at", "is_available", "created_by")
    list_filter = ("is_available",)
