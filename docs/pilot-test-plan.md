# ChargeNearby Pilot Test Plan (Pune, Maharashtra)

## 1. Pilot Cluster Scope
- **Cluster 1**: Koregaon Park & Kalyani Nagar (Bungalow driveway wallboxes)
- **Cluster 2**: Baner & Aundh (Commercial & bungalow chargers)
- **Cluster 3**: Kothrud & Karve Nagar (Apartment society 15A & Type 2 points)
- **Cluster 4**: Viman Nagar & Kharadi (Airport corridor DC rapid hub)

## 2. Test Verification Steps

### Step 1: Health & Database Connectivity
```bash
python backend/manage.py test tests
```
*Expected: 20 passed tests covering health, permissions, geospatial radius filtering, privacy sanitization, and state transitions.*

### Step 2: Seed Pilot Test Data
```bash
python backend/manage.py seed_pune_data
```
*Creates realistic test accounts in Pune:*
- Admin: `admin@chargenearby.in` / `AdminPass123!`
- Host: `koregaon.host@chargenearby.in` / `HostPass123!`
- Driver: `pune.driver@chargenearby.in` / `DriverPass123!`

### Step 3: Web Client Verification
1. Start Django backend on `http://127.0.0.1:8000`.
2. Start Vite dev server in `apps/web`:
```bash
cd apps/web && npm run dev
```
3. Open `http://localhost:5173/find`
   - Test map/list toggle
   - Verify that 4 approved chargers around Pune appear
   - Verify that Hinjawadi (status: PENDING) is excluded
   - Click "Use My GPS" or click on the map to set custom coordinates
   - Inspect charger details: confirm exact address is hidden as "Hidden until booking is confirmed by host."

### Step 4: End-to-End Booking Lifecycle
1. Log in as driver (`pune.driver@chargenearby.in`).
2. Request access to "Lane 7 Green Oasis Wallbox".
3. Log in as host (`koregaon.host@chargenearby.in`) on `/host/bookings`.
4. Click "Accept Emergency Access".
5. Return to driver view: confirm exact street address and gate instructions are now visible!
6. Click "I Have Arrived", "Plug In & Start Charging", and "Complete Session".
