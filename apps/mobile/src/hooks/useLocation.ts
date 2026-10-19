import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  latitude: number;
  longitude: number;
  hasPermission: boolean;
  loading: boolean;
  errorMsg: string | null;
  isManual: boolean;
}

const DEFAULT_PUNE_LAT = 18.5204;
const DEFAULT_PUNE_LNG = 73.8567;

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: DEFAULT_PUNE_LAT,
    longitude: DEFAULT_PUNE_LNG,
    hasPermission: false,
    loading: true,
    errorMsg: null,
    isManual: false,
  });

  const requestGps = async () => {
    setState((prev) => ({ ...prev, loading: true, errorMsg: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState((prev) => ({
          ...prev,
          loading: false,
          hasPermission: false,
          isManual: true,
          errorMsg: 'Permission to access location was denied. Using Pune fallback coordinates.',
        }));
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setState({
        latitude: Number(loc.coords.latitude.toFixed(4)),
        longitude: Number(loc.coords.longitude.toFixed(4)),
        hasPermission: true,
        loading: false,
        errorMsg: null,
        isManual: false,
      });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        hasPermission: false,
        isManual: true,
        errorMsg: `GPS Error: ${err.message || 'Location unavailable'}. Using Pune default.`,
      }));
    }
  };

  const setManualCoordinates = (lat: number, lng: number) => {
    setState((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      isManual: true,
    }));
  };

  useEffect(() => {
    requestGps();
  }, []);

  return {
    ...state,
    refreshGps: requestGps,
    setManualCoordinates,
  };
}
