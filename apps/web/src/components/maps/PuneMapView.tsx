import React, { useState } from 'react';
import { Charger, PublicHub } from '../../types';
import { MapPin, Navigation, Zap, BatteryCharging, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PuneMapViewProps {
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  chargers: Charger[];
  publicHubs?: PublicHub[];
  onSelectLocation?: (lat: number, lng: number) => void;
  selectedChargerId?: string | null;
  onSelectCharger?: (charger: Charger | null) => void;
}

export const PuneMapView: React.FC<PuneMapViewProps> = ({
  centerLat,
  centerLng,
  radiusKm,
  chargers,
  publicHubs = [],
  onSelectLocation,
  selectedChargerId,
  onSelectCharger
}) => {
  const [activePin, setActivePin] = useState<Charger | PublicHub | null>(null);

  // Pune bounding box coordinate projection parameters for SVG rendering:
  // Lat range: approx 18.44 to 18.64
  // Lng range: approx 73.72 to 73.96
  const MIN_LAT = 18.44;
  const MAX_LAT = 18.64;
  const MIN_LNG = 73.72;
  const MAX_LNG = 73.96;

  // Convert GPS coordinates to SVG percentages (0% to 100%)
  const toSvgX = (lng: number) => {
    const clamped = Math.max(MIN_LNG, Math.min(MAX_LNG, lng));
    return ((clamped - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
  };

  const toSvgY = (lat: number) => {
    // Invert Y because SVG coordinates increase downwards
    const clamped = Math.max(MIN_LAT, Math.min(MAX_LAT, lat));
    return 100 - ((clamped - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 100;
  };

  const userX = toSvgX(centerLng);
  const userY = toSvgY(centerLat);
  // Radius approximation in SVG percentage units (~111 km per degree)
  const radiusSvg = (radiusKm / (111.0 * (MAX_LAT - MIN_LAT))) * 100;

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onSelectLocation) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const clickedLng = MIN_LNG + (clickX / 100) * (MAX_LNG - MIN_LNG);
    const clickedLat = MAX_LAT - (clickY / 100) * (MAX_LAT - MIN_LAT);

    onSelectLocation(Number(clickedLat.toFixed(4)), Number(clickedLng.toFixed(4)));
  };

  return (
    <div className="relative w-full h-[520px] bg-[#0A1210] rounded-2xl overflow-hidden border border-[#1E2F2A] shadow-inner select-none">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-[#0A1210]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#1E2F2A] text-xs shadow-md flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="font-semibold text-[#E8F1EE]">You ({centerLat.toFixed(4)}, {centerLng.toFixed(4)})</span>
        </div>
        <span className="text-[#1E2F2A]">|</span>
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22E58B]" />
          <span className="text-[#C5D5CF]">Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FCD34D]" />
          <span className="text-[#C5D5CF]">Unconfirmed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
          <span className="text-[#C5D5CF]">Public Hub</span>
        </div>
      </div>

      {/* Manual Pin Pointer Hint */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#0A1210]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1E2F2A] text-[11px] text-[#8DA39B] flex items-center space-x-1.5">
        <MapPin className="w-3.5 h-3.5 text-[#22E58B]" />
        <span>Click anywhere on the map to set your search location manually.</span>
      </div>

      {/* SVG Map Canvas */}
      <svg
        className="w-full h-full cursor-crosshair"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        onClick={handleMapClick}
      >
        <defs>
          <radialGradient id="radiusGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </radialGradient>
          <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.3" />
          </pattern>
        </defs>

        {/* Map Grid & Pune Outlines */}
        <rect width="100" height="100" fill="#090d16" />
        <rect width="100" height="100" fill="url(#gridPattern)" />

        {/* Mula-Mutha River illustrative curves across Pune */}
        <path
          d="M 5,28 Q 30,35 48,46 T 95,50"
          fill="none"
          stroke="#0369a1"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />
        <path
          d="M 48,46 Q 55,60 70,85"
          fill="none"
          stroke="#0369a1"
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />

        {/* Major Localities Landmarks */}
        <text x="73" y="42" fill="#475569" fontSize="2.2" fontWeight="bold">Koregaon Park</text>
        <text x="36" y="70" fill="#475569" fontSize="2.2" fontWeight="bold">Kothrud</text>
        <text x="24" y="32" fill="#475569" fontSize="2.2" fontWeight="bold">Baner</text>
        <text x="82" y="30" fill="#475569" fontSize="2.2" fontWeight="bold">Viman Nagar</text>
        <text x="6" y="20" fill="#475569" fontSize="2.2" fontWeight="bold">Hinjawadi</text>
        <text x="50" y="55" fill="#334155" fontSize="2.4" fontWeight="bold">Pune Center (Shivajinagar)</text>

        {/* User Search Radius Range */}
        <circle
          cx={userX}
          cy={userY}
          r={radiusSvg}
          fill="url(#radiusGradient)"
          stroke="#3b82f6"
          strokeWidth="0.5"
          strokeDasharray="1.5,1.5"
        />

        {/* User Current Location Pin */}
        <circle cx={userX} cy={userY} r="2.2" fill="#3b82f6" opacity="0.4">
          <animate attributeName="r" values="2.2;4.5;2.2" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={userX} cy={userY} r="1.4" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.4" />

        {/* Verified Community Chargers */}
        {chargers.map((c) => {
          const lat = typeof c.latitude === 'string' ? parseFloat(c.latitude) : c.latitude;
          const lng = typeof c.longitude === 'string' ? parseFloat(c.longitude) : c.longitude;
          const cx = toSvgX(lng);
          const cy = toSvgY(lat);
          const isSelected = selectedChargerId === c.id || activePin?.id === c.id;
          const color = c.availability_status === 'AVAILABLE' ? '#10b981' : '#f59e0b';

          return (
            <g
              key={c.id}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={(e) => {
                e.stopPropagation();
                setActivePin(c);
                if (onSelectCharger) onSelectCharger(c);
              }}
            >
              {isSelected && (
                <circle cx={cx} cy={cy} r="3" fill={color} opacity="0.3" />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? "1.8" : "1.4"}
                fill={color}
                stroke="#0f172a"
                strokeWidth="0.4"
              />
              <circle cx={cx} cy={cy} r="0.6" fill="#ffffff" />
            </g>
          );
        })}

        {/* Public Commercial Hubs */}
        {publicHubs.map((hub) => {
          const cx = toSvgX(hub.longitude);
          const cy = toSvgY(hub.latitude);
          return (
            <g
              key={hub.id}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={(e) => {
                e.stopPropagation();
                setActivePin(hub);
              }}
            >
              <rect
                x={cx - 1}
                y={cy - 1}
                width="2"
                height="2"
                rx="0.5"
                fill="#06b6d4"
                stroke="#0f172a"
                strokeWidth="0.3"
              />
            </g>
          );
        })}
      </svg>

      {/* Selected Pin Details Modal / Card */}
      {activePin && (
        <div className="absolute bottom-4 right-4 z-30 w-80 bg-[#111C19]/95 backdrop-blur-lg border border-[#1E2F2A] p-4 rounded-2xl shadow-2xl text-[#E8F1EE]">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  'is_public_hub' in activePin
                    ? 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30'
                    : activePin.availability_status === 'AVAILABLE'
                    ? 'bg-[#22E58B]/10 text-[#22E58B] border border-[#22E58B]/30'
                    : 'bg-[#FCD34D]/10 text-[#FCD34D] border border-[#FCD34D]/30'
                }`}
              >
                {'is_public_hub' in activePin ? 'Public DC Fast Hub' : `${activePin.availability_status} Private`}
              </span>
              <h4 className="font-bold text-sm text-[#E8F1EE] mt-1 line-clamp-1">
                {'is_public_hub' in activePin ? activePin.name : activePin.title}
              </h4>
            </div>
            <button
              onClick={() => setActivePin(null)}
              className="text-[#8DA39B] hover:text-[#E8F1EE] text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="text-xs text-[#C5D5CF] space-y-1 mb-3">
            <div className="flex items-center text-[#8DA39B]">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#22E58B] shrink-0" />
              <span>{activePin.locality}</span>
            </div>
            <div className="flex items-center justify-between text-[#E8F1EE] pt-1 border-t border-[#1E2F2A]">
              <span>Power: {activePin.max_power_kw} kW ({activePin.charger_type})</span>
              <span className="font-semibold text-[#FFD60A] font-mono">
                {'is_public_hub' in activePin
                  ? activePin.pricing
                  : activePin.pricing_model === 'FIXED_SESSION'
                  ? `₹${activePin.session_price}/session`
                  : `₹${activePin.price_per_kwh}/kWh`}
              </span>
            </div>
            {activePin.distance_km !== undefined && (
              <div className="text-[11px] text-[#8DA39B]">
                Straight line: ~{activePin.distance_km} km | Est. road: ~{activePin.estimated_road_distance_km || Math.round(activePin.distance_km * 1.35)} km
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {'is_public_hub' in activePin ? (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activePin.latitude},${activePin.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#04130C] font-bold rounded-lg text-xs transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </a>
            ) : (
              <>
                <Link
                  to={`/chargers/${activePin.id}`}
                  className="flex-1 text-center py-1.5 px-3 bg-[#22E58B] hover:bg-[#1BC878] text-[#04130C] font-bold rounded-lg text-xs transition"
                >
                  View Details & Book
                </Link>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${centerLat},${centerLng}&destination=${activePin.latitude},${activePin.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Google Maps Navigation"
                  className="p-2 bg-[#16241F] hover:bg-[#1E2F2A] text-[#E8F1EE] border border-[#1E2F2A] rounded-lg text-xs flex items-center justify-center transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
