import React from 'react';
import { ShieldCheck, AlertTriangle, Phone, Zap, FileText } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
          <ShieldCheck className="w-7 h-7 text-emerald-500" />
          <span>Safety, Compliance & Support</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Everything you need to know about participating in the ChargeNearby Pune Pilot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safety & Reachability */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Reachability Transparency</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            ChargeNearby does not guarantee that a charger is reachable based only on straight-line distance or battery
            percentage. Always account for Pune traffic, road detour factors (~1.35x), elevations, and air-conditioning
            consumption.
          </p>
        </div>

        {/* Private Equipment Guidelines */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Host Electrical Suitability</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Host chargers must use dedicated miniature circuit breakers (MCBs) with residual current devices (RCDs).
            Unapproved daisy-chain extension cords are strictly prohibited. Equipment is verified before public listing.
          </p>
        </div>

        {/* Privacy Gating */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Address Privacy Protocols</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Public search only exposes the general neighborhood (e.g. Koregaon Park). The exact bungalow/society address
            and access code are never publicly indexed and only reveal to a confirmed driver once accepted by the host.
          </p>
        </div>

        {/* Emergency Assistance Helpline */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Emergency Roadside Assistance</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            If your battery is depleted before reaching a charger, stop safely on the road shoulder and contact the 24/7
            EV roadside helpline:
          </p>
          <a
            href="tel:18002097979"
            className="inline-block font-extrabold text-sm text-emerald-600 hover:underline"
          >
            📞 1800-209-7979 (Toll Free)
          </a>
        </div>
      </div>
    </div>
  );
};
