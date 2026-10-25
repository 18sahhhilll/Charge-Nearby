import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Zap,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  ChevronLeft,
  Navigation,
  ExternalLink,
  Lock,
  Unlock,
  Battery
} from 'lucide-react';
import { bookingService } from '../services';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/motion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { NotFoundState } from '../components/common/NotFoundState';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Charging telemetry inputs
  const [startBattery, setStartBattery] = useState('15');
  const [endBattery, setEndBattery] = useState('80');
  const [deliveredKwh, setDeliveredKwh] = useState('18.5');

  useEffect(() => {
    if (id) {
      loadBooking(id);
    }
  }, [id]);

  const loadBooking = async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.get(bookingId);
      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionFn: () => Promise<any>) => {
    setActionLoading(true);
    try {
      await actionFn();
      if (id) loadBooking(id);
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-[#8DA39B] text-sm animate-pulse">
        Loading emergency dispatch HUD...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <PageTransition>
        <NotFoundState
          title="Booking Not Found"
          description={error || "This charging session request does not exist or you don't have permission to access it."}
          code="EV 404"
          showRadar={false}
          primaryAction={{ label: 'Back to my bookings', to: user?.role === 'HOST' ? '/host/bookings' : '/driver/bookings' }}
          secondaryAction={{ label: 'Find a charger', to: '/find' }}
        />
      </PageTransition>
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
    <PageTransition>
      <div className="max-w-4xl mx-auto py-6 space-y-6 text-[#E8F1EE]">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to={isDriver ? '/driver/bookings' : '/host/bookings'}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#8DA39B] hover:text-[#E8F1EE] transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to {isDriver ? 'Driver Sessions' : 'Host Requests'}</span>
          </Link>
          <span className="text-xs text-[#8DA39B] font-mono">Session #{booking.id.slice(0, 8)}</span>
        </div>

        {/* Main Session HUD Card */}
        <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2F2A] pb-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    booking.status === 'REQUESTED'
                      ? 'amber'
                      : booking.status === 'ACCEPTED'
                      ? 'emerald'
                      : booking.status === 'CHARGING'
                      ? 'blue'
                      : booking.status === 'COMPLETED'
                      ? 'slate'
                      : 'rose'
                  }
                  pulse={booking.status === 'REQUESTED' || booking.status === 'CHARGING'}
                >
                  {booking.status}
                </Badge>
                <span className="text-xs text-[#8DA39B] font-semibold">{booking.booking_type} DISPATCH</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight">
                {booking.charger_title}
              </h1>
              <div className="flex items-center text-xs text-[#8DA39B] space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#22E58B]" />
                <span>{booking.charger_locality}</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="font-extrabold text-3xl text-[#FFD60A]">₹{booking.quoted_amount}</span>
              <div className="text-[11px] text-[#8DA39B] font-medium">Agreed rate snapshot</div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-5 gap-2 text-center">
              {steps.map((st, i) => {
                const isPast = currentStepIndex >= i && booking.status !== 'CANCELLED' && booking.status !== 'DECLINED';
                const isCurrent = st.key === booking.status;
                return (
                  <div key={st.key} className="space-y-1.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        isCurrent
                          ? 'bg-[#22E58B] ring-4 ring-[#22E58B]/20'
                          : isPast
                          ? 'bg-[#34D399]'
                          : 'bg-[#1E2F2A]'
                      }`}
                    />
                    <span
                      className={`text-[10px] sm:text-xs font-bold block leading-tight ${
                        isCurrent ? 'text-[#22E58B]' : isPast ? 'text-[#C5D5CF]' : 'text-[#8DA39B]'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {booking.status === 'CANCELLED' && (
              <div className="p-4 bg-[rgba(255,90,95,0.12)] border border-[rgba(255,90,95,0.3)] rounded-2xl text-xs text-[#FF5A5F] font-bold text-center">
                This charging request was cancelled: {booking.cancellation_reason || 'Cancelled by user.'}
              </div>
            )}
            {booking.status === 'DECLINED' && (
              <div className="p-4 bg-[rgba(255,90,95,0.12)] border border-[rgba(255,90,95,0.3)] rounded-2xl text-xs text-[#FF5A5F] font-bold text-center">
                Host was unable to accept this request: {booking.cancellation_reason || 'Host unavailable.'}
              </div>
            )}
          </div>

          {/* Unlocked Host Address & Instructions */}
          <div className="bg-[#16241F] border border-[#1E2F2A] rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-extrabold">
              {isUnlocked ? (
                <>
                  <Unlock className="w-4 h-4 text-[#22E58B]" />
                  <span className="text-[#34D399]">Private Host Access Information (Unlocked)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#8DA39B]" />
                  <span className="text-[#8DA39B]">Address Protected (Unlocks as soon as host accepts)</span>
                </>
              )}
            </div>

            {isUnlocked ? (
              <div className="space-y-3.5 text-xs text-[#C5D5CF]">
                <div>
                  <span className="text-[#8DA39B] block text-[11px] font-semibold">Exact Residential Street Address:</span>
                  <span className="font-extrabold text-[#E8F1EE] text-base">{booking.exact_address}</span>
                </div>

                {booking.access_instructions && (
                  <div>
                    <span className="text-[#8DA39B] block text-[11px] font-semibold">Gate & Security Instructions:</span>
                    <div className="bg-[#111C19] p-4 rounded-2xl border border-[#1E2F2A] text-[#E8F1EE] font-medium mt-1 shadow-xs">
                      {booking.access_instructions}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#1E2F2A]">
                  <div className="flex items-center space-x-3">
                    <span className="text-[#8DA39B] text-xs">Host: <strong className="text-[#E8F1EE]">{booking.host_name}</strong></span>
                    {booking.host_phone && (
                      <a
                        href={`tel:${booking.host_phone}`}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#111C19] hover:bg-[#1E2F2A] text-[#22E58B] border border-[#1E2F2A] rounded-lg font-bold text-xs transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call {booking.host_phone}</span>
                      </a>
                    )}
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booking.exact_address || booking.charger_locality)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-[#22E58B] hover:underline font-extrabold text-xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate in Google Maps</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#8DA39B] leading-relaxed">
                The exact residential bungalow number, parking bay clearance, and gate instructions will automatically appear here as soon
                as the host confirms and accepts your emergency request.
              </p>
            )}
          </div>

          {/* Session Record Telemetry */}
          {booking.session && (
            <div className="bg-[#16241F] border border-[#1E2F2A] rounded-3xl p-5 text-xs text-[#C5D5CF] space-y-3">
              <span className="font-extrabold text-[#E8F1EE] text-sm block">Session Telemetry Record</span>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#111C19] p-3 rounded-2xl border border-[#1E2F2A]">
                  <span className="text-[#8DA39B] text-[11px] block">Energy Delivered</span>
                  <span className="font-extrabold text-base text-[#E8F1EE]">{booking.session.energy_delivered_kwh || 'N/A'} kWh</span>
                </div>
                <div className="bg-[#111C19] p-3 rounded-2xl border border-[#1E2F2A]">
                  <span className="text-[#8DA39B] text-[11px] block">Start Battery</span>
                  <span className="font-extrabold text-base text-[#E8F1EE]">{booking.session.start_battery_percent != null ? `${booking.session.start_battery_percent}%` : 'N/A'}</span>
                </div>
                <div className="bg-[#111C19] p-3 rounded-2xl border border-[#1E2F2A]">
                  <span className="text-[#8DA39B] text-[11px] block">End Battery</span>
                  <span className="font-extrabold text-base text-[#34D399]">{booking.session.end_battery_percent != null ? `${booking.session.end_battery_percent}%` : 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Lifecycle Action Buttons */}
          <div className="pt-2 space-y-4">
            {booking.status === 'ACCEPTED' && isDriver && (
              <button
                type="button"
                onClick={() => handleAction(() => bookingService.arrive(booking.id))}
                disabled={actionLoading}
                className="w-full py-4 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold rounded-2xl text-sm transition shadow-lg shadow-[#22E58B]/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>{actionLoading ? 'Updating Status...' : 'I Have Arrived at Host Gate'}</span>
              </button>
            )}

            {booking.status === 'ARRIVED' && (
              <div className="p-5 bg-[#16241F] border border-[#1E2F2A] rounded-3xl space-y-4">
                <div>
                  <h3 className="font-extrabold text-[#E8F1EE] text-sm">Start Charging Session</h3>
                  <p className="text-xs text-[#8DA39B]">Confirm starting vehicle battery level to begin recording.</p>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-xs font-bold text-[#C5D5CF]">Starting Battery SOC (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={startBattery}
                    onChange={(e) => setStartBattery(e.target.value)}
                    className="w-24 px-3 py-2 text-xs border border-[#1E2F2A] rounded-xl text-[#E8F1EE] font-bold bg-[#111C19] focus:outline-none focus:border-[#22E58B]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleAction(() => bookingService.startSession(booking.id, { start_battery_percent: parseInt(startBattery) }))}
                  disabled={actionLoading}
                  className="w-full py-4 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold rounded-2xl text-sm transition shadow-lg shadow-[#22E58B]/20 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{actionLoading ? 'Connecting...' : 'Cable Plugged In - Start Charging Session'}</span>
                </button>
              </div>
            )}

            {booking.status === 'CHARGING' && (
              <div className="p-5 bg-[#16241F] border border-[#1E2F2A] rounded-3xl space-y-4">
                <div>
                  <h3 className="font-extrabold text-[#E8F1EE] text-sm">Complete Charging Session</h3>
                  <p className="text-xs text-[#8DA39B]">Record final energy delivered to complete payout and unlock gate clearance.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-[#C5D5CF] block mb-1">Energy Delivered (kWh):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={deliveredKwh}
                      onChange={(e) => setDeliveredKwh(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1E2F2A] rounded-xl font-bold bg-[#111C19] text-[#E8F1EE] focus:outline-none focus:border-[#22E58B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#C5D5CF] block mb-1">Final Battery SOC (%):</label>
                    <input
                      type="number"
                      value={endBattery}
                      onChange={(e) => setEndBattery(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1E2F2A] rounded-xl font-bold bg-[#111C19] text-[#E8F1EE] focus:outline-none focus:border-[#22E58B]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAction(() => bookingService.completeSession(booking.id, {
                    energy_delivered_kwh: parseFloat(deliveredKwh),
                    end_battery_percent: parseInt(endBattery)
                  }))}
                  disabled={actionLoading}
                  className="w-full py-4 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold rounded-2xl text-sm transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{actionLoading ? 'Finalizing Receipt...' : 'Complete Session & Unplug Cable'}</span>
                </button>
              </div>
            )}

            {['REQUESTED', 'ACCEPTED', 'ARRIVED'].includes(booking.status) && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const reason = prompt('Cancellation reason:');
                    if (reason !== null) {
                      handleAction(() => bookingService.cancel(booking.id, reason));
                    }
                  }}
                  className="text-xs text-[#FF5A5F] hover:underline font-bold cursor-pointer"
                >
                  Cancel Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
