import { ApiError } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export class ApiException extends Error {
  code: string;
  details: Record<string, any>;
  statusCode: number;

  constructor(code: string, message: string, details: Record<string, any> = {}, statusCode: number = 400) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('chargenearby_access_token');
}

export function setAuthTokens(access: string, refresh?: string): void {
  localStorage.setItem('chargenearby_access_token', access);
  if (refresh) {
    localStorage.setItem('chargenearby_refresh_token', refresh);
  }
}

export function clearAuthTokens(): void {
  localStorage.removeItem('chargenearby_access_token');
  localStorage.removeItem('chargenearby_refresh_token');
  localStorage.removeItem('chargenearby_user');
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
  } catch (networkError: any) {
    if (networkError.name === 'AbortError') {
      throw new ApiException(
        'TIMEOUT_ERROR',
        'Request to ChargeNearby server timed out. Please ensure backend is running at http://127.0.0.1:8000.',
        {},
        0
      );
    }
    throw new ApiException(
      'NETWORK_ERROR',
      'Cannot connect to the ChargeNearby server. Please check your internet or local server.',
      { original: networkError.message },
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let errorData: any = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    if (errorData && errorData.error) {
      const err = errorData as ApiError;
      throw new ApiException(
        err.error.code,
        err.error.message,
        err.error.details || {},
        response.status
      );
    }

    throw new ApiException(
      `HTTP_${response.status}`,
      `Request failed with status ${response.status}: ${response.statusText}`,
      errorData || {},
      response.status
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
