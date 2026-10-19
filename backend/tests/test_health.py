from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class HealthCheckTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check_returns_healthy(self):
        url = reverse("api-health")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "healthy")
        self.assertEqual(response.data["service"], "ChargeNearby API")
        self.assertEqual(response.data["pilot_city"], "Pune, Maharashtra, India")
        self.assertIn("timestamp", response.data)
        # Ensure no sensitive configuration or database secrets leaked
        self.assertNotIn("password", str(response.data))
        self.assertNotIn("secret", str(response.data).lower())
