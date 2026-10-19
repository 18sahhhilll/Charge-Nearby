from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.accounts.models import User

class AuthAndPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.driver_user = User.objects.create_user(
            email="driver@test.com",
            full_name="Driver User",
            password="SecurePassword123!",
            role="DRIVER"
        )
        self.host_user = User.objects.create_user(
            email="host@test.com",
            full_name="Host User",
            password="SecurePassword123!",
            role="HOST"
        )
        self.admin_user = User.objects.create_superuser(
            email="admin@test.com",
            full_name="Admin Moderator",
            password="AdminPassword123!"
        )

    def test_user_registration_success(self):
        url = reverse("auth-register")
        payload = {
            "email": "newdriver@test.com",
            "full_name": "New EV Driver",
            "phone_number": "+919876543210",
            "role": "DRIVER",
            "password": "Password1234!",
            "password_confirm": "Password1234!"
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], "newdriver@test.com")

    def test_registration_password_mismatch(self):
        url = reverse("auth-register")
        payload = {
            "email": "mismatch@test.com",
            "full_name": "Test Mismatch",
            "role": "DRIVER",
            "password": "Password123!",
            "password_confirm": "DifferentPassword!"
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        url = reverse("auth-login")
        response = self.client.post(url, {
            "email": "driver@test.com",
            "password": "SecurePassword123!"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["email"], "driver@test.com")

    def test_me_endpoint_requires_auth(self):
        url = reverse("auth-me")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_endpoint_authenticated(self):
        url = reverse("auth-me")
        self.client.force_authenticate(user=self.driver_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "driver@test.com")

    def test_host_only_endpoint_blocks_driver(self):
        url = reverse("chargers-host:host-charger-list-create")
        self.client.force_authenticate(user=self.driver_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
