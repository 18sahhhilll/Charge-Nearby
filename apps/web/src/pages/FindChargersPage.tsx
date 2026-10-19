import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Zap,
  MapPin,
  Filter,
  Navigation,
  Battery,
  AlertTriangle,
  RotateCw,
  Sliders,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import { discoveryService } from '../services';
import { Charger, DiscoveryResponse, PublicHub } from '../types';
import { PuneMapView } from '../components/maps/PuneMapView';

export const FindChargersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Location state (defaulting to Pune Shivajinagar)
  const initialLat = parseFloat(searchParams.get('lat') || '18.5204');
  const initialLng = parseFloat(searchParams.get('lng') || '73.8567');
  const initialBattery = searchParams.get('battery') ? parseInt(searchParams.get('battery')!) : 20;

  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [radiusKm, setRadiusKm] = useState<number>(5.0);
  const [connector, setConnector] = useState<string>('');
  const [chargerType, setChargerType] = useState<string>('');
  const [availableNow, setAvailableNow] = useState<boolean>(false);
  const [batteryPercent, setBatteryPercent] = useState<number>(initialBattery);
  const [vehicleType, setVehicleType] = useState<string>('CAR');

  // UI state
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DiscoveryResponse | null>(null);
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  const fetchNearby = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await discoveryService.searchNearby({
        lat,
        lng,
        radius_km: radiusKm,
        connector: connector || undefined,
        charger_type: chargerType || undefined,
        available_now: availableNow,
        battery_percent: batteryPercent,
        vehicle_type: vehicleType,
      });
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Failed to search for chargers nearby.');
    } finally {
      setLoading(false);
    }
  }, [lat, lng, radiusKm, connector, chargerType, availableNow, batteryPercent, vehicleType]);

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(4));
        const newLng = Number(pos.coords.longitude.toFixed(4));
        setLat(newLat);
        setLng(newLng);
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        alert(`Location permission denied or unavailable (${err.message}). You can pick a location on the map or type coordinates below.`);
      }
    );
  };

  const handleMapLocationSelect = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Search & Filter Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <Zap className="w-6 h-6 text-emerald-500 fill-current" />
              <span>Emergency EV Charger Discovery</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Finding verified private community chargers and emergency fallback options in Pune.
            </p>
          </div>

          {/* View Toggles & GPS */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUseGPS}
              disabled={gpsLoading}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              <Navigation className={`w-3.5 h-3.5 text-blue-600 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsLoading ? 'Locating...' : 'Use My GPS'}</span>
            </button>

            <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs font-medium">
              <button
                onClick={() => setViewMode('both')}
                className={`px-3 py-1.5 rounded-md transition ${viewMode === 'both' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-md transition ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Latitude */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 18.5204)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value) || 73.8567)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Search Radius */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Radius: <span className="font-bold text-slate-800">{radiusKm} km</span>
            </label>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1.5"
            />
          </div>

          {/* Connector Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Connector</label>
            <select
              value={connector}
              onChange={(e) => setConnector(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">Any Connector</option>
              <option value="TYPE2">Type 2 (Mennekes AC)</option>
              <option value="CCS2">CCS 2 DC Fast</option>
              <option value="15A_3PIN">15A 3-Pin Socket</option>
            </select>
          </div>

          {/* Battery % Input for Reachability */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Current Battery: <span className="font-bold text-emerald-600">{batteryPercent}%</span>
            </label>
            <input
              type="range"
              min="2"
              max="60"
              value={batteryPercent}
              onChange={(e) => setBatteryPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1.5"
            />
          </div>

          {/* Available Now Toggle */}
          <div className="flex items-center pt-5">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={availableNow}
                onChange={(e) => setAvailableNow(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700">Available Now</span>
            </label>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <RotateCw className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
          <p className="text-sm font-medium text-slate-600">Querying verified Pune community chargers...</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start space-x-3 text-rose-800 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
          <div>
            <h4 className="font-bold">Discovery Error</h4>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map View Column */}
          {(viewMode === 'both' || viewMode === 'map') && (
            <div className={viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-7'}>
              <PuneMapView
                centerLat={lat}
                centerLng={lng}
                radiusKm={radiusKm}
                chargers={data.results}
                publicHubs={data.alternatives}
                onSelectLocation={handleMapLocationSelect}
                selectedChargerId={selectedCharger?.id}
                onSelectCharger={(ch) => setSelectedCharger(ch)}
              />
            </div>
          )}

          {/* List View Column */}
          {(viewMode === 'both' || viewMode === 'list') && (
            <div className={`space-y-4 ${viewMode === 'list' ? 'lg:col-span-12' : 'lg:col-span-5'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {data.count} Verified Community {data.count === 1 ? 'Option' : 'Options'}
                </span>
                <span className="text-xs text-slate-400">Within {radiusKm} km radius</span>
              </div>

              {/* Private Chargers List */}
              {data.results.length > 0 ? (
                <div className="space-y-3">
                  {data.results.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCharger(c)}
                      className={`bg-white border rounded-2xl p-4 shadow-sm transition hover:shadow-md cursor-pointer ${
                        selectedCharger?.id === c.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                c.availability_status === 'AVAILABLE'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {c.availability_status}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              Host: {c.host_display_name}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                        </div>

                        {/* Pricing */}
                        <div className="text-right shrink-0">
                          <div className="font-bold text-emerald-600 text-sm">
                            {c.pricing_model === 'FIXED_SESSION'
                              ? `₹${c.session_price}`
                              : `₹${c.price_per_kwh}`}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {c.pricing_model === 'FIXED_SESSION' ? 'per session' : 'per kWh'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-slate-500 space-x-3 mb-2.5">
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                          {c.locality}
                        </span>
                        <span>•</span>
                        <span>{c.max_power_kw} kW {c.charger_type}</span>
                        <span>•</span>
                        <span>{(c.connector_types || []).join(', ')}</span>
                      </div>

                      {/* Reachability & Route Estimates */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span>
                            Road route: ~<strong>{c.estimated_road_distance_km} km</strong> (est. {c.estimated_duration_minutes} min)
                          </span>
                          <span
                            className={`font-bold ${
                              c.reachability_status === 'REACHABLE'
                                ? 'text-emerald-600'
                                : c.reachability_status === 'CRITICAL'
                                ? 'text-rose-600'
                                : 'text-amber-600'
                            }`}
                          >
                            {c.reachability_status}
                          </span>
                        </div>
                        {c.reachability_notes && c.reachability_notes[0] && (
                          <div className="text-[10px] text-slate-500 italic">
                            {c.reachability_notes[0]}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[11px] text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>
                            {c.availability_freshness_minutes !== null && c.availability_freshness_minutes !== undefined
                              ? `Confirmed ${c.availability_freshness_minutes}m ago`
                              : 'Unconfirmed freshness'}
                          </span>
                        </div>

                        <Link
                          to={`/chargers/${c.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                        >
                          <span>Request Access</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State with Advisory */
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h3 className="font-bold text-slate-900 text-sm">No Private Chargers Within {radiusKm} km</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    {data.fallback_info.advisory}
                  </p>
                  <button
                    onClick={() => setRadiusKm((prev) => Math.min(25, prev + 5))}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-amber-500 transition"
                  >
                    <span>Expand Radius to {radiusKm + 5} km</span>
                  </button>
                </div>
              )}

              {/* Public DC Fast Hub Alternatives (Section 10 Fallback) */}
              {data.alternatives && data.alternatives.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 flex items-center space-x-1">
                      <Layers className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Public Commercial Fast Hubs</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Pune Public DC Hubs</span>
                  </div>

                  <div className="space-y-2.5">
                    {data.alternatives.map((hub) => (
                      <div
                        key={hub.id}
                        className="bg-cyan-50/40 border border-cyan-200/60 rounded-xl p-3 text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800">
                              {hub.operator}
                            </span>
                            <h4 className="font-bold text-slate-900 text-xs mt-1">{hub.name}</h4>
                          </div>
                          <span className="font-semibold text-cyan-800 text-[11px]">{hub.pricing}</span>
                        </div>

                        <div className="flex items-center text-slate-600 text-[11px] space-x-2">
                          <span>{hub.locality}</span>
                          <span>•</span>
                          <span>{hub.max_power_kw} kW {hub.charger_type}</span>
                          <span>•</span>
                          <span>{hub.connector_types.join(', ')}</span>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-cyan-100/80">
                          <span className="text-[10px] text-slate-500">
                            Road distance: ~{hub.estimated_road_distance_km || Math.round((hub.distance_km || 0) * 1.35)} km
                          </span>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${hub.latitude},${hub.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-cyan-700 hover:text-cyan-800 font-bold text-[11px]"
                          >
                            <span>Navigate</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
