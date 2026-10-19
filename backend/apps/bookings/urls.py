from django.urls import path
from .views import (
    BookingListCreateView,
    BookingDetailView,
    BookingAcceptView,
    BookingDeclineView,
    BookingCancelView,
    BookingArriveView,
    BookingStartSessionView,
    BookingCompleteView,
    BookingReportIssueView,
)

app_name = "bookings"

urlpatterns = [
    path("", BookingListCreateView.as_view(), name="booking-list-create"),
    path("<uuid:pk>/", BookingDetailView.as_view(), name="booking-detail"),
    path("<uuid:pk>/accept/", BookingAcceptView.as_view(), name="booking-accept"),
    path("<uuid:pk>/decline/", BookingDeclineView.as_view(), name="booking-decline"),
    path("<uuid:pk>/cancel/", BookingCancelView.as_view(), name="booking-cancel"),
    path("<uuid:pk>/arrive/", BookingArriveView.as_view(), name="booking-arrive"),
    path("<uuid:pk>/start-session/", BookingStartSessionView.as_view(), name="booking-start-session"),
    path("<uuid:pk>/complete/", BookingCompleteView.as_view(), name="booking-complete"),
    path("<uuid:pk>/report-issue/", BookingReportIssueView.as_view(), name="booking-report-issue"),
]
