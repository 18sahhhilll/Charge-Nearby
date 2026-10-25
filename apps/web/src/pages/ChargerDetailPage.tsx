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
  Star,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { chargerService, vehicleService, bookingService } from '../services';
import { Charger, Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/motion';
import { ChargerDetailSkeleton } from '../components/common/Skeleton';
import { NotFoundState } from '../components/common/NotFoundState';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

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
      navigate(`/driver/bookings/${res.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking request.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <ChargerDetailSkeleton />
      </PageTransition>
    );
  }

  if (error || !charger) {
    return (
      <PageTransition>
        <NotFoundState
          title="Charger Not Found"
          description={error || "This charger listing doesn't exist, is pending host verification, or has been temporarily unlisted."}
          code="EV 404"
          showRadar={false}
          primaryAction={{ label: 'Find other chargers', to: '/find' }}
          secondaryAction={{ label: 'Back to home', to: '/' }}
        />
      </PageTransition>
    );
  }

  const isOwnCharger = user && charger.host_display_name && user.full_name?.startsWith(charger.host_display_name.split(' ')[0]);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/find"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Discovery Map</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-mono">ID: {charger.id.slice(0, 8)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Details Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              {/* Badges & Meta */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={charger.availability_status === 'AVAILABLE' ? 'emerald' : 'amber'}
                  pulse={charger.availability_status === 'AVAILABLE'}
                >
                  {charger.availability_status}
                </Badge>

                <Badge variant="blue">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verified Host: {charger.host_display_name}
                </Badge>

                <Badge variant="slate">
                  {charger.parking_access.replace('_', ' ')}
                </Badge>
              </div>

              {/* Title & Locality */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {charger.title}
                </h1>
                <div className="flex items-center text-sm text-slate-500 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-500 mr-1.5 shrink-0" />
                  <span className="font-semibold text-slate-700">{charger.locality}</span>
                </div>
              </div>

              {/* Photos Gallery */}
              {charger.photos && charger.photos.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="relative aspect-16/9 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                    <img
                      src={charger.photos[activePhotoIndex]?.image_url || charger.photos[activePhotoIndex]?.image}
                      alt={charger.photos[activePhotoIndex]?.caption || charger.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold rounded-xl shadow-sm">
                        {charger.photos[activePhotoIndex]?.photo_type === 'CHARGER'
                          ? 'Wallbox / Charging Hardware'
                          : charger.photos[activePhotoIndex]?.photo_type === 'PARKING_BAY'
                          ? 'Parking Bay Clearance'
                          : charger.photos[activePhotoIndex]?.photo_type === 'CIRCUIT_BREAKER'
                          ? 'MCB & Dedicated Earthing'
                          : 'Installation View'}
                      </span>
                      {charger.photos[activePhotoIndex]?.is_primary && (
                        <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 text-[11px] font-extrabold rounded-xl shadow-sm flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Primary Cover</span>
                        </span>
                      )}
                    </div>
                    {charger.photos[activePhotoIndex]?.caption && (
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/85 via-slate-950/50 to-transparent text-white text-xs">
                        {charger.photos[activePhotoIndex]?.caption}
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {charger.photos.length > 1 && (
                    <div className="flex items-center space-x-2.5 overflow-x-auto pb-1">
                      {charger.photos.map((p, idx) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setActivePhotoIndex(idx)}
                          className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                            idx === activePhotoIndex
                              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
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

              {/* Description */}
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Host Overview</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {charger.description || 'Verified private community charger sharing point hosted by a Pune EV enthusiast.'}
                </p>
              </div>

              {/* Hardware Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Maximum Output</span>
                  <span className="font-extrabold text-xl text-slate-900">{charger.max_power_kw} kW</span>
                  <span className="text-xs text-slate-500 block mt-0.5">{charger.charger_type} Fast AC</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Connector Type</span>
                  <span className="font-extrabold text-sm text-slate-900 block truncate">
                    {(charger.connector_types || []).join(', ')}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">Standard Indian EV</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Pricing Model</span>
                  <span className="font-extrabold text-xl text-emerald-600">
                    {charger.pricing_model === 'FIXED_SESSION'
                      ? `₹${charger.session_price}`
                      : `₹${charger.price_per_kwh}`}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {charger.pricing_model === 'FIXED_SESSION' ? 'per session' : 'per kWh'}
                  </span>
                </div>
              </div>

              {/* Host Privacy & Protection Safeguard */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start space-x-3.5">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-900">Host Address Privacy Protection</span>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    To maintain privacy and prevent unannounced arrivals, the exact bungalow/apartment number and private gate code
                    remain encrypted. They unlock automatically the moment the host accepts your request.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Action Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6 sticky top-20">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="font-extrabold text-slate-900 text-lg">Request Access</h2>
                  <p className="text-xs text-slate-400">Direct dispatch to host</p>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Host Responsive</span>
                </div>
              </div>

              {isOwnCharger ? (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center text-xs text-slate-600 space-y-2">
                  <Info className="w-5 h-5 text-slate-400 mx-auto" />
                  <p className="font-semibold text-slate-800">You are the host of this charger.</p>
                  <p className="text-slate-500">You cannot create a booking on your own equipment.</p>
                  <Link
                    to="/host/dashboard"
                    className="inline-block mt-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
                  >
                    Go to Host Dashboard
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleBookingRequest} className="space-y-5 text-xs">
                  {/* Select Vehicle */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-700">Select Your EV</label>
                      <Link to="/onboarding/vehicle" className="text-emerald-600 font-bold hover:underline">
                        + Add New
                      </Link>
                    </div>
                    {vehicles.length > 0 ? (
                      <select
                        value={selectedVehicleId}
                        onChange={(e) => setSelectedVehicleId(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-2xl bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition"
                      >
                        {vehicles.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.make} {v.model} ({v.connector_types.join(', ')})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 space-y-2.5">
                        <p className="text-slate-600">No vehicles registered on your profile yet.</p>
                        <Link
                          to="/onboarding/vehicle"
                          className="inline-block py-2 px-4 bg-emerald-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-sm hover:bg-emerald-400 transition"
                        >
                          Add Vehicle First
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Request Type Toggle */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Request Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingType('EMERGENCY')}
                        className={`p-3 rounded-2xl border text-center transition ${
                          bookingType === 'EMERGENCY'
                            ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-extrabold shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <span className="block font-bold text-xs">Emergency (Now)</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Priority dispatch</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingType('SCHEDULED')}
                        className={`p-3 rounded-2xl border text-center transition ${
                          bookingType === 'SCHEDULED'
                            ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-extrabold shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <span className="block font-bold text-xs">Scheduled</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Planned visit</span>
                      </button>
                    </div>
                  </div>

                  {/* Rate Summary Card */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Agreed Rate Snapshot:</span>
                      <span className="text-[10px] text-slate-400">Fixed rate before connection</span>
                    </div>
                    <span className="font-extrabold text-base text-slate-900">
                      {charger.pricing_model === 'FIXED_SESSION'
                        ? `₹${charger.session_price} flat`
                        : `₹${charger.price_per_kwh} / kWh`}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={bookingLoading || vehicles.length === 0}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{bookingLoading ? 'Sending Dispatch Alert...' : 'Send Access Request'}</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center leading-normal">
                    The host receives an instant notification. Zero fee if cancelled before host acceptance.
                  </p>
                </form>
              )}

              {/* External Maps Link */}
              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${charger.latitude},${charger.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition text-xs"
                >
                  <Navigation className="w-4 h-4 text-blue-500" />
                  <span>Preview Route in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
