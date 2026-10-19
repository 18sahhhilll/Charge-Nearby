# ChargeNearby --- Antigravity Project Specification

> **Purpose:** This document is the source of truth for building the
> ChargeNearby prototype. Read it fully before making changes. Inspect
> the existing repository first, preserve working code where possible,
> and implement the project in small, testable phases.

## 1. Project Overview

**Working name:** ChargeNearby\
**Pilot city:** Pune, Maharashtra, India\
**Founder/team:** Solo founder\
**Budget:** Minimal; prefer open-source tools and free/low-cost tiers\
**Current stage:** Prototype\
**Product focus:** Emergency EV charging discovery\
**Platforms:** Responsive website first, then Android/iOS mobile app\
**Primary users:** EV drivers and private charger hosts

### Product vision

Build a community-powered EV charger-sharing platform that helps a
driver with a low battery discover a compatible, potentially reachable,
verified private charger nearby. Homeowners, bungalow owners, approved
apartment societies, and businesses can list suitable charging equipment
and earn money by sharing it when available.

### Core promise

**Help EV drivers find a safe, compatible charging option nearby when
they need it urgently.**

The platform must not promise that a charger is reachable based only on
battery percentage or straight-line distance. Show estimates and
uncertainty honestly, and provide alternatives when a private charger is
not suitable.

## 2. Product Principles

1.  Emergency discovery is the primary experience.
2.  Compatibility and safety come before ranking or convenience.
3.  The nearest charger is not always the best or reachable charger.
4.  A private charger is not automatically public or approved for paid
    sharing.
5.  Public listings must not expose a host's exact residential address
    or private access instructions.
6.  Both web and mobile clients use the same backend API and business
    rules.
7.  Build the smallest useful MVP before adding advanced features.
8.  Do not invent real charger listings, reviews, host details, live
    availability, or successful payments.
9.  If this repository already contains code, inspect it before changing
    architecture. Reuse good existing work and explain any major
    refactor before doing it.
10. Keep the application maintainable for a solo developer.

## 3. Required Technology Stack

### Web client

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   Accessible, reusable UI components
-   React Router for separate page URLs
-   A typed API client

### Mobile client

-   React Native
-   Expo
-   TypeScript
-   Shared backend API
-   Expo Location with permission handling
-   Navigation handoff to a supported maps application
-   Push notifications may be added after the core workflow works

### Backend

-   Python
-   Django
-   Django REST Framework
-   GeoDjango
-   PostgreSQL with PostGIS
-   OpenAPI documentation, preferably `drf-spectacular`
-   A maintained authentication/JWT solution if JWT is used

### Supporting services

-   Mapping/routing provider selected through environment configuration
-   Image/object storage abstraction for charger photos
-   Payment gateway only after the booking workflow and applicable
    compliance checks are validated
-   Git and GitHub

Use compatible maintained versions and commit dependency lockfiles. Do
not hard-code API keys or credentials. Do not assume that a database
provider supports PostGIS without verifying it.

## 4. Monorepo Structure

Use this structure as a target. Adapt it to the existing repository if
appropriate rather than blindly duplicating files.

``` text
chargenearby/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   ├── maps/
│   │   │   │   ├── chargers/
│   │   │   │   └── forms/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── discovery/
│   │   │   │   ├── vehicles/
│   │   │   │   ├── host/
│   │   │   │   ├── bookings/
│   │   │   │   └── profile/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── ...
│   └── mobile/
│       ├── app/
│       │   ├── (auth)/
│       │   ├── (driver)/
│       │   ├── (host)/
│       │   └── (account)/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── services/
│       └── types/
├── backend/
│   ├── config/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── vehicles/
│   │   ├── chargers/
│   │   ├── discovery/
│   │   ├── bookings/
│   │   ├── sessions/
│   │   ├── payments/
│   │   ├── reviews/
│   │   └── moderation/
│   ├── tests/
│   ├── manage.py
│   └── requirements.txt
├── docs/
│   ├── architecture.md
│   ├── api-spec.md
│   ├── database-schema.md
│   ├── safety-and-operations.md
│   └── pilot-test-plan.md
├── .env.example
├── .gitignore
└── README.md
```

Do not create every module immediately if it is not needed for the
current phase. Add modules incrementally.

## 5. MVP Scope and Priorities

### P0 --- Required for the first working prototype

-   Public landing page with a clear "Find Nearby Chargers" call to
    action
-   Registration, login, logout, and account profile
-   Driver vehicle profile
-   Host charger listing creation and editing
-   Charger listing submission and admin verification
-   Map and list-based nearby charger search
-   Manual location entry if location permission is denied
-   Filters for connector compatibility, charger type, price,
    availability, and distance
-   Charger details page
-   Host availability confirmation
-   Emergency and scheduled booking requests
-   Host accept/decline workflow
-   Booking status and history
-   Admin moderation using Django Admin initially
-   Responsive design, loading states, error states, and empty states
-   Tests for permissions, geospatial search, and booking conflicts

### P1 --- After P0 is stable

-   Online payment integration and host settlement, after
    operational/legal review
-   SMS or push booking notifications
-   Ratings and reviews
-   Incident reporting and support workflows
-   Better reachability estimates
-   Host earnings dashboard
-   Booking refunds and cancellation policy enforcement

### Explicitly out of scope for the first MVP

-   Automatic control of charger hardware
-   Claims of live charger telemetry without an actual integration
-   AI/ML battery prediction
-   Dynamic pricing
-   Subscription plans
-   Complex fleet management
-   Multi-city expansion
-   Automatic payouts before a compliant payment flow is selected

For prototype payments, use a clearly labelled simulated payment state.
Never imply that a real payment was processed.

## 6. User Roles

-   `DRIVER`: searches chargers and requests charging access
-   `HOST`: manages own chargers, availability, and incoming booking
    requests
-   `BOTH`: can act as a driver and a host
-   `ADMIN`: verifies listings, moderates incidents, and manages
    platform operations

Enforce roles and object ownership on the backend. Hiding a button in
the frontend is not authorization.

## 7. Database Requirements

Use UUID primary keys for public-facing records. Store timestamps in
UTC. Use decimal or integer minor units for currency arithmetic; never
use floating-point money values. Use PostGIS geography points with SRID
4326 for charger locations and a GiST spatial index.

### 7.1 User

Fields: - `id`: UUID primary key - `email`: unique, normalized -
`full_name`: required - `phone_number`: nullable until required for
operational bookings - `role`: `DRIVER`, `HOST`, `BOTH`, `ADMIN` -
`is_active`: boolean - `created_at`, `updated_at`

Use a custom Django user model from the beginning.

### 7.2 Vehicle

Fields: - `id` - `owner_id`: foreign key to User - `nickname`:
optional - `make`, `model` - `vehicle_type`: `CAR`, `TWO_WHEELER`,
`THREE_WHEELER`, `OTHER` - `connector_types`: one or more supported
connector types - `battery_capacity_kwh`: optional decimal -
`estimated_battery_percent`: nullable integer from 0 to 100 -
`created_at`, `updated_at`

Battery percentage is user-reported and time-sensitive. Vehicle model
alone must not be treated as proof of exact charging capability.

### 7.3 Charger

Fields: - `id` - `host_id`: foreign key to User - `title`,
`description` - `charger_type`: `AC` or `DC` - `connector_types` -
`max_power_kw`: positive decimal - `pricing_model`: `PER_KWH`,
`PER_MINUTE`, or `FIXED_SESSION` - `price_per_kwh`, `price_per_minute`,
`session_price`: nullable decimals; enforce the selected pricing model's
corresponding field - `location`: PostGIS geography point -
`availability_status`: `AVAILABLE`, `UNAVAILABLE`, `UNCONFIRMED` -
`verification_status`: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED` -
`last_confirmed_available_at`: nullable timestamp - `parking_access`:
appropriate enum - `created_at`, `updated_at`

Keep exact address and private access instructions out of public
responses. Only approved, unsuspended chargers can appear in public
search.

### 7.4 AvailabilityWindow

Fields: - `id` - `charger_id` - `start_at`, `end_at` - `is_available` -
`created_by_id` - timestamps

Validate that `end_at` is after `start_at`. The initial version may use
manual availability rather than complex recurrence rules.

### 7.5 Booking

Fields: - `id` - `driver_id` - `charger_id` - `vehicle_id` -
`booking_type`: `EMERGENCY` or `SCHEDULED` - `status`: `REQUESTED`,
`ACCEPTED`, `DECLINED`, `CANCELLED`, `ARRIVED`, `CHARGING`, `COMPLETED`,
`DISPUTED` - `requested_start_at`, optional `requested_end_at` -
nullable `accepted_at`, `arrival_at`, `completed_at` - `quoted_amount`:
price snapshot - `currency`: `INR` - `cancellation_reason` -
`created_at`, `updated_at`

Validate that the vehicle belongs to the driver and the driver is not
booking their own charger unless an explicitly supported use case
permits it. Preserve the agreed price snapshot even if the host later
changes listing pricing.

### 7.6 ChargingSession

Fields: - `id` - one-to-one `booking_id` - nullable `started_at`,
`ended_at` - nullable `energy_delivered_kwh` - nullable start/end
battery percentages - `completion_method`: `HOST`, `DRIVER`, `ADMIN` -
optional notes

Do not claim that energy was measured if it was only reported manually.

### 7.7 Payment (later phase)

Fields: - `id` - `booking_id` - unique nullable `provider_reference` -
`gross_amount`, `platform_fee`, `host_amount` - `status`: `PENDING`,
`AUTHORIZED`, `PAID`, `REFUNDED`, `FAILED` - nullable `paid_at` -
`refund_amount`

Add an auditable payout/ledger design before real host settlements.
Booking completion must not imply payment completion.

### 7.8 Review, Incident, AuditLog

-   `Review`: booking, reviewer, reviewee, rating, comment, timestamp.
    Only eligible participants may review a completed session.
-   `Incident`: reporter, optional booking/charger, category,
    description, severity, status, timestamps.
-   `AuditLog`: actor, action, object type/id, timestamp, appropriate
    metadata. Restrict access to sensitive information.

### Required constraints and indexes

-   GiST spatial index on charger location
-   Indexes for charger verification/availability/host and booking
    driver/charger/status/time
-   Nonnegative pricing; positive charger power; valid battery
    percentages
-   Valid time ranges
-   Transactional booking acceptance
-   Prevent overlapping confirmed bookings for the same charger using a
    PostgreSQL exclusion constraint or robust transactional locking
-   Do not expose private address or access-instruction fields in public
    serializers

## 8. API Specification

Base path: `/api/v1/`

All endpoints return JSON. Use consistent errors, server-side
validation, ownership checks, and role permissions. Generate OpenAPI
documentation.

### Authentication and vehicles

-   `POST /auth/register/`
-   `POST /auth/login/`
-   `POST /auth/token/refresh/`
-   `POST /auth/logout/`
-   `GET /auth/me/`
-   `PATCH /auth/me/`
-   `GET /vehicles/`
-   `POST /vehicles/`
-   `GET /vehicles/{id}/`
-   `PATCH /vehicles/{id}/`
-   `DELETE /vehicles/{id}/`

### Charger and host

-   `GET /chargers/` --- approved public listings only
-   `GET /chargers/{id}/` --- approved public details only
-   `GET /host/chargers/`
-   `POST /host/chargers/`
-   `PATCH /host/chargers/{id}/`
-   `POST /host/chargers/{id}/submit/`
-   `POST /host/chargers/{id}/availability/`
-   `GET /host/earnings/` --- later phase

### Emergency discovery

-   `GET /discovery/nearby/`
-   `GET /discovery/chargers/{id}/route/`
-   `POST /discovery/estimate-reachability/`
-   `GET /discovery/alternatives/`

Example:
`GET /api/v1/discovery/nearby/?lat=18.5204&lng=73.8567&radius_km=5&connector=TYPE2&available_now=true`

Validate latitude/longitude ranges, radius limits, connector values, and
pagination. Use PostGIS to filter by geography; use a routing provider
for road distance/time. Do not use straight-line distance as the travel
distance.

### Bookings and sessions

-   `POST /bookings/`
-   `GET /bookings/`
-   `GET /bookings/{id}/`
-   `POST /bookings/{id}/accept/`
-   `POST /bookings/{id}/decline/`
-   `POST /bookings/{id}/cancel/`
-   `POST /bookings/{id}/arrive/`
-   `POST /bookings/{id}/start-session/`
-   `POST /bookings/{id}/complete/`
-   `POST /bookings/{id}/report-issue/`
-   `PATCH /sessions/{id}/`

Use idempotency protection for booking requests. Use transactions/row
locks to avoid double booking. Centralize legal status transitions in
backend service functions. Never trust client-supplied host IDs, prices,
fees, or status values.

### Admin

Prefer Django Admin initially. If API endpoints are needed: -
`GET /admin/verification-queue/` -
`POST /admin/chargers/{id}/approve/` -
`POST /admin/chargers/{id}/reject/` -
`POST /admin/chargers/{id}/suspend/` - `GET /admin/incidents/` -
`POST /admin/incidents/{id}/resolve/`

All admin routes require explicit server-side admin permissions and
audit logging.

### HTTP errors

Use `400` invalid input, `401` unauthenticated, `403` forbidden, `404`
missing/inaccessible resource, `409` booking conflict, and `429` rate
limited. Use a consistent structure such as:

``` json
{
  "error": {
    "code": "CHARGER_UNAVAILABLE",
    "message": "This charger is no longer available for the requested time.",
    "details": {}
  }
}
```

## 9. Booking State Machine

Valid transitions: - `REQUESTED` → `ACCEPTED`, `DECLINED`, or
`CANCELLED` - `ACCEPTED` → `ARRIVED` or `CANCELLED` - `ARRIVED` →
`CHARGING` or `CANCELLED` - `CHARGING` → `COMPLETED` or `DISPUTED` -
`COMPLETED` → `DISPUTED` only through an authorized dispute flow - A
resolved dispute must be recorded with an audit trail

Only the host can accept or decline their own charger's request. Only
authorized participants/admins can perform the allowed transitions.
Reject all invalid transitions.

## 10. Emergency Discovery Logic

### Step 1: Eligibility filtering

A charger must: - be approved and not suspended - be compatible with the
vehicle's connector and charging capabilities - fall within the
configured search radius - meet availability requirements - have valid
listing/pricing data - satisfy access requirements

Start with a configurable search radius, initially 3--5 km for the
pilot, and expand when appropriate. This is not a reachability
guarantee.

### Step 2: Ranking

Use configurable normalized scores from 0 to 1: - reachability
confidence: initial weight 0.35 - availability confidence: 0.25 -
travel-time score: 0.20 - compatibility/usefulness: 0.10 - price
suitability: 0.10

These are initial product assumptions, not validated scientific weights.
Hard incompatibility or a clearly infeasible route must exclude a result
rather than be compensated by a high score elsewhere.

Use road route estimates where available. If battery, vehicle
consumption, route, or charger information is insufficient, return
`UNKNOWN` or `UNCERTAIN` instead of inventing a confidence value.

### Step 3: Availability labels

-   `AVAILABLE`: recently confirmed by the host
-   `UNCONFIRMED`: not recently confirmed
-   `UNAVAILABLE`: not bookable

Show when availability was last confirmed. Availability can change
before arrival.

### Step 4: Fallback

When no suitable private charger is found: - expand the search radius -
show other compatible public charging options if data is available -
offer navigation to alternatives - show an appropriate
support/roadside-assistance option - explain why results may be limited

Never guarantee that a charger is reachable using only a rough battery
percentage or straight-line distance.

## 11. Website Routes and Screens

Use real, separate URLs and React Router. Do not implement the entire
application as one long landing page.

-   `/` --- landing page
-   `/find` --- map and list search
-   `/chargers/:id` --- charger details
-   `/login` --- login
-   `/register` --- registration
-   `/onboarding/vehicle` --- vehicle setup
-   `/host/dashboard` --- host overview
-   `/host/chargers/new` --- create listing
-   `/host/chargers/:id/edit` --- edit owned listing
-   `/host/bookings` --- incoming requests
-   `/driver/bookings` --- driver booking history
-   `/driver/bookings/:id` --- booking details
-   `/profile` --- account and vehicle settings
-   `/help` --- safety and support
-   `/admin` --- link to protected Django Admin

### Shared layout

-   Responsive header/navigation
-   Footer on public marketing/help pages
-   Separate login and registration pages
-   Clear loading, error, empty, success, and permission-denied states
-   Accessible form labels and keyboard navigation
-   Mobile-first responsive layout
-   Consistent design tokens and reusable components
-   Avoid excessive animations; use subtle transitions that respect
    reduced-motion preferences

### Find Chargers screen

-   Map and list toggle
-   GPS permission with manual fallback
-   connector, charger type, price, distance and availability filters
-   vehicle selector and optional battery estimate
-   route time/distance estimates
-   visible availability freshness and uncertainty
-   clear empty state and alternatives

### Charger detail screen

-   charger photos and verified specifications
-   connector, AC/DC type, maximum power, pricing
-   approximate public location
-   host/listing verification status
-   availability freshness and access rules
-   request access and navigation actions
-   exact private address/access instructions only when appropriate
    after confirmed booking

### Host screens

-   create/edit charger
-   upload equipment photos
-   submit for approval
-   manage availability
-   accept/decline incoming requests
-   booking history
-   earnings UI only after real settlement logic exists

## 12. Mobile App Screens

Use React Native + Expo with the same API and booking state machine.

Driver: - home/emergency search - location and vehicle selection -
map/list results - charger details - booking request/confirmation -
active booking and navigation handoff - booking history - profile/help

Host: - dashboard - my chargers - add/edit charger - availability -
incoming requests - booking history - verification/support

Handle denied location permission gracefully with manual location entry.
Do not require continuous background location tracking for the MVP. Push
notifications can follow after the booking flow is stable.

## 13. Security, Privacy, and Safety

-   Never commit secrets, API keys, private addresses, or credentials.
-   Use Django password hashing and validation.
-   Use HTTPS in production.
-   Configure CORS narrowly.
-   Apply server-side object ownership and role permissions to every
    protected endpoint.
-   Rate-limit authentication and sensitive discovery/booking endpoints.
-   Validate and constrain uploaded images and file types.
-   Avoid exposing exact residential locations in public APIs.
-   Store private access instructions separately from public listing
    fields.
-   Log moderation and booking state changes.
-   Provide incident reporting and a suspension process.
-   Do not store precise location longer than needed without a clear
    reason and privacy policy.
-   Do not promise that a home charging point is safe or legally
    shareable without verification.
-   Before real-world paid sessions, review applicable Indian electrical
    safety, electricity billing/tariff, property/society permissions,
    liability, insurance, privacy, taxation, and payment requirements
    with appropriate professionals.
-   Do not launch real payments until the operating model and
    payment/payout flow have been reviewed.

## 14. Testing Requirements

### Backend

-   model validation and constraints
-   authentication and permission tests
-   charger approval filtering
-   PostGIS radius and boundary tests using known test coordinates
-   connector compatibility tests
-   booking state-transition tests
-   concurrent booking/conflict tests
-   private address and access-instruction serialization tests
-   API schema generation

### Web

-   login/registration validation
-   search filters and loading/error/empty states
-   map and list result consistency
-   host listing and booking flows
-   responsive layouts
-   API failure handling

### Mobile

-   location permission granted/denied
-   manual location fallback
-   charger search and detail
-   booking and status refresh
-   navigation handoff
-   network failure and retry handling

### End-to-end

1.  Admin approves a seeded charger.
2.  Driver registers and adds a vehicle.
3.  Driver searches for a compatible charger.
4.  Driver requests access.
5.  Host accepts.
6.  Driver marks arrival.
7.  Session is recorded and completed.
8.  Both participants can view the final booking status.
9.  An unauthorized user cannot view or modify private booking data.

Use fictional seeded data in development. Never invent real hosts or
claim that a real charging session happened.

## 15. 12-Week Solo-Founder Roadmap

### Week 1 --- Foundation

-   inspect repository
-   create monorepo and development instructions
-   configure Django, PostgreSQL/PostGIS, React, TypeScript
-   create environment template and health endpoint

### Weeks 2--3 --- Identity and listings

-   custom user model and authentication
-   vehicle CRUD
-   charger CRUD and photos
-   host permissions and approval
-   Django Admin moderation

### Weeks 4--5 --- Discovery

-   PostGIS nearby query
-   map/list UI
-   compatibility filters
-   route provider abstraction
-   conservative reachability states and fallback

### Weeks 6--7 --- Bookings

-   request, accept, decline, cancel, arrival and completion
-   conflict protection and idempotency
-   booking history
-   state transition tests

### Week 8 --- Safety and hardening

-   incident reporting
-   audit trail
-   privacy review
-   permissions and security tests
-   deployment checklist

### Weeks 9--10 --- Mobile

-   Expo project
-   authentication
-   search/details
-   booking
-   host response
-   navigation handoff

### Weeks 11--12 --- Controlled Pune pilot

-   recruit and verify a small cluster of participating hosts
-   confirm permission and equipment suitability
-   run manual operational tests
-   measure completed sessions, host response, cancellations, and
    suitable-search rate
-   add payments only after appropriate review

This is a planning target, not a guaranteed delivery date. Reduce scope
rather than skipping safety, permission checks, or testing.

## 16. Acceptance Criteria

### Authentication and authorization

-   Users can register, log in, log out, and manage their own profiles.
-   Drivers cannot edit another user's vehicles or bookings.
-   Hosts cannot modify another host's charger.
-   Hosts cannot approve their own listings.
-   Admin actions are protected server-side.

### Discovery

-   GPS and manual location search work.
-   PostGIS returns chargers within the configured radius.
-   Unapproved/suspended listings are excluded.
-   Incompatible chargers are excluded.
-   Availability freshness is visible.
-   Reachability is marked uncertain when the inputs are insufficient.
-   Empty results provide alternatives.

### Booking

-   Driver can request a compatible available charger.
-   Host can accept or decline their own request.
-   Concurrent requests cannot double-book the same slot.
-   Invalid status transitions are rejected.
-   Price snapshots do not change after booking.
-   Cancellation and dispute records are retained.

### Privacy and reliability

-   Exact home address and access instructions are not public.
-   Secrets are excluded from Git.
-   Critical permission, geospatial, and booking tests pass.
-   Error states are handled in both clients.
-   Both clients use the same API and business rules.
-   A successful session is not automatically treated as a successful
    payment.

## 17. Environment and Developer Experience

Create `.env.example` with placeholders only, for example:

``` env
DJANGO_SECRET_KEY=replace-me
DJANGO_DEBUG=True
DATABASE_URL=postgres://user:password@localhost:5432/chargenearby
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
MAPS_API_KEY=
```

Use the selected database/driver configuration required by the actual
project. Never put real credentials in this file.

The README must document: - prerequisites - installation commands -
database/PostGIS setup - migrations and seeded test data - running
backend and web app - running mobile app - tests and linting -
environment variables - API docs URL - known limitations

Provide a simple health endpoint such as `/api/v1/health/` that reports
application health without leaking credentials or infrastructure
secrets.

## 18. Implementation Instructions for Antigravity

Follow these instructions in order:

1.  **Inspect first.** List the repository contents, inspect existing
    source files and README, and determine whether the project is empty
    or already implemented.
2.  **Summarize findings.** Briefly state the current stack, reusable
    code, missing pieces, and the implementation sequence.
3.  **Create a plan.** Break the work into small phases with acceptance
    criteria.
4.  **Build a vertical slice.** First make the backend health endpoint,
    database connection, custom user model, charger model, and approved
    nearby-charger API work. Add tests.
5.  **Connect the web app.** Implement the landing page, separate
    routes, and a working Find Chargers page using the actual API---not
    hard-coded mock data presented as real.
6.  **Add host and booking flows.** Enforce permissions and state
    transitions server-side.
7.  **Add mobile after the shared API is stable.** Reuse the same API
    and domain rules.
8.  **Run checks.** Run migrations, backend tests, frontend
    type-check/lint/tests, and mobile checks where available.
9.  **Fix errors.** Do not leave broken imports, nonfunctional buttons,
    fake successful API calls, or unhandled primary flows.
10. **Document results.** Update README and record implemented features,
    commands run, test results, remaining limitations, and next steps.

### Coding standards

-   TypeScript strict mode where practical.
-   Reusable components and typed API responses.
-   Keep business logic out of presentation components.
-   Keep secrets in environment variables.
-   Avoid duplicate API implementations across web and mobile.
-   Use migrations for schema changes.
-   Add tests for security-sensitive logic.
-   Use clear naming and consistent formatting.
-   Do not add dependencies without a reason.
-   Do not refactor unrelated code without justification.
-   Do not mark a feature complete unless it works and has been checked.

### Required final report from Antigravity

At the end of each implementation phase, report: - files
created/modified - features completed - commands executed - tests and
results - setup steps required from the founder - known issues and
remaining work - the recommended next task

## 19. Definition of Done for the First Milestone

The first milestone is complete when: - Django starts successfully. -
PostgreSQL/PostGIS connection and migrations work. - A custom user model
exists. - A host can create a charger listing. - Admin can approve it. -
Public nearby search returns only approved listings using a PostGIS
radius query. - The React web app calls that real API and displays the
results. - Basic automated tests pass for approval filtering, location
search, and permissions. - README instructions allow the founder to
reproduce the setup locally.

**Build this milestone first. Do not attempt to complete every feature
in one pass.**

------------------------------------------------------------------------

**End of specification.**
