import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Clock,
  ChevronRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  BatteryCharging,
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { bookingService } from '../services';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { PageTransition, Stagger, StaggerItem, HoverLift } from '../components/motion';
import { BookingCardSkeleton } from '../components/common/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const DriverBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/driver/bookings');
      return;
    }
    loadDriverBookings();
  }, [isAuthenticated, navigate]);

  const loadDriverBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.list(false);
      setBookings(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const activeBooking = bookings.find((b) =>
    ['REQUESTED', 'ACCEPTED', 'ARRIVED', 'CHARGING'].includes(b.status)
  );

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ACTIVE') return ['REQUESTED', 'ACCEPTED', 'ARRIVED', 'CHARGING'].includes(b.status);
    if (filter === 'COMPLETED') return ['COMPLETED', 'DECLINED', 'CANCELLED'].includes(b.status);
    return true;
  });

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="emerald" pulse>DRIVER CONSOLE</Badge>
              <span className="text-xs text-slate-400 font-semibold">Pune EV Mesh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
              <span className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
                <Car className="w-5 h-5" />
              </span>
              <span>My Charging Sessions & History</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Track active emergency requests in real time and review completed sessions across Pune.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/find"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Find Nearby Chargers</span>
            </Link>
          </div>
        </div>

        {/* Active Emergency Session Spotlight */}
        {activeBooking && (
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="emerald" pulse>LIVE SESSION ACTIVE</Badge>
                  <span className="text-xs text-slate-400">Step in progress: <strong className="text-white">{activeBooking.status}</strong></span>
                </div>
                <h3 className="text-xl font-extrabold text-white">{activeBooking.charger_title}</h3>
                <p className="text-xs text-slate-400 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                  {activeBooking.charger_locality}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-emerald-400">₹{activeBooking.quoted_amount}</span>
                  <div className="text-[10px] text-slate-400">Agreed rate snapshot</div>
                </div>

                <Link
                  to={`/driver/bookings/${activeBooking.id}`}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  <span>Open Session HUD</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-1 border-b border-slate-800 pb-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              filter === 'ALL'
                ? 'bg-slate-800 text-white font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            All Sessions ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              filter === 'ACTIVE'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Active In-Flight
          </button>
          <button
            type="button"
            onClick={() => setFilter('COMPLETED')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              filter === 'COMPLETED'
                ? 'bg-slate-800 text-white font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            History & Receipts
          </button>
        </div>

        {/* Bookings List Area */}
        {loading ? (
          <div className="space-y-4">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Zap className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No Sessions Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              When you request emergency access to a verified host charger, your session HUD and navigation links will appear here.
            </p>
            <Link
              to="/find"
              className="inline-block mt-2 py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
            >
              Search Nearby Chargers
            </Link>
          </div>
        ) : (
          <Stagger className="space-y-4">
            {filteredBookings.map((b) => (
              <StaggerItem key={b.id}>
                <HoverLift>
                  <Link
                    to={`/driver/bookings/${b.id}`}
                    className="block bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-emerald-400 hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              b.status === 'REQUESTED'
                                ? 'amber'
                                : b.status === 'ACCEPTED'
                                ? 'emerald'
                                : b.status === 'CHARGING'
                                ? 'blue'
                                : b.status === 'COMPLETED'
                                ? 'slate'
                                : 'rose'
                            }
                            pulse={b.status === 'REQUESTED' || b.status === 'CHARGING'}
                          >
                            {b.status}
                          </Badge>
                          <span className="text-xs font-bold text-slate-500">{b.booking_type} SESSION</span>
                          <span className="text-xs text-slate-400 font-mono">#{b.id.slice(0, 8)}</span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base">{b.charger_title}</h3>
                        <div className="flex items-center text-xs text-slate-500 space-x-2">
                          <span className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                            {b.charger_locality}
                          </span>
                          <span>•</span>
                          <span>Vehicle: {b.vehicle_details ? `${b.vehicle_details.make} ${b.vehicle_details.model}` : 'EV'}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="font-extrabold text-lg text-emerald-600">₹{b.quoted_amount}</span>
                          <div className="text-[10px] text-slate-400">Quoted rate</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </PageTransition>
  );
};
