from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError
from apps.core.permissions import IsHostUser, IsAdminRole, IsOwnerOrAdmin
from .models import Charger, AvailabilityWindow
from .serializers import (
    PublicChargerSerializer,
    HostChargerSerializer,
    AvailabilityWindowSerializer
)

# ----------------- PUBLIC VIEWS -----------------

class PublicChargerListView(generics.ListAPIView):
    """
    Public listing: returns ONLY approved, non-suspended chargers.
    Never exposes exact residential address or access instructions.
    """
    serializer_class = PublicChargerSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Charger.objects.filter(verification_status="APPROVED")
        connector = self.request.query_params.get("connector")
        charger_type = self.request.query_params.get("charger_type")
        available_now = self.request.query_params.get("available_now")

        if connector:
            # JSON field contains connector
            queryset = queryset.filter(connector_types__icontains=connector)
        if charger_type:
            queryset = queryset.filter(charger_type=charger_type)
        if available_now and available_now.lower() == "true":
            queryset = queryset.filter(availability_status="AVAILABLE")

        return queryset

class PublicChargerDetailView(generics.RetrieveAPIView):
    """Public detail: returns public information for an approved charger."""
    serializer_class = PublicChargerSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        pk = self.kwargs.get("pk")
        try:
            charger = Charger.objects.get(pk=pk)
        except Charger.DoesNotExist:
            raise NotFound("Charger not found.")

        # If user is owner or admin, allow viewing even if pending
        if self.request.user.is_authenticated:
            if charger.host == self.request.user or self.request.user.role == "ADMIN" or self.request.user.is_staff:
                return charger

        if charger.verification_status != "APPROVED":
            raise NotFound("Charger not found or pending verification.")

        return charger


# ----------------- HOST VIEWS -----------------

class HostChargerListCreateView(generics.ListCreateAPIView):
    serializer_class = HostChargerSerializer
    permission_classes = [permissions.IsAuthenticated, IsHostUser]

    def get_queryset(self):
        return Charger.objects.filter(host=self.request.user)

    def perform_create(self, serializer):
        # Auto-set host to authenticated user and status to PENDING
        serializer.save(
            host=self.request.user,
            verification_status="PENDING",
            availability_status="UNCONFIRMED"
        )

class HostChargerDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = HostChargerSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.role == "ADMIN" or self.request.user.is_staff:
            return Charger.objects.all()
        return Charger.objects.filter(host=self.request.user)

    def perform_update(self, serializer):
        # If crucial specs or location are edited, require re-verification
        instance = serializer.save()
        if "exact_address" in serializer.validated_data or "latitude" in serializer.validated_data:
            instance.verification_status = "PENDING"
            instance.save(update_fields=["verification_status"])

class HostChargerSubmitView(APIView):
    """Submits a charger listing for verification review."""
    permission_classes = [permissions.IsAuthenticated, IsHostUser]

    def post(self, request, pk):
        try:
            charger = Charger.objects.get(pk=pk, host=request.user)
        except Charger.DoesNotExist:
            raise NotFound("Charger not found or not owned by you.")

        charger.verification_status = "PENDING"
        charger.save(update_fields=["verification_status", "updated_at"])
        return Response({
            "message": "Charger listing submitted for admin review.",
            "verification_status": charger.verification_status
        })

class HostChargerAvailabilityView(APIView):
    """Host confirms immediate availability status."""
    permission_classes = [permissions.IsAuthenticated, IsHostUser]

    def post(self, request, pk):
        try:
            charger = Charger.objects.get(pk=pk, host=request.user)
        except Charger.DoesNotExist:
            raise NotFound("Charger not found or not owned by you.")

        status_input = request.data.get("availability_status")
        valid_statuses = ["AVAILABLE", "UNAVAILABLE", "UNCONFIRMED"]
        if status_input not in valid_statuses:
            raise ValidationError({"availability_status": f"Must be one of {valid_statuses}."})

        charger.availability_status = status_input
        if status_input == "AVAILABLE":
            charger.last_confirmed_available_at = timezone.now()
        charger.save(update_fields=["availability_status", "last_confirmed_available_at", "updated_at"])

        return Response({
            "message": "Availability updated successfully.",
            "availability_status": charger.availability_status,
            "last_confirmed_available_at": charger.last_confirmed_available_at
        })


# ----------------- ADMIN MODERATION VIEWS -----------------

class AdminVerificationQueueView(generics.ListAPIView):
    serializer_class = HostChargerSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        return Charger.objects.filter(verification_status="PENDING").order_by("created_at")

class AdminApproveChargerView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        try:
            charger = Charger.objects.get(pk=pk)
        except Charger.DoesNotExist:
            raise NotFound("Charger not found.")

        # Hosts cannot approve their own listings! (Specification Section 16)
        if charger.host == request.user and not request.user.is_superuser:
            raise PermissionDenied("Hosts cannot approve their own listings.")

        charger.verification_status = "APPROVED"
        charger.admin_review_notes = request.data.get("notes", "Approved by admin.")
        charger.save(update_fields=["verification_status", "admin_review_notes", "updated_at"])

        return Response({
            "message": "Charger approved for public discovery.",
            "verification_status": charger.verification_status
        })

class AdminRejectChargerView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        try:
            charger = Charger.objects.get(pk=pk)
        except Charger.DoesNotExist:
            raise NotFound("Charger not found.")

        charger.verification_status = "REJECTED"
        charger.admin_review_notes = request.data.get("notes", "Rejected by admin.")
        charger.save(update_fields=["verification_status", "admin_review_notes", "updated_at"])

        return Response({
            "message": "Charger listing rejected.",
            "verification_status": charger.verification_status
        })

class AdminSuspendChargerView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        try:
            charger = Charger.objects.get(pk=pk)
        except Charger.DoesNotExist:
            raise NotFound("Charger not found.")

        charger.verification_status = "SUSPENDED"
        charger.admin_review_notes = request.data.get("notes", "Suspended by admin.")
        charger.save(update_fields=["verification_status", "admin_review_notes", "updated_at"])

        return Response({
            "message": "Charger listing suspended.",
            "verification_status": charger.verification_status
        })
