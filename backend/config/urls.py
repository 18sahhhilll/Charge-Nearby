from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from apps.core.views import HealthCheckView
from apps.chargers.urls import public_urlpatterns as charger_public_urls
from apps.chargers.urls import host_urlpatterns as charger_host_urls
from apps.chargers.urls import admin_urlpatterns as charger_admin_urls

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # OpenAPI Schema & Interactive Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

    # ChargeNearby API v1
    path("api/v1/health/", HealthCheckView.as_view(), name="api-health"),
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/vehicles/", include("apps.vehicles.urls")),
    path("api/v1/chargers/", include((charger_public_urls, "chargers-public"))),
    path("api/v1/host/chargers/", include((charger_host_urls, "chargers-host"))),
    path("api/v1/admin/", include((charger_admin_urls, "chargers-admin"))),
    path("api/v1/discovery/", include("apps.discovery.urls")),
    path("api/v1/bookings/", include("apps.bookings.urls")),
]
