# ChargeNearby Database Schema

## 1. Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Vehicle : owns
    User ||--o{ Charger : hosts
    User ||--o{ Booking : requests
    Charger ||--o{ Booking : reserves
    Charger ||--o{ AvailabilityWindow : schedules
    Booking ||--o| ChargingSession : tracks

    User {
        uuid id PK
        string email UK
        string full_name
        string phone_number
        string role
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    Vehicle {
        uuid id PK
        uuid owner_id FK
        string make
        string model
        string vehicle_type
        json connector_types
        decimal battery_capacity_kwh
        integer estimated_battery_percent
        timestamp created_at
    }

    Charger {
        uuid id PK
        uuid host_id FK
        string title
        text description
        string charger_type
        json connector_types
        decimal max_power_kw
        string pricing_model
        decimal price_per_kwh
        decimal price_per_minute
        decimal session_price
        string currency
        decimal latitude
        decimal longitude
        string locality
        string exact_address
        text access_instructions
        string parking_access
        string availability_status
        string verification_status
        timestamp last_confirmed_available_at
        timestamp created_at
    }

    Booking {
        uuid id PK
        uuid driver_id FK
        uuid charger_id FK
        uuid vehicle_id FK
        string booking_type
        string status
        timestamp requested_start_at
        timestamp accepted_at
        timestamp arrival_at
        timestamp completed_at
        decimal quoted_amount
        string currency
        text cancellation_reason
        text dispute_reason
        timestamp created_at
    }

    ChargingSession {
        uuid id PK
        uuid booking_id FK
        timestamp started_at
        timestamp ended_at
        decimal energy_delivered_kwh
        integer start_battery_percent
        integer end_battery_percent
        string completion_method
        text notes
    }
```

## 2. Key Constraints & Indices
- **Primary Keys**: UUIDv4 across public entities.
- **Geospatial & Filtering Indices**:
  - `chargers`: composite index on `(verification_status, availability_status)`, spatial indices on `(latitude, longitude)`.
  - `bookings`: composite indices on `(driver, status)`, `(charger, status)`, `(status, requested_start_at)`.
- **Currency Arithmetic**: Strict decimal format in INR (no floats).
- **Concurrency Protection**: Database row-locking (`select_for_update()`) on booking state mutations preventing double booking.
