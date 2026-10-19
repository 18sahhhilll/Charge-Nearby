import { Platform } from 'react-native';
import { DiscoveryResponse, Charger, Booking } from '../types';

// For Android emulator 10.0.2.2 points to host machine localhost; for iOS / web use localhost
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
export const API_BASE_URL = `${DEFAULT_HOST}/api/v1`;

let authToken: string | null = null;

export const setMobileAuthToken = (token: string | null) => {
  authToken = token;
};

async function mobileRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const json = await response.json();
      if (json.error?.message) errorMsg = json.error.message;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

export const mobileApi = {
  async searchNearby(lat: number, lng: number, radiusKm: number = 5.0, batteryPercent?: number): Promise<DiscoveryResponse> {
    const q = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius_km: radiusKm.toString(),
    });
    if (batteryPercent !== undefined) {
      q.set('battery_percent', batteryPercent.toString());
    }
    return mobileRequest<DiscoveryResponse>(`/discovery/nearby/?${q.toString()}`);
  },

  async getCharger(id: string): Promise<Charger> {
    return mobileRequest<Charger>(`/chargers/${id}/`);
  },

  async getBookings(viewAsHost: boolean = false): Promise<Booking[]> {
    const query = viewAsHost ? '?view=host' : '';
    const res = await mobileRequest<any>(`/bookings/${query}`);
    return Array.isArray(res) ? res : res.results || [];
  },

  async acceptBooking(id: string): Promise<Booking> {
    return mobileRequest<Booking>(`/bookings/${id}/accept/`, { method: 'POST' });
  },

  async markArrive(id: string): Promise<Booking> {
    return mobileRequest<Booking>(`/bookings/${id}/arrive/`, { method: 'POST' });
  },

  async startSession(id: string, startPct?: number): Promise<Booking> {
    return mobileRequest<Booking>(`/bookings/${id}/start-session/`, {
      method: 'POST',
      body: JSON.stringify({ start_battery_percent: startPct }),
    });
  },

  async completeSession(id: string, kwh?: number, endPct?: number): Promise<Booking> {
    return mobileRequest<Booking>(`/bookings/${id}/complete/`, {
      method: 'POST',
      body: JSON.stringify({ energy_delivered_kwh: kwh, end_battery_percent: endPct }),
    });
  }
};
