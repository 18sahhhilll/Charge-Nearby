import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Phone, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A1210] border-t border-[#1E2F2A] text-[#8DA39B] py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-[#22E58B] rounded-lg text-[#04130C] font-bold">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-lg text-[#E8F1EE]">Charge<span className="text-[#22E58B]">Nearby</span></span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#22E58B]/10 text-[#22E58B] border border-[#22E58B]/30 font-medium">
                Pune Prototype
              </span>
            </div>
            <p className="text-[#8DA39B] text-sm max-w-md leading-relaxed">
              Community-powered emergency EV charging discovery platform. Connecting EV drivers with low battery to
              verified private hosts and community charging points across Pune, Maharashtra.
            </p>
            <div className="flex items-center space-x-2.5 text-xs text-[#FCD34D] bg-[#FCD34D]/10 border border-[#FCD34D]/30 p-3 rounded-xl max-w-md">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#FCD34D]" />
              <span>
                <strong className="font-semibold text-[#E8F1EE]">Safety Promise:</strong> Straight-line distance is not travel distance. Always inspect real
                traffic and verify battery reserves before driving.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#E8F1EE] font-semibold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/find" className="text-[#C5D5CF] hover:text-[#22E58B] transition">Emergency Search</Link>
              </li>
              <li>
                <Link to="/help" className="text-[#C5D5CF] hover:text-[#22E58B] transition">How It Works & Safety</Link>
              </li>
              <li>
                <Link to="/login" className="text-[#C5D5CF] hover:text-[#22E58B] transition">Host a Charger</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[#C5D5CF] hover:text-[#22E58B] transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#C5D5CF] hover:text-[#22E58B] transition">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Emergency Assistance */}
          <div>
            <h4 className="text-[#E8F1EE] font-semibold text-xs uppercase tracking-wider mb-4">Pilot Support</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2.5 text-[#C5D5CF]">
                <Phone className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#8DA39B]">Roadside EV Helpline (India)</div>
                  <a href="tel:18002097979" className="font-semibold text-[#E8F1EE] hover:text-[#22E58B] transition">
                    1800-209-7979
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 text-[#C5D5CF]">
                <ShieldCheck className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#8DA39B]">Active Service Area</div>
                  <span className="font-medium text-[#E8F1EE]">Pune City & Suburbs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1E2F2A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8DA39B]">
          <p>© 2026 ChargeNearby. Pune EV Community Pilot.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-[#E8F1EE] transition">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#E8F1EE] transition">Terms of Service</Link>
            <span>•</span>
            <Link to="/help" className="hover:text-[#E8F1EE] transition">Safety Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
