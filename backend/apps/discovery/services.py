from decimal import Decimal
from typing import List, Dict, Any, Optional
from django.utils import timezone
from apps.chargers.models import Charger
from apps.chargers.serializers import PublicChargerSerializer
from apps.core.geo import haversine_distance_km, calculate_bounding_box, estimate_reachability

# Seeded Pune Public/Commercial Charging hubs for fallback when community chargers are unavailable
PUNE_PUBLIC_HUBS = [
    {
        "id": "hub-tata-shivajinagar",
        "name": "Tata Power EV Fast Charging - Shivajinagar",
        "locality": "Shivajinagar, Pune",
        "latitude": 18.5308,
        "longitude": 73.8475,
        "charger_type": "DC",
        "connector_types": ["CCS2", "TYPE2"],
        "max_power_kw": 60.0,
        "pricing": "Rs. 18-22 / kWh",
        "is_public_hub": True,
        "operator": "Tata Power EZ Charge",
        "support_phone": "1800-209-5161"
    },
    {
        "id": "hub-jio-bp-baner",
        "name": "Jio-bp Pulse Fast Charging Hub - Baner",
        "locality": "Baner, Pune",
        "latitude": 18.5590,
        "longitude": 73.7868,
        "charger_type": "DC",
        "connector_types": ["CCS2", "TYPE2"],
        "max_power_kw": 60.0,
        "pricing": "Rs. 20 / kWh",
        "is_public_hub": True,
        "operator": "Jio-bp Pulse",
        "support_phone": "1800-891-9023"
    },
    {
        "id": "hub-statiq-viman-nagar",
        "name": "Statiq EV Station - Phoenix Marketcity Viman Nagar",
        "locality": "Viman Nagar, Pune",
        "latitude": 18.5621,
        "longitude": 73.9168,
        "charger_type": "DC",
        "connector_types": ["CCS2", "GB_T"],
        "max_power_kw": 50.0,
        "pricing": "Rs. 19 / kWh",
        "is_public_hub": True,
        "operator": "Statiq",
        "support_phone": "011-41183300"
    }
]

def search_nearby_chargers(
    lat: float,
    lng: float,
    radius_km: float = 5.0,
    connector: Optional[str] = None,
    charger_type: Optional[str] = None,
    available_now: bool = False,
    battery_percent: Optional[int] = None,
    battery_capacity_kwh: Optional[float] = None,
    vehicle_type: Optional[str] = None,
    max_price_per_kwh: Optional[float] = None,
) -> Dict[str, Any]:
    """
    Core Emergency Discovery Algorithm following Section 10 of specification:
    1. Filter only APPROVED, non-suspended chargers
    2. Indexed bounding-box + Haversine distance
    3. Connector compatibility
    4. Availability freshness
    5. Honest reachability confidence
    """
    min_lat, max_lat, min_lon, max_lon = calculate_bounding_box(lat, lng, radius_km)

    # 1. Base eligibility: APPROVED only
    qs = Charger.objects.filter(
        verification_status="APPROVED",
        latitude__gte=min_lat,
        latitude__lte=max_lat,
        longitude__gte=min_lon,
        longitude__lte=max_lon
    )

    if connector:
        qs = qs.filter(connector_types__icontains=connector)
    if charger_type:
        qs = qs.filter(charger_type=charger_type)
    if available_now:
        qs = qs.filter(availability_status="AVAILABLE")
    if max_price_per_kwh is not None:
        qs = qs.filter(price_per_kwh__lte=Decimal(str(max_price_per_kwh)))

    results = []
    for charger in qs:
        ch_lat = float(charger.latitude)
        ch_lng = float(charger.longitude)
        straight_dist = haversine_distance_km(lat, lng, ch_lat, ch_lng)

        # Precise spherical distance check
        if straight_dist <= radius_km:
            reachability = estimate_reachability(
                current_lat=lat,
                current_lng=lng,
                charger_lat=ch_lat,
                charger_lng=ch_lng,
                battery_percent=battery_percent,
                battery_capacity_kwh=battery_capacity_kwh,
                vehicle_type=vehicle_type
            )

            # Availability freshness note
            freshness_minutes = None
            if charger.last_confirmed_available_at:
                delta = timezone.now() - charger.last_confirmed_available_at
                freshness_minutes = int(delta.total_seconds() / 60)

            charger_data = PublicChargerSerializer(charger).data
            charger_data["distance_km"] = straight_dist
            charger_data["estimated_road_distance_km"] = reachability["estimated_road_distance_km"]
            charger_data["estimated_duration_minutes"] = reachability["estimated_duration_minutes"]
            charger_data["reachability_status"] = reachability["reachability_status"]
            charger_data["reachability_confidence"] = reachability["reachability_confidence"]
            charger_data["reachability_notes"] = reachability["notes"]
            charger_data["availability_freshness_minutes"] = freshness_minutes

            # Multi-factor score (0.0 to 1.0)
            dist_score = max(0.0, 1.0 - (straight_dist / radius_km))
            avail_score = 1.0 if charger.availability_status == "AVAILABLE" else (0.5 if charger.availability_status == "UNCONFIRMED" else 0.0)
            reach_score = reachability["reachability_confidence"]

            total_score = round((dist_score * 0.35) + (avail_score * 0.35) + (reach_score * 0.30), 3)
            charger_data["discovery_rank_score"] = total_score

            results.append(charger_data)

    # Sort primarily by rank score, then road distance
    results.sort(key=lambda x: (-x["discovery_rank_score"], x["estimated_road_distance_km"]))

    # Alternatives & fallback if results are low
    alternatives = []
    if len(results) == 0:
        for hub in PUNE_PUBLIC_HUBS:
            hub_dist = haversine_distance_km(lat, lng, hub["latitude"], hub["longitude"])
            hub_copy = dict(hub)
            hub_copy["distance_km"] = hub_dist
            hub_copy["estimated_road_distance_km"] = round(hub_dist * 1.35, 1)
            alternatives.append(hub_copy)
        alternatives.sort(key=lambda x: x["distance_km"])

    return {
        "search_center": {"latitude": lat, "longitude": lng},
        "radius_km": radius_km,
        "count": len(results),
        "results": results,
        "alternatives": alternatives,
        "fallback_info": {
            "expanded_radius_recommended": len(results) == 0,
            "emergency_assistance_phone": "1800-209-7979", # Indian Roadside EV Assistance helpline
            "advisory": (
                "Straight-line distance is not travel distance. Verify battery margin before heading to any charger."
                if len(results) > 0 else
                "No verified private chargers found within this radius. See public DC fast charging hubs below or expand radius."
            )
        }
    }
