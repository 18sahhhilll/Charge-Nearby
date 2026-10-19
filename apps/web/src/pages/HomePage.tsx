import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Navigation, ShieldCheck, BatteryCharging, AlertCircle, MapPin, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState({
    name: 'Pune Center (Shivajinagar)',
    lat: 18.5308,
    lng: 73.8475,
  });
  const [batteryPercent, setBatteryPercent] = useState<number>(20);

  const presets = [
    { name: 'Shivajinagar', lat: 18.5308, lng: 73.8475 },
    { name: 'Koregaon Park', lat: 18.5362, lng: 73.8940 },
    { name: 'Baner High St.', lat: 18.5590, lng: 73.7868 },
    { name: 'Kothrud', lat: 18.5074, lng: 73.8077 },
    { name: 'Viman Nagar', lat: 18.5679, lng: 73.9143 },
    { name: 'Hinjawadi Ph 1', lat: 18.5913, lng: 73.7389 },
  ];

  const handleQuickSearch = () => {
    navigate(`/find?lat=${selectedPreset.lat}&lng=${selectedPreset.lng}&battery=${batteryPercent}`);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      handleQuickSearch();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        navigate(`/find?lat=${pos.coords.latitude.toFixed(4)}&lng=${pos.coords.longitude.toFixed(4)}&battery=${batteryPercent}`);
      },
      () => {
        handleQuickSearch();
      }
    );
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-slate-800 text-white p-8 md:p-14 shadow-2xl">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Community EV Emergency Discovery • Pune Pilot</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Low Battery? Discover Verified <span className="text-emerald-400">Private Chargers</span> Nearby.
          </h1>

          <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed">
            Community-powered EV charger-sharing for drivers in urgent need. Verified private bungalow hosts,
            societies, and small businesses sharing charging access across Pune.
          </p>

          {/* Emergency Triage Card */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Quick Emergency Search</span>
              <span className="text-emerald-400">Live Pilot Database</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Locality Selector */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Location in Pune</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setSelectedPreset(p)}
                      className={`text-xs p-2 rounded-lg border text-left transition ${
                        selectedPreset.name === p.name
                          ? 'border-emerald-400 bg-emerald-500/20 text-white font-semibold'
                          : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <MapPin className="w-3 h-3 inline mr-1 text-emerald-400" />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Battery % */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Current Battery: <span className="text-emerald-400 font-bold">{batteryPercent}%</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="50"
                  value={batteryPercent}
                  onChange={(e) => setBatteryPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Critical (5%)</span>
                  <span>Low (20%)</span>
                  <span>50%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleQuickSearch}
                className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>Find Nearby Chargers</span>
              </button>

              <button
                onClick={handleUseGPS}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium py-3.5 px-5 rounded-xl transition"
              >
                <Navigation className="w-4 h-4 text-blue-400" />
                <span>Use Current GPS</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Engineered for Real Emergency Reliability
          </h2>
          <p className="text-slate-600 text-sm">
            We do not promise reachability based on straight lines or raw battery guesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Community Verified Equipment</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every host listing is reviewed for connector compatibility, dedicated parking, and safe electrical access
              before public approval.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Honest Reachability Scoring</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We factor in urban Pune road detour factors (~1.35x) and conservative consumption estimates, flagging
              uncertainty openly when data is tight.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Privacy & Safety Gating</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Exact residential addresses and gate access instructions remain strictly hidden until the host explicitly
              accepts your emergency booking request.
            </p>
          </div>
        </div>
      </section>

      {/* Host CTA Banner */}
      <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Become a Host</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white">
            Have a Private EV Wallbox or 15A Socket in Pune?
          </h3>
          <p className="text-slate-400 text-sm">
            Help fellow EV drivers in urgent emergencies while monetizing your idle driveway charger when you are home.
          </p>
        </div>
        <button
          onClick={() => navigate('/register')}
          className="shrink-0 flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg transition"
        >
          <span>List Your Charger</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
