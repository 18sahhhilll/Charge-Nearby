from django.urls import path
from .views import (
    NearbyDiscoveryView,
    ChargerRouteView,
    EstimateReachabilityView,
    AlternativesView
)

urlpatterns = [
    path("nearby/", NearbyDiscoveryView.as_view(), name="discovery-nearby"),
    path("chargers/<uuid:pk>/route/", ChargerRouteView.as_view(), name="discovery-charger-route"),
    path("estimate-reachability/", EstimateReachabilityView.as_view(), name="discovery-estimate-reachability"),
    path("alternatives/", AlternativesView.as_view(), name="discovery-alternatives"),
]
