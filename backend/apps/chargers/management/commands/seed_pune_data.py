from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.accounts.models import User
from apps.vehicles.models import Vehicle
from apps.chargers.models import Charger

class Command(BaseCommand):
    help = "Seed realistic pilot chargers and test users in Pune, Maharashtra"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Pune pilot data...")

        # 1. Admin User
        admin, _ = User.objects.get_or_create(
            email="admin@chargenearby.in",
            defaults={
                "full_name": "Antigravity Moderator",
                "phone_number": "+919800000001",
                "role": "ADMIN",
                "is_staff": True,
                "is_superuser": True
            }
        )
        admin.set_password("AdminPass123!")
        admin.save()

        # 2. Host Users
        host1, _ = User.objects.get_or_create(
            email="koregaon.host@chargenearby.in",
            defaults={
                "full_name": "Arjun Deshmukh",
                "phone_number": "+919822001122",
                "role": "HOST"
            }
        )
        host1.set_password("HostPass123!")
        host1.save()

        host2, _ = User.objects.get_or_create(
            email="baner.host@chargenearby.in",
            defaults={
                "full_name": "Pooja Kulkarni",
                "phone_number": "+919822003344",
                "role": "HOST"
            }
        )
        host2.set_password("HostPass123!")
        host2.save()

        host3, _ = User.objects.get_or_create(
            email="kothrud.host@chargenearby.in",
            defaults={
                "full_name": "Sunil Joshi",
                "phone_number": "+919822005566",
                "role": "HOST"
            }
        )
        host3.set_password("HostPass123!")
        host3.save()

        # 3. Driver User
        driver, _ = User.objects.get_or_create(
            email="pune.driver@chargenearby.in",
            defaults={
                "full_name": "Siddharth Patil",
                "phone_number": "+919822007788",
                "role": "DRIVER"
            }
        )
        driver.set_password("DriverPass123!")
        driver.save()

        # 4. Driver Vehicle
        vehicle, _ = Vehicle.objects.get_or_create(
            owner=driver,
            make="Tata",
            model="Nexon EV Max",
            defaults={
                "nickname": "Sid's Nexon",
                "vehicle_type": "CAR",
                "connector_types": ["TYPE2", "CCS2"],
                "battery_capacity_kwh": Decimal("40.5"),
                "estimated_battery_percent": 18
            }
        )

        # 5. Seed Chargers
        chargers_data = [
            {
                "host": host1,
                "title": "Lane 7 Green Oasis Wallbox",
                "description": "Clean, dedicated private driveway parking with a 7.4 kW Mennekes Type 2 Wallbox charger. Safe for overnight or emergency daytime charging.",
                "charger_type": "AC",
                "connector_types": ["TYPE2"],
                "max_power_kw": Decimal("7.4"),
                "pricing_model": "PER_KWH",
                "price_per_kwh": Decimal("16.00"),
                "latitude": Decimal("18.536200"),
                "longitude": Decimal("73.894000"),
                "locality": "Koregaon Park, Pune",
                "exact_address": "Bungalow 24, Lane 7, Near ABC Farms, Koregaon Park, Pune 411001",
                "access_instructions": "Gate code is 4421. Cable is mounted on the left pillar beside the portico.",
                "parking_access": "DEDICATED_DRIVEWAY",
                "availability_status": "AVAILABLE",
                "verification_status": "APPROVED",
                "last_confirmed_available_at": timezone.now(),
            },
            {
                "host": host2,
                "title": "Baner High Street Fast Point",
                "description": "High-speed 22 kW AC three-phase charger located in a secure commercial office basement. Security guard available 24/7.",
                "charger_type": "AC",
                "connector_types": ["TYPE2"],
                "max_power_kw": Decimal("22.0"),
                "pricing_model": "PER_KWH",
                "price_per_kwh": Decimal("18.50"),
                "latitude": Decimal("18.559000"),
                "longitude": Decimal("73.786800"),
                "locality": "Baner, Pune",
                "exact_address": "Basement Bay B-12, Apex Commercial Tower, Baner Road, Pune 411045",
                "access_instructions": "Inform security at boom barrier: visiting Apex Bay B-12. Push button on charger to start.",
                "parking_access": "COMMERCIAL_LOT",
                "availability_status": "AVAILABLE",
                "verification_status": "APPROVED",
                "last_confirmed_available_at": timezone.now(),
            },
            {
                "host": host3,
                "title": "Mayur Colony Community 15A & Type 2 Point",
                "description": "Cozy covered parking in an approved apartment society with a dedicated 15A socket and portable 3.3 kW Type 2 adapter.",
                "charger_type": "AC",
                "connector_types": ["TYPE2", "15A_3PIN"],
                "max_power_kw": Decimal("3.3"),
                "pricing_model": "FIXED_SESSION",
                "session_price": Decimal("140.00"),
                "latitude": Decimal("18.507400"),
                "longitude": Decimal("73.807700"),
                "locality": "Kothrud, Pune",
                "exact_address": "Parking Slot P-4, Sai Niketan CHS, Mayur Colony, Kothrud, Pune 411038",
                "access_instructions": "Enter society gate, take immediate right to visitor slot P-4.",
                "parking_access": "SOCIETY_PARKING",
                "availability_status": "AVAILABLE",
                "verification_status": "APPROVED",
                "last_confirmed_available_at": timezone.now(),
            },
            {
                "host": host1,
                "title": "Viman Nagar Airport Road DC Rapid",
                "description": "30 kW DC fast charger suitable for CCS2 compatible vehicles. Emergency priority access.",
                "charger_type": "DC",
                "connector_types": ["CCS2"],
                "max_power_kw": Decimal("30.0"),
                "pricing_model": "PER_KWH",
                "price_per_kwh": Decimal("21.00"),
                "latitude": Decimal("18.567900"),
                "longitude": Decimal("73.914300"),
                "locality": "Viman Nagar, Pune",
                "exact_address": "Plot 88, Near Symbiosis Campus, Viman Nagar, Pune 411014",
                "access_instructions": "Park in front of main office showroom. Security guard will assist with plug.",
                "parking_access": "STREET_FRONT",
                "availability_status": "AVAILABLE",
                "verification_status": "APPROVED",
                "last_confirmed_available_at": timezone.now(),
            },
            {
                "host": host2,
                "title": "Hinjawadi Phase 1 Tech Hub Charger",
                "description": "7.4 kW Type 2 charger near Infosys Circle. Ideal for tech park commuters.",
                "charger_type": "AC",
                "connector_types": ["TYPE2"],
                "max_power_kw": Decimal("7.4"),
                "pricing_model": "PER_KWH",
                "price_per_kwh": Decimal("15.50"),
                "latitude": Decimal("18.591300"),
                "longitude": Decimal("73.738900"),
                "locality": "Hinjawadi, Pune",
                "exact_address": "Tech Villa 9, Phase 1, Hinjawadi, Pune 411057",
                "access_instructions": "Ring intercom for Villa 9.",
                "parking_access": "DEDICATED_DRIVEWAY",
                "availability_status": "UNCONFIRMED",
                "verification_status": "PENDING",
            }
        ]

        for item in chargers_data:
            charger, created = Charger.objects.get_or_create(
                title=item["title"],
                defaults=item
            )
            action = "Created" if created else "Updated"
            self.stdout.write(f"  {action} charger: {charger.title} [{charger.verification_status}]")

        self.stdout.write(self.style.SUCCESS("Successfully seeded Pune pilot chargers, vehicles, and test credentials!"))
