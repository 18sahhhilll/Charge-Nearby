import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { mobileApi } from '../services/api';
import { Booking } from '../types';

export const ActiveBookingScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const list = await mobileApi.getBookings(false);
      setBookings(list);
      if (list.length > 0) {
        setActiveBooking(list[0]);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleArrive = async () => {
    if (!activeBooking) return;
    setActionLoading(true);
    try {
      const updated = await mobileApi.markArrive(activeBooking.id);
      setActiveBooking(updated);
      Alert.alert('Arrival Confirmed', 'You have marked your arrival at the host location.');
    } catch (err: any) {
      Alert.alert('Action Failed', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartSession = async () => {
    if (!activeBooking) return;
    setActionLoading(true);
    try {
      const updated = await mobileApi.startSession(activeBooking.id, 18);
      setActiveBooking(updated);
      Alert.alert('Charging Active', 'Charging session is now running.');
    } catch (err: any) {
      Alert.alert('Action Failed', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!activeBooking) return;
    setActionLoading(true);
    try {
      const updated = await mobileApi.completeSession(activeBooking.id, 10.5, 45);
      setActiveBooking(updated);
      Alert.alert('Session Complete', 'Session recorded successfully.');
    } catch (err: any) {
      Alert.alert('Action Failed', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading active sessions...</Text>
      </View>
    );
  }

  if (!activeBooking) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No Active Bookings</Text>
        <Text style={styles.emptySubtitle}>
          When you request emergency access to a charger, your active session and gate instructions will appear here.
        </Text>
      </View>
    );
  }

  const isUnlocked = ['ACCEPTED', 'ARRIVED', 'CHARGING', 'COMPLETED'].includes(activeBooking.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{activeBooking.status}</Text>
          </View>
          <Text style={styles.priceText}>₹{activeBooking.quoted_amount}</Text>
        </View>

        <Text style={styles.chargerTitle}>{activeBooking.charger_title}</Text>
        <Text style={styles.localityText}>{activeBooking.charger_locality}</Text>

        {/* Confidential Address Section */}
        <View style={styles.secretBox}>
          <Text style={styles.secretHeader}>
            {isUnlocked ? '🔓 Host Access Unlocked' : '🔒 Address Gated (Awaiting Host)'}
          </Text>

          {isUnlocked ? (
            <View style={styles.unlockedContent}>
              <Text style={styles.secretLabel}>Exact Street Address:</Text>
              <Text style={styles.addressText}>{activeBooking.exact_address}</Text>

              {activeBooking.access_instructions && (
                <>
                  <Text style={styles.secretLabel}>Gate Instructions:</Text>
                  <Text style={styles.instructionsText}>{activeBooking.access_instructions}</Text>
                </>
              )}

              {activeBooking.host_phone && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${activeBooking.host_phone}`)}
                  style={styles.phoneButton}
                >
                  <Text style={styles.phoneButtonText}>📞 Call Host: {activeBooking.host_phone}</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text style={styles.gatedText}>
              Host has received your request. The exact residential address will unlock immediately upon acceptance.
            </Text>
          )}
        </View>

        {/* Dynamic Action Buttons */}
        <View style={styles.actionsBox}>
          {activeBooking.status === 'ACCEPTED' && (
            <TouchableOpacity
              onPress={handleArrive}
              disabled={actionLoading}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>📍 I Have Arrived at Location</Text>
            </TouchableOpacity>
          )}

          {activeBooking.status === 'ARRIVED' && (
            <TouchableOpacity
              onPress={handleStartSession}
              disabled={actionLoading}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>⚡ Plug In & Start Charging</Text>
            </TouchableOpacity>
          )}

          {activeBooking.status === 'CHARGING' && (
            <TouchableOpacity
              onPress={handleCompleteSession}
              disabled={actionLoading}
              style={[styles.primaryButton, { backgroundColor: '#059669' }]}
            >
              <Text style={styles.primaryButtonText}>✅ Complete Session & Unplug</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 8, color: '#64748b', fontSize: 13 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  emptySubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 8 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, elevation: 2 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusBadge: { backgroundColor: '#dcfce7', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold', color: '#065f46' },
  priceText: { fontSize: 18, fontWeight: 'bold', color: '#059669' },
  chargerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  localityText: { fontSize: 13, color: '#64748b', marginTop: 2, marginBottom: 16 },
  secretBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  secretHeader: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  unlockedContent: { gap: 4 },
  secretLabel: { fontSize: 11, color: '#64748b', marginTop: 4 },
  addressText: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  instructionsText: { fontSize: 13, color: '#334155', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginTop: 2 },
  phoneButton: { marginTop: 10, backgroundColor: '#e2e8f0', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  phoneButtonText: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
  gatedText: { fontSize: 12, color: '#64748b', lineHeight: 18 },
  actionsBox: { marginTop: 8 },
  primaryButton: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { fontSize: 14, fontWeight: 'bold', color: '#022c22' }
});
