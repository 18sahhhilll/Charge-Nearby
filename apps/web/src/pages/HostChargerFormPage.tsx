import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Zap, Check, ChevronLeft, MapPin, Lock, AlertCircle } from 'lucide-react';
import { chargerService } from '../services';
import { Charger } from '../types';
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
      } else {
        await chargerService.createHostCharger(payload);
      }
      navigate('/host/dashboard');
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
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Location & Secure Access Instructions</span>
            </h3>

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
    </div>
  );
};
