import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { DriverEmergencySearchScreen } from './src/screens/DriverEmergencySearchScreen';
import { ActiveBookingScreen } from './src/screens/ActiveBookingScreen';
import { HostDashboardScreen } from './src/screens/HostDashboardScreen';

type Tab = 'search' | 'active' | 'host';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('search');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoTitle}>Charge<Text style={styles.logoHighlight}>Nearby</Text></Text>
          <View style={styles.pilotPill}>
            <Text style={styles.pilotText}>Pune Pilot</Text>
          </View>
        </View>
      </View>

      {/* Screen Body */}
      <View style={styles.body}>
        {activeTab === 'search' && <DriverEmergencySearchScreen />}
        {activeTab === 'active' && <ActiveBookingScreen />}
        {activeTab === 'host' && <HostDashboardScreen />}
      </View>

      {/* Bottom Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('search')}
          style={[styles.tabButton, activeTab === 'search' && styles.tabButtonActive]}
        >
          <Text style={styles.tabIcon}>⚡</Text>
          <Text style={[styles.tabLabel, activeTab === 'search' && styles.tabLabelActive]}>
            Emergency Search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('active')}
          style={[styles.tabButton, activeTab === 'active' && styles.tabButtonActive]}
        >
          <Text style={styles.tabIcon}>🚗</Text>
          <Text style={[styles.tabLabel, activeTab === 'active' && styles.tabLabelActive]}>
            Active Session
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('host')}
          style={[styles.tabButton, activeTab === 'host' && styles.tabButtonActive]}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={[styles.tabLabel, activeTab === 'host' && styles.tabLabelActive]}>
            Host Portal
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090d16' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#090d16',
    borderBottomWidth: 1,
    borderColor: '#1e293b',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoTitle: { fontSize: 20, fontWeight: '900', color: '#ffffff', letterSpacing: -0.5 },
  logoHighlight: { color: '#10b981' },
  pilotPill: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#047857',
  },
  pilotText: { color: '#6ee7b7', fontSize: 10, fontWeight: 'bold' },
  body: { flex: 1, backgroundColor: '#f8fafc' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#090d16',
    borderTopWidth: 1,
    borderColor: '#1e293b',
    paddingVertical: 6,
    paddingBottom: 8,
  },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  tabButtonActive: {},
  tabIcon: { fontSize: 18, marginBottom: 2 },
  tabLabel: { fontSize: 11, fontWeight: '600', color: '#64748b' },
  tabLabelActive: { color: '#10b981', fontWeight: 'bold' },
});
