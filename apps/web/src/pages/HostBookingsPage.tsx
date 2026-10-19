import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, Clock, Car, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { bookingService } from '../services';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';

export const HostBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <Clock className="w-6 h-6 text-emerald-500" />
          <span>Incoming Driver Booking Requests</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review emergency charging requests for your private equipment in Pune.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading incoming requests...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Pending Requests</h3>
          <p className="text-xs text-slate-400">All incoming driver requests have been resolved.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        b.status === 'REQUESTED'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                          : b.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {b.booking_type} Request
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{b.charger_title}</h3>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-lg text-emerald-600">₹{b.quoted_amount}</span>
                  <div className="text-[10px] text-slate-400">Agreed price snapshot</div>
                </div>
              </div>

              {/* Driver & Vehicle info */}
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Driver</span>
                  <span className="font-semibold text-slate-900">{b.driver_name}</span>
                  {b.driver_phone && <span className="text-slate-500 block">{b.driver_phone}</span>}
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Vehicle</span>
                  <span className="font-semibold text-slate-900">
                    {b.vehicle_details ? `${b.vehicle_details.make} ${b.vehicle_details.model}` : 'EV'}
                  </span>
                  {b.vehicle_details?.battery_capacity_kwh && (
                    <span className="text-slate-500 block">{b.vehicle_details.battery_capacity_kwh} kWh Battery</span>
                  )}
                </div>
              </div>

              {/* Action Buttons for Host */}
              {b.status === 'REQUESTED' && (
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => handleAccept(b.id)}
                    disabled={actionLoadingId === b.id}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Emergency Access</span>
                  </button>

                  <button
                    onClick={() => handleDecline(b.id)}
                    disabled={actionLoadingId === b.id}
                    className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              )}

              {b.status === 'ACCEPTED' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                  <span>Booking accepted. Your address and instructions have been revealed to the driver.</span>
                  <Link
                    to={`/driver/bookings/${b.id}`}
                    className="font-bold underline text-emerald-900"
                  >
                    View Active Progress
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
