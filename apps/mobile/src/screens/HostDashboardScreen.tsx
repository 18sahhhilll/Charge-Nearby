import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { mobileApi } from '../services/api';
import { Booking } from '../types';

export const HostDashboardScreen: React.FC = () => {
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const list = await mobileApi.getBookings(true);
      setRequests(list);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (id: string) => {
    setActionLoadingId(id);
    try {
      await mobileApi.acceptBooking(id);
      Alert.alert('Accepted', 'Driver has been granted access. Your address is now visible to them.');
      loadRequests();
    } catch (err: any) {
      Alert.alert('Action Failed', err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Host Dashboard</Text>
        <Text style={styles.subtitle}>Review driver requests and manage equipment in Pune.</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 24 }} />
      ) : requests.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No Pending Requests</Text>
          <Text style={styles.emptySubtitle}>All incoming emergency charging requests have been handled.</Text>
        </View>
      ) : (
        requests.map((r) => (
          <View key={r.id} style={styles.requestCard}>
            <View style={styles.cardTop}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{r.status}</Text>
              </View>
              <Text style={styles.priceText}>₹{r.quoted_amount}</Text>
            </View>

            <Text style={styles.chargerTitle}>{r.charger_title}</Text>
            <Text style={styles.driverInfo}>Driver: {r.driver_name} {r.driver_phone ? `(${r.driver_phone})` : ''}</Text>

            {r.status === 'REQUESTED' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => handleAccept(r.id)}
                  disabled={actionLoadingId === r.id}
                  style={styles.acceptButton}
                >
                  <Text style={styles.acceptText}>Accept Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  emptyCard: { backgroundColor: '#ffffff', padding: 24, borderRadius: 16, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  emptySubtitle: { fontSize: 12, color: '#64748b', marginTop: 4, textAlign: 'center' },
  requestCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { backgroundColor: '#fef3c7', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#92400e' },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#059669' },
  chargerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginTop: 6 },
  driverInfo: { fontSize: 13, color: '#475569', marginTop: 2 },
  actionRow: { marginTop: 12 },
  acceptButton: { backgroundColor: '#10b981', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  acceptText: { color: '#022c22', fontWeight: 'bold', fontSize: 13 }
});
