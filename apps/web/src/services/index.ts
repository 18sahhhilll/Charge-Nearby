import { request, setAuthTokens, clearAuthTokens } from './apiClient';
import {
  User,
  AuthResponse,
  Vehicle,
  Charger,
  ChargerPhoto,
  DiscoveryResponse,
  Booking,
  PublicHub
} from '../types';

// ----------------- AUTH SERVICE -----------------
export const authService = {
  async register(payload: {
    email: string;
    full_name: string;
    phone_number?: string;
    role: string;
    password: string;
    password_confirm: string;
  }): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setAuthTokens(data.access, data.refresh);
    localStorage.setItem('chargenearby_user', JSON.stringify(data.user));
    return data;
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthTokens(data.access, data.refresh);
    localStorage.setItem('chargenearby_user', JSON.stringify(data.user));
    return data;
  },

  async getMe(): Promise<User> {
    const user = await request<User>('/auth/me/');
    localStorage.setItem('chargenearby_user', JSON.stringify(user));
    return user;
  },

  async updateMe(payload: Partial<User>): Promise<User> {
    const user = await request<User>('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    localStorage.setItem('chargenearby_user', JSON.stringify(user));
    return user;
  },

  logout(): void {
    clearAuthTokens();
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('chargenearby_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }
};

// ----------------- VEHICLE SERVICE -----------------
export const vehicleService = {
  async list(): Promise<Vehicle[]> {
    const data = await request<any>('/vehicles/');
    return Array.isArray(data) ? data : data.results || [];
  },

  async create(payload: Partial<Vehicle>): Promise<Vehicle> {
    return request<Vehicle>('/vehicles/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async get(id: string): Promise<Vehicle> {
    return request<Vehicle>(`/vehicles/${id}/`);
  },

  async update(id: string, payload: Partial<Vehicle>): Promise<Vehicle> {
    return request<Vehicle>(`/vehicles/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async delete(id: string): Promise<void> {
    return request<void>(`/vehicles/${id}/`, {
      method: 'DELETE',
    });
  }
};

// ----------------- DISCOVERY SERVICE -----------------
export const discoveryService = {
  async searchNearby(params: {
    lat: number;
    lng: number;
    radius_km?: number;
    connector?: string;
    charger_type?: string;
    available_now?: boolean;
    battery_percent?: number;
    vehicle_type?: string;
    max_price?: number;
  }): Promise<DiscoveryResponse> {
    const query = new URLSearchParams();
    query.set('lat', params.lat.toString());
    query.set('lng', params.lng.toString());
    if (params.radius_km) query.set('radius_km', params.radius_km.toString());
    if (params.connector) query.set('connector', params.connector);
    if (params.charger_type) query.set('charger_type', params.charger_type);
    if (params.available_now) query.set('available_now', 'true');
    if (params.battery_percent !== undefined) query.set('battery_percent', params.battery_percent.toString());
    if (params.vehicle_type) query.set('vehicle_type', params.vehicle_type);
    if (params.max_price !== undefined) query.set('max_price', params.max_price.toString());

    return request<DiscoveryResponse>(`/discovery/nearby/?${query.toString()}`);
  },

  async getRoute(chargerId: string, originLat: number, originLng: number): Promise<any> {
    return request<any>(`/discovery/chargers/${chargerId}/route/?origin_lat=${originLat}&origin_lng=${originLng}`);
  },

  async getAlternatives(lat?: number, lng?: number): Promise<{ count: number; alternatives: PublicHub[] }> {
    const q = lat && lng ? `?lat=${lat}&lng=${lng}` : '';
    return request<{ count: number; alternatives: PublicHub[] }>(`/discovery/alternatives/${q}`);
  }
};

// ----------------- CHARGER SERVICE -----------------
export const chargerService = {
  async getPublicList(filters?: { connector?: string; charger_type?: string; available_now?: boolean }): Promise<Charger[]> {
    const query = new URLSearchParams();
    if (filters?.connector) query.set('connector', filters.connector);
    if (filters?.charger_type) query.set('charger_type', filters.charger_type);
    if (filters?.available_now) query.set('available_now', 'true');
    
    const data = await request<any>(`/chargers/?${query.toString()}`);
    return Array.isArray(data) ? data : data.results || [];
  },

  async getPublicById(id: string): Promise<Charger> {
    return request<Charger>(`/chargers/${id}/`);
  },

  async getHostChargers(): Promise<Charger[]> {
    const data = await request<any>('/host/chargers/');
    return Array.isArray(data) ? data : data.results || [];
  },

  async getHostChargerById(id: string): Promise<Charger> {
    return request<Charger>(`/host/chargers/${id}/`);
  },

  async createHostCharger(payload: Partial<Charger>): Promise<Charger> {
    return request<Charger>('/host/chargers/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateHostCharger(id: string, payload: Partial<Charger>): Promise<Charger> {
    return request<Charger>(`/host/chargers/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async submitForReview(id: string): Promise<any> {
    return request<any>(`/host/chargers/${id}/submit/`, {
      method: 'POST',
    });
  },

  async updateAvailability(id: string, status: 'AVAILABLE' | 'UNAVAILABLE' | 'UNCONFIRMED'): Promise<any> {
    return request<any>(`/host/chargers/${id}/availability/`, {
      method: 'POST',
      body: JSON.stringify({ availability_status: status }),
    });
  },

  async uploadPhoto(
    chargerId: string,
    file: File,
    caption?: string,
    photoType: string = 'CHARGER',
    isPrimary: boolean = false
  ): Promise<ChargerPhoto> {
    const formData = new FormData();
    formData.append('image', file);
    if (caption) formData.append('caption', caption);
    formData.append('photo_type', photoType);
    if (isPrimary) formData.append('is_primary', 'true');

    return request<ChargerPhoto>(`/host/chargers/${chargerId}/photos/`, {
      method: 'POST',
      body: formData,
    });
  },

  async deletePhoto(chargerId: string, photoId: string): Promise<void> {
    return request<void>(`/host/chargers/${chargerId}/photos/${photoId}/`, {
      method: 'DELETE',
    });
  }
};

// ----------------- BOOKING SERVICE -----------------
export const bookingService = {
  async list(viewAsHost: boolean = false): Promise<Booking[]> {
    const query = viewAsHost ? '?view=host' : '';
    const data = await request<any>(`/bookings/${query}`);
    return Array.isArray(data) ? data : data.results || [];
  },

  async get(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/`);
  },

  async create(payload: {
    charger: string;
    vehicle: string;
    booking_type: 'EMERGENCY' | 'SCHEDULED';
    requested_start_at?: string;
  }): Promise<Booking> {
    return request<Booking>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async accept(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/accept/`, { method: 'POST' });
  },

  async decline(id: string, reason?: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/decline/`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async cancel(id: string, reason?: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/cancel/`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async arrive(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/arrive/`, { method: 'POST' });
  },

  async startSession(id: string, data?: { start_battery_percent?: number; notes?: string }): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/start-session/`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  },

  async completeSession(id: string, data?: { energy_delivered_kwh?: number; end_battery_percent?: number }): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/complete/`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  },

  async reportIssue(id: string, dispute_reason: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/report-issue/`, {
      method: 'POST',
      body: JSON.stringify({ dispute_reason }),
    });
  }
};
