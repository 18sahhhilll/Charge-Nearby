import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { FindChargersPage } from './pages/FindChargersPage';
import { ChargerDetailPage } from './pages/ChargerDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VehicleOnboardingPage } from './pages/VehicleOnboardingPage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { HostChargerFormPage } from './pages/HostChargerFormPage';
import { HostBookingsPage } from './pages/HostBookingsPage';
import { DriverBookingsPage } from './pages/DriverBookingsPage';
import { BookingDetailPage } from './pages/BookingDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { HelpPage } from './pages/HelpPage';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/find" element={<FindChargersPage />} />
              <Route path="/chargers/:id" element={<ChargerDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onboarding/vehicle" element={<VehicleOnboardingPage />} />
              
              {/* Host Routes */}
              <Route path="/host/dashboard" element={<HostDashboardPage />} />
              <Route path="/host/chargers/new" element={<HostChargerFormPage />} />
              <Route path="/host/chargers/:id/edit" element={<HostChargerFormPage />} />
              <Route path="/host/bookings" element={<HostBookingsPage />} />

              {/* Driver Routes */}
              <Route path="/driver/bookings" element={<DriverBookingsPage />} />
              <Route path="/driver/bookings/:id" element={<BookingDetailPage />} />

              {/* Account & Help */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/help" element={<HelpPage />} />

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
