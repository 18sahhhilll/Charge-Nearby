from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError
from .models import Booking, ChargingSession
from .serializers import BookingSerializer, BookingCreateSerializer, ChargingSessionSerializer

class BookingListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BookingCreateSerializer
        return BookingSerializer

    def get_queryset(self):
        user = self.request.user
        role_view = self.request.query_params.get("view")
        if role_view == "host" or user.role == "HOST":
            return Booking.objects.filter(charger__host=user)
        elif user.role == "ADMIN" or user.is_staff:
            return Booking.objects.all()
        # Default: user as driver
        return Booking.objects.filter(driver=user)

    def perform_create(self, serializer):
        charger = serializer.validated_data["charger"]
        
        # Calculate snapshot quoted amount based on pricing model
        if charger.pricing_model == "FIXED_SESSION":
            quote = charger.session_price or Decimal("150.00")
        elif charger.pricing_model == "PER_KWH":
            # For emergency estimate: typical top-up ~ 10 kWh
            quote = (charger.price_per_kwh or Decimal("15.00")) * Decimal("10.0")
        elif charger.pricing_model == "PER_MINUTE":
            # Typical 60 min session
            quote = (charger.price_per_minute or Decimal("2.50")) * Decimal("60.0")
        else:
            quote = Decimal("100.00")

        serializer.save(
            driver=self.request.user,
            status="REQUESTED",
            quoted_amount=quote,
            currency="INR"
        )

class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get("pk")
        try:
            booking = Booking.objects.select_related("driver", "charger", "vehicle", "session").get(pk=pk)
        except Booking.DoesNotExist:
            raise NotFound("Booking not found.")

        user = self.request.user
        if booking.driver != user and booking.charger.host != user and user.role != "ADMIN" and not user.is_staff:
            raise PermissionDenied("You do not have permission to view this booking.")

        return booking

class BookingAcceptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        with transaction.atomic():
            try:
                booking = Booking.objects.select_for_update().get(pk=pk)
            except Booking.DoesNotExist:
                raise NotFound("Booking not found.")

            if booking.charger.host != request.user and request.user.role != "ADMIN" and not request.user.is_staff:
                raise PermissionDenied("Only the host can accept this booking.")

            if booking.status != "REQUESTED":
                raise ValidationError(f"Cannot accept booking in state '{booking.status}'. Must be 'REQUESTED'.")

            booking.status = "ACCEPTED"
            booking.accepted_at = timezone.now()
            booking.save(update_fields=["status", "accepted_at", "updated_at"])

        return Response(BookingSerializer(booking, context={"request": request}).data)

class BookingDeclineView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        with transaction.atomic():
            try:
                booking = Booking.objects.select_for_update().get(pk=pk)
            except Booking.DoesNotExist:
                raise NotFound("Booking not found.")

            if booking.charger.host != request.user and request.user.role != "ADMIN" and not request.user.is_staff:
                raise PermissionDenied("Only the host can decline this booking.")

            if booking.status != "REQUESTED":
                raise ValidationError(f"Cannot decline booking in state '{booking.status}'. Must be 'REQUESTED'.")

            booking.status = "DECLINED"
            booking.cancellation_reason = request.data.get("reason", "Host unavailable at this time.")
            booking.save(update_fields=["status", "cancellation_reason", "updated_at"])

        return Response(BookingSerializer(booking, context={"request": request}).data)

class BookingCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        with transaction.atomic():
            try:
                booking = Booking.objects.select_for_update().get(pk=pk)
            except Booking.DoesNotExist:
                raise NotFound("Booking not found.")

            user = request.user
            if booking.driver != user and booking.charger.host != user and user.role != "ADMIN" and not user.is_staff:
                raise PermissionDenied("You do not have permission to cancel this booking.")

            if booking.status not in ["REQUESTED", "ACCEPTED", "ARRIVED"]:
                raise ValidationError(f"Cannot cancel booking in state '{booking.status}'.")

            booking.status = "CANCELLED"
            booking.cancellation_reason = request.data.get("reason", "Cancelled by user.")
            booking.save(update_fields=["status", "cancellation_reason", "updated_at"])

        return Response(BookingSerializer(booking, context={"request": request}).data)

class BookingArriveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        with transaction.atomic():
            try:
                booking = Booking.objects.select_for_update().get(pk=pk)
            except Booking.DoesNotExist:
                raise NotFound("Booking not found.")

            if booking.driver != request.user and request.user.role != "ADMIN" and not request.user.is_staff:
                raise PermissionDenied("Only the driver can mark arrival.")

            if booking.status != "ACCEPTED":
                raise ValidationError(f"Cannot mark arrival for booking in state '{booking.status}'. Must be 'ACCEPTED'.")

            booking.status = "ARRIVED"
            booking.arrival_at = timezone.now()
            booking.save(update_fields=["status", "arrival_at", "updated_at"])

        return Response(BookingSerializer(booking, context={"request": request}).data)

class BookingStartSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        with transaction.atomic():
            try:
                booking = Booking.objects.select_for_update().get(pk=pk)
            except Booking.DoesNotExist:
                raise NotFound("Booking not found.")

            user = request.user
            if booking.driver != user and booking.charger.host != user and user.role != "ADMIN" and not user.is_staff:
                raise PermissionDenied("You do not have permission to start this charging session.")

            if booking.status != "ARRIVED":
                raise ValidationError(f"Cannot start charging session in state '{booking.status}'. Must be 'ARRIVED'.")

            booking.status = "CHARGING"
            booking.save(update_fields=["status", "updated_at"])

            start_pct = request.data.get("start_battery_percent")
            ChargingSession.objects.create(
                booking=booking,
                started_at=timezone.now(),
                start_battery_percent=int(start_pct) if start_pct is not None else None,
                notes=request.data.get("notes", "")
            )

        return Response(BookingSerializer(booking, context={"request": request}).data)

class BookingCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        with transaction.atomic():
            try:
                booking = Booking.objects.select_for_update().get(pk=pk)
            except Booking.DoesNotExist:
                raise NotFound("Booking not found.")

            user = request.user
            if booking.driver != user and booking.charger.host != user and user.role != "ADMIN" and not user.is_staff:
                raise PermissionDenied("You do not have permission to complete this charging session.")

            if booking.status != "CHARGING":
                raise ValidationError(f"Cannot complete session in state '{booking.status}'. Must be 'CHARGING'.")

            booking.status = "COMPLETED"
            booking.completed_at = timezone.now()
            booking.save(update_fields=["status", "completed_at", "updated_at"])

            # Update session details
            session, _ = ChargingSession.objects.get_or_create(booking=booking)
            session.ended_at = timezone.now()
            
            energy = request.data.get("energy_delivered_kwh")
            if energy is not None:
                session.energy_delivered_kwh = Decimal(str(energy))
            
            end_pct = request.data.get("end_battery_percent")
            if end_pct is not None:
                session.end_battery_percent = int(end_pct)

            session.completion_method = "HOST" if user == booking.charger.host else "DRIVER"
            session.save()

        return Response(BookingSerializer(booking, context={"request": request}).data)

class BookingReportIssueView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        with transaction.atomic():
            try:
                booking = Booking.objects.select_for_update().get(pk=pk)
            except Booking.DoesNotExist:
                raise NotFound("Booking not found.")

            user = request.user
            if booking.driver != user and booking.charger.host != user and user.role != "ADMIN" and not user.is_staff:
                raise PermissionDenied("You do not have permission to report an issue for this booking.")

            booking.status = "DISPUTED"
            booking.dispute_reason = request.data.get("dispute_reason", "Issue reported by user.")
            booking.save(update_fields=["status", "dispute_reason", "updated_at"])

        return Response(BookingSerializer(booking, context={"request": request}).data)
