export type UserRole = 'DRIVER' | 'HOST' | 'BOTH' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string | null;
  role: UserRole;
}

export type ChargerType = 'AC' | 'DC';
export type AvailabilityStatus = 'AVAILABLE' | 'UNCONFIRMED' | 'UNAVAILABLE';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface Charger {
  id: string;
  title: string;
  description: string;
  charger_type: ChargerType;
  connector_types: string[];
  max_power_kw: string | number;
  pricing_model: string;
  price_per_kwh?: string | null;
  session_price?: string | null;
  currency: string;
  latitude: number | string;
  longitude: number | string;
  locality: string;
  parking_access: string;
  availability_status: AvailabilityStatus;
  verification_status: VerificationStatus;
  host_display_name?: string;
  distance_km?: number;
  estimated_road_distance_km?: number;
  estimated_duration_minutes?: number;
  reachability_status?: string;
  reachability_confidence?: number;
  reachability_notes?: string[];
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
  operator: string;
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
  booking_type: string;
  status: string;
  quoted_amount: string | number;
  currency: string;
  exact_address?: string;
  access_instructions?: string;
  created_at: string;
}
