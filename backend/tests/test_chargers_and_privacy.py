from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.chargers.models import Charger

class ChargerAndPrivacyTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.host = User.objects.create_user(
            email="host_privacy@test.com",
            full_name="Rajesh Sharma",
            password="Password123!",
            role="HOST"
        )
        self.admin = User.objects.create_superuser(
            email="admin_privacy@test.com",
            full_name="Admin Moderator",
            password="AdminPassword123!"
        )
        self.driver = User.objects.create_user(
            email="driver_privacy@test.com",
            full_name="Driver Anand",
            password="Password123!",
            role="DRIVER"
        )

        # Create an approved charger
        self.approved_charger = Charger.objects.create(
            host=self.host,
            title="Koregaon Park Green Charger",
            description="7.4 kW Type 2 Charger in bungalow driveway",
            charger_type="AC",
            connector_types=["TYPE2"],
            max_power_kw=Decimal("7.4"),
            pricing_model="PER_KWH",
            price_per_kwh=Decimal("16.00"),
            latitude=Decimal("18.536200"),
            longitude=Decimal("73.894000"),
            locality="Koregaon Park, Pune",
            exact_address="Bungalow 14, Lane 7, North Main Road, Koregaon Park",
            access_instructions="Security guard at black gate will unlock bollard.",
            availability_status="AVAILABLE",
            verification_status="APPROVED"
        )

        # Create a pending charger
        self.pending_charger = Charger.objects.create(
            host=self.host,
            title="Baner Pending Charger",
            charger_type="AC",
            connector_types=["TYPE2", "15A_3PIN"],
            max_power_kw=Decimal("3.3"),
            pricing_model="PER_KWH",
            price_per_kwh=Decimal("12.00"),
            latitude=Decimal("18.559000"),
            longitude=Decimal("73.786800"),
            locality="Baner, Pune",
            exact_address="Secret Flat 302, Green Towers, Baner",
            access_instructions="Key is under doormat",
            availability_status="AVAILABLE",
            verification_status="PENDING"
        )

    def test_public_listings_exclude_unapproved_chargers(self):
        url = reverse("chargers-public:public-charger-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"] if "results" in response.data else response.data
        ids = [item["id"] for item in results]
        
        self.assertIn(str(self.approved_charger.id), ids)
        self.assertNotIn(str(self.pending_charger.id), ids)

    def test_public_detail_never_exposes_private_address_or_instructions(self):
        url = reverse("chargers-public:public-charger-detail", kwargs={"pk": self.approved_charger.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify public attributes exist
        self.assertEqual(response.data["title"], "Koregaon Park Green Charger")
        self.assertEqual(response.data["locality"], "Koregaon Park, Pune")
        self.assertEqual(response.data["host_display_name"], "Rajesh S.")

        # CRITICAL PRIVACY: exact_address and access_instructions must NOT be in public payload
        self.assertNotIn("exact_address", response.data)
        self.assertNotIn("access_instructions", response.data)
        self.assertNotIn("Lane 7", str(response.data))
        self.assertNotIn("bollard", str(response.data))

    def test_host_cannot_approve_own_listing(self):
        url = reverse("chargers-admin:admin-charger-approve", kwargs={"pk": self.pending_charger.id})
        self.client.force_authenticate(user=self.host)
        response = self.client.post(url)
        # Non-admin host should be forbidden from calling admin moderation
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_approval_workflow(self):
        url = reverse("chargers-admin:admin-charger-approve", kwargs={"pk": self.pending_charger.id})
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(url, {"notes": "Verified host identity and photo specs."}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.pending_charger.refresh_from_db()
        self.assertEqual(self.pending_charger.verification_status, "APPROVED")

        # Now it should be visible in public search
        pub_url = reverse("chargers-public:public-charger-list")
        pub_response = self.client.get(pub_url)
        ids = [item["id"] for item in (pub_response.data.get("results") or pub_response.data)]
        self.assertIn(str(self.pending_charger.id), ids)
