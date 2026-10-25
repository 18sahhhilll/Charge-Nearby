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
  Layers,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { discoveryService } from '../services';
import { Charger, DiscoveryResponse, PublicHub } from '../types';
import { PuneMapView } from '../components/maps/PuneMapView';
import { PageTransition, Stagger, StaggerItem, HoverLift } from '../components/motion';
import { ChargerCardSkeleton } from '../components/common/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const PUNE_PRESETS = [
  { name: 'Koregaon Park', lat: 18.5362, lng: 73.8940 },
  { name: 'Baner', lat: 18.5590, lng: 73.7868 },
  { name: 'Hinjawadi', lat: 18.5913, lng: 73.7389 },
  { name: 'Viman Nagar', lat: 18.5679, lng: 73.9143 },
  { name: 'Kothrud', lat: 18.5074, lng: 73.8077 },
  { name: 'Shivajinagar', lat: 18.5204, lng: 73.8567 },
];

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
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

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
        alert(`Location permission denied or unavailable (${err.message}). You can pick a location on the map or select a Pune zone preset.`);
      }
    );
  };

  const handleMapLocationSelect = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  const getBatteryStatusColor = (pct: number) => {
    if (pct <= 15) return 'text-rose-500 bg-rose-50 border-rose-200';
    if (pct <= 30) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-emerald-500 bg-emerald-50 border-emerald-200';
  };

  return (
    <PageTransition>
      <div className="space-y-6 py-4">
        {/* Top Command Bar */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <Badge variant="emerald" pulse>
                  PUNE PILOT LIVE
                </Badge>
                <span className="text-xs text-slate-400 font-mono">1.35x Road-Detour Physics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2.5">
                <span className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
                  <Zap className="w-5 h-5 fill-current" />
                </span>
                <span>Emergency EV Charger Discovery</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Real-time reachability engine for Pune EV drivers. Private host community wallboxes + verified commercial DC fast fallbacks.
              </p>
            </div>

            {/* Quick Actions & View Mode Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleUseGPS}
                disabled={gpsLoading}
                className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition shadow-sm"
              >
                <Navigation className={`w-4 h-4 text-emerald-400 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Acquiring GPS...' : 'Use My GPS'}</span>
              </button>

              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center space-x-2 px-4 py-2.5 border text-xs font-semibold rounded-xl transition ${
                  filtersOpen
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Filters & Tuning</span>
              </button>

              {/* View Switcher */}
              <div className="bg-slate-800/90 border border-slate-700/80 p-1 rounded-xl flex items-center text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode('both')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    viewMode === 'both' ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Split View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    viewMode === 'map' ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Map
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    viewMode === 'list' ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Quick Zone Presets Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center mr-1">
              <Compass className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Quick Pune Zones:
            </span>
            {PUNE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setLat(preset.lat);
                  setLng(preset.lng);
                }}
                className={`px-3 py-1 rounded-lg border text-[11px] font-medium transition ${
                  Math.abs(lat - preset.lat) < 0.005 && Math.abs(lng - preset.lng) < 0.005
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-semibold'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Collapsible Fine-Tuning Filters Bar */}
          {filtersOpen && (
            <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-xs animate-in fade-in duration-200">
              {/* Latitude */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 18.5204)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 73.8567)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Search Radius */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Search Radius</span>
                  <span className="font-bold text-emerald-400">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
                />
              </div>

              {/* Connector Type */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Connector</label>
                <select
                  value={connector}
                  onChange={(e) => setConnector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">Any Connector</option>
                  <option value="TYPE2">Type 2 (Mennekes AC)</option>
                  <option value="CCS2">CCS 2 DC Fast</option>
                  <option value="15A_3PIN">15A 3-Pin Socket</option>
                </select>
              </div>

              {/* Battery SOC */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Driver Battery (SOC)</span>
                  <span className={`font-bold ${batteryPercent <= 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {batteryPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  value={batteryPercent}
                  onChange={(e) => setBatteryPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
                />
              </div>

              {/* Available Now Toggle */}
              <div className="flex items-center sm:pt-5">
                <label className="inline-flex items-center space-x-2.5 cursor-pointer p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 w-full">
                  <input
                    type="checkbox"
                    checked={availableNow}
                    onChange={(e) => setAvailableNow(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded border-slate-600 focus:ring-emerald-500 accent-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-200">Online Only</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {(viewMode === 'both' || viewMode === 'map') && (
              <div className={viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-7'}>
                <div className="h-[480px] bg-slate-100 border border-slate-200 animate-pulse rounded-3xl" />
              </div>
            )}
            {(viewMode === 'both' || viewMode === 'list') && (
              <div className={`space-y-4 ${viewMode === 'list' ? 'lg:col-span-12' : 'lg:col-span-5'}`}>
                <ChargerCardSkeleton />
                <ChargerCardSkeleton />
                <ChargerCardSkeleton />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 flex items-start space-x-3 text-rose-800 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <div>
              <h4 className="font-bold">Discovery Engine Error</h4>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results Layout */}
        {!loading && data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map Column */}
            {(viewMode === 'both' || viewMode === 'map') && (
              <div className={viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-7'}>
                <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>Interactive Pune Map (Click to re-center)</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </span>
                  </div>
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
              </div>
            )}

            {/* List Column */}
            {(viewMode === 'both' || viewMode === 'list') && (
              <div className={`space-y-4 ${viewMode === 'list' ? 'lg:col-span-12' : 'lg:col-span-5'}`}>
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      {data.count} Verified Community {data.count === 1 ? 'Station' : 'Stations'}
                    </span>
                    <Badge variant="emerald">{radiusKm} km radius</Badge>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Sorted by distance</span>
                </div>

                {/* Private Chargers List */}
                {data.results.length > 0 ? (
                  <Stagger className="space-y-3.5">
                    {data.results.map((c) => (
                      <StaggerItem key={c.id}>
                        <HoverLift>
                          <div
                            onClick={() => setSelectedCharger(c)}
                            className={`bg-white border rounded-3xl p-5 shadow-sm transition hover:shadow-md cursor-pointer ${
                              selectedCharger?.id === c.id
                                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-start space-x-3.5">
                                {c.photos && c.photos.length > 0 ? (
                                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                                    <img
                                      src={c.photos[0].image_url || c.photos[0].image}
                                      alt={c.photos[0].caption || c.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Zap className="w-7 h-7" />
                                  </div>
                                )}
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant={c.availability_status === 'AVAILABLE' ? 'emerald' : 'amber'}
                                      pulse={c.availability_status === 'AVAILABLE'}
                                    >
                                      {c.availability_status}
                                    </Badge>
                                    <span className="text-[11px] font-semibold text-slate-500 flex items-center">
                                      <ShieldCheck className="w-3 h-3 text-blue-500 mr-1" />
                                      {c.host_display_name}
                                    </span>
                                  </div>
                                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">{c.title}</h3>
                                  <div className="flex items-center text-xs text-slate-500 space-x-2">
                                    <span className="flex items-center">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                                      {c.locality}
                                    </span>
                                    <span>•</span>
                                    <span className="font-semibold text-slate-700">{c.max_power_kw} kW {c.charger_type}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Price Pill */}
                              <div className="text-right shrink-0">
                                <div className="font-extrabold text-emerald-600 text-base">
                                  {c.pricing_model === 'FIXED_SESSION'
                                    ? `₹${c.session_price}`
                                    : `₹${c.price_per_kwh}`}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium">
                                  {c.pricing_model === 'FIXED_SESSION' ? 'flat session' : 'per kWh'}
                                </div>
                              </div>
                            </div>

                            {/* Reachability Card */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                  Road distance: <strong className="text-slate-900 font-bold">{c.estimated_road_distance_km} km</strong>{' '}
                                  (~{c.estimated_duration_minutes} min)
                                </span>
                                <Badge
                                  variant={
                                    c.reachability_status === 'REACHABLE'
                                      ? 'emerald'
                                      : c.reachability_status === 'CRITICAL'
                                      ? 'rose'
                                      : 'amber'
                                  }
                                >
                                  {c.reachability_status}
                                </Badge>
                              </div>
                              {c.reachability_notes && c.reachability_notes[0] && (
                                <p className="text-[11px] text-slate-500 italic">
                                  {c.reachability_notes[0]}
                                </p>
                              )}
                            </div>

                            {/* Footer Row */}
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div className="text-[11px] text-slate-400 flex items-center">
                                <Clock className="w-3 h-3 mr-1 text-slate-400" />
                                <span>
                                  {c.availability_freshness_minutes !== null && c.availability_freshness_minutes !== undefined
                                    ? `Host confirmed ${c.availability_freshness_minutes}m ago`
                                    : 'Live equipment status'}
                                </span>
                              </div>

                              <Link
                                to={`/chargers/${c.id}`}
                                className="inline-flex items-center space-x-1 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 group"
                              >
                                <span>Request Access</span>
                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                              </Link>
                            </div>
                          </div>
                        </HoverLift>
                      </StaggerItem>
                    ))}
                  </Stagger>
                ) : (
                  /* Empty State with Advisory */
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base">No Private Chargers Within {radiusKm} km</h3>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                      {data.fallback_info.advisory}
                    </p>
                    <button
                      type="button"
                      onClick={() => setRadiusKm((prev) => Math.min(25, prev + 5))}
                      className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-sm transition"
                    >
                      <span>Expand Radius to {radiusKm + 5} km</span>
                    </button>
                  </div>
                )}

                {/* Public Commercial DC Fast Hub Alternatives */}
                {data.alternatives && data.alternatives.length > 0 && (
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                        <Layers className="w-4 h-4 text-blue-500" />
                        <span>Public Commercial Fast Hubs</span>
                      </span>
                      <span className="text-[11px] text-slate-400">Emergency 24/7 Fallbacks</span>
                    </div>

                    <div className="space-y-2.5">
                      {data.alternatives.map((hub) => (
                        <div
                          key={hub.id}
                          className="bg-blue-50/40 border border-blue-200/60 rounded-2xl p-4 text-xs space-y-2 hover:bg-blue-50/70 transition"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="blue">{hub.operator}</Badge>
                              <h4 className="font-extrabold text-slate-900 text-sm mt-1">{hub.name}</h4>
                            </div>
                            <span className="font-bold text-blue-800 text-xs">{hub.pricing}</span>
                          </div>

                          <div className="flex items-center text-slate-600 text-xs space-x-2">
                            <span>{hub.locality}</span>
                            <span>•</span>
                            <span className="font-semibold">{hub.max_power_kw} kW {hub.charger_type}</span>
                            <span>•</span>
                            <span>{hub.connector_types.join(', ')}</span>
                          </div>

                          <div className="pt-2.5 flex items-center justify-between border-t border-blue-100">
                            <span className="text-[11px] text-slate-500">
                              Estimated road distance: ~<strong>{hub.estimated_road_distance_km || Math.round((hub.distance_km || 0) * 1.35)} km</strong>
                            </span>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${hub.latitude},${hub.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-extrabold text-xs"
                            >
                              <span>Navigate</span>
                              <ExternalLink className="w-3.5 h-3.5" />
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
    </PageTransition>
  );
};
