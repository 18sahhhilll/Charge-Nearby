import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, MapPin, Database, Eye, Server, Phone, ChevronLeft, AlertTriangle } from 'lucide-react';
import { PageTransition } from '../components/motion';
import { Badge } from '../components/ui/Badge';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | ChargeNearby';
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 text-[#E8F1EE]">
        {/* Navigation Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#8DA39B] hover:text-[#22E58B] transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-2 border-b border-[#1E2F2A] pb-6">
          <div className="flex items-center space-x-2">
            <Badge variant="emerald">LEGAL & DATA PRACTICES</Badge>
            <span className="text-xs text-[#8DA39B] font-semibold">Pune Pilot Program</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#E8F1EE] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#8DA39B]">
            Effective Date: October 25, 2026 • Last Updated: October 25, 2026
          </p>
        </div>

        {/* Legal Pilot Notice Box */}
        <div className="p-4 bg-[#FCD34D]/10 border border-[#FCD34D]/30 rounded-2xl flex items-start space-x-3 text-xs text-[#FCD34D]">
          <AlertTriangle className="w-4 h-4 text-[#FCD34D] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#E8F1EE]">Pilot Program Transparency Notice</span>
            <p className="text-[#C5D5CF] mt-0.5 leading-relaxed">
              ChargeNearby is currently operating as an emergency EV charging technology pilot in Pune, Maharashtra. This policy
              details our actual technical data practices, including location handling, address encryption, and session storage.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-[#C5D5CF] leading-relaxed">
          {/* 1. Information Collected */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#E8F1EE] flex items-center space-x-2">
              <Database className="w-5 h-5 text-[#22E58B]" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              We collect only the technical and operational information necessary to facilitate safe community EV emergency charging:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#8DA39B]">
              <li>
                <strong className="text-[#E8F1EE]">Account Credentials:</strong> Full name, email address, hashed passwords (stored securely via Django authentication with PBKDF2/Argon2 one-way hashing), and optional mobile phone number for session coordination.
              </li>
              <li>
                <strong className="text-[#E8F1EE]">Vehicle Profiles:</strong> Electric vehicle make, model, connector plug types (Type 2, CCS2, 15A Socket), battery capacity in kWh, and estimated state-of-charge percentage to calculate reachability.
              </li>
              <li>
                <strong className="text-[#E8F1EE]">Host Charger Listings:</strong> Charger title, current output (AC or DC), maximum power in kW, supported connectors, parking access clearance, and session pricing models.
              </li>
              <li>
                <strong className="text-[#E8F1EE]">Location Data:</strong> Latitude and longitude coordinates acquired via the browser Geolocation API (only with your explicit permission) or selected manually on the Pune interactive map.
              </li>
            </ul>
          </section>

          {/* 2. Address Encryption & Host Privacy */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#E8F1EE] flex items-center space-x-2">
              <Lock className="w-5 h-5 text-[#22E58B]" />
              <span>2. Address Confidentiality and Two-Party Disclosure</span>
            </h2>
            <p>
              To protect residential homeowners and prevent unannounced arrivals:
            </p>
            <div className="bg-[#111C19] border border-[#1E2F2A] rounded-2xl p-5 space-y-2 text-xs text-[#C5D5CF]">
              <p>
                <strong className="text-[#E8F1EE]">Public Discovery:</strong> Only the broad neighborhood (such as "Koregaon Park" or "Baner") and approximate coordinates are visible on the public discovery map to calculate road distances.
              </p>
              <p>
                <strong className="text-[#E8F1EE]">Address Encryption:</strong> The exact residential street address, bungalow or apartment number, and private gate access instructions remain securely stored in the backend and are never displayed publicly.
              </p>
              <p>
                <strong className="text-[#E8F1EE]">Unlocking Mechanism:</strong> The exact residential address is revealed solely to a driver after the host explicitly reviews the request and clicks "Accept Emergency Access".
              </p>
            </div>
          </section>

          {/* 3. How We Use Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#E8F1EE] flex items-center space-x-2">
              <Eye className="w-5 h-5 text-[#22E58B]" />
              <span>3. How We Use Your Information</span>
            </h2>
            <p>Your data is used solely to provide platform services:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#8DA39B]">
              <li>To compute realistic driving distance using our Pune 1.35x road-detour algorithm.</li>
              <li>To evaluate vehicle connector compatibility and classify battery status (Reachable, Uncertain, or Critical).</li>
              <li>To notify hosts of incoming emergency charging requests.</li>
              <li>To record session telemetry (starting battery %, delivered kWh, and end battery %) for transparent receipts.</li>
              <li>We do not sell, rent, or monetize personal user data to third-party advertising networks.</li>
            </ul>
          </section>

          {/* 4. Session Storage & Tokens */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#E8F1EE] flex items-center space-x-2">
              <Server className="w-5 h-5 text-[#22E58B]" />
              <span>4. Authentication and Local Storage</span>
            </h2>
            <p>
              ChargeNearby uses JSON Web Tokens (JWT) to maintain authenticated sessions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#8DA39B]">
              <li>Authentication tokens are stored locally in your browser's localStorage.</li>
              <li>Tokens are transmitted over encrypted HTTPS connections in the authorization header.</li>
              <li>Logging out purges authentication tokens from your local browser storage immediately.</li>
            </ul>
          </section>

          {/* 5. Third-Party Integrations */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#E8F1EE] flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#22E58B]" />
              <span>5. Third-Party Services</span>
            </h2>
            <p>
              Our application interacts with selected external infrastructure services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#8DA39B]">
              <li>
                <strong className="text-[#E8F1EE]">OpenStreetMap Nominatim:</strong> Used for reverse geocoding to suggest neighborhood names from GPS coordinates.
              </li>
              <li>
                <strong className="text-[#E8F1EE]">Google Maps Navigation:</strong> When you click "Open in Google Maps", coordinates are passed to Google Maps to launch driving navigation.
              </li>
              <li>
                <strong className="text-[#E8F1EE]">Commercial Fast Hubs:</strong> Public fast charging stations (Tata Power, Jio-bp, ChargeZone) are indexed from verified public records as emergency fallbacks.
              </li>
            </ul>
          </section>

          {/* 6. User Rights & Account Management */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#E8F1EE] flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#22E58B]" />
              <span>6. User Rights and Data Deletion</span>
            </h2>
            <p>
              You maintain control over your personal data on ChargeNearby:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#8DA39B]">
              <li>You can edit or delete vehicle profiles at any time in your Garage settings.</li>
              <li>Hosts can toggle charger availability offline or remove equipment listings from their dashboard.</li>
              <li>To request complete account deletion or data removal, contact our pilot team at privacy@chargenearby.in.</li>
            </ul>
          </section>

          {/* 7. Contact Details */}
          <section className="space-y-3 border-t border-[#1E2F2A] pt-6">
            <h2 className="text-lg font-extrabold text-[#E8F1EE] flex items-center space-x-2">
              <Phone className="w-5 h-5 text-[#22E58B]" />
              <span>7. Contact & Privacy Inquiries</span>
            </h2>
            <p className="text-xs text-[#8DA39B]">
              For privacy inquiries regarding our Pune pilot operations, email us at{' '}
              <a href="mailto:privacy@chargenearby.in" className="text-[#22E58B] font-bold underline">
                privacy@chargenearby.in
              </a>
              . For immediate 24/7 EV roadside emergency towing in Pune, call{' '}
              <a href="tel:18002097979" className="text-[#22E58B] font-bold underline">
                1800-209-7979
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default PrivacyPage;
