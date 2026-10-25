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
      <div className="max-w-6xl mx-auto py-6 space-y-8">
        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="emerald" pulse>HOST CONSOLE</Badge>
              <span className="text-xs text-slate-400 font-semibold">Pune Community Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
              <span className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
                <Zap className="w-5 h-5 fill-current" />
              </span>
              <span>Host Management Console</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Control live station availability, update session rates, and oversee verified private charging equipment.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              to="/host/bookings"
              className="px-4 py-2.5 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition shadow-sm flex items-center space-x-1.5"
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Incoming Requests</span>
            </Link>

            <Link
              to="/host/chargers/new"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Charger</span>
            </Link>
          </div>
        </div>

        {/* Host Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Listed Equipment</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{chargers.length}</div>
            <div className="text-[11px] text-slate-500">
              <span className="text-emerald-600 font-bold">{availableCount} online</span> accepting drivers
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Pilot Dispatch Rate</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">₹150 - ₹180</div>
            <div className="text-[11px] text-slate-500">Avg. standard session in Pune</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Host Protection</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">Protected</div>
            <div className="text-[11px] text-slate-500">Address encrypted until request accept</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Roadside Backup</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">24/7 Live</div>
            <div className="text-[11px] text-slate-500">1800-209-7979 Emergency Towing</div>
          </div>
        </div>

        {/* Listings Section */}
        {loading ? (
          <DashboardCardSkeleton />
        ) : chargers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">No Charger Listings Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Own an EV Wallbox, 15A socket, or commercial parking socket in Pune? List it to assist low-battery EV drivers
              and earn recurring session payouts.
            </p>
            <Link
              to="/host/chargers/new"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Listing</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white">Your Equipment Listings ({chargers.length})</h2>
              <span className="text-xs text-slate-400">Click toggle to change live discovery status</span>
            </div>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chargers.map((ch) => (
                <StaggerItem key={ch.id}>
                  <HoverLift>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 transition hover:border-slate-300">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                ch.verification_status === 'APPROVED'
                                  ? 'emerald'
                                  : ch.verification_status === 'PENDING'
                                  ? 'amber'
                                  : 'rose'
                              }
                            >
                              {ch.verification_status}
                            </Badge>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {ch.parking_access.replace('_', ' ')}
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900 leading-snug">{ch.title}</h3>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-extrabold text-base text-emerald-600">
                            {ch.pricing_model === 'FIXED_SESSION'
                              ? `₹${ch.session_price} / sess`
                              : `₹${ch.price_per_kwh} / kWh`}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {ch.max_power_kw} kW {ch.charger_type}
                          </div>
                        </div>
                      </div>

                      {/* Location & Connector Details */}
                      <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                          <span><strong>Public Zone:</strong> {ch.locality}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 pl-5">
                          <strong>Private Address:</strong> {ch.exact_address || 'Encrypted until dispatch'}
                        </div>
                        <div className="text-[11px] text-slate-500 pl-5">
                          <strong>Connectors:</strong> {(ch.connector_types || []).join(', ')}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(ch)}
                          disabled={updatingId === ch.id}
                          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition active:scale-[0.98] ${
                            ch.availability_status === 'AVAILABLE'
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          }`}
                        >
                          <Power className={`w-3.5 h-3.5 ${updatingId === ch.id ? 'animate-spin' : ''}`} />
                          <span>
                            {updatingId === ch.id
                              ? 'Updating...'
                              : ch.availability_status === 'AVAILABLE'
                              ? 'Online (Available)'
                              : 'Offline (Paused)'}
                          </span>
                        </button>

                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/chargers/${ch.id}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                            title="Preview public listing"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/host/chargers/${ch.id}/edit`}
                            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Listing</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </HoverLift>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
