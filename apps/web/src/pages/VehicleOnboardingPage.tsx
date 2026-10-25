import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Battery,
  Zap,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { vehicleService } from '../services';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';
import { PageTransition, Stagger, StaggerItem, HoverLift } from '../components/motion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const POPULAR_PUNE_EVS = [
  { name: 'Tata Nexon EV (Long Range)', make: 'Tata', model: 'Nexon EV Empowered', type: 'CAR', batteryKwh: '40.5', connectors: ['CCS2', 'TYPE2'] },
  { name: 'Tata Tiago EV', make: 'Tata', model: 'Tiago EV XT', type: 'CAR', batteryKwh: '24.0', connectors: ['CCS2', 'TYPE2'] },
  { name: 'MG ZS EV', make: 'MG', model: 'ZS EV Exclusive', type: 'CAR', batteryKwh: '50.3', connectors: ['CCS2', 'TYPE2'] },
  { name: 'Ather 450X', make: 'Ather', model: '450X Gen 3', type: 'TWO_WHEELER', batteryKwh: '3.7', connectors: ['15A_3PIN'] },
  { name: 'Ola S1 Pro', make: 'Ola', model: 'S1 Pro Gen 2', type: 'TWO_WHEELER', batteryKwh: '4.0', connectors: ['15A_3PIN'] },
];

export const VehicleOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [vehicleType, setVehicleType] = useState<'CAR' | 'TWO_WHEELER' | 'THREE_WHEELER'>('CAR');
  const [batteryKwh, setBatteryKwh] = useState('');
  const [batteryPercent, setBatteryPercent] = useState('20');
  const [selectedConnectors, setSelectedConnectors] = useState<string[]>(['CCS2', 'TYPE2']);

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
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const toggleConnector = (connector: string) => {
    setSelectedConnectors((prev) =>
      prev.includes(connector) ? prev.filter((c) => c !== connector) : [...prev, connector]
    );
  };

  const applyPreset = (preset: typeof POPULAR_PUNE_EVS[0]) => {
    setMake(preset.make);
    setModel(preset.model);
    setVehicleType(preset.type as any);
    setBatteryKwh(preset.batteryKwh);
    setSelectedConnectors(preset.connectors);
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedConnectors.length === 0) {
      setError('Please select at least one supported charging plug type.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await vehicleService.create({
        make,
        model,
        vehicle_type: vehicleType,
        connector_types: selectedConnectors,
        battery_capacity_kwh: batteryKwh ? parseFloat(batteryKwh) : null,
        estimated_battery_percent: batteryPercent ? parseInt(batteryPercent) : null,
      });

      setMake('');
      setModel('');
      setBatteryKwh('');
      setBatteryPercent('20');
      setSelectedConnectors(['CCS2', 'TYPE2']);
      loadVehicles();
    } catch (err: any) {
      setError(err.message || 'Failed to save vehicle profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this vehicle profile?')) return;
    try {
      await vehicleService.delete(id);
      loadVehicles();
    } catch (err: any) {
      alert(err.message || 'Failed to delete vehicle.');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Badge variant="emerald">EV GARAGE & SPECIFICATIONS</Badge>
            <span className="text-xs text-[#8DA39B] font-semibold">Pune Pilot Range Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight flex items-center space-x-2.5">
            <span className="p-2 bg-[#22E58B] text-[#04130C] rounded-xl shadow-xs">
              <Car className="w-5 h-5" />
            </span>
            <span>Vehicle Profiles & Compatibility</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8DA39B]">
            Configure your electric vehicles so ChargeNearby can calculate reachability detour physics and match compatible plugs.
          </p>
        </div>

        {/* Popular Presets Strip */}
        <div className="bg-[#111C19] text-[#E8F1EE] border border-[#1E2F2A] rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#22E58B]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#E8F1EE] flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#22E58B]" />
              <span>One-Click Indian EV Presets:</span>
            </span>
            <span className="text-[11px] text-[#8DA39B]">Autofills battery capacity & connectors</span>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 pt-1">
            {POPULAR_PUNE_EVS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-[0.98] cursor-pointer ${
                  make === preset.make && model === preset.model
                    ? 'bg-[#22E58B] text-[#04130C] border-[#22E58B] font-extrabold shadow-sm'
                    : 'bg-[#16241F] text-[#C5D5CF] border-[#1E2F2A] hover:bg-[#1E2F2A] hover:text-[#E8F1EE]'
                }`}
              >
                {preset.name} ({preset.batteryKwh} kWh)
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Vehicle Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-[#E8F1EE]">
            <h2 className="text-lg font-extrabold text-[#E8F1EE] flex items-center space-x-2">
              <Plus className="w-5 h-5 text-[#22E58B]" />
              <span>Add Vehicle to Garage</span>
            </h2>

            {error && (
              <div className="p-4 bg-[rgba(255,90,95,0.12)] border border-[rgba(255,90,95,0.3)] text-[#FF5A5F] text-xs rounded-2xl">
                {error}
              </div>
            )}

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Make / Brand</label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Tata, Ather, MG"
                    className="w-full px-4 py-2.5 bg-[#16241F] border border-[#1E2F2A] rounded-xl text-[#E8F1EE] font-semibold focus:outline-none focus:border-[#22E58B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Nexon EV, 450X"
                    className="w-full px-4 py-2.5 bg-[#16241F] border border-[#1E2F2A] rounded-xl text-[#E8F1EE] font-semibold focus:outline-none focus:border-[#22E58B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#C5D5CF] mb-1">Vehicle Classification</label>
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
                      className={`py-2 px-3 rounded-xl border text-center transition font-semibold cursor-pointer ${
                        vehicleType === t.id
                          ? 'border-[#22E58B] bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-bold'
                          : 'border-[#1E2F2A] bg-[#16241F] text-[#8DA39B] hover:border-[#1E2F2A]/80 hover:text-[#E8F1EE]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#C5D5CF] mb-1">Supported Plugs / Connectors</label>
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
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          isChecked
                            ? 'border-[#22E58B] bg-[rgba(34,229,139,0.12)] text-[#22E58B] font-extrabold shadow-xs'
                            : 'border-[#1E2F2A] bg-[#16241F] text-[#8DA39B] hover:border-[#1E2F2A]/80 hover:text-[#E8F1EE]'
                        }`}
                      >
                        <span>{c.label}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-[#22E58B]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Battery Capacity (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={batteryKwh}
                    onChange={(e) => setBatteryKwh(e.target.value)}
                    placeholder="e.g. 40.5"
                    className="w-full px-4 py-2.5 bg-[#16241F] border border-[#1E2F2A] rounded-xl text-[#E8F1EE] font-bold focus:outline-none focus:border-[#22E58B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#C5D5CF] mb-1">Default SOC % (Triage)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={batteryPercent}
                    onChange={(e) => setBatteryPercent(e.target.value)}
                    placeholder="20"
                    className="w-full px-4 py-2.5 bg-[#16241F] border border-[#1E2F2A] rounded-xl text-[#E8F1EE] font-bold focus:outline-none focus:border-[#22E58B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold rounded-2xl transition shadow-lg shadow-[#22E58B]/20 text-xs cursor-pointer"
              >
                {submitting ? 'Saving Profile...' : 'Save Vehicle to Profile'}
              </button>
            </form>
          </div>

          {/* Saved Vehicles List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#E8F1EE]">Your Vehicles ({vehicles.length})</h2>
              <span className="text-xs text-[#8DA39B] font-medium">Auto-synced</span>
            </div>

            {vehicles.length === 0 ? (
              <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-8 text-center text-[#8DA39B] text-xs shadow-sm space-y-2">
                <Car className="w-8 h-8 text-[#8DA39B] mx-auto" />
                <p className="font-bold text-[#E8F1EE]">No vehicles added yet</p>
                <p className="text-[#8DA39B]">Configure your EV on the left or select a popular Pune preset above.</p>
              </div>
            ) : (
              <Stagger className="space-y-3">
                {vehicles.map((v) => (
                  <StaggerItem key={v.id}>
                    <HoverLift>
                      <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-5 shadow-sm space-y-3 transition hover:border-[#1E2F2A]/80">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="slate">{v.vehicle_type}</Badge>
                            <h3 className="font-extrabold text-[#E8F1EE] text-base mt-1.5">
                              {v.make} {v.model}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(v.id)}
                            className="text-[#8DA39B] hover:text-[#FF5A5F] p-1.5 rounded-lg hover:bg-[rgba(255,90,95,0.12)] transition cursor-pointer"
                            title="Remove Vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="bg-[#16241F] p-3 rounded-2xl border border-[#1E2F2A] text-xs text-[#C5D5CF] space-y-1">
                          <div><strong className="text-[#8DA39B]">Plugs:</strong> {v.connector_types.join(', ')}</div>
                          {v.battery_capacity_kwh && (
                            <div><strong className="text-[#8DA39B]">Pack:</strong> {v.battery_capacity_kwh} kWh Lithium-Ion</div>
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
                    className="w-full flex items-center justify-center space-x-2 py-3.5 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold rounded-2xl text-xs transition duration-150 shadow-md cursor-pointer"
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
