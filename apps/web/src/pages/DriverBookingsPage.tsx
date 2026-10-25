import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Zap,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search
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
    loadBookings();
  }, [isAuthenticated, navigate]);

  const loadBookings = async () => {
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

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ACTIVE') return ['REQUESTED', 'ACCEPTED', 'ARRIVED', 'CHARGING'].includes(b.status);
    if (filter === 'COMPLETED') return ['COMPLETED', 'DECLINED', 'CANCELLED'].includes(b.status);
    return true;
  });

  const activeBooking = bookings.find((b) =>
    ['REQUESTED', 'ACCEPTED', 'ARRIVED', 'CHARGING'].includes(b.status)
  );

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto py-6 space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="blue">PUNE DRIVER HUD</Badge>
              <span className="text-xs text-[#8DA39B] font-semibold">Active Dispatch & History</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight flex items-center space-x-2.5">
              <span className="p-2 bg-[#22E58B] text-[#04130C] rounded-xl shadow-xs">
                <Clock className="w-5 h-5" />
              </span>
              <span>Your EV Emergency Bookings</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8DA39B]">
              Track ongoing host confirmations, navigate unlocked gates, and review past receipts.
            </p>
          </div>

          <Link
            to="/find"
            className="px-4 py-2.5 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold text-xs rounded-xl shadow-lg shadow-[#22E58B]/20 transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Search className="w-4 h-4" />
            <span>Find a Charger</span>
          </Link>
        </div>

        {/* Active Emergency Session Spotlight */}
        {activeBooking && (
          <div className="bg-[#111C19] border border-[#22E58B]/40 ws-online-glow text-[#E8F1EE] rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#22E58B]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="emerald" pulse>LIVE SESSION ACTIVE</Badge>
                  <span className="text-xs text-[#8DA39B]">Step in progress: <strong className="text-[#E8F1EE]">{activeBooking.status}</strong></span>
                </div>
                <h3 className="text-xl font-extrabold text-[#E8F1EE]">{activeBooking.charger_title}</h3>
                <p className="text-xs text-[#8DA39B] flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-[#22E58B] mr-1" />
                  {activeBooking.charger_locality}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-[#FFD60A]">₹{activeBooking.quoted_amount}</span>
                  <div className="text-[10px] text-[#8DA39B]">Agreed rate snapshot</div>
                </div>

                <Link
                  to={`/driver/bookings/${activeBooking.id}`}
                  className="px-5 py-3 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  <span>Open Session HUD</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-1 border-b border-[#1E2F2A] pb-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-bold border border-[rgba(34,229,139,0.3)]'
                : 'text-[#8DA39B] hover:text-[#E8F1EE] hover:bg-[#16241F]'
            }`}
          >
            All Sessions ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'ACTIVE'
                ? 'bg-[rgba(34,229,139,0.15)] text-[#22E58B] font-bold border border-[rgba(34,229,139,0.3)]'
                : 'text-[#8DA39B] hover:text-[#E8F1EE] hover:bg-[#16241F]'
            }`}
          >
            Active In-Flight
          </button>
          <button
            type="button"
            onClick={() => setFilter('COMPLETED')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'COMPLETED'
                ? 'bg-[#16241F] text-[#E8F1EE] font-bold border border-[#1E2F2A]'
                : 'text-[#8DA39B] hover:text-[#E8F1EE] hover:bg-[#16241F]'
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
          <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-12 text-center text-[#8DA39B] space-y-3 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 bg-[rgba(34,229,139,0.12)] rounded-2xl flex items-center justify-center mx-auto text-[#22E58B]">
              <Zap className="w-8 h-8 text-[#22E58B]" />
            </div>
            <h3 className="font-extrabold text-[#E8F1EE] text-base">No Sessions Found</h3>
            <p className="text-xs text-[#8DA39B] max-w-sm mx-auto leading-relaxed">
              When you request emergency access to a verified host charger, your session HUD and navigation links will appear here.
            </p>
            <Link
              to="/find"
              className="inline-block mt-2 py-2.5 px-5 bg-[#22E58B] hover:bg-[#1BC878] text-[#04130C] font-extrabold rounded-xl text-xs transition"
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
                    className="block bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-6 shadow-sm hover:border-[#22E58B]/40 transition"
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
                          <span className="text-xs font-bold text-[#8DA39B]">{b.booking_type} SESSION</span>
                          <span className="text-xs text-[#8DA39B] font-mono">#{b.id.slice(0, 8)}</span>
                        </div>
                        <h3 className="font-extrabold text-[#E8F1EE] text-base">{b.charger_title}</h3>
                        <div className="flex items-center text-xs text-[#8DA39B] space-x-2">
                          <span className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 text-[#8DA39B] mr-1" />
                            {b.charger_locality}
                          </span>
                          <span>•</span>
                          <span>Vehicle: {b.vehicle_details ? `${b.vehicle_details.make} ${b.vehicle_details.model}` : 'EV'}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="font-extrabold text-lg text-[#FFD60A]">₹{b.quoted_amount}</span>
                          <div className="text-[10px] text-[#8DA39B]">Quoted rate</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#16241F] flex items-center justify-center text-[#8DA39B] group-hover:text-[#22E58B]">
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
