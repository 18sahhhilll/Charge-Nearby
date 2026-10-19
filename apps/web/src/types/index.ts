export type UserRole = 'DRIVER' | 'HOST' | 'BOTH' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface Vehicle {
  id: string;
  owner?: string;
  nickname?: string | null;
  make: string;
  model: string;
  vehicle_type: 'CAR' | 'TWO_WHEELER' | 'THREE_WHEELER' | 'OTHER';
  connector_types: string[];
  battery_capacity_kwh?: string | number | null;
  estimated_battery_percent?: number | null;
  created_at: string;
}

export type ChargerType = 'AC' | 'DC';
export type PricingModel = 'PER_KWH' | 'PER_MINUTE' | 'FIXED_SESSION';
export type AvailabilityStatus = 'AVAILABLE' | 'UNCONFIRMED' | 'UNAVAILABLE';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type PhotoType = 'CHARGER' | 'PARKING_BAY' | 'CIRCUIT_BREAKER' | 'OTHER';

export interface ChargerPhoto {
  id: string;
  charger: string;
  image: string;
  image_url: string;
  caption: string;
  photo_type: PhotoType;
  is_primary: boolean;
  uploaded_at: string;
}

export interface Charger {
  id: string;
  title: string;
  description: string;
  charger_type: ChargerType;
  connector_types: string[];
  max_power_kw: string | number;
  pricing_model: PricingModel;
  price_per_kwh?: string | null;
  price_per_minute?: string | null;
  session_price?: string | null;
  currency: string;
  latitude: number | string;
  longitude: number | string;
  locality: string;
  parking_access: string;
  availability_status: AvailabilityStatus;
  verification_status: VerificationStatus;
  last_confirmed_available_at?: string | null;
  host_display_name?: string;
  photos?: ChargerPhoto[];
  
  // Computed in discovery results
  distance_km?: number;
  estimated_road_distance_km?: number;
  estimated_duration_minutes?: number;
  reachability_status?: 'REACHABLE' | 'UNCERTAIN' | 'CRITICAL' | 'UNKNOWN';
  reachability_confidence?: number;
  reachability_notes?: string[];
  availability_freshness_minutes?: number | null;
  discovery_rank_score?: number;

  // Private fields (only in host view or confirmed booking)
  exact_address?: string;
  access_instructions?: string;
}

export interface PublicHub {
  id: string;
  name: string;
  locality: string;
  latitude: number;
  longitude: number;
  charger_type: string;
  connector_types: string[];
  max_power_kw: number;
  pricing: string;
  is_public_hub: boolean;
  operator: string;
  support_phone: string;
  distance_km?: number;
  estimated_road_distance_km?: number;
}

export interface DiscoveryResponse {
  search_center: { latitude: number; longitude: number };
  radius_km: number;
  count: number;
  results: Charger[];
  alternatives: PublicHub[];
  fallback_info: {
    expanded_radius_recommended: boolean;
    emergency_assistance_phone: string;
    advisory: string;
  };
}

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'ARRIVED'
  | 'CHARGING'
  | 'COMPLETED'
  | 'DISPUTED';

export interface ChargingSession {
  id: string;
  started_at?: string | null;
  ended_at?: string | null;
  energy_delivered_kwh?: string | null;
  start_battery_percent?: number | null;
  end_battery_percent?: number | null;
  completion_method: 'HOST' | 'DRIVER' | 'ADMIN';
  notes?: string;
}

export interface Booking {
  id: string;
  driver: string;
  driver_name: string;
  driver_phone?: string | null;
  host_name: string;
  host_phone?: string | null;
  charger: string;
  charger_title: string;
  charger_locality: string;
  vehicle: string;
  vehicle_details?: Vehicle;
  booking_type: 'EMERGENCY' | 'SCHEDULED';
  status: BookingStatus;
  requested_start_at: string;
  requested_end_at?: string | null;
  accepted_at?: string | null;
  arrival_at?: string | null;
  completed_at?: string | null;
  quoted_amount: string | number;
  currency: string;
  exact_address: string;
  access_instructions: string;
  cancellation_reason?: string;
  dispute_reason?: string;
  session?: ChargingSession | null;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: Record<string, any>;
  };
}
