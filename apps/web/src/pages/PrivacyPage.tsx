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
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="flex items-center space-x-2">
            <Badge variant="emerald">LEGAL & DATA PRACTICES</Badge>
            <span className="text-xs text-slate-400 font-semibold">Pune Pilot Program</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            Effective Date: October 25, 2026 • Last Updated: October 25, 2026
          </p>
        </div>

        {/* Legal Pilot Notice Box */}
        <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Pilot Program Transparency Notice</span>
            <p className="text-amber-800 mt-0.5 leading-relaxed">
              ChargeNearby is currently operating as an emergency EV charging technology pilot in Pune, Maharashtra. This policy
              details our actual technical data practices, including location handling, address encryption, and session storage.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* 1. Information Collected */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              We collect only the technical and operational information necessary to facilitate safe community EV emergency charging:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>Account Credentials:</strong> Full name, email address, hashed passwords (stored securely via Django authentication with PBKDF2/Argon2 one-way hashing), and optional mobile phone number for session coordination.
              </li>
              <li>
                <strong>Vehicle Profiles:</strong> Electric vehicle make, model, connector plug types (Type 2, CCS2, 15A Socket), battery capacity in kWh, and estimated state-of-charge percentage to calculate reachability.
              </li>
              <li>
                <strong>Host Charger Listings:</strong> Charger title, current output (AC or DC), maximum power in kW, supported connectors, parking access clearance, and session pricing models.
              </li>
              <li>
                <strong>Location Data:</strong> Latitude and longitude coordinates acquired via the browser Geolocation API (only with your explicit permission) or selected manually on the Pune interactive map.
              </li>
            </ul>
          </section>

          {/* 2. Address Encryption & Host Privacy */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>2. Address Confidentiality and Two-Party Disclosure</span>
            </h2>
            <p>
              To protect residential homeowners and prevent unannounced arrivals:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 text-xs text-slate-700">
              <p>
                <strong>Public Discovery:</strong> Only the broad neighborhood (such as "Koregaon Park" or "Baner") and approximate coordinates are visible on the public discovery map to calculate road distances.
              </p>
              <p>
                <strong>Address Encryption:</strong> The exact residential street address, bungalow or apartment number, and private gate access instructions remain securely stored in the backend and are never displayed publicly.
              </p>
              <p>
                <strong>Unlocking Mechanism:</strong> The exact residential address is revealed solely to a driver after the host explicitly reviews the request and clicks "Accept Emergency Access".
              </p>
            </div>
          </section>

          {/* 3. How We Use Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              <span>3. How We Use Your Information</span>
            </h2>
            <p>Your data is used solely to provide platform services:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>To compute realistic driving distance using our Pune 1.35x road-detour algorithm.</li>
              <li>To evaluate vehicle connector compatibility and classify battery status (Reachable, Uncertain, or Critical).</li>
              <li>To notify hosts of incoming emergency charging requests.</li>
              <li>To record session telemetry (starting battery %, delivered kWh, and end battery %) for transparent receipts.</li>
              <li>We do not sell, rent, or monetize personal user data to third-party advertising networks.</li>
            </ul>
          </section>

          {/* 4. Session Storage & Tokens */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Server className="w-5 h-5 text-emerald-600" />
              <span>4. Authentication and Local Storage</span>
            </h2>
            <p>
              ChargeNearby uses JSON Web Tokens (JWT) to maintain authenticated sessions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Authentication tokens are stored locally in your browser's localStorage.</li>
              <li>Tokens are transmitted over encrypted HTTPS connections in the authorization header.</li>
              <li>Logging out purges authentication tokens from your local browser storage immediately.</li>
            </ul>
          </section>

          {/* 5. Third-Party Integrations */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>5. Third-Party Services</span>
            </h2>
            <p>
              Our application interacts with selected external infrastructure services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>OpenStreetMap Nominatim:</strong> Used for reverse geocoding to suggest neighborhood names from GPS coordinates.
              </li>
              <li>
                <strong>Google Maps Navigation:</strong> When you click "Open in Google Maps", coordinates are passed to Google Maps to launch driving navigation.
              </li>
              <li>
                <strong>Commercial Fast Hubs:</strong> Public fast charging stations (Tata Power, Jio-bp, ChargeZone) are indexed from verified public records as emergency fallbacks.
              </li>
            </ul>
          </section>

          {/* 6. User Rights & Account Management */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>6. User Rights and Data Deletion</span>
            </h2>
            <p>
              You maintain control over your personal data on ChargeNearby:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>You can edit or delete vehicle profiles at any time in your Garage settings.</li>
              <li>Hosts can toggle charger availability offline or remove equipment listings from their dashboard.</li>
              <li>To request complete account deletion or data removal, contact our pilot team at privacy@chargenearby.in.</li>
            </ul>
          </section>

          {/* 7. Contact Details */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>7. Contact & Privacy Inquiries</span>
            </h2>
            <p className="text-xs text-slate-600">
              For privacy inquiries regarding our Pune pilot operations, email us at{' '}
              <a href="mailto:privacy@chargenearby.in" className="text-emerald-700 font-bold underline">
                privacy@chargenearby.in
              </a>
              . For immediate 24/7 EV roadside emergency towing in Pune, call{' '}
              <a href="tel:18002097979" className="text-emerald-700 font-bold underline">
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
