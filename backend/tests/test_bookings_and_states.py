from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.chargers.models import Charger
from apps.vehicles.models import Vehicle
from apps.bookings.models import Booking

class BookingAndStateTransitionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.host = User.objects.create_user(
            email="booking_host@test.com",
            full_name="Host Nilesh",
            password="Password123!",
            role="HOST"
        )
        self.driver = User.objects.create_user(
            email="booking_driver@test.com",
            full_name="Driver Priya",
            password="Password123!",
            role="DRIVER"
        )
        self.other_driver = User.objects.create_user(
            email="other_driver@test.com",
            full_name="Other User",
            password="Password123!",
            role="DRIVER"
        )

        self.charger = Charger.objects.create(
            host=self.host,
            title="Kothrud Rapid Point",
            charger_type="AC",
            connector_types=["TYPE2"],
            max_power_kw=Decimal("7.4"),
            pricing_model="FIXED_SESSION",
            session_price=Decimal("200.00"),
            latitude=Decimal("18.507400"),
            longitude=Decimal("73.807700"),
            locality="Kothrud, Pune",
            exact_address="Flat 402, Mayur Colony, Kothrud",
            access_instructions="Use rightmost parking bay marked EV 402",
            availability_status="AVAILABLE",
            verification_status="APPROVED"
        )

        self.vehicle = Vehicle.objects.create(
            owner=self.driver,
            make="Tata",
            model="Nexon EV",
            vehicle_type="CAR",
            connector_types=["TYPE2", "CCS2"],
            battery_capacity_kwh=Decimal("40.5"),
            estimated_battery_percent=18
        )

    def test_booking_creation_and_price_snapshot(self):
        url = reverse("bookings:booking-list-create")
        self.client.force_authenticate(user=self.driver)
        payload = {
            "charger": str(self.charger.id),
            "vehicle": str(self.vehicle.id),
            "booking_type": "EMERGENCY"
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        booking_id = response.data["id"]
        
        # Verify status and snapshot price
        booking = Booking.objects.get(id=booking_id)
        self.assertEqual(booking.status, "REQUESTED")
        self.assertEqual(booking.quoted_amount, Decimal("200.00"))
        self.assertEqual(booking.currency, "INR")

        # While in REQUESTED state, exact address must still be hidden
        detail_url = reverse("bookings:booking-detail", kwargs={"pk": booking_id})
        det_response = self.client.get(detail_url)
        self.assertEqual(det_response.data["exact_address"], "Hidden until booking is confirmed by host.")

    def test_driver_cannot_book_own_charger(self):
        # Create a charger owned by driver
        own_charger = Charger.objects.create(
            host=self.driver,
            title="Driver's Home Charger",
            charger_type="AC",
            connector_types=["TYPE2"],
            max_power_kw=Decimal("3.3"),
            pricing_model="FIXED_SESSION",
            session_price=Decimal("100.00"),
            latitude=Decimal("18.510000"),
            longitude=Decimal("73.810000"),
            locality="Kothrud, Pune",
            exact_address="Own home",
            verification_status="APPROVED"
        )
        url = reverse("bookings:booking-list-create")
        self.client.force_authenticate(user=self.driver)
        response = self.client.post(url, {
            "charger": str(own_charger.id),
            "vehicle": str(self.vehicle.id),
            "booking_type": "EMERGENCY"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_driver_cannot_use_another_users_vehicle(self):
        # other_driver's vehicle
        other_vehicle = Vehicle.objects.create(
            owner=self.other_driver,
            make="MG",
            model="ZS EV",
            vehicle_type="CAR",
            connector_types=["TYPE2", "CCS2"]
        )
        url = reverse("bookings:booking-list-create")
        self.client.force_authenticate(user=self.driver)
        response = self.client.post(url, {
            "charger": str(self.charger.id),
            "vehicle": str(other_vehicle.id),
            "booking_type": "EMERGENCY"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_full_booking_lifecycle_state_machine(self):
        # 1. Create booking (REQUESTED)
        booking = Booking.objects.create(
            driver=self.driver,
            charger=self.charger,
            vehicle=self.vehicle,
            booking_type="EMERGENCY",
            status="REQUESTED",
            quoted_amount=Decimal("200.00")
        )

        # 2. Host accepts booking -> ACCEPTED
        accept_url = reverse("bookings:booking-accept", kwargs={"pk": booking.id})
        self.client.force_authenticate(user=self.host)
        res_accept = self.client.post(accept_url)
        self.assertEqual(res_accept.status_code, status.HTTP_200_OK)
        self.assertEqual(res_accept.data["status"], "ACCEPTED")

        # Now exact address is revealed to driver!
        self.client.force_authenticate(user=self.driver)
        det_url = reverse("bookings:booking-detail", kwargs={"pk": booking.id})
        res_det = self.client.get(det_url)
        self.assertEqual(res_det.data["exact_address"], "Flat 402, Mayur Colony, Kothrud")
        self.assertEqual(res_det.data["access_instructions"], "Use rightmost parking bay marked EV 402")

        # 3. Driver marks arrival -> ARRIVED
        arrive_url = reverse("bookings:booking-arrive", kwargs={"pk": booking.id})
        res_arr = self.client.post(arrive_url)
        self.assertEqual(res_arr.status_code, status.HTTP_200_OK)
        self.assertEqual(res_arr.data["status"], "ARRIVED")

        # 4. Start session -> CHARGING
        start_url = reverse("bookings:booking-start-session", kwargs={"pk": booking.id})
        res_start = self.client.post(start_url, {"start_battery_percent": 18, "notes": "Connected successfully"})
        self.assertEqual(res_start.status_code, status.HTTP_200_OK)
        self.assertEqual(res_start.data["status"], "CHARGING")

        # 5. Complete session -> COMPLETED
        complete_url = reverse("bookings:booking-complete", kwargs={"pk": booking.id})
        res_comp = self.client.post(complete_url, {
            "energy_delivered_kwh": "11.25",
            "end_battery_percent": 45
        })
        self.assertEqual(res_comp.status_code, status.HTTP_200_OK)
        self.assertEqual(res_comp.data["status"], "COMPLETED")
        self.assertEqual(res_comp.data["session"]["energy_delivered_kwh"], "11.25")
        self.assertEqual(res_comp.data["session"]["end_battery_percent"], 45)

    def test_invalid_state_transition_rejected(self):
        # Booking in REQUESTED state cannot jump straight to CHARGING
        booking = Booking.objects.create(
            driver=self.driver,
            charger=self.charger,
            vehicle=self.vehicle,
            booking_type="EMERGENCY",
            status="REQUESTED",
            quoted_amount=Decimal("200.00")
        )
        start_url = reverse("bookings:booking-start-session", kwargs={"pk": booking.id})
        self.client.force_authenticate(user=self.driver)
        response = self.client.post(start_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
