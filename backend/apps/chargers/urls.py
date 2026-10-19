from django.urls import path
from .views import (
    PublicChargerListView,
    PublicChargerDetailView,
    HostChargerListCreateView,
    HostChargerDetailView,
    HostChargerSubmitView,
    HostChargerAvailabilityView,
    HostChargerPhotoUploadView,
    HostChargerPhotoDeleteView,
    AdminVerificationQueueView,
    AdminApproveChargerView,
    AdminRejectChargerView,
    AdminSuspendChargerView,
)

# Public routes: /api/v1/chargers/
public_urlpatterns = [
    path("", PublicChargerListView.as_view(), name="public-charger-list"),
    path("<uuid:pk>/", PublicChargerDetailView.as_view(), name="public-charger-detail"),
]

# Host routes: /api/v1/host/chargers/
host_urlpatterns = [
    path("", HostChargerListCreateView.as_view(), name="host-charger-list-create"),
    path("<uuid:pk>/", HostChargerDetailView.as_view(), name="host-charger-detail"),
    path("<uuid:pk>/submit/", HostChargerSubmitView.as_view(), name="host-charger-submit"),
    path("<uuid:pk>/availability/", HostChargerAvailabilityView.as_view(), name="host-charger-availability"),
    path("<uuid:pk>/photos/", HostChargerPhotoUploadView.as_view(), name="host-charger-photos-upload"),
    path("<uuid:pk>/photos/<uuid:photo_id>/", HostChargerPhotoDeleteView.as_view(), name="host-charger-photos-delete"),
]

# Admin moderation routes: /api/v1/admin/
admin_urlpatterns = [
    path("verification-queue/", AdminVerificationQueueView.as_view(), name="admin-verification-queue"),
    path("chargers/<uuid:pk>/approve/", AdminApproveChargerView.as_view(), name="admin-charger-approve"),
    path("chargers/<uuid:pk>/reject/", AdminRejectChargerView.as_view(), name="admin-charger-reject"),
    path("chargers/<uuid:pk>/suspend/", AdminSuspendChargerView.as_view(), name="admin-charger-suspend"),
]
