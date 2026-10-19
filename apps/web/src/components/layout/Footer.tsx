import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Phone, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-emerald-500 rounded-md text-slate-950 font-bold">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-lg text-white">ChargeNearby</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Pune Prototype
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Community-powered emergency EV charging discovery platform. Connecting EV drivers with low battery to
              verified private hosts and community charging points across Pune, Maharashtra.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/60 p-3 rounded-lg max-w-md">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Safety Promise:</strong> Straight-line distance is not travel distance. Always inspect real
                traffic and verify battery reserves before driving.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/find" className="hover:text-emerald-400 transition">Emergency Search</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-emerald-400 transition">How It Works & Safety</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition">Host a Charger</Link>
              </li>
              <li>
                <a href="http://127.0.0.1:8000/api/docs/" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">
                  OpenAPI Specs (DRF)
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Assistance */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Pilot Support</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Roadside EV Helpline (India)</div>
                  <a href="tel:18002097979" className="font-semibold text-white hover:text-emerald-400 transition">
                    1800-209-7979
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Active Service Area</div>
                  <span className="font-medium text-slate-200">Pune City & Suburbs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 ChargeNearby. Built for Pune EV Community. Not affiliated with governmental distribution entities.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span>Pilot Stage Prototype</span>
            <span>•</span>
            <span>UTC Clock</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
