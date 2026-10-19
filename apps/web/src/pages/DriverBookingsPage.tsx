import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Clock, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { bookingService } from '../services';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';

export const DriverBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Car className="w-6 h-6 text-emerald-500" />
            <span>My Charging Requests & History</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track active emergency charging sessions and review past visits in Pune.
          </p>
        </div>

        <Link
          to="/find"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
        >
          Find Charger
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3">
          <Zap className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Bookings Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you request access to a community charger, your real-time session progress will appear here.
          </p>
          <Link
            to="/find"
            className="inline-block mt-2 py-2 px-4 bg-slate-900 text-white font-semibold rounded-xl text-xs"
          >
            Search Nearby Chargers
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Link
              key={b.id}
              to={`/driver/bookings/${b.id}`}
              className="block bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-emerald-400 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        b.status === 'REQUESTED'
                          ? 'bg-amber-100 text-amber-900 animate-pulse'
                          : b.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'CHARGING'
                          ? 'bg-blue-100 text-blue-800'
                          : b.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-xs text-slate-500">• {b.charger_locality}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{b.charger_title}</h3>
                  <div className="text-xs text-slate-500">Host: {b.host_name}</div>
                </div>

                <div className="flex items-center justify-between sm:justify-end sm:space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="font-extrabold text-base text-emerald-600">₹{b.quoted_amount}</span>
                    <div className="text-[10px] text-slate-400">Snapshot price</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
