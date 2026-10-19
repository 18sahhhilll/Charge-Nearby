import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  TextInput,
} from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { mobileApi } from '../services/api';
import { Charger, DiscoveryResponse, PublicHub } from '../types';

interface Props {
  onSelectCharger?: (charger: Charger) => void;
}

export const DriverEmergencySearchScreen: React.FC<Props> = ({ onSelectCharger }) => {
  const { latitude, longitude, loading: locLoading, errorMsg, isManual, refreshGps, setManualCoordinates } = useLocation();

  const [radiusKm, setRadiusKm] = useState<number>(5.0);
  const [batteryPercent, setBatteryPercent] = useState<number>(18);
  const [data, setData] = useState<DiscoveryResponse | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performSearch = async () => {
    setSearching(true);
    setSearchError(null);
    try {
      const res = await mobileApi.searchNearby(latitude, longitude, radiusKm, batteryPercent);
      setData(res);
    } catch (err: any) {
      setSearchError(err.message || 'Failed to search nearby.');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!locLoading) {
      performSearch();
    }
  }, [latitude, longitude, locLoading, radiusKm]);

  const openMapsNavigation = (destLat: number, destLng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destLat},${destLng}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Location Triage Bar */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Emergency Location</Text>
          <TouchableOpacity onPress={refreshGps} style={styles.gpsButton}>
            <Text style={styles.gpsButtonText}>📍 Refresh GPS</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.coordsText}>
          {latitude.toFixed(4)}, {longitude.toFixed(4)} {isManual ? '(Manual/Fallback)' : '(GPS)'}
        </Text>

        {errorMsg && (
          <Text style={styles.warningText}>⚠️ {errorMsg}</Text>
        )}

        {/* Quick Pune presets */}
        <View style={styles.presetsRow}>
          {[
            { name: 'Shivajinagar', lat: 18.5308, lng: 73.8475 },
            { name: 'Koregaon Park', lat: 18.5362, lng: 73.8940 },
            { name: 'Baner', lat: 18.5590, lng: 73.7868 },
            { name: 'Kothrud', lat: 18.5074, lng: 73.8077 },
          ].map((p) => (
            <TouchableOpacity
              key={p.name}
              onPress={() => setManualCoordinates(p.lat, p.lng)}
              style={styles.presetChip}
            >
              <Text style={styles.presetChipText}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Battery triage */}
        <View style={styles.batteryRow}>
          <Text style={styles.label}>Battery Reserve: {batteryPercent}%</Text>
          <View style={styles.batteryControls}>
            {[10, 18, 30].map((pct) => (
              <TouchableOpacity
                key={pct}
                onPress={() => setBatteryPercent(pct)}
                style={[
                  styles.batteryButton,
                  batteryPercent === pct && styles.batteryButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.batteryButtonText,
                    batteryPercent === pct && styles.batteryButtonTextActive,
                  ]}
                >
                  {pct}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Results Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Nearby Community Chargers ({data?.count || 0})
        </Text>
        {searching && <ActivityIndicator size="small" color="#10b981" />}
      </View>

      {searchError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{searchError}</Text>
        </View>
      )}

      {/* Chargers List */}
      {data?.results && data.results.length > 0 ? (
        data.results.map((c) => (
          <View key={c.id} style={styles.chargerCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.statusBadge,
                    c.availability_status === 'AVAILABLE' ? styles.badgeGreen : styles.badgeAmber,
                  ]}
                >
                  <Text style={styles.badgeText}>{c.availability_status}</Text>
                </View>
                <Text style={styles.localityText}>{c.locality}</Text>
              </View>

              <Text style={styles.priceText}>
                {c.pricing_model === 'FIXED_SESSION' ? `₹${c.session_price}` : `₹${c.price_per_kwh}/kWh`}
              </Text>
            </View>

            <Text style={styles.chargerTitle}>{c.title}</Text>
            <Text style={styles.specsText}>
              {c.max_power_kw} kW {c.charger_type} • {(c.connector_types || []).join(', ')}
            </Text>

            {/* Road route & reachability */}
            <View style={styles.reachabilityBox}>
              <Text style={styles.reachabilityText}>
                Road: ~{c.estimated_road_distance_km} km ({c.estimated_duration_minutes} min) • Reachability:{' '}
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: c.reachability_status === 'REACHABLE' ? '#10b981' : '#f59e0b',
                  }}
                >
                  {c.reachability_status}
                </Text>
              </Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => {
                  const lat = typeof c.latitude === 'string' ? parseFloat(c.latitude) : c.latitude;
                  const lng = typeof c.longitude === 'string' ? parseFloat(c.longitude) : c.longitude;
                  openMapsNavigation(lat, lng);
                }}
                style={styles.navButton}
              >
                <Text style={styles.navButtonText}>🗺️ Navigate (Maps)</Text>
              </TouchableOpacity>

              {onSelectCharger && (
                <TouchableOpacity
                  onPress={() => onSelectCharger(c)}
                  style={styles.bookButton}
                >
                  <Text style={styles.bookButtonText}>Request Access</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      ) : (
        /* Empty Fallback Screen (Section 10 Fallback) */
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No Private Chargers in {radiusKm} km</Text>
          <Text style={styles.emptyDesc}>
            {data?.fallback_info?.advisory || 'See public commercial DC fast hubs below or call assistance.'}
          </Text>

          <TouchableOpacity
            onPress={() => setRadiusKm((prev) => Math.min(25, prev + 5))}
            style={styles.expandButton}
          >
            <Text style={styles.expandButtonText}>Expand Radius to {radiusKm + 5} km</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Public Hubs Fallback Section */}
      {data?.alternatives && data.alternatives.length > 0 && (
        <View style={styles.publicSection}>
          <Text style={styles.publicTitle}>Public DC Fast Hubs (Pune)</Text>
          {data.alternatives.map((hub) => (
            <View key={hub.id} style={styles.hubCard}>
              <View style={styles.cardTopRow}>
                <Text style={styles.hubName}>{hub.name}</Text>
                <Text style={styles.hubPrice}>{hub.pricing}</Text>
              </View>
              <Text style={styles.hubSpecs}>{hub.locality} • {hub.max_power_kw} kW {hub.charger_type}</Text>
              <TouchableOpacity
                onPress={() => openMapsNavigation(hub.latitude, hub.longitude)}
                style={styles.hubNavButton}
              >
                <Text style={styles.hubNavText}>Open in Google Maps (~{hub.estimated_road_distance_km || Math.round((hub.distance_km || 0) * 1.35)} km)</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Emergency Roadside Assistance Footer Card */}
      <View style={styles.sosCard}>
        <Text style={styles.sosTitle}>🚨 24/7 Roadside EV Helpline (India)</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('tel:18002097979')}
          style={styles.sosButton}
        >
          <Text style={styles.sosButtonText}>Call 1800-209-7979 (Toll Free)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  gpsButton: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#e2e8f0', borderRadius: 8 },
  gpsButtonText: { fontSize: 11, fontWeight: '600', color: '#334155' },
  coordsText: { fontSize: 13, color: '#64748b', marginTop: 4, fontFamily: 'monospace' },
  warningText: { fontSize: 11, color: '#d97706', marginTop: 4 },
  presetsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  presetChip: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#f1f5f9', borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0' },
  presetChipText: { fontSize: 11, color: '#334155', fontWeight: '500' },
  batteryRow: { marginTop: 12, borderTopWidth: 1, borderColor: '#f1f5f9', paddingTop: 10 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155' },
  batteryControls: { flexDirection: 'row', gap: 8, marginTop: 6 },
  batteryButton: { flex: 1, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center' },
  batteryButtonActive: { backgroundColor: '#dcfce7', borderColor: '#10b981' },
  batteryButtonText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  batteryButtonTextActive: { color: '#047857' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  errorBox: { backgroundColor: '#ffe4e6', padding: 12, borderRadius: 12, marginBottom: 12 },
  errorText: { color: '#be123c', fontSize: 12 },
  chargerCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusBadge: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6 },
  badgeGreen: { backgroundColor: '#dcfce7' },
  badgeAmber: { backgroundColor: '#fef3c7' },
  badgeText: { fontSize: 9, fontWeight: 'bold', color: '#0f172a' },
  localityText: { fontSize: 12, color: '#64748b' },
  priceText: { fontSize: 14, fontWeight: 'bold', color: '#059669' },
  chargerTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginTop: 4 },
  specsText: { fontSize: 12, color: '#475569', marginTop: 2 },
  reachabilityBox: { backgroundColor: '#f1f5f9', padding: 8, borderRadius: 8, marginTop: 8 },
  reachabilityText: { fontSize: 11, color: '#334155' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  navButton: { flex: 1, backgroundColor: '#e2e8f0', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  navButtonText: { fontSize: 12, fontWeight: 'bold', color: '#1e293b' },
  bookButton: { flex: 1, backgroundColor: '#10b981', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  bookButtonText: { fontSize: 12, fontWeight: 'bold', color: '#022c22' },
  emptyBox: { backgroundColor: '#fffbeb', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#92400e' },
  emptyDesc: { fontSize: 12, color: '#78350f', textAlign: 'center', marginTop: 4, marginBottom: 12 },
  expandButton: { backgroundColor: '#d97706', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  expandButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  publicSection: { marginTop: 8 },
  publicTitle: { fontSize: 14, fontWeight: 'bold', color: '#0891b2', marginBottom: 8 },
  hubCard: { backgroundColor: '#ecfeff', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#cffafe' },
  hubName: { fontSize: 13, fontWeight: 'bold', color: '#155e75' },
  hubPrice: { fontSize: 12, fontWeight: 'bold', color: '#0e7490' },
  hubSpecs: { fontSize: 11, color: '#164e63', marginTop: 2 },
  hubNavButton: { marginTop: 8, backgroundColor: '#0891b2', paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  hubNavText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  sosCard: { backgroundColor: '#fff1f2', padding: 16, borderRadius: 16, marginTop: 12, alignItems: 'center', borderWidth: 1, borderColor: '#fecdd3' },
  sosTitle: { fontSize: 13, fontWeight: 'bold', color: '#be123c', marginBottom: 8 },
  sosButton: { backgroundColor: '#e11d48', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  sosButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 }
});
