# ChargeNearby ⚡

> **Community-powered emergency EV charging discovery platform** for electric vehicle drivers in urgent need, connecting them to verified private hosts and community charging equipment in Pune, Maharashtra, India.

---

## 1. System Overview & Technology Stack

| Layer | Technologies |
|---|---|
| **Backend API** | Python 3.15, Django 6.1, Django REST Framework, SimpleJWT, drf-spectacular (OpenAPI 3) |
| **Geospatial & DB** | PostgreSQL with PostGIS / Portable spherical Haversine spatial engine with bounding-box index |
| **Web Client** | React 19, TypeScript (strict mode), Vite, Tailwind CSS v4, React Router, Lucide Icons |
| **Mobile Client** | React Native, Expo SDK 58, TypeScript, Expo Location with GPS permission handling |
| **Documentation** | OpenAPI / Swagger UI at `/api/docs/`, Markdown architecture & safety specs in `docs/` |

---

## 2. Monorepo Structure

```text
Charge-Nearby/
├── backend/                  # Django REST Framework API
│   ├── config/               # Settings, URLs, WSGI, ASGI
│   ├── apps/
│   │   ├── accounts/         # Custom User model (DRIVER, HOST, BOTH, ADMIN), JWT auth
│   │   ├── vehicles/         # EV models, connectors, battery capacity
│   │   ├── chargers/         # Equipment listings, pricing models, privacy gating
│   │   ├── discovery/        # Emergency nearby search, reachability triage, fallback
│   │   ├── bookings/         # Transactional state machine, arrival & charging sessions
│   │   └── core/             # Health check, custom exception handler, geo math
│   ├── tests/                # Automated backend unit & integration test suite
│   ├── manage.py
│   └── requirements.txt
├── apps/
│   ├── web/                  # React + Vite + Tailwind responsive web application
│   └── mobile/               # React Native + Expo mobile application
├── docs/                     # Technical specifications & operational guidelines
│   ├── architecture.md
│   ├── api-spec.md
│   ├── database-schema.md
│   ├── safety-and-operations.md
│   └── pilot-test-plan.md
├── .env.example              # Environment variables template
├── .gitignore
└── README.md
```

---

## 3. Quickstart & Installation

### 3.1 Prerequisites
- **Python 3.10+** (Python 3.15 tested)
- **Node.js 20+** (Node v24.18.1 tested) and **npm 10+**
- **Git**

### 3.2 Environment Setup
Copy the environment variables template:
```bash
cp .env.example .env
```

### 3.3 Backend Setup & Database Migrations
Create a virtual environment and install backend dependencies:
```bash
# From repository root
python -m venv backend/.venv

# Activate virtual environment (Windows PowerShell)
.\backend\.venv\Scripts\Activate.ps1

# Install requirements
pip install -r backend/requirements.txt

# Run migrations
cd backend
python manage.py migrate

# Seed realistic Pune pilot chargers & test accounts
python manage.py seed_pune_data
```

### 3.4 Seeded Demo Credentials (Pune Pilot)
| Role | Email | Password | Location / Notes |
|---|---|---|---|
| **Driver** | `pune.driver@chargenearby.in` | `DriverPass123!` | Pune (Tata Nexon EV Max, 18% battery) |
| **Host 1** | `koregaon.host@chargenearby.in` | `HostPass123!` | Koregaon Park (7.4 kW AC Type 2) |
| **Host 2** | `baner.host@chargenearby.in` | `HostPass123!` | Baner High Street (22 kW AC Type 2) |
| **Host 3** | `kothrud.host@chargenearby.in` | `HostPass123!` | Kothrud (3.3 kW AC 15A Socket / Type 2) |
| **Admin** | `admin@chargenearby.in` | `AdminPass123!` | Antigravity Moderator |

---

## 4. Running the Applications

### 4.1 Backend API Server
```bash
cd backend
python manage.py runserver 127.0.0.1:8000
```
- **Health Check**: `http://127.0.0.1:8000/api/v1/health/`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/api/docs/`
- **OpenAPI Schema**: `http://127.0.0.1:8000/api/schema/`
- **Django Admin Portal**: `http://127.0.0.1:8000/admin/`

### 4.2 Web Application (React + Vite)
```bash
cd apps/web
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.
- Emergency Discovery Map & List: `/find`
- Details & Booking: `/chargers/:id`
- Driver Bookings: `/driver/bookings`
- Host Dashboard: `/host/dashboard`
- Incoming Requests: `/host/bookings`

### 4.3 Mobile Application (Expo + React Native)
```bash
cd apps/mobile
npm install
npm start
```
- Press `w` to run on web, `a` for Android emulator, or scan the QR code using the Expo Go mobile app.

---

## 5. Automated Tests & Quality Verification

### 5.1 Backend Automated Test Suite
Run the 20 automated tests:
```bash
cd backend
python manage.py test tests
```
**Test Coverage Includes:**
1. Health check response format and zero credential leakage.
2. Custom User registration, password matching, JWT login, and profile permissions.
3. Role authorization (drivers blocked from host endpoints, hosts cannot approve own listings).
4. Charger approval filtering: only `APPROVED` chargers appear publicly; pending/suspended are excluded.
5. Privacy protection: `exact_address` and `access_instructions` are stripped from public endpoints.
6. Geospatial radius filtering in Pune (Koregaon Park vs. Baner vs. Kothrud).
7. Connector compatibility matching (Type 2, CCS 2, 15A Socket).
8. Reachability honest uncertainty flags (`REACHABLE`, `UNCERTAIN`, `CRITICAL`, `UNKNOWN`).
9. Emergency fallback public DC fast hubs when results = 0.
10. Booking lifecycle state machine (`REQUESTED` -> `ACCEPTED` -> `ARRIVED` -> `CHARGING` -> `COMPLETED`).
11. Privacy reveal flow: address and access instructions unlock only upon host acceptance.
12. Validation preventing self-booking and booking with another user's vehicle.

### 5.2 Frontend Build & TypeScript Check
```bash
cd apps/web
npm run build
```
*Builds production assets with zero errors and strict TypeScript checks.*

### 5.3 Mobile App TypeScript Check
```bash
cd apps/mobile
npx tsc --noEmit
```
*Validates mobile screens, hooks, and types with zero errors.*

---

## 6. Security, Privacy & Safety Highlights

- **Confidential Address Gating**: Public search only exposes the broad locality (e.g., "Koregaon Park, Pune"). Exact bungalow numbers, gate codes, and parking bay instructions remain encrypted and hidden until the host explicitly accepts an emergency request.
- **Strict Role Permissions**: Host-specific and driver-specific operations are enforced server-side via custom DRF permission classes (`IsHostUser`, `IsDriverUser`, `IsAdminRole`, `IsOwnerOrAdmin`).
- **No Floating-Point Money**: All quoted amounts and snapshots are processed in INR using exact decimals.
- **Concurrency Locking**: Atomic row locks (`select_for_update()`) prevent double-booking conflicts on the same charger.

---

## 7. Known Limitations & Roadmap Next Steps

1. **Simulated Payments**: For pilot safety and Indian tariff/regulatory review, booking price snapshots are stored in INR with simulated settlement. Live payment gateways (e.g. Razorpay / UPI) will follow formal compliance approval.
2. **Push Notifications**: Expo push notifications can be wired to Firebase Cloud Messaging (FCM) / Apple APNs once host pilot recruitment begins.
3. **Turn-by-turn Navigation**: The application currently hands off to native navigation apps (Google Maps / Apple Maps) via verified deep links with origin and destination coordinates.
