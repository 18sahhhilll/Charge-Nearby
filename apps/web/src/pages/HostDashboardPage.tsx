import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Zap, ShieldCheck, Clock, AlertCircle, Edit3, Power, CheckCircle2 } from 'lucide-react';
import { chargerService } from '../services';
import { Charger } from '../types';
import { useAuth } from '../context/AuthContext';

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

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Zap className="w-6 h-6 text-emerald-500 fill-current" />
            <span>Host Management Dashboard</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your listed equipment, verify live availability status, and review incoming requests.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/host/bookings"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
          >
            Incoming Requests
          </Link>
          <Link
            to="/host/chargers/new"
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Charger</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500">
          <Zap className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-2" />
          <p className="text-sm">Loading your charger listings...</p>
        </div>
      ) : chargers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Charger Listings Yet</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Have an EV Wallbox, 15A socket, or commercial parking socket in Pune? List it to help low-battery drivers
            and earn per session.
          </p>
          <Link
            to="/host/chargers/new"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Listing</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chargers.map((ch) => (
            <div key={ch.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        ch.verification_status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ch.verification_status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ch.verification_status}
                    </span>
                    <span className="text-xs text-slate-400">• {ch.parking_access.replace('_', ' ')}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{ch.title}</h3>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-emerald-600">
                    {ch.pricing_model === 'FIXED_SESSION' ? `₹${ch.session_price}/sess` : `₹${ch.price_per_kwh}/kWh`}
                  </span>
                  <div className="text-[10px] text-slate-400">{ch.max_power_kw} kW {ch.charger_type}</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div><strong>Public Area:</strong> {ch.locality}</div>
                <div><strong>Exact Street:</strong> {ch.exact_address}</div>
                <div><strong>Connectors:</strong> {(ch.connector_types || []).join(', ')}</div>
              </div>

              {/* Status & Availability Quick Toggle */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleAvailability(ch)}
                    disabled={updatingId === ch.id}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      ch.availability_status === 'AVAILABLE'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{ch.availability_status === 'AVAILABLE' ? 'Online (Available)' : 'Offline (Unavailable)'}</span>
                  </button>
                </div>

                <Link
                  to={`/host/chargers/${ch.id}/edit`}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
