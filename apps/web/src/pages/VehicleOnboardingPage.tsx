import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Plus,
  Trash2,
  Check,
  ArrowRight,
  BatteryCharging,
  Zap,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { vehicleService } from '../services';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';
import { PageTransition, Stagger, StaggerItem, HoverLift } from '../components/motion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface IndianEVPreset {
  name: string;
  make: string;
  model: string;
  type: 'CAR' | 'TWO_WHEELER';
  connectors: string[];
  batteryKwh: string;
}

const POPULAR_PUNE_EVS: IndianEVPreset[] = [
  { name: 'Tata Nexon EV', make: 'Tata', model: 'Nexon EV', type: 'CAR', connectors: ['TYPE2', 'CCS2'], batteryKwh: '40.5' },
  { name: 'Tata Punch EV', make: 'Tata', model: 'Punch EV', type: 'CAR', connectors: ['TYPE2', 'CCS2'], batteryKwh: '35.0' },
  { name: 'MG ZS EV', make: 'MG', model: 'ZS EV', type: 'CAR', connectors: ['TYPE2', 'CCS2'], batteryKwh: '50.3' },
  { name: 'Mahindra XUV400', make: 'Mahindra', model: 'XUV400', type: 'CAR', connectors: ['TYPE2', 'CCS2'], batteryKwh: '39.4' },
  { name: 'Ather 450X', make: 'Ather', model: '450X', type: 'TWO_WHEELER', connectors: ['15A_3PIN'], batteryKwh: '3.7' },
  { name: 'Ola S1 Pro', make: 'Ola', model: 'S1 Pro', type: 'TWO_WHEELER', connectors: ['15A_3PIN'], batteryKwh: '4.0' },
];

export const VehicleOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [make, setMake] = useState('Tata');
  const [model, setModel] = useState('Nexon EV');
  const [nickname, setNickname] = useState('');
  const [vehicleType, setVehicleType] = useState<'CAR' | 'TWO_WHEELER' | 'THREE_WHEELER'>('CAR');
  const [selectedConnectors, setSelectedConnectors] = useState<string[]>(['TYPE2', 'CCS2']);
  const [batteryKwh, setBatteryKwh] = useState('40.5');
  const [batteryPercent, setBatteryPercent] = useState('20');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/onboarding/vehicle');
      return;
    }
    loadVehicles();
  }, [isAuthenticated, navigate]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.list();
      setVehicles(data);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: IndianEVPreset) => {
    setMake(preset.make);
    setModel(preset.model);
    setVehicleType(preset.type);
    setSelectedConnectors(preset.connectors);
    setBatteryKwh(preset.batteryKwh);
  };

  const toggleConnector = (conn: string) => {
    if (selectedConnectors.includes(conn)) {
      if (selectedConnectors.length > 1) {
        setSelectedConnectors(selectedConnectors.filter((c) => c !== conn));
      }
    } else {
      setSelectedConnectors([...selectedConnectors, conn]);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await vehicleService.create({
        make,
        model,
        nickname: nickname || undefined,
        vehicle_type: vehicleType,
        connector_types: selectedConnectors,
        battery_capacity_kwh: batteryKwh ? parseFloat(batteryKwh) : undefined,
        estimated_battery_percent: batteryPercent ? parseInt(batteryPercent) : undefined,
      });
      setNickname('');
      loadVehicles();
    } catch (err: any) {
      setError(err.message || 'Failed to save vehicle profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this vehicle?')) return;
    try {
      await vehicleService.delete(id);
      loadVehicles();
    } catch {
      alert('Failed to remove vehicle.');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto py-6 space-y-8">
        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Badge variant="emerald">EV GARAGE</Badge>
            <span className="text-xs text-slate-400 font-semibold">Triage & Reachability Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <span className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
              <Car className="w-5 h-5" />
            </span>
            <span>Vehicle Profiles & Compatibility</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure your electric vehicles so ChargeNearby can calculate reachability detour physics and match compatible plugs.
          </p>
        </div>

        {/* Popular Presets Strip */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>One-Click Indian EV Presets:</span>
            </span>
            <span className="text-[11px] text-slate-400">Autofills battery capacity & connectors</span>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 pt-1">
            {POPULAR_PUNE_EVS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-[0.98] ${
                  make === preset.make && model === preset.model
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {preset.name} ({preset.batteryKwh} kWh)
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Vehicle Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              <span>Add Vehicle to Garage</span>
            </h2>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl">
                {error}
              </div>
            )}

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Make / Brand</label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Tata, Ather, MG"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Nexon EV, 450X"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Classification</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CAR', label: '4W Car' },
                    { id: 'TWO_WHEELER', label: '2W Scooter' },
                    { id: 'THREE_WHEELER', label: '3W Auto' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setVehicleType(t.id as any)}
                      className={`py-2 px-3 rounded-xl border text-center transition font-semibold ${
                        vehicleType === t.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Supported Plugs / Connectors</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'TYPE2', label: 'Type 2 AC' },
                    { id: 'CCS2', label: 'CCS 2 DC' },
                    { id: '15A_3PIN', label: '15A 3-Pin Socket' },
                    { id: 'CHADEMO', label: 'CHAdeMO DC' },
                  ].map((c) => {
                    const isChecked = selectedConnectors.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleConnector(c.id)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                          isChecked
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-extrabold shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span>{c.label}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Battery Capacity (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={batteryKwh}
                    onChange={(e) => setBatteryKwh(e.target.value)}
                    placeholder="e.g. 40.5"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Default SOC % (Triage)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={batteryPercent}
                    onChange={(e) => setBatteryPercent(e.target.value)}
                    placeholder="20"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-extrabold rounded-2xl transition shadow-lg shadow-emerald-500/20 text-xs"
              >
                {submitting ? 'Saving Profile...' : 'Save Vehicle to Profile'}
              </button>
            </form>
          </div>

          {/* Saved Vehicles List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white">Your Vehicles ({vehicles.length})</h2>
              <span className="text-xs text-slate-400 font-medium">Auto-synced</span>
            </div>

            {vehicles.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs shadow-sm space-y-2">
                <Car className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">No vehicles added yet</p>
                <p className="text-slate-400">Configure your EV on the left or select a popular Pune preset above.</p>
              </div>
            ) : (
              <Stagger className="space-y-3">
                {vehicles.map((v) => (
                  <StaggerItem key={v.id}>
                    <HoverLift>
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 transition hover:border-slate-300">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="slate">{v.vehicle_type}</Badge>
                            <h3 className="font-extrabold text-slate-900 text-base mt-1.5">
                              {v.make} {v.model}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(v.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                            title="Remove Vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                          <div><strong>Plugs:</strong> {v.connector_types.join(', ')}</div>
                          {v.battery_capacity_kwh && (
                            <div><strong>Pack:</strong> {v.battery_capacity_kwh} kWh Lithium-Ion</div>
                          )}
                        </div>
                      </div>
                    </HoverLift>
                  </StaggerItem>
                ))}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/find')}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-extrabold rounded-2xl text-xs transition duration-150 shadow-md"
                  >
                    <span>Proceed to Charger Discovery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Stagger>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
