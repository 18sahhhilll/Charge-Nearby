import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AppShell } from './components/layout/AppShell';

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
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

const WorkspaceLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppShell>{children}</AppShell>;
};

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isAuthPage = isLoginPage || isRegisterPage;

  const isWorkspacePage =
    location.pathname.startsWith('/host/') ||
    location.pathname.startsWith('/driver/') ||
    location.pathname === '/profile' ||
    location.pathname === '/onboarding/vehicle';

  const showGlobalHeader = !isAuthPage && !isWorkspacePage;
  const showGlobalFooter = !isAuthPage && !isWorkspacePage;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--pub-canvas)] text-[var(--pub-text)] selection:bg-[var(--brand)]/20 selection:text-emerald-950">
      <ScrollToTop />
      {showGlobalHeader && <Header />}
      <main
        className={`flex-1 w-full ${
          isHomePage || isAuthPage || isWorkspacePage
            ? ''
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'
        }`}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Discovery & Informational Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/find" element={<FindChargersPage />} />
            <Route path="/chargers/:id" element={<ChargerDetailPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Workspace Routes */}
            <Route
              path="/onboarding/vehicle"
              element={
                <WorkspaceLayout>
                  <VehicleOnboardingPage />
                </WorkspaceLayout>
              }
            />
            <Route
              path="/host/dashboard"
              element={
                <WorkspaceLayout>
                  <HostDashboardPage />
                </WorkspaceLayout>
              }
            />
            <Route
              path="/host/chargers/new"
              element={
                <WorkspaceLayout>
                  <HostChargerFormPage />
                </WorkspaceLayout>
              }
            />
            <Route
              path="/host/chargers/:id/edit"
              element={
                <WorkspaceLayout>
                  <HostChargerFormPage />
                </WorkspaceLayout>
              }
            />
            <Route
              path="/host/bookings"
              element={
                <WorkspaceLayout>
                  <HostBookingsPage />
                </WorkspaceLayout>
              }
            />
            <Route
              path="/driver/bookings"
              element={
                <WorkspaceLayout>
                  <DriverBookingsPage />
                </WorkspaceLayout>
              }
            />
            <Route
              path="/driver/bookings/:id"
              element={
                <WorkspaceLayout>
                  <BookingDetailPage />
                </WorkspaceLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <WorkspaceLayout>
                  <ProfilePage />
                </WorkspaceLayout>
              }
            />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      {showGlobalFooter && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </MotionConfig>
  );
}

export default App;
