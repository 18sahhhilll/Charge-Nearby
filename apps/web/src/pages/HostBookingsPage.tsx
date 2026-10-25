import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Phone,
  Battery,
  Check,
  X
} from 'lucide-react';
import { bookingService } from '../services';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { PageTransition, Stagger, StaggerItem, HoverLift } from '../components/motion';
import { BookingCardSkeleton } from '../components/common/Skeleton';
import { Badge } from '../components/ui/Badge';

export const HostBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'REQUESTED' | 'ACTIVE' | 'RESOLVED'>('ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/host/bookings');
      return;
    }
    loadRequests();
  }, [isAuthenticated, navigate]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await bookingService.list(true);
      setBookings(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    setActionLoadingId(id);
    try {
      await bookingService.accept(id);
      loadRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to accept booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    const reason = prompt('Please provide a reason for declining this request:', 'Charger currently occupied');
    if (reason === null) return;
    setActionLoadingId(id);
    try {
      await bookingService.decline(id, reason);
      loadRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to decline booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'REQUESTED') return b.status === 'REQUESTED';
    if (filter === 'ACTIVE') return ['ACCEPTED', 'ARRIVED', 'CHARGING'].includes(b.status);
    if (filter === 'RESOLVED') return ['COMPLETED', 'DECLINED', 'CANCELLED'].includes(b.status);
    return true;
  });

  const pendingCount = bookings.filter((b) => b.status === 'REQUESTED').length;

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant={pendingCount > 0 ? 'amber' : 'emerald'} pulse={pendingCount > 0}>
                {pendingCount > 0 ? `${pendingCount} Pending Emergency Action` : 'Queue Clear'}
              </Badge>
              <span className="text-xs text-[#8DA39B] font-semibold">Live Host Dispatch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight flex items-center space-x-2.5">
              <span className="p-2 bg-[#22E58B] text-[#04130C] rounded-xl shadow-xs">
                <Clock className="w-5 h-5" />
              </span>
              <span>Incoming Driver Booking Requests</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8DA39B]">
              Review and authorize EV charging requests from stranded drivers in Pune.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/host/dashboard"
              className="px-4 py-2 bg-transparent hover:bg-[#16241F] active:scale-[0.98] text-[#8DA39B] hover:text-[#E8F1EE] border border-[#1E2F2A] hover:border-[rgba(34,229,139,0.3)] text-xs font-bold rounded-xl transition shadow-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-1 border-b border-[#1E2F2A] pb-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-bold border border-[rgba(34,229,139,0.3)]'
                : 'text-[#8DA39B] hover:text-[#E8F1EE] hover:bg-[#16241F]'
            }`}
          >
            All Requests ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('REQUESTED')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'REQUESTED'
                ? 'bg-[rgba(252,211,77,0.15)] text-[#FCD34D] font-bold border border-[rgba(252,211,77,0.3)]'
                : 'text-[#8DA39B] hover:text-[#E8F1EE] hover:bg-[#16241F]'
            }`}
          >
            Needs Action ({pendingCount})
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
            Active Sessions
          </button>
          <button
            type="button"
            onClick={() => setFilter('RESOLVED')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'RESOLVED'
                ? 'bg-[#16241F] text-[#E8F1EE] font-bold border border-[#1E2F2A]'
                : 'text-[#8DA39B] hover:text-[#E8F1EE] hover:bg-[#16241F]'
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="space-y-4">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-12 text-center text-[#8DA39B] space-y-3 shadow-sm max-w-lg mx-auto">
            <div className="w-14 h-14 bg-[rgba(34,229,139,0.12)] rounded-2xl flex items-center justify-center mx-auto text-[#22E58B]">
              <CheckCircle2 className="w-8 h-8 text-[#22E58B]" />
            </div>
            <h3 className="font-extrabold text-[#E8F1EE] text-base">No Requests Found</h3>
            <p className="text-xs text-[#8DA39B] leading-relaxed max-w-sm mx-auto">
              There are no incoming charging requests matching the selected filter right now.
            </p>
          </div>
        ) : (
          <Stagger className="space-y-4">
            {filteredBookings.map((b) => (
              <StaggerItem key={b.id}>
                <HoverLift>
                  <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-6 shadow-sm space-y-4 transition hover:border-[#1E2F2A]/80">
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
                          <span className="text-xs font-bold text-[#8DA39B]">
                            {b.booking_type} REQUEST
                          </span>
                          <span className="text-xs text-[#8DA39B] font-mono">#{b.id.slice(0, 8)}</span>
                        </div>
                        <h3 className="font-extrabold text-[#E8F1EE] text-lg">{b.charger_title}</h3>
                        <p className="text-xs text-[#8DA39B]">{b.charger_locality}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="font-extrabold text-2xl text-[#FFD60A]">₹{b.quoted_amount}</span>
                        <div className="text-[10px] text-[#8DA39B] font-medium">Host payout snapshot</div>
                      </div>
                    </div>

                    {/* Driver & Vehicle Details Grid */}
                    <div className="bg-[#16241F] border border-[#1E2F2A] p-4 rounded-2xl text-xs text-[#C5D5CF] grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[#8DA39B] block text-[11px] font-semibold">Incoming Driver</span>
                        <span className="font-extrabold text-[#E8F1EE] text-sm block">{b.driver_name}</span>
                        {b.driver_phone && (
                          <div className="flex items-center space-x-1 text-[#8DA39B] font-mono text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-[#8DA39B]" />
                            <span>{b.driver_phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[#8DA39B] block text-[11px] font-semibold">Vehicle Profile</span>
                        <span className="font-extrabold text-[#E8F1EE] text-sm block">
                          {b.vehicle_details ? `${b.vehicle_details.make} ${b.vehicle_details.model}` : 'Electric Vehicle'}
                        </span>
                        {b.vehicle_details?.battery_capacity_kwh && (
                          <div className="flex items-center space-x-1 text-[#8DA39B] text-[11px]">
                            <Battery className="w-3.5 h-3.5 text-[#34D399]" />
                            <span>{b.vehicle_details.battery_capacity_kwh} kWh Pack</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar for Pending Requests */}
                    {b.status === 'REQUESTED' && (
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleAccept(b.id)}
                          disabled={actionLoadingId === b.id}
                          className="w-full sm:flex-1 py-3 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold rounded-2xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-[#22E58B]/20 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>{actionLoadingId === b.id ? 'Accepting...' : 'Accept Emergency Request & Unlock Address'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDecline(b.id)}
                          disabled={actionLoadingId === b.id}
                          className="w-full sm:w-auto px-6 py-3 bg-[rgba(255,90,95,0.12)] text-[#FF5A5F] hover:bg-[rgba(255,90,95,0.2)] border border-[rgba(255,90,95,0.3)] active:scale-[0.98] font-bold rounded-2xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}

                    {/* Progress Link for Active / Completed */}
                    {['ACCEPTED', 'ARRIVED', 'CHARGING', 'COMPLETED'].includes(b.status) && (
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1.5 text-[#34D399] font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                          <span>Address unlocked to driver. Session active.</span>
                        </div>
                        <Link
                          to={`/driver/bookings/${b.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-extrabold text-[#22E58B] hover:underline"
                        >
                          <span>Live Session HUD</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </PageTransition>
  );
};
