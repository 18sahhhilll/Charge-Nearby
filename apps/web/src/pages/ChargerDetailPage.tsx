import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  MapPin,
  ShieldCheck,
  Clock,
  Navigation,
  Car,
  AlertCircle,
  CheckCircle,
  Lock,
  ChevronLeft,
  Camera,
  Image as ImageIcon,
  Star
} from 'lucide-react';
import { chargerService, vehicleService, bookingService } from '../services';
import { Charger, Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';

export const ChargerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [charger, setCharger] = useState<Charger | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [bookingType, setBookingType] = useState<'EMERGENCY' | 'SCHEDULED'>('EMERGENCY');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await chargerService.getPublicById(id);
        setCharger(data);
      } catch (err: any) {
        setError(err.message || 'Charger not found or pending verification.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) {
      vehicleService.list().then((list) => {
        setVehicles(list);
        if (list.length > 0) {
          setSelectedVehicleId(list[0].id);
        }
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleBookingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=/chargers/' + id);
      return;
    }
    if (!selectedVehicleId) {
      alert('Please add or select a vehicle before requesting access.');
      navigate('/onboarding/vehicle');
      return;
    }

    setBookingLoading(true);
    setError(null);
    try {
      const res = await bookingService.create({
        charger: id!,
        vehicle: selectedVehicleId,
        booking_type: bookingType,
      });
      setBookingSuccessId(res.id);
      navigate(`/driver/bookings/${res.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking request.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500">
        <Zap className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-2" />
        <p>Loading charger specifications...</p>
      </div>
    );
  }

  if (error || !charger) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Unable to View Listing</h2>
          <p className="text-sm text-slate-600">{error || 'This charger is unavailable or not yet approved.'}</p>
          <Link
            to="/find"
            className="inline-flex items-center space-x-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnCharger = user && charger.host_display_name && user.full_name.startsWith(charger.host_display_name.split(' ')[0]);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Back button */}
      <Link
        to="/find"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Nearby Search</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  charger.availability_status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                ● {charger.availability_status}
              </span>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Private Host: {charger.host_display_name}</span>
              </span>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {charger.parking_access.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{charger.title}</h1>

            <div className="flex items-center text-sm text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-500 mr-1.5 shrink-0" />
              <span className="font-medium text-slate-700">{charger.locality}</span>
            </div>

            {/* Verification Photos Showcase */}
            {charger.photos && charger.photos.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={charger.photos[activePhotoIndex]?.image_url || charger.photos[activePhotoIndex]?.image}
                    alt={charger.photos[activePhotoIndex]?.caption || charger.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg shadow-sm">
                      {charger.photos[activePhotoIndex]?.photo_type === 'CHARGER'
                        ? 'Wallbox / Charging Equipment'
                        : charger.photos[activePhotoIndex]?.photo_type === 'PARKING_BAY'
                        ? 'Parking Bay Clearance'
                        : charger.photos[activePhotoIndex]?.photo_type === 'CIRCUIT_BREAKER'
                        ? 'MCB / Earthing Verification'
                        : 'Installation Detail'}
                    </span>
                    {charger.photos[activePhotoIndex]?.is_primary && (
                      <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 text-[11px] font-bold rounded-lg shadow-sm flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Primary Cover</span>
                      </span>
                    )}
                  </div>
                  {charger.photos[activePhotoIndex]?.caption && (
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent text-white text-xs">
                      {charger.photos[activePhotoIndex]?.caption}
                    </div>
                  )}
                </div>

                {/* Thumbnails Row */}
                {charger.photos.length > 1 && (
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                    {charger.photos.map((p, idx) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                          idx === activePhotoIndex
                            ? 'border-emerald-500 ring-2 ring-emerald-200'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={p.image_url || p.image}
                          alt={p.caption || ''}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
              {charger.description || 'Verified private charger sharing point hosted by a Pune EV enthusiast.'}
            </p>

            {/* Hardware Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-0.5">Max Output Power</span>
                <span className="font-extrabold text-lg text-slate-900">{charger.max_power_kw} kW</span>
                <span className="text-xs text-slate-500 block">{charger.charger_type}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-0.5">Connector Type</span>
                <span className="font-extrabold text-sm text-slate-900 block truncate">
                  {(charger.connector_types || []).join(', ')}
                </span>
                <span className="text-xs text-emerald-600 font-medium">Standard Fit</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-400 block mb-0.5">Pricing Model</span>
                <span className="font-extrabold text-lg text-emerald-600">
                  {charger.pricing_model === 'FIXED_SESSION'
                    ? `₹${charger.session_price}`
                    : `₹${charger.price_per_kwh}`}
                </span>
                <span className="text-xs text-slate-500 block">
                  {charger.pricing_model === 'FIXED_SESSION' ? 'per session' : 'per kWh'}
                </span>
              </div>
            </div>

            {/* Privacy Safeguard Alert */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start space-x-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Host Privacy & Access Protection</span>
                <p className="text-amber-800 leading-relaxed">
                  To protect community hosts, the exact bungalow/flat address and private gate access instructions
                  are securely locked until the host confirms and accepts your emergency request.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar Action */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">Request Access</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>Host Online</span>
              </span>
            </div>

            {isOwnCharger ? (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center text-xs text-slate-600">
                You are the host of this charger listing. You cannot book your own charger.
              </div>
            ) : (
              <form onSubmit={handleBookingRequest} className="space-y-4 text-xs">
                {/* Vehicle Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-slate-700">Select Your EV</label>
                    <Link to="/onboarding/vehicle" className="text-emerald-600 hover:underline">
                      + Add Vehicle
                    </Link>
                  </div>
                  {vehicles.length > 0 ? (
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.make} {v.model} ({v.connector_types.join(', ')})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 space-y-2">
                      <p>No vehicles configured on your profile.</p>
                      <Link
                        to="/onboarding/vehicle"
                        className="inline-block py-1.5 px-3 bg-slate-900 text-white font-semibold rounded-lg"
                      >
                        Set up Vehicle
                      </Link>
                    </div>
                  )}
                </div>

                {/* Booking Type */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Request Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingType('EMERGENCY')}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        bookingType === 'EMERGENCY'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Emergency (Now)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType('SCHEDULED')}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        bookingType === 'SCHEDULED'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Scheduled
                    </button>
                  </div>
                </div>

                {/* Quoted Amount Preview */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500">Estimated Rate Snapshot:</span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {charger.pricing_model === 'FIXED_SESSION'
                      ? `₹${charger.session_price} flat`
                      : `₹${charger.price_per_kwh} / kWh`}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading || vehicles.length === 0}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{bookingLoading ? 'Submitting Request...' : 'Send Access Request'}</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Host is notified immediately. No cancellation fee for emergency requests.
                </p>
              </form>
            )}

            {/* Navigation Handoff Action */}
            <div className="pt-3 border-t border-slate-100">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${charger.latitude},${charger.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition text-xs"
              >
                <Navigation className="w-4 h-4 text-blue-500" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
