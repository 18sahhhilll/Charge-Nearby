# ChargeNearby API Specification

Base URL: `/api/v1`
Interactive Swagger Docs: `/api/docs/`
OpenAPI Schema: `/api/schema/`

## 1. Authentication & Accounts
- `POST /api/v1/auth/register/`: Register driver/host account. Returns user details & JWT access/refresh tokens.
- `POST /api/v1/auth/login/`: Obtain JWT token pair with claims.
- `POST /api/v1/auth/token/refresh/`: Refresh expired access token.
- `POST /api/v1/auth/logout/`: Invalidate user session.
- `GET /api/v1/auth/me/`: Retrieve current authenticated profile.
- `PATCH /api/v1/auth/me/`: Update user profile (name, phone, role).

## 2. Vehicles
- `GET /api/v1/vehicles/`: List authenticated driver's configured vehicles.
- `POST /api/v1/vehicles/`: Register a new electric vehicle (make, model, connectors, battery kWh).
- `GET /api/v1/vehicles/{id}/`: Retrieve vehicle details.
- `PATCH /api/v1/vehicles/{id}/`: Update vehicle specifications.
- `DELETE /api/v1/vehicles/{id}/`: Remove vehicle profile.

## 3. Public Chargers
- `GET /api/v1/chargers/`: List approved public chargers (filters: `connector`, `charger_type`, `available_now`). Privacy: exact address omitted.
- `GET /api/v1/chargers/{id}/`: Retrieve approved charger public specifications.

## 4. Host Charger Management
- `GET /api/v1/host/chargers/`: List host's own chargers including private details and verification status.
- `POST /api/v1/host/chargers/`: Create a new charger listing (initial status: `PENDING`).
- `GET /api/v1/host/chargers/{id}/`: Retrieve owned listing.
- `PATCH /api/v1/host/chargers/{id}/`: Update owned listing.
- `POST /api/v1/host/chargers/{id}/submit/`: Submit listing for admin verification.
- `POST /api/v1/host/chargers/{id}/availability/`: Update live availability status (`AVAILABLE`, `UNAVAILABLE`).

## 5. Emergency Discovery
- `GET /api/v1/discovery/nearby/`: Query nearby chargers by coordinates.
  - Query parameters: `lat`, `lng`, `radius_km` (default: 5.0), `connector`, `available_now`, `battery_percent`, `vehicle_type`.
  - Output: Ranked chargers, road distance estimates, reachability confidence, and fallback public DC hubs.
- `GET /api/v1/discovery/chargers/{id}/route/`: Get road route estimate and navigation deep link.
- `POST /api/v1/discovery/estimate-reachability/`: Triage reachability between two points given vehicle consumption.
- `GET /api/v1/discovery/alternatives/`: List Pune commercial DC fast hubs.

## 6. Bookings & State Machine
- `POST /api/v1/bookings/`: Create booking with price snapshot in INR.
- `GET /api/v1/bookings/`: List bookings for current driver (or pass `?view=host` for host view).
- `GET /api/v1/bookings/{id}/`: Retrieve booking details. Unlocks exact residential address when status is in `ACCEPTED`, `ARRIVED`, `CHARGING`, or `COMPLETED`.
- `POST /api/v1/bookings/{id}/accept/`: Host accepts emergency access request.
- `POST /api/v1/bookings/{id}/decline/`: Host declines request with reason.
- `POST /api/v1/bookings/{id}/cancel/`: Cancel request.
- `POST /api/v1/bookings/{id}/arrive/`: Driver marks arrival at host location.
- `POST /api/v1/bookings/{id}/start-session/`: Start active charging session.
- `POST /api/v1/bookings/{id}/complete/`: Complete session with delivered energy and end battery %.
- `POST /api/v1/bookings/{id}/report-issue/`: Record dispute/issue for admin audit.

## 7. Admin Moderation
- `GET /api/v1/admin/verification-queue/`: List pending charger submissions.
- `POST /api/v1/admin/chargers/{id}/approve/`: Approve listing for public discovery.
- `POST /api/v1/admin/chargers/{id}/reject/`: Reject listing with review notes.
- `POST /api/v1/admin/chargers/{id}/suspend/`: Suspend active listing.
