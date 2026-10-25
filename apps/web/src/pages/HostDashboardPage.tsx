import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Zap,
  ShieldCheck,
  Clock,
  AlertCircle,
  Edit3,
  Power,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ExternalLink,
  Sliders,
  DollarSign
} from 'lucide-react';
import { chargerService } from '../services';
import { Charger } from '../types';
import { useAuth } from '../context/AuthContext';
import { PageTransition, Stagger, StaggerItem, HoverLift } from '../components/motion';
import { DashboardCardSkeleton } from '../components/common/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const HostDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/host/dashboard');
      return;
    }
    loadHostChargers();
  }, [isAuthenticated, navigate]);

  const loadHostChargers = async () => {
    setLoading(true);
    try {
      const data = await chargerService.getHostChargers();
      setChargers(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (charger: Charger) => {
    const nextStatus = charger.availability_status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    setUpdatingId(charger.id);
    try {
      await chargerService.updateAvailability(charger.id, nextStatus);
      loadHostChargers();
    } catch (err: any) {
      alert(err.message || 'Failed to update availability.');
    } finally {
      setUpdatingId(null);
    }
  };

  const availableCount = chargers.filter((c) => c.availability_status === 'AVAILABLE').length;

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto py-6 space-y-8 relative">
        {/* Ambient Glow behind Page Header only */}
        <div
          aria-hidden="true"
          className="absolute -top-10 left-1/4 w-96 h-64 bg-[#22E58B]/10 blur-3xl pointer-events-none"
        />

        {/* Dashboard Top Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="emerald" pulse>HOST CONSOLE</Badge>
              <span className="text-xs text-[#8DA39B] font-semibold">Pune Community Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight flex items-center space-x-2.5">
              <span className="p-2 bg-[#22E58B] text-[#04130C] rounded-xl shadow-xs">
                <Zap className="w-5 h-5 fill-current" />
              </span>
              <span>Host Management Console</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8DA39B]">
              Control live station availability, update session rates, and oversee verified private charging equipment.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* Secondary button: GHOST style with brand border */}
            <Link
              to="/host/bookings"
              className="px-4 py-2.5 bg-transparent border border-[rgba(34,229,139,0.4)] hover:bg-[rgba(34,229,139,0.12)] text-[#22E58B] active:scale-[0.98] text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
            >
              <Clock className="w-4 h-4 text-[#22E58B]" />
              <span>Incoming Requests</span>
            </Link>

            {/* Primary button: brand button */}
            <Link
              to="/host/chargers/new"
              className="px-4 py-2.5 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] text-xs font-extrabold rounded-xl shadow-lg shadow-[#22E58B]/20 transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Charger</span>
            </Link>
          </div>
        </div>

        {/* Host Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111C19] border border-[#1E2F2A] rounded-2xl p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8DA39B]">Total Listed Equipment</span>
              <div className="w-8 h-8 rounded-xl bg-[rgba(34,229,139,0.12)] text-[#22E58B] flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#E8F1EE]">{chargers.length}</div>
            <div className="text-[11px] text-[#8DA39B]">
              <span className="text-[#34D399] font-bold">{availableCount} online</span> accepting drivers
            </div>
          </div>

          <div className="bg-[#111C19] border border-[#1E2F2A] rounded-2xl p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8DA39B]">Pilot Dispatch Rate</span>
              <div className="w-8 h-8 rounded-xl bg-[rgba(34,229,139,0.12)] text-[#22E58B] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#E8F1EE]">₹150 - ₹180</div>
            <div className="text-[11px] text-[#8DA39B]">Avg. standard session in Pune</div>
          </div>

          <div className="bg-[#111C19] border border-[#1E2F2A] rounded-2xl p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8DA39B]">Host Protection</span>
              <div className="w-8 h-8 rounded-xl bg-[rgba(56,189,248,0.12)] text-[#38BDF8] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#E8F1EE]">Protected</div>
            <div className="text-[11px] text-[#8DA39B]">Address encrypted until request accept</div>
          </div>

          <div className="bg-[#111C19] border border-[#1E2F2A] rounded-2xl p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8DA39B]">Roadside Backup</span>
              <div className="w-8 h-8 rounded-xl bg-[rgba(255,90,95,0.12)] text-[#FF5A5F] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#E8F1EE]">24/7 Live</div>
            <div className="text-[11px] text-[#8DA39B]">
              <span className="text-[#FF5A5F] font-mono font-bold">1800-209-7979</span> Emergency Towing
            </div>
          </div>
        </div>

        {/* Listings Section */}
        {loading ? (
          <DashboardCardSkeleton />
        ) : chargers.length === 0 ? (
          <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-[rgba(34,229,139,0.12)] text-[#22E58B] rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#E8F1EE]">No Charger Listings Yet</h3>
            <p className="text-xs text-[#8DA39B] leading-relaxed max-w-sm mx-auto">
              Own an EV Wallbox, 15A socket, or commercial parking socket in Pune? List it to assist low-battery EV drivers
              and earn recurring session payouts.
            </p>
            <Link
              to="/host/chargers/new"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#22E58B] hover:bg-[#1BC878] text-[#04130C] font-extrabold rounded-2xl text-xs shadow-lg shadow-[#22E58B]/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Listing</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#E8F1EE]">Your Equipment Listings ({chargers.length})</h2>
              <span className="text-xs text-[#8DA39B]">Click toggle to change live discovery status</span>
            </div>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chargers.map((ch) => {
                const isOnline = ch.availability_status === 'AVAILABLE';
                return (
                  <StaggerItem key={ch.id}>
                    <HoverLift>
                      <div
                        className={`bg-[#111C19] border rounded-3xl p-6 shadow-sm space-y-4 transition ${
                          isOnline
                            ? 'border-[#22E58B]/40 ws-online-glow'
                            : 'border-[#1E2F2A] hover:border-[#1E2F2A]/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {/* Status Pill with pulsating dot for online */}
                              {isOnline ? (
                                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[rgba(52,211,153,0.3)]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                                  <span>Online</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(141,163,155,0.12)] text-[#8DA39B] border border-[#1E2F2A]">
                                  <span>Offline</span>
                                </span>
                              )}

                              {ch.verification_status === 'APPROVED' ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[rgba(52,211,153,0.3)]">
                                  <span>APPROVED</span>
                                </span>
                              ) : ch.verification_status === 'PENDING' ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(252,211,77,0.12)] text-[#FCD34D] border border-[rgba(252,211,77,0.3)]">
                                  <span>PENDING</span>
                                </span>
                              ) : null}

                              {/* Listing type tag (no fill, muted text) */}
                              <span className="text-[11px] font-semibold text-[#8DA39B] uppercase">
                                {ch.parking_access.replace('_', ' ')}
                              </span>
                            </div>
                            <h3 className="text-base font-extrabold text-[#E8F1EE] leading-snug">{ch.title}</h3>
                          </div>

                          {/* Price & Specs */}
                          <div className="text-right shrink-0">
                            <div className="font-extrabold text-base text-[#FFD60A]">
                              {ch.pricing_model === 'FIXED_SESSION'
                                ? `₹${ch.session_price} `
                                : `₹${ch.price_per_kwh} `}
                              <span className="text-xs font-normal text-[#8DA39B]">
                                {ch.pricing_model === 'FIXED_SESSION' ? '/ sess' : '/ kWh'}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#8DA39B] font-mono">
                              {ch.max_power_kw} kW {ch.charger_type}
                            </div>
                          </div>
                        </div>

                        {/* Nested Block: Location & Connector Chips */}
                        <div className="text-xs text-[#C5D5CF] space-y-2 bg-[#16241F] p-4 rounded-2xl border border-[#1E2F2A]">
                          <div className="flex items-center text-[#E8F1EE]">
                            <MapPin className="w-3.5 h-3.5 text-[#8DA39B] mr-1.5 shrink-0" />
                            <span><strong className="text-[#8DA39B]">Public Zone:</strong> {ch.locality}</span>
                          </div>
                          <div className="text-[11px] text-[#8DA39B] pl-5">
                            <strong className="text-[#C5D5CF]">Private Address:</strong> {ch.exact_address || 'Encrypted until dispatch'}
                          </div>
                          <div className="text-[11px] flex items-center flex-wrap gap-1.5 pl-5 pt-0.5">
                            <strong className="text-[#8DA39B] mr-1">Connectors:</strong>
                            {(ch.connector_types || []).map((conn) => (
                              <span
                                key={conn}
                                className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(56,189,248,0.12)] text-[#38BDF8] border border-[rgba(56,189,248,0.3)]"
                              >
                                {conn}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-3 border-t border-[#1E2F2A] flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(ch)}
                            disabled={updatingId === ch.id}
                            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition active:scale-[0.98] cursor-pointer ${
                              isOnline
                                ? 'bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[rgba(52,211,153,0.3)] hover:bg-[rgba(52,211,153,0.2)]'
                                : 'bg-[#16241F] text-[#8DA39B] border border-[#1E2F2A] hover:text-[#E8F1EE]'
                            }`}
                          >
                            <Power className={`w-3.5 h-3.5 ${updatingId === ch.id ? 'animate-spin' : ''}`} />
                            <span>
                              {updatingId === ch.id
                                ? 'Updating...'
                                : isOnline
                                ? 'Online (Available)'
                                : 'Offline (Paused)'}
                            </span>
                          </button>

                          <div className="flex items-center space-x-2">
                            {/* External link button: ghost style */}
                            <Link
                              to={`/chargers/${ch.id}`}
                              target="_blank"
                              className="p-2 text-[#8DA39B] hover:text-[#E8F1EE] rounded-xl border border-[#1E2F2A] hover:border-[rgba(34,229,139,0.3)] bg-transparent transition"
                              title="Preview public listing"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            {/* Edit Listing: ghost style */}
                            <Link
                              to={`/host/chargers/${ch.id}/edit`}
                              className="flex items-center space-x-1.5 px-3.5 py-2 bg-transparent hover:bg-[#16241F] border border-[#1E2F2A] hover:border-[rgba(34,229,139,0.3)] text-[#8DA39B] hover:text-[#E8F1EE] rounded-xl text-xs font-bold transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Listing</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </HoverLift>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
