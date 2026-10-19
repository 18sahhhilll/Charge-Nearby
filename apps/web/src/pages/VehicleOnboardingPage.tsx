import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, Trash2, Check, ArrowRight, BatteryCharging } from 'lucide-react';
import { vehicleService } from '../services';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';

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
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <Car className="w-6 h-6 text-emerald-500" />
          <span>Vehicle Profiles</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Add your electric vehicles so ChargeNearby can filter compatible connectors and estimate reachability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Vehicle Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-emerald-500" />
            <span>Add Electric Vehicle</span>
          </h2>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Make / Brand</label>
                <input
                  type="text"
                  required
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Tata, Ather, MG"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Model</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Nexon EV, 450X"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="CAR">4-Wheeler Car</option>
                <option value="TWO_WHEELER">2-Wheeler (Scooter/Bike)</option>
                <option value="THREE_WHEELER">3-Wheeler</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Supported Connectors</label>
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
                      className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{c.label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Battery (kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={batteryKwh}
                  onChange={(e) => setBatteryKwh(e.target.value)}
                  placeholder="e.g. 40.5"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Current % (Triage)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={batteryPercent}
                  onChange={(e) => setBatteryPercent(e.target.value)}
                  placeholder="20"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-md"
            >
              {submitting ? 'Saving...' : 'Add Vehicle'}
            </button>
          </form>
        </div>

        {/* Saved Vehicles List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Your Configured Vehicles</h2>
          {vehicles.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs">
              No vehicles added yet. Add one on the left to start finding compatible chargers.
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((v) => (
                <div key={v.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {v.vehicle_type}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">
                        {v.make} {v.model}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remove Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap gap-2">
                    <span>Connectors: <strong>{v.connector_types.join(', ')}</strong></span>
                    {v.battery_capacity_kwh && (
                      <span>• Battery: <strong>{v.battery_capacity_kwh} kWh</strong></span>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <button
                  onClick={() => navigate('/find')}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  <span>Proceed to Nearby Charger Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
