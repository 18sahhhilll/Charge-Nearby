import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Car,
  Plus,
  ChevronRight,
  LogOut,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services';
import { Vehicle } from '../types';
import { PageTransition } from '../components/motion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
      return;
    }
    loadUserData();
  }, [isAuthenticated, navigate]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const v = await vehicleService.list();
      setVehicles(v);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isHost = user.role === 'HOST' || user.role === 'BOTH' || user.role === 'ADMIN';

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Badge variant="emerald">ACCOUNT CONSOLE</Badge>
            <span className="text-xs text-[#8DA39B] font-semibold">User Credentials & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight flex items-center space-x-2.5">
            <span className="p-2 bg-[#22E58B] text-[#04130C] rounded-xl shadow-xs">
              <User className="w-5 h-5" />
            </span>
            <span>Profile & Account Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8DA39B]">
            Manage your personal credentials, user roles, security preferences, and registered EV garage.
          </p>
        </div>

        {/* User Identity Card */}
        <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-[#E8F1EE]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-extrabold text-2xl flex items-center justify-center border border-[rgba(34,229,139,0.3)] shadow-md">
                {user.full_name?.charAt(0) || 'U'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-[#E8F1EE]">{user.full_name}</h2>
                  <Badge variant="emerald">{user.role}</Badge>
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#8DA39B] font-mono">
                  <span>ID: {user.id.slice(0, 12)}</span>
                  <span>•</span>
                  <span>Pune Pilot Member</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2.5 bg-[rgba(255,90,95,0.12)] hover:bg-[rgba(255,90,95,0.2)] text-[#FF5A5F] font-bold text-xs rounded-xl border border-[rgba(255,90,95,0.3)] active:scale-[0.98] transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#1E2F2A]">
            <div className="bg-[#16241F] p-4 rounded-2xl border border-[#1E2F2A] flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#111C19] border border-[#1E2F2A] flex items-center justify-center text-[#22E58B]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#8DA39B] block text-[11px] font-semibold">Registered Email</span>
                <span className="font-extrabold text-[#E8F1EE] text-sm">{user.email}</span>
              </div>
            </div>

            <div className="bg-[#16241F] p-4 rounded-2xl border border-[#1E2F2A] flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#111C19] border border-[#1E2F2A] flex items-center justify-center text-[#22E58B]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#8DA39B] block text-[11px] font-semibold">Mobile Number</span>
                <span className="font-extrabold text-[#E8F1EE] text-sm">{user.phone_number || '+91 Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Summary Card */}
        <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 text-[#E8F1EE]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-[#22E58B]" />
              <h3 className="font-extrabold text-base text-[#E8F1EE]">Your Vehicles Garage ({vehicles.length})</h3>
            </div>
            <Link
              to="/onboarding/vehicle"
              className="flex items-center space-x-1 text-xs font-extrabold text-[#22E58B] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Vehicles</span>
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="p-6 bg-[#16241F] border border-[#1E2F2A] rounded-2xl text-center space-y-2">
              <p className="text-xs text-[#8DA39B]">No vehicles registered yet.</p>
              <Link
                to="/onboarding/vehicle"
                className="inline-block px-4 py-2 bg-[#22E58B] text-[#04130C] font-extrabold rounded-xl text-xs"
              >
                Configure EV
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {vehicles.map((v) => (
                <div key={v.id} className="p-4 bg-[#16241F] border border-[#1E2F2A] rounded-2xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#E8F1EE] text-sm">{v.make} {v.model}</span>
                    <Badge variant="slate">{v.vehicle_type}</Badge>
                  </div>
                  <div className="text-[#8DA39B] text-[11px]">
                    Connectors: <strong className="text-[#C5D5CF]">{v.connector_types.join(', ')}</strong>
                  </div>
                  {v.battery_capacity_kwh && (
                    <div className="text-[#8DA39B] text-[11px]">
                      Battery: <strong className="text-[#C5D5CF]">{v.battery_capacity_kwh} kWh</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Host Quick Link if Host Role */}
        {isHost && (
          <div className="bg-[#111C19] text-[#E8F1EE] border border-[#1E2F2A] rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant="emerald">HOST SHORTCUT</Badge>
                <span className="text-xs text-[#8DA39B]">Hardware & Bookings</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#E8F1EE]">Go to Host Management Dashboard</h3>
              <p className="text-xs text-[#8DA39B] max-w-md">
                Monitor incoming driver requests, equipment availability status, and earnings per session.
              </p>
            </div>

            <Link
              to="/host/dashboard"
              className="px-5 py-3 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 self-start sm:self-auto shrink-0"
            >
              <span>Open Host Console</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Roadside Assistance Hotline */}
        <div className="bg-[#111C19] border border-[rgba(255,90,95,0.3)] rounded-3xl p-6 text-xs text-[#C5D5CF] flex items-start space-x-4">
          <div className="p-2.5 bg-[rgba(255,90,95,0.12)] text-[#FF5A5F] rounded-2xl shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-[#E8F1EE] text-sm">24/7 Pune EV Roadside Emergency Hotline</span>
            <p className="text-[#8DA39B] leading-relaxed text-xs">
              If your battery reaches 0% or your vehicle is immobilized, contact our Pune dispatch operator immediately at{' '}
              <a href="tel:18002097979" className="font-extrabold font-mono underline text-[#FF5A5F]">
                1800-209-7979
              </a>
              . Flatbed EV tow trucks and mobile 15A rescue vans are stationed across Pune zones.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
