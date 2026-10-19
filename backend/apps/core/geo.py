import math
from typing import Dict, Any, Optional

EARTH_RADIUS_KM = 6371.0088

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on Earth in kilometers."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return round(EARTH_RADIUS_KM * c, 2)

def calculate_bounding_box(lat: float, lon: float, radius_km: float):
    """
    Computes a bounding box (min_lat, max_lat, min_lon, max_lon)
    for efficient indexed database filtering prior to precise spherical distance calculation.
    """
    lat_delta = radius_km / 111.0  # Approx 111 km per degree of latitude
    # Longitude delta depends on latitude
    lon_delta = radius_km / (111.0 * math.cos(math.radians(lat)))

    return (
        lat - lat_delta,
        lat + lat_delta,
        lon - lon_delta,
        lon + lon_delta
    )

def estimate_reachability(
    current_lat: float,
    current_lng: float,
    charger_lat: float,
    charger_lng: float,
    battery_percent: Optional[int] = None,
    battery_capacity_kwh: Optional[float] = None,
    vehicle_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Emergency reachability assessment following Section 10 of specification:
    - Conservative confidence
    - Distinguish road estimate from straight-line
    - Honest uncertainty labels (HIGH, MEDIUM, UNCERTAIN, UNKNOWN)
    """
    straight_line_dist = haversine_distance_km(current_lat, current_lng, charger_lat, charger_lng)
    
    # Pune urban detour multiplier ~ 1.35
    estimated_road_distance_km = round(straight_line_dist * 1.35, 1)
    # Average urban transit speed in Pune: ~22 km/h
    estimated_duration_minutes = max(2, int(round((estimated_road_distance_km / 22.0) * 60)))

    reachability_status = "UNKNOWN"
    reachability_confidence = 0.50
    notes = []

    if battery_percent is None:
        reachability_status = "UNKNOWN"
        reachability_confidence = 0.30
        notes.append("Battery percentage not provided. Cannot confirm reachability.")
    else:
        # Rough consumption assumptions for emergency triage:
        # Car: ~0.15 kWh/km (approx 1% per 2.5-3 km for typical 30-40 kWh battery)
        # 2W: ~0.035 kWh/km (approx 1% per 0.8-1 km for 3 kWh battery)
        if vehicle_type == "TWO_WHEELER":
            estimated_range_per_percent = 0.9  # km
        elif vehicle_type == "CAR":
            estimated_range_per_percent = 2.5  # km
        else:
            estimated_range_per_percent = 1.8  # generic

        estimated_max_range_km = battery_percent * estimated_range_per_percent

        if estimated_max_range_km < estimated_road_distance_km:
            reachability_status = "CRITICAL"
            reachability_confidence = 0.80
            notes.append(
                f"Low battery alert: estimated range {estimated_max_range_km:.1f} km may be insufficient for {estimated_road_distance_km} km route."
            )
        elif estimated_max_range_km < estimated_road_distance_km * 1.5:
            reachability_status = "UNCERTAIN"
            reachability_confidence = 0.55
            notes.append("Tight battery margin. Traffic delays or AC usage could deplete charge.")
        else:
            reachability_status = "REACHABLE"
            reachability_confidence = 0.85
            notes.append("Estimated battery reserve is adequate under typical driving conditions.")

    return {
        "straight_line_distance_km": straight_line_dist,
        "estimated_road_distance_km": estimated_road_distance_km,
        "estimated_duration_minutes": estimated_duration_minutes,
        "reachability_status": reachability_status,
        "reachability_confidence": reachability_confidence,
        "notes": notes
    }
