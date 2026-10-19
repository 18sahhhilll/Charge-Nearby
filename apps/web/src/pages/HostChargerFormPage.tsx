import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  Check,
  ChevronLeft,
  MapPin,
  Lock,
  AlertCircle,
  Navigation,
  RotateCw,
  CheckCircle2,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  Star
} from 'lucide-react';
import { chargerService } from '../services';
import { Charger, ChargerPhoto, PhotoType } from '../types';
import { useAuth } from '../context/AuthContext';

export const HostChargerFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chargerType, setChargerType] = useState<'AC' | 'DC'>('AC');
  const [connectorTypes, setConnectorTypes] = useState<string[]>(['TYPE2']);
  const [maxPower, setMaxPower] = useState('7.4');
  const [pricingModel, setPricingModel] = useState<'PER_KWH' | 'PER_MINUTE' | 'FIXED_SESSION'>('PER_KWH');
  const [pricePerKwh, setPricePerKwh] = useState('16.00');
  const [pricePerMinute, setPricePerMinute] = useState('2.50');
  const [sessionPrice, setSessionPrice] = useState('150.00');

  // Location
  const [locality, setLocality] = useState('Koregaon Park, Pune');
  const [latitude, setLatitude] = useState('18.5362');
  const [longitude, setLongitude] = useState('73.8940');
  const [exactAddress, setExactAddress] = useState('');
  const [accessInstructions, setAccessInstructions] = useState('');
  const [parkingAccess, setParkingAccess] = useState('DEDICATED_DRIVEWAY');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Photo states
  const [photos, setPhotos] = useState<ChargerPhoto[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoType, setPhotoType] = useState<PhotoType>('CHARGER');
  const [isPrimaryPhoto, setIsPrimaryPhoto] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);

  // Auto-detection state
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);
    setLocationErrorMsg(null);
    setLocationSuccessMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setLatitude(String(lat));
        setLongitude(String(lng));

        let detectedLocality = '';
        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim for convenience
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            { headers: { 'Accept': 'application/json' } }
          );
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const neighborhood = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || addr.quarter;
            const city = addr.city || addr.town || addr.state_district || 'Pune';
            if (neighborhood) {
              detectedLocality = `${neighborhood}, ${city}`;
              setLocality(detectedLocality);
            } else if (data.display_name) {
              const parts = data.display_name.split(',');
              detectedLocality = parts.slice(0, 2).join(',').trim();
              setLocality(detectedLocality);
            }

            // If exact street address is empty, suggest the street name if found
            if (!exactAddress) {
              const road = [addr.house_number, addr.road].filter(Boolean).join(', ');
              if (road) {
                setExactAddress(road);
              }
            }
          }
        } catch {
          // Reverse geocode is best-effort; coordinates are already set
        }

        const accuracyText = pos.coords.accuracy ? ` (Accuracy: ±${Math.round(pos.coords.accuracy)}m)` : '';
        setLocationSuccessMsg(
          `Location coordinates detected: ${lat}, ${lng}${detectedLocality ? ` (${detectedLocality})` : ''}${accuracyText}`
        );
        setDetectingLocation(false);
      },
      (geoErr) => {
        setDetectingLocation(false);
        setLocationErrorMsg(`Unable to fetch location: ${geoErr.message}. You can enter coordinates manually.`);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    if (isEdit && id) {
      setLoading(true);
      chargerService.getHostChargerById(id).then((ch) => {
        setTitle(ch.title);
        setDescription(ch.description || '');
        setChargerType(ch.charger_type);
        setConnectorTypes(ch.connector_types || ['TYPE2']);
        setMaxPower(String(ch.max_power_kw));
        setPricingModel(ch.pricing_model);
        if (ch.price_per_kwh) setPricePerKwh(String(ch.price_per_kwh));
        if (ch.price_per_minute) setPricePerMinute(String(ch.price_per_minute));
        if (ch.session_price) setSessionPrice(String(ch.session_price));
        setLocality(ch.locality);
        setLatitude(String(ch.latitude));
        setLongitude(String(ch.longitude));
        setExactAddress(ch.exact_address || '');
        setAccessInstructions(ch.access_instructions || '');
        setParkingAccess(ch.parking_access);
        setPhotos(ch.photos || []);
      }).catch((err) => {
        setError(err.message || 'Failed to load listing.');
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [id, isEdit, isAuthenticated, navigate]);

  const toggleConnector = (conn: string) => {
    if (connectorTypes.includes(conn)) {
      if (connectorTypes.length > 1) {
        setConnectorTypes(connectorTypes.filter((c) => c !== conn));
      }
    } else {
      setConnectorTypes([...connectorTypes, conn]);
    }
  };

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !photoFile) return;

    setUploadingPhoto(true);
    setPhotoError(null);
    setPhotoSuccess(null);

    try {
      const newPhoto = await chargerService.uploadPhoto(
        id,
        photoFile,
        photoCaption,
        photoType,
        isPrimaryPhoto
      );
      setPhotos((prev) => {
        if (newPhoto.is_primary) {
          return [...prev.map((p) => ({ ...p, is_primary: false })), newPhoto];
        }
        return [...prev, newPhoto];
      });
      setPhotoFile(null);
      setPhotoCaption('');
      setIsPrimaryPhoto(false);
      setPhotoSuccess('Photo uploaded successfully! It is now part of your verification submission.');
    } catch (err: any) {
      setPhotoError(err.message || 'Failed to upload photo. Ensure file is JPG/PNG/WEBP under 5MB.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async (photoId: string) => {
    if (!id) return;
    if (!window.confirm('Delete this photo?')) return;

    try {
      await chargerService.deletePhoto(id, photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete photo.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: Partial<Charger> = {
      title,
      description,
      charger_type: chargerType,
      connector_types: connectorTypes,
      max_power_kw: parseFloat(maxPower),
      pricing_model: pricingModel,
      price_per_kwh: pricingModel === 'PER_KWH' ? pricePerKwh : null,
      price_per_minute: pricingModel === 'PER_MINUTE' ? pricePerMinute : null,
      session_price: pricingModel === 'FIXED_SESSION' ? sessionPrice : null,
      locality,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      exact_address: exactAddress,
      access_instructions: accessInstructions,
      parking_access: parkingAccess,
    };

    try {
      if (isEdit && id) {
        await chargerService.updateHostCharger(id, payload);
        navigate('/host/dashboard');
      } else {
        const created = await chargerService.createHostCharger(payload);
        navigate(`/host/chargers/${created.id}/edit`, { state: { justCreated: true } });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save charger listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-500">Loading charger details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Link
        to="/host/dashboard"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {isEdit ? 'Edit Charger Listing' : 'List a New Private Charger'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fill in accurate equipment specs and parking access for Pune EV drivers.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Listing Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lane 7 Bungalow 7.4 kW Wallbox"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description & Hours</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention access details, gate hours, or visitor protocols..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Equipment Specifications */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Equipment Specifications</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Charger Current</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setChargerType('AC')}
                    className={`py-2 px-3 rounded-xl border text-center transition ${
                      chargerType === 'AC'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    AC Slow/Fast
                  </button>
                  <button
                    type="button"
                    onClick={() => setChargerType('DC')}
                    className={`py-2 px-3 rounded-xl border text-center transition ${
                      chargerType === 'DC'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    DC Rapid
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Max Power (kW)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={maxPower}
                  onChange={(e) => setMaxPower(e.target.value)}
                  placeholder="7.4"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Connector Types</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'TYPE2', label: 'Type 2 AC' },
                  { id: 'CCS2', label: 'CCS 2 DC' },
                  { id: '15A_3PIN', label: '15A 3-Pin Socket' },
                  { id: 'CHADEMO', label: 'CHAdeMO DC' },
                ].map((c) => {
                  const active = connectorTypes.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleConnector(c.id)}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
                        active
                          ? 'border-emerald-500 bg-emerald-100/70 text-emerald-900 font-semibold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="text-[11px]">{c.label}</span>
                      {active && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Parking & Access Type</label>
              <select
                value={parkingAccess}
                onChange={(e) => setParkingAccess(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="DEDICATED_DRIVEWAY">Private Dedicated Driveway</option>
                <option value="GARAGE">Enclosed Private Garage</option>
                <option value="STREET_FRONT">Street-facing Bungalow Gate</option>
                <option value="SOCIETY_PARKING">Apartment Society Visitor Bay</option>
                <option value="COMMERCIAL_LOT">Commercial Office / Business Lot</option>
              </select>
            </div>
          </div>

          {/* Pricing Model */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Pricing Structure (INR)</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPricingModel('PER_KWH')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  pricingModel === 'PER_KWH'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Per kWh
              </button>
              <button
                type="button"
                onClick={() => setPricingModel('FIXED_SESSION')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  pricingModel === 'FIXED_SESSION'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Fixed Session
              </button>
              <button
                type="button"
                onClick={() => setPricingModel('PER_MINUTE')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  pricingModel === 'PER_MINUTE'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Per Minute
              </button>
            </div>

            {pricingModel === 'PER_KWH' && (
              <div>
                <label className="block font-medium text-slate-700 mb-1">Price per kWh (₹)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={pricePerKwh}
                  onChange={(e) => setPricePerKwh(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            )}

            {pricingModel === 'FIXED_SESSION' && (
              <div>
                <label className="block font-medium text-slate-700 mb-1">Fixed Flat Price per Session (₹)</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={sessionPrice}
                  onChange={(e) => setSessionPrice(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Location & Privacy Fields */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Location & Secure Access Instructions</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Use your device GPS to fetch coordinates automatically or enter them manually.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoDetectLocation}
                disabled={detectingLocation}
                className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-60 cursor-pointer"
              >
                {detectingLocation ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Navigation className="w-3.5 h-3.5" />
                )}
                <span>{detectingLocation ? 'Detecting Location...' : 'Auto-detect My Location'}</span>
              </button>
            </div>

            {/* Auto-detect Location Alerts */}
            {locationSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{locationSuccessMsg}</span>
              </div>
            )}

            {locationErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="font-medium">{locationErrorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block font-medium text-slate-700 mb-1">Public Locality / Area</label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Koregaon Park, Pune"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Confidential Address */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center space-x-1.5 text-xs text-amber-800 font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Protected Fields (Only revealed to confirmed drivers after you accept)</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Exact Street / Bungalow / Flat Address</label>
                <input
                  type="text"
                  required
                  value={exactAddress}
                  onChange={(e) => setExactAddress(e.target.value)}
                  placeholder="e.g. Bungalow 14, Lane 7, Koregaon Park"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Access Instructions for Driver</label>
                <textarea
                  rows={2}
                  value={accessInstructions}
                  onChange={(e) => setAccessInstructions(e.target.value)}
                  placeholder="e.g. Inform gate guard: visiting Bungalow 14. Charger is on left pillar."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition text-sm flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{submitting ? 'Submitting...' : isEdit ? 'Save Changes' : 'Submit Listing for Review'}</span>
          </button>
        </form>
      </div>

      {/* Photo Verification & Equipment Management */}
      {isEdit && id ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <span>Charger & Installation Photos</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload clear photos of your charging wallbox/socket, parking spot clearance, and MCB circuit breaker to expedite admin approval.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
            </span>
          </div>

          {photoSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{photoSuccess}</span>
            </div>
          )}

          {photoError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{photoError}</span>
            </div>
          )}

          {/* Photo Gallery Grid */}
          {photos.length === 0 ? (
            <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No verification photos uploaded yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                Listings with photos are prioritized by admins and receive 3x more bookings from emergency EV drivers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((p) => {
                const typeLabels: Record<string, string> = {
                  CHARGER: 'Wallbox / Equipment',
                  PARKING_BAY: 'Parking Bay Clearance',
                  CIRCUIT_BREAKER: 'MCB / Earthing',
                  OTHER: 'Other',
                };
                return (
                  <div
                    key={p.id}
                    className="group relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col shadow-xs"
                  >
                    <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
                      <img
                        src={p.image_url || p.image}
                        alt={p.caption || 'Charger photo'}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      {p.is_primary && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full shadow-sm flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Primary Cover</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handlePhotoDelete(p.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full shadow-sm transition"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 text-xs space-y-1 bg-white flex-1">
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {typeLabels[p.photo_type] || p.photo_type}
                      </span>
                      {p.caption ? (
                        <p className="font-medium text-slate-800 line-clamp-1">{p.caption}</p>
                      ) : (
                        <p className="text-slate-400 italic text-[11px]">No caption provided</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Upload Form */}
          <form onSubmit={handlePhotoUpload} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Upload New Photo</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Photo File (JPG, PNG, WEBP &lt; 5MB)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Photo Category</label>
                <select
                  value={photoType}
                  onChange={(e) => setPhotoType(e.target.value as PhotoType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 bg-white"
                >
                  <option value="CHARGER">Charging Equipment / Wallbox Plug</option>
                  <option value="PARKING_BAY">Parking Bay / Driveway Access</option>
                  <option value="CIRCUIT_BREAKER">MCB / Electrical Switchboard</option>
                  <option value="OTHER">Other Installation Detail</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="e.g. 7.4 kW Wallbox on driveway wall"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="primary_checkbox"
                  checked={isPrimaryPhoto}
                  onChange={(e) => setIsPrimaryPhoto(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="primary_checkbox" className="font-medium text-slate-700 text-xs cursor-pointer">
                  Set as primary cover photo for listing
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploadingPhoto || !photoFile}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingPhoto ? 'Uploading Photo...' : 'Upload Photo'}</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl text-xs text-emerald-900 flex items-start space-x-2.5">
          <Camera className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Next Step: Verification Photos</span>
            <p className="text-emerald-800 mt-0.5 leading-relaxed">
              Once you submit this listing, you will be able to upload photos of your wallbox, parking clearance, and switchboard to verify your charger.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
