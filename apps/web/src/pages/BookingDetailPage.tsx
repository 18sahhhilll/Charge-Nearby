import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  MapPin,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Navigation,
  AlertTriangle,
  Play,
  Check,
  ChevronLeft,
  Phone
} from 'lucide-react';
import { bookingService } from '../services';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Session start inputs
  const [startBattery, setStartBattery] = useState('18');
  // Session completion inputs
  const [deliveredKwh, setDeliveredKwh] = useState('9.5');
  const [endBattery, setEndBattery] = useState('42');

  const loadBooking = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.get(id);
      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/driver/bookings/' + id);
      return;
    }
    loadBooking();
  }, [id, isAuthenticated, navigate]);

  const handleAction = async (actionFn: () => Promise<any>) => {
    setActionLoading(true);
    setError(null);
    try {
      await actionFn();
      loadBooking();
    } catch (err: any) {
      setError(err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-500">Loading booking state...</div>;
  }

  if (error || !booking) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Booking Access Error</h2>
        <p className="text-xs text-slate-600">{error || 'Booking not found.'}</p>
        <Link to="/driver/bookings" className="text-xs font-bold text-emerald-600 underline">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const isDriver = user?.id === booking.driver;
  const isUnlocked = ['ACCEPTED', 'ARRIVED', 'CHARGING', 'COMPLETED'].includes(booking.status);

  const steps = [
    { key: 'REQUESTED', label: 'Requested' },
    { key: 'ACCEPTED', label: 'Accepted by Host' },
    { key: 'ARRIVED', label: 'Arrived at Gate' },
    { key: 'CHARGING', label: 'Session Active' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === booking.status);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Link
        to={isDriver ? '/driver/bookings' : '/host/bookings'}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Bookings</span>
      </Link>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs text-slate-400">Booking #{booking.id.slice(0, 8)}</div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-0.5">
              {booking.charger_title}
            </h1>
            <div className="text-xs text-slate-500 mt-1">{booking.charger_locality}</div>
          </div>

          <div className="text-left sm:text-right">
            <span className="font-extrabold text-2xl text-emerald-600">₹{booking.quoted_amount}</span>
            <div className="text-[10px] text-slate-400">Agreed price snapshot (INR)</div>
          </div>
        </div>

        {/* State Machine Stepper */}
        <div className="py-2">
          <div className="grid grid-cols-5 gap-1 text-center">
            {steps.map((st, i) => {
              const isPast = currentStepIndex >= i && booking.status !== 'CANCELLED' && booking.status !== 'DECLINED';
              const isCurrent = st.key === booking.status;
              return (
                <div key={st.key} className="space-y-1.5">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-emerald-500 ring-2 ring-emerald-500/30'
                        : isPast
                        ? 'bg-emerald-400'
                        : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold block leading-tight ${
                      isCurrent ? 'text-emerald-700 font-bold' : isPast ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>

          {booking.status === 'CANCELLED' && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold text-center">
              This booking was cancelled. Reason: {booking.cancellation_reason || 'Cancelled by participant.'}
            </div>
          )}
          {booking.status === 'DECLINED' && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold text-center">
              Host was unable to accept this request: {booking.cancellation_reason || 'Host unavailable.'}
            </div>
          )}
        </div>

        {/* Unlocked Private Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
            {isUnlocked ? (
              <>
                <Unlock className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800">Private Host Access Unlocked</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Private Details Gated (Awaiting Host Acceptance)</span>
              </>
            )}
          </div>

          {isUnlocked ? (
            <div className="space-y-2 text-xs text-slate-700 pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Exact Street Address:</span>
                <span className="font-bold text-slate-900 text-sm">{booking.exact_address}</span>
              </div>

              {booking.access_instructions && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Gate & Parking Access Instructions:</span>
                  <p className="bg-white p-3 rounded-xl border border-slate-200 text-slate-800 mt-0.5">
                    {booking.access_instructions}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 text-[11px]">Host Name: </span>
                  <span className="font-semibold text-slate-900">{booking.host_name}</span>
                </div>
                {booking.host_phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <a href={`tel:${booking.host_phone}`} className="font-semibold text-emerald-700 underline">
                      {booking.host_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed">
              The exact residential bungalow number and gate instructions will automatically appear here as soon
              as the host confirms and accepts your emergency request.
            </p>
          )}
        </div>

        {/* Session Telemetry (if Charging or Completed) */}
        {booking.session && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
            <span className="font-bold text-emerald-900 block">Session Performance Record</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-emerald-700 text-[11px] block">Energy Delivered</span>
                <span className="font-extrabold text-sm">{booking.session.energy_delivered_kwh || '—'} kWh</span>
              </div>
              <div>
                <span className="text-emerald-700 text-[11px] block">Start Battery</span>
                <span className="font-extrabold text-sm">{booking.session.start_battery_percent ?? '—'}%</span>
              </div>
              <div>
                <span className="text-emerald-700 text-[11px] block">End Battery</span>
                <span className="font-extrabold text-sm">{booking.session.end_battery_percent ?? '—'}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Lifecycle Action Buttons */}
        <div className="pt-2 space-y-3">
          {booking.status === 'ACCEPTED' && isDriver && (
            <button
              onClick={() => handleAction(() => bookingService.arrive(booking.id))}
              disabled={actionLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>I Have Arrived at Host Location</span>
            </button>
          )}

          {booking.status === 'ARRIVED' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <span className="font-bold text-slate-800 text-xs block">Start Charging Session</span>
              <div className="flex items-center space-x-2">
                <label className="text-xs text-slate-600">Starting Battery %:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={startBattery}
                  onChange={(e) => setStartBattery(e.target.value)}
                  className="w-20 px-2 py-1 text-xs border border-slate-300 rounded-lg text-slate-900 font-bold"
                />
              </div>
              <button
                onClick={() => handleAction(() => bookingService.startSession(booking.id, { start_battery_percent: parseInt(startBattery) }))}
                disabled={actionLoading}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Plugged In - Start Session</span>
              </button>
            </div>
          )}

          {booking.status === 'CHARGING' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <span className="font-bold text-slate-800 text-xs block">Complete Charging Session</span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-0.5">Energy Delivered (kWh):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={deliveredKwh}
                    onChange={(e) => setDeliveredKwh(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-0.5">Final Battery %:</label>
                  <input
                    type="number"
                    value={endBattery}
                    onChange={(e) => setEndBattery(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>
              <button
                onClick={() => handleAction(() => bookingService.completeSession(booking.id, {
                  energy_delivered_kwh: parseFloat(deliveredKwh),
                  end_battery_percent: parseInt(endBattery)
                }))}
                disabled={actionLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Complete Charging & Disconnect</span>
              </button>
            </div>
          )}

          {['REQUESTED', 'ACCEPTED', 'ARRIVED'].includes(booking.status) && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  const reason = prompt('Cancellation reason:');
                  if (reason !== null) {
                    handleAction(() => bookingService.cancel(booking.id, reason));
                  }
                }}
                className="text-xs text-rose-600 hover:underline"
              >
                Cancel Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
