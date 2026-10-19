from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import ValidationError, NotFound
from apps.chargers.models import Charger
from apps.core.geo import haversine_distance_km, estimate_reachability
from .services import search_nearby_chargers, PUNE_PUBLIC_HUBS

class NearbyDiscoveryView(APIView):
    """
    Emergency nearby charger discovery endpoint.
    Example: GET /api/v1/discovery/nearby/?lat=18.5204&lng=73.8567&radius_km=5&connector=TYPE2
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        lat_str = request.query_params.get("lat")
        lng_str = request.query_params.get("lng")

        if not lat_str or not lng_str:
            raise ValidationError({
                "location": "Both 'lat' and 'lng' query parameters are required."
            })

        try:
            lat = float(lat_str)
            lng = float(lng_str)
        except ValueError:
            raise ValidationError({"location": "'lat' and 'lng' must be valid floating point numbers."})

        if not (-90.0 <= lat <= 90.0 and -180.0 <= lng <= 180.0):
            raise ValidationError({"location": "Latitude must be between -90 and 90, and longitude between -180 and 180."})

        # Radius bounds
        radius_km = float(request.query_params.get("radius_km", 5.0))
        if radius_km <= 0 or radius_km > 50.0:
            raise ValidationError({"radius_km": "Search radius must be between 0.5 km and 50 km."})

        connector = request.query_params.get("connector")
        charger_type = request.query_params.get("charger_type")
        available_now = request.query_params.get("available_now", "").lower() in ["true", "1"]
        
        battery_percent = request.query_params.get("battery_percent")
        if battery_percent is not None:
            try:
                battery_percent = int(battery_percent)
                if not (0 <= battery_percent <= 100):
                    battery_percent = None
            except ValueError:
                battery_percent = None

        vehicle_type = request.query_params.get("vehicle_type")
        max_price = request.query_params.get("max_price")
        if max_price:
            try:
                max_price = float(max_price)
            except ValueError:
                max_price = None

        payload = search_nearby_chargers(
            lat=lat,
            lng=lng,
            radius_km=radius_km,
            connector=connector,
            charger_type=charger_type,
            available_now=available_now,
            battery_percent=battery_percent,
            vehicle_type=vehicle_type,
            max_price_per_kwh=max_price
        )

        return Response(payload, status=status.HTTP_200_OK)

class ChargerRouteView(APIView):
    """
    Road route estimation to an approved charger.
    GET /api/v1/discovery/chargers/{id}/route/?origin_lat=18.52&origin_lng=73.85
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            charger = Charger.objects.get(pk=pk, verification_status="APPROVED")
        except Charger.DoesNotExist:
            raise NotFound("Charger not found or not approved.")

        origin_lat = request.query_params.get("origin_lat")
        origin_lng = request.query_params.get("origin_lng")
        if not origin_lat or not origin_lng:
            raise ValidationError({"origin": "'origin_lat' and 'origin_lng' are required."})

        try:
            o_lat = float(origin_lat)
            o_lng = float(origin_lng)
        except ValueError:
            raise ValidationError({"origin": "Coordinates must be valid numbers."})

        reach = estimate_reachability(
            current_lat=o_lat,
            current_lng=o_lng,
            charger_lat=float(charger.latitude),
            charger_lng=float(charger.longitude)
        )

        # Generate navigational deep-link URL (Google Maps navigation)
        nav_url = f"https://www.google.com/maps/dir/?api=1&origin={o_lat},{o_lng}&destination={charger.latitude},{charger.longitude}&travelmode=driving"

        return Response({
            "charger_id": str(charger.id),
            "charger_title": charger.title,
            "destination": {
                "latitude": float(charger.latitude),
                "longitude": float(charger.longitude),
                "locality": charger.locality
            },
            "route_estimate": reach,
            "navigation_url": nav_url
        })

class EstimateReachabilityView(APIView):
    """
    POST /api/v1/discovery/estimate-reachability/
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            origin_lat = float(request.data.get("origin_lat"))
            origin_lng = float(request.data.get("origin_lng"))
            dest_lat = float(request.data.get("dest_lat"))
            dest_lng = float(request.data.get("dest_lng"))
        except (TypeError, ValueError):
            raise ValidationError("origin_lat, origin_lng, dest_lat, and dest_lng are required floats.")

        battery_percent = request.data.get("battery_percent")
        vehicle_type = request.data.get("vehicle_type")
        capacity = request.data.get("battery_capacity_kwh")

        result = estimate_reachability(
            current_lat=origin_lat,
            current_lng=origin_lng,
            charger_lat=dest_lat,
            charger_lng=dest_lng,
            battery_percent=int(battery_percent) if battery_percent is not None else None,
            battery_capacity_kwh=float(capacity) if capacity is not None else None,
            vehicle_type=vehicle_type
        )

        return Response(result)

class AlternativesView(APIView):
    """Returns fallback public charging options in Pune."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        lat_str = request.query_params.get("lat")
        lng_str = request.query_params.get("lng")
        
        results = []
        if lat_str and lng_str:
            try:
                lat = float(lat_str)
                lng = float(lng_str)
                for hub in PUNE_PUBLIC_HUBS:
                    hub_dist = haversine_distance_km(lat, lng, hub["latitude"], hub["longitude"])
                    copy = dict(hub)
                    copy["distance_km"] = hub_dist
                    copy["estimated_road_distance_km"] = round(hub_dist * 1.35, 1)
                    results.append(copy)
                results.sort(key=lambda x: x["distance_km"])
            except ValueError:
                results = PUNE_PUBLIC_HUBS
        else:
            results = PUNE_PUBLIC_HUBS

        return Response({
            "count": len(results),
            "alternatives": results,
            "emergency_assistance_phone": "1800-209-7979"
        })
