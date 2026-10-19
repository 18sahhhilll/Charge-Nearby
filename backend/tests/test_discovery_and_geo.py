from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.chargers.models import Charger

class DiscoveryAndGeospatialTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.host = User.objects.create_user(
            email="pune_host@test.com",
            full_name="Pune Host",
            password="Password123!",
            role="HOST"
        )

        # Charger 1: Koregaon Park (Lat: 18.5362, Lng: 73.8940) - APPROVED
        self.ch_koregaon = Charger.objects.create(
            host=self.host,
            title="Koregaon Park Type 2",
            charger_type="AC",
            connector_types=["TYPE2"],
            max_power_kw=Decimal("7.4"),
            pricing_model="PER_KWH",
            price_per_kwh=Decimal("15.00"),
            latitude=Decimal("18.536200"),
            longitude=Decimal("73.894000"),
            locality="Koregaon Park, Pune",
            exact_address="Bungalow 12, Lane 6",
            availability_status="AVAILABLE",
            verification_status="APPROVED"
        )

        # Charger 2: Baner (Lat: 18.5590, Lng: 73.7868) - APPROVED (approx 12 km from Koregaon Park)
        self.ch_baner = Charger.objects.create(
            host=self.host,
            title="Baner CCS2 Fast Charger",
            charger_type="DC",
            connector_types=["CCS2"],
            max_power_kw=Decimal("30.0"),
            pricing_model="PER_KWH",
            price_per_kwh=Decimal("18.00"),
            latitude=Decimal("18.559000"),
            longitude=Decimal("73.786800"),
            locality="Baner, Pune",
            exact_address="Office 102, Baner Road",
            availability_status="AVAILABLE",
            verification_status="APPROVED"
        )

        # Charger 3: Koregaon Park (Unapproved)
        self.ch_koregaon_pending = Charger.objects.create(
            host=self.host,
            title="Koregaon Park Unapproved",
            charger_type="AC",
            connector_types=["TYPE2"],
            max_power_kw=Decimal("3.3"),
            pricing_model="PER_KWH",
            price_per_kwh=Decimal("12.00"),
            latitude=Decimal("18.537000"),
            longitude=Decimal("73.895000"),
            locality="Koregaon Park, Pune",
            exact_address="Unapproved Flat 2",
            availability_status="AVAILABLE",
            verification_status="PENDING"
        )

    def test_discovery_within_3km_radius_of_koregaon_park(self):
        # Search from Koregaon Park center: (18.5360, 73.8938)
        url = reverse("discovery-nearby")
        response = self.client.get(url, {
            "lat": "18.5360",
            "lng": "73.8938",
            "radius_km": "3.0"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"]
        result_ids = [r["id"] for r in results]

        # Koregaon Park approved should be found
        self.assertIn(str(self.ch_koregaon.id), result_ids)
        # Baner is ~12 km away, should NOT be in 3 km results
        self.assertNotIn(str(self.ch_baner.id), result_ids)
        # Unapproved should NOT be in results
        self.assertNotIn(str(self.ch_koregaon_pending.id), result_ids)

    def test_discovery_connector_filtering(self):
        # Search with radius 20 km (both Koregaon and Baner in range), but filter connector=CCS2
        url = reverse("discovery-nearby")
        response = self.client.get(url, {
            "lat": "18.5360",
            "lng": "73.8938",
            "radius_km": "20.0",
            "connector": "CCS2"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"]
        result_ids = [r["id"] for r in results]

        # Only Baner has CCS2
        self.assertIn(str(self.ch_baner.id), result_ids)
        self.assertNotIn(str(self.ch_koregaon.id), result_ids)

    def test_empty_results_returns_pune_public_hub_alternatives(self):
        # Search in a location far from private chargers (e.g. Talegaon or 0.1 km radius with no chargers)
        url = reverse("discovery-nearby")
        response = self.client.get(url, {
            "lat": "18.7300",
            "lng": "73.6800",
            "radius_km": "1.0"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)
        self.assertGreater(len(response.data["alternatives"]), 0)
        self.assertTrue(response.data["fallback_info"]["expanded_radius_recommended"])

    def test_reachability_labels_honest_uncertainty(self):
        # Call estimate reachability without battery percent
        url = reverse("discovery-estimate-reachability")
        response = self.client.post(url, {
            "origin_lat": 18.5360,
            "origin_lng": 73.8938,
            "dest_lat": 18.5590,
            "dest_lng": 73.7868
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["reachability_status"], "UNKNOWN")
        self.assertIn("Battery percentage not provided", response.data["notes"][0])
