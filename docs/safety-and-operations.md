# ChargeNearby Safety, Privacy, and Operational Guidelines

## 1. Safety Principles

1. **Emergency Discovery Priority**: ChargeNearby prioritizes urgent emergency charging access over casual convenience.
2. **Conservative Reachability Calculations**:
   - Pune urban detour multiplier: ~1.35x applied to straight-line distance.
   - Traffic speeds: ~22 km/h average in central Pune corridors.
   - Triage rules: Return `UNCERTAIN` or `CRITICAL` when battery reserve is close to the travel route.
3. **Public Fallback Hubs**: When zero private community options exist in radius, drivers are immediately presented with commercial DC fast hubs (Tata Power Shivajinagar, Jio-bp Baner, Statiq Viman Nagar) and the national 24/7 EV roadside assistance hotline (`1800-209-7979`).

## 2. Privacy & Host Protection Protocols

- **Public Strip Policy**: Serializers explicitly drop `exact_address` and `access_instructions`.
- **Gated Reveal Flow**: Confidential host address information is only transmitted to authenticated users when an active, confirmed booking exists (`ACCEPTED`, `ARRIVED`, `CHARGING`, `COMPLETED`).
- **Owner Verification**: Hosts cannot approve their own listings. All listings go through `PENDING` review.

## 3. Electrical & Regulatory Considerations for Pilot

- **Residential Safety**: Dedicated 16A/32A MCB and Type A/B RCD protection required for listed equipment.
- **Simulated Financials**: For early pilot operations, price snapshots are captured in INR but simulated without live automatic payment deductions pending legal and tariff review.
