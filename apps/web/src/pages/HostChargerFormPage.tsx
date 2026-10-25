import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Zap,
  MapPin,
  Lock,
  Plus,
  Upload,
  AlertCircle,
  CheckCircle2,
  Navigation,
  RotateCw,
  Camera,
  Trash2,
  Star,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { chargerService } from '../services';
import { Charger, ChargerType, PricingModel, PhotoType, ChargerPhoto } from '../types';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/motion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const HostChargerFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isEdit = Boolean(id);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chargerType, setChargerType] = useState<ChargerType>('AC');
  const [connectorTypes, setConnectorTypes] = useState<string[]>(['TYPE2']);
  const [maxPower, setMaxPower] = useState('7.4');
  const [pricingModel, setPricingModel] = useState<PricingModel>('PER_KWH');
  const [pricePerKwh, setPricePerKwh] = useState('18.00');
  const [pricePerMinute, setPricePerMinute] = useState('0.50');
  const [sessionPrice, setSessionPrice] = useState('150.00');
  const [locality, setLocality] = useState('Koregaon Park, Pune');
  const [latitude, setLatitude] = useState('18.5362');
  const [longitude, setLongitude] = useState('73.8940');
  const [exactAddress, setExactAddress] = useState('');
  const [accessInstructions, setAccessInstructions] = useState('');
  const [parkingAccess, setParkingAccess] = useState<string>('DEDICATED_DRIVEWAY');

  // Photo state
  const [photos, setPhotos] = useState<ChargerPhoto[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoType, setPhotoType] = useState<PhotoType>('CHARGER');
  const [photoCaption, setPhotoCaption] = useState('');
  const [isPrimaryPhoto, setIsPrimaryPhoto] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);

  // Status & Geolocation
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

            if (!exactAddress) {
              const road = [addr.house_number, addr.road].filter(Boolean).join(', ');
              if (road) {
                setExactAddress(road);
              }
            }
          }
        } catch {
          // Best-effort reverse geocode
        }

        const accuracyText = pos.coords.accuracy ? ` (±${Math.round(pos.coords.accuracy)}m)` : '';
        setLocationSuccessMsg(
          `Coordinates locked: ${lat}, ${lng}${detectedLocality ? ` (${detectedLocality})` : ''}${accuracyText}`
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
      loadChargerData(id);
    }
  }, [id, isAuthenticated, isEdit, navigate]);

  const loadChargerData = async (chargerId: string) => {
    setLoading(true);
    try {
      const data = await chargerService.getHostChargerById(chargerId);
      setTitle(data.title);
      setDescription(data.description || '');
      setChargerType(data.charger_type);
      setConnectorTypes(data.connector_types || ['TYPE2']);
      setMaxPower(String(data.max_power_kw));
      setPricingModel(data.pricing_model);
      setPricePerKwh(data.price_per_kwh || '18.00');
      setPricePerMinute(data.price_per_minute || '0.50');
      setSessionPrice(data.session_price || '150.00');
      setLocality(data.locality);
      setLatitude(String(data.latitude));
      setLongitude(String(data.longitude));
      setExactAddress(data.exact_address || '');
      setAccessInstructions(data.access_instructions || '');
      setParkingAccess(data.parking_access);
      setPhotos(data.photos || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load charger details.');
    } finally {
      setLoading(false);
    }
  };

  const toggleConnector = (connector: string) => {
    setConnectorTypes((prev) =>
      prev.includes(connector) ? prev.filter((c) => c !== connector) : [...prev, connector]
    );
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
          return prev.map((p) => ({ ...p, is_primary: false })).concat(newPhoto);
        }
        return [...prev, newPhoto];
      });
      setPhotoFile(null);
      setPhotoCaption('');
      setIsPrimaryPhoto(false);
      setPhotoSuccess('Verification photo uploaded successfully.');
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

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-6 space-y-6 text-[#E8F1EE]">
        {/* Navigation Breadcrumb */}
        <Link
          to="/host/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#8DA39B] hover:text-[#E8F1EE] transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Host Console</span>
        </Link>

        {/* Main Header */}
        <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="emerald">
                {isEdit ? 'EDITING LISTING' : 'NEW HOST LISTING'}
              </Badge>
              <span className="text-xs text-[#8DA39B] font-semibold">Pune Community Mesh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight">
              {isEdit ? 'Edit Charger Specifications' : 'List a Private Charger in Pune'}
            </h1>
            <p className="text-xs sm:text-sm text-[#8DA39B]">
              Provide hardware specs, transparent pricing, and parking directions to help stranded EV drivers.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-[rgba(255,90,95,0.12)] border border-[rgba(255,90,95,0.3)] text-[#FF5A5F] text-xs rounded-2xl flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Section 1: Title & Description */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-[#E8F1EE] text-sm flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-bold flex items-center justify-center text-xs">1</span>
                <span>Listing Overview</span>
              </h3>

              <div>
                <label className="block font-bold text-[#C5D5CF] mb-1">Listing Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lane 7 Bungalow 7.4 kW Wallbox (Koregaon Park)"
                  className="w-full px-4 py-3 bg-[#16241F] border border-[#1E2F2A] rounded-2xl text-[#E8F1EE] text-sm font-medium focus:outline-none focus:border-[#22E58B] transition"
                />
              </div>

              <div>
                <label className="block font-bold text-[#C5D5CF] mb-1">Description & Hours</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention access details, gate hours, or visitor protocols..."
                  className="w-full px-4 py-3 bg-[#16241F] border border-[#1E2F2A] rounded-2xl text-[#E8F1EE] text-sm font-medium focus:outline-none focus:border-[#22E58B] transition"
                />
              </div>
            </div>

            {/* Section 2: Equipment Specs */}
            <div className="p-5 bg-[#16241F] border border-[#1E2F2A] rounded-3xl space-y-4">
              <h3 className="font-extrabold text-[#E8F1EE] text-sm flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-bold flex items-center justify-center text-xs">2</span>
                <span>Equipment & Hardware Specs</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1.5">Current Output</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setChargerType('AC')}
                      className={`py-2.5 px-3 rounded-xl border text-center transition cursor-pointer ${
                        chargerType === 'AC'
                          ? 'border-[#22E58B] bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-extrabold shadow-sm'
                          : 'border-[#1E2F2A] bg-[#111C19] text-[#8DA39B] hover:border-[#1E2F2A]/80 hover:text-[#E8F1EE]'
                      }`}
                    >
                      AC (Wallbox / Socket)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChargerType('DC')}
                      className={`py-2.5 px-3 rounded-xl border text-center transition cursor-pointer ${
                        chargerType === 'DC'
                          ? 'border-[#22E58B] bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-extrabold shadow-sm'
                          : 'border-[#1E2F2A] bg-[#111C19] text-[#8DA39B] hover:border-[#1E2F2A]/80 hover:text-[#E8F1EE]'
                      }`}
                    >
                      DC Fast
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1.5">Max Power (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={maxPower}
                    onChange={(e) => setMaxPower(e.target.value)}
                    placeholder="7.4"
                    className="w-full px-4 py-2.5 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#E8F1EE] font-bold focus:outline-none focus:border-[#22E58B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#C5D5CF] mb-1.5">Connector Types Supported</label>
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
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          active
                            ? 'border-[#22E58B] bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-extrabold shadow-xs'
                            : 'border-[#1E2F2A] bg-[#111C19] text-[#8DA39B] hover:border-[#1E2F2A]/80 hover:text-[#E8F1EE]'
                        }`}
                      >
                        <span className="text-xs">{c.label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-[#22E58B]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#C5D5CF] mb-1.5">Parking Clearance & Access</label>
                <select
                  value={parkingAccess}
                  onChange={(e) => setParkingAccess(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#E8F1EE] font-semibold focus:outline-none focus:border-[#22E58B]"
                >
                  <option value="DEDICATED_DRIVEWAY">Private Dedicated Driveway</option>
                  <option value="GARAGE">Enclosed Private Garage</option>
                  <option value="STREET_FRONT">Street-facing Bungalow Gate</option>
                  <option value="SOCIETY_PARKING">Apartment Society Visitor Bay</option>
                  <option value="COMMERCIAL_LOT">Commercial Office / Business Lot</option>
                </select>
              </div>
            </div>

            {/* Section 3: Pricing Structure */}
            <div className="p-5 bg-[#16241F] border border-[#1E2F2A] rounded-3xl space-y-4">
              <h3 className="font-extrabold text-[#E8F1EE] text-sm flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-bold flex items-center justify-center text-xs">3</span>
                <span>Pricing Structure (INR)</span>
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPricingModel('PER_KWH')}
                  className={`py-2.5 px-3 rounded-xl border text-center transition cursor-pointer ${
                    pricingModel === 'PER_KWH'
                      ? 'border-[#22E58B] bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-extrabold'
                      : 'border-[#1E2F2A] bg-[#111C19] text-[#8DA39B] hover:text-[#E8F1EE]'
                  }`}
                >
                  Per kWh
                </button>
                <button
                  type="button"
                  onClick={() => setPricingModel('FIXED_SESSION')}
                  className={`py-2.5 px-3 rounded-xl border text-center transition cursor-pointer ${
                    pricingModel === 'FIXED_SESSION'
                      ? 'border-[#22E58B] bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-extrabold'
                      : 'border-[#1E2F2A] bg-[#111C19] text-[#8DA39B] hover:text-[#E8F1EE]'
                  }`}
                >
                  Fixed Session
                </button>
                <button
                  type="button"
                  onClick={() => setPricingModel('PER_MINUTE')}
                  className={`py-2.5 px-3 rounded-xl border text-center transition cursor-pointer ${
                    pricingModel === 'PER_MINUTE'
                      ? 'border-[#22E58B] bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-extrabold'
                      : 'border-[#1E2F2A] bg-[#111C19] text-[#8DA39B] hover:text-[#E8F1EE]'
                  }`}
                >
                  Per Minute
                </button>
              </div>

              {pricingModel === 'PER_KWH' && (
                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Price per kWh (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={pricePerKwh}
                    onChange={(e) => setPricePerKwh(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#FFD60A] font-extrabold focus:outline-none focus:border-[#22E58B]"
                  />
                </div>
              )}

              {pricingModel === 'FIXED_SESSION' && (
                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Fixed Flat Price per Session (₹)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={sessionPrice}
                    onChange={(e) => setSessionPrice(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#FFD60A] font-extrabold focus:outline-none focus:border-[#22E58B]"
                  />
                </div>
              )}
            </div>

            {/* Section 4: Location & Confidential Instructions */}
            <div className="p-5 bg-[#16241F] border border-[#1E2F2A] rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-extrabold text-[#E8F1EE] text-sm flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-bold flex items-center justify-center text-xs">4</span>
                  <span>Pune Geolocation & Access Safeguards</span>
                </h3>

                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  disabled={detectingLocation}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] rounded-xl text-xs font-extrabold shadow-sm transition disabled:opacity-60 cursor-pointer"
                >
                  {detectingLocation ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  <span>{detectingLocation ? 'Detecting GPS...' : 'Auto-detect My Location'}</span>
                </button>
              </div>

              {locationSuccessMsg && (
                <div className="p-3 bg-[rgba(52,211,153,0.12)] border border-[rgba(52,211,153,0.3)] rounded-xl text-xs text-[#34D399] flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                  <span className="font-semibold">{locationSuccessMsg}</span>
                </div>
              )}

              {locationErrorMsg && (
                <div className="p-3 bg-[rgba(255,90,95,0.12)] border border-[rgba(255,90,95,0.3)] rounded-xl text-xs text-[#FF5A5F] flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5" />
                  <span className="font-semibold">{locationErrorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Public Locality / Zone</label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Koregaon Park, Pune"
                    className="w-full px-3.5 py-2.5 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#E8F1EE] font-semibold focus:outline-none focus:border-[#22E58B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#E8F1EE] font-mono text-xs focus:outline-none focus:border-[#22E58B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#E8F1EE] font-mono text-xs focus:outline-none focus:border-[#22E58B]"
                  />
                </div>
              </div>

              {/* Confidential Address */}
              <div className="space-y-3 pt-3 border-t border-[#1E2F2A]">
                <div className="flex items-center space-x-1.5 text-xs text-[#FCD34D] font-bold">
                  <Lock className="w-3.5 h-3.5 text-[#FCD34D]" />
                  <span>Confidential Address Fields (Encrypted until you accept driver request)</span>
                </div>

                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Exact Street / Bungalow / Flat Address</label>
                  <input
                    type="text"
                    required
                    value={exactAddress}
                    onChange={(e) => setExactAddress(e.target.value)}
                    placeholder="e.g. Bungalow 14, Lane 7, Koregaon Park"
                    className="w-full px-4 py-2.5 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#E8F1EE] font-medium focus:outline-none focus:border-[#22E58B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Driver Access & Gate Instructions</label>
                  <textarea
                    rows={2}
                    value={accessInstructions}
                    onChange={(e) => setAccessInstructions(e.target.value)}
                    placeholder="e.g. Inform gate guard: visiting Bungalow 14. Charger on left wall..."
                    className="w-full px-4 py-2.5 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#E8F1EE] font-medium focus:outline-none focus:border-[#22E58B]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold rounded-2xl shadow-lg shadow-[#22E58B]/20 transition text-sm flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{submitting ? 'Saving Listing...' : isEdit ? 'Save Changes' : 'Submit Listing for Admin Review'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 5: Photo Verification Gallery (when in edit mode or created) */}
        {isEdit && id && (
          <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#1E2F2A] pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#E8F1EE] flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-[#22E58B]" />
                  <span>Hardware & Installation Photos</span>
                </h2>
                <p className="text-xs text-[#8DA39B] mt-0.5">
                  Clear photos of your wallbox, parking clearance, and MCB breaker speed up verified host approval.
                </p>
              </div>
              <Badge variant="slate">{photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}</Badge>
            </div>

            {photoSuccess && (
              <div className="p-3 bg-[rgba(52,211,153,0.12)] border border-[rgba(52,211,153,0.3)] text-[#34D399] text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                <span>{photoSuccess}</span>
              </div>
            )}

            {photoError && (
              <div className="p-3 bg-[rgba(255,90,95,0.12)] border border-[rgba(255,90,95,0.3)] text-[#FF5A5F] text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                <span>{photoError}</span>
              </div>
            )}

            {/* Gallery Grid */}
            {photos.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-[#1E2F2A] rounded-2xl bg-[#16241F]">
                <ImageIcon className="w-10 h-10 text-[#8DA39B] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#E8F1EE]">No verification photos uploaded yet</p>
                <p className="text-[11px] text-[#8DA39B] mt-1 max-w-sm mx-auto">
                  Listings with verification photos are prioritized by admins and receive 3x more bookings.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((p) => {
                  const typeLabels: Record<string, string> = {
                    CHARGER: 'Wallbox / Equipment',
                    PARKING_BAY: 'Parking Bay Clearance',
                    CIRCUIT_BREAKER: 'MCB / Earthing',
                    OTHER: 'General Installation',
                  };
                  return (
                    <div
                      key={p.id}
                      className="group relative bg-[#16241F] border border-[#1E2F2A] rounded-2xl overflow-hidden shadow-xs"
                    >
                      <div className="aspect-16/10 bg-[#0A1210] relative">
                        <img
                          src={p.image_url || p.image}
                          alt={p.caption || 'Equipment photo'}
                          className="w-full h-full object-cover"
                        />
                        {p.is_primary && (
                          <div className="absolute top-2 left-2 bg-[#22E58B] text-[#04130C] font-extrabold text-[10px] px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-sm">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Primary</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handlePhotoDelete(p.id)}
                          className="absolute top-2 right-2 p-1.5 bg-[rgba(255,90,95,0.9)] hover:bg-[#FF5A5F] text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="p-3 text-xs space-y-1">
                        <Badge variant="slate">{typeLabels[p.photo_type] || p.photo_type}</Badge>
                        {p.caption && <p className="text-[#C5D5CF] text-[11px] truncate">{p.caption}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upload New Photo Form */}
            <form onSubmit={handlePhotoUpload} className="p-5 bg-[#16241F] border border-[#1E2F2A] rounded-2xl space-y-4 text-xs">
              <h4 className="font-extrabold text-[#E8F1EE] text-xs flex items-center space-x-1.5">
                <Upload className="w-4 h-4 text-[#22E58B]" />
                <span>Upload New Verification Photo</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Photo Classification</label>
                  <select
                    value={photoType}
                    onChange={(e) => setPhotoType(e.target.value as PhotoType)}
                    className="w-full px-3 py-2 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#E8F1EE] font-semibold focus:outline-none focus:border-[#22E58B]"
                  >
                    <option value="CHARGER">Wallbox / Charging Socket</option>
                    <option value="PARKING_BAY">Parking Bay Clearance</option>
                    <option value="CIRCUIT_BREAKER">MCB Circuit Breaker / Earthing</option>
                    <option value="OTHER">Other Installation Detail</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Caption / Note</label>
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="e.g. Dedicated 32A MCB switchboard"
                    className="w-full px-3 py-2 border border-[#1E2F2A] rounded-xl bg-[#111C19] text-[#E8F1EE] focus:outline-none focus:border-[#22E58B]"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    className="text-xs text-[#8DA39B] file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#111C19] file:text-[#E8F1EE] hover:file:bg-[#0A1210] cursor-pointer"
                  />
                  <label className="inline-flex items-center space-x-1.5 text-[#C5D5CF] font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPrimaryPhoto}
                      onChange={(e) => setIsPrimaryPhoto(e.target.checked)}
                      className="rounded text-[#22E58B] accent-[#22E58B]"
                    />
                    <span className="text-[11px]">Set as Primary Cover</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!photoFile || uploadingPhoto}
                  className="px-5 py-2.5 bg-[#22E58B] hover:bg-[#1BC878] disabled:opacity-50 text-[#04130C] font-extrabold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
