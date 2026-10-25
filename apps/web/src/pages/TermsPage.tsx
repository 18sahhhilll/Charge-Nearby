import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldAlert, Zap, AlertTriangle, ChevronLeft, CheckCircle2, Phone } from 'lucide-react';
import { PageTransition } from '../components/motion';
import { Badge } from '../components/ui/Badge';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms and Conditions | ChargeNearby';
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
            <Badge variant="emerald">TERMS OF SERVICE</Badge>
            <span className="text-xs text-slate-400 font-semibold">Pune Pilot Operating Rules</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-sm text-slate-500">
            Effective Date: October 25, 2026 • Status: Pilot Prototype Phase
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Pilot Stage Notice and Legal Review Requirement</span>
            <p className="text-amber-800 mt-0.5 leading-relaxed">
              ChargeNearby is currently an EV emergency charging discovery prototype operating in Pune, Maharashtra. These terms
              define the operational rules governing community equipment sharing. Formal review by qualified legal counsel is
              required prior to commercial public rollout.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* 1. Platform Intermediary Role */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span>1. Nature of the ChargeNearby Platform</span>
            </h2>
            <p>
              ChargeNearby operates solely as a community technology platform connecting electric vehicle (EV) drivers requiring
              emergency charging with independent private hosts and public commercial charging facilities.
            </p>
            <p className="text-xs text-slate-600">
              ChargeNearby is not an electrical utility, energy distributor, or charging equipment manufacturer. All charging transactions,
              parking bay access, and equipment usage take place directly between drivers and independent hosts.
            </p>
          </section>

          {/* 2. User Eligibility & Accounts */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>2. User Eligibility & Registration</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Drivers must hold a valid Indian motor vehicle driving license and operate roadworthy, insured electric vehicles.</li>
              <li>Hosts must have legal authorization to permit temporary parking and vehicle charging on the designated residential driveway or commercial property.</li>
              <li>Users are responsible for safeguarding their account credentials and session access tokens.</li>
            </ul>
          </section>

          {/* 3. Host Safety & Equipment Obligations */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>3. Host Obligations and Electrical Safety</span>
            </h2>
            <p>
              Hosts listing charging wallboxes or 15A industrial sockets agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>Dedicated Circuit Protection:</strong> Ensure charging equipment is connected to a dedicated miniature circuit breaker (MCB) or residual current circuit breaker (RCCB) with proper earthing.
              </li>
              <li>
                <strong>Accurate Specifications:</strong> Provide truthful information regarding connector type (Type 2, CCS2, 15A Socket), maximum power output in kW, and parking clearance.
              </li>
              <li>
                <strong>Bay Clearance:</strong> Ensure the designated driveway or visitor parking space is unobstructed and safe for vehicle access upon accepting an emergency request.
              </li>
              <li>
                <strong>Availability Control:</strong> Maintain accurate online/offline availability status in the host dashboard to prevent driver diversion to unavailable bays.
              </li>
            </ul>
          </section>

          {/* 4. Driver Responsibilities & Confidential Address Use */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              <span>4. Driver Conduct and Residential Access Rules</span>
            </h2>
            <p>
              Drivers requesting emergency community charging agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>Confidentiality:</strong> Use host residential addresses, bungalow numbers, and gate security codes solely for the accepted emergency session. Drivers may not record, publish, or disclose host addresses to any third party.
              </li>
              <li>
                <strong>No Unannounced Arrivals:</strong> Visiting or entering private residential premises without an active, accepted booking request is strictly prohibited and constitutes unlawful trespassing.
              </li>
              <li>
                <strong>Prompt Departure:</strong> Promptly unplug and vacate the host's parking bay once the emergency charge is completed to respect host property and community guidelines.
              </li>
            </ul>
          </section>

          {/* 5. Pricing, Quoted Snapshots & Cancellations */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span>5. Pricing, Quoted Rates & Cancellations</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>Quoted Snapshot:</strong> The price per kWh, price per minute, or fixed flat session fee is locked at the moment an emergency request is submitted.
              </li>
              <li>
                <strong>Zero Cancellation Fees:</strong> Drivers may cancel an emergency request at zero charge before the host accepts.
              </li>
              <li>
                <strong>Disputes:</strong> Any metering or billing discrepancies must be reported to support@chargenearby.in within 24 hours of session completion.
              </li>
            </ul>
          </section>

          {/* 6. Electrical Liability & Limitation */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-emerald-600" />
              <span>6. Electrical Liability Disclaimer</span>
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 space-y-2">
              <p>
                To the fullest extent permitted by applicable Indian law, ChargeNearby disclaims liability for any direct, indirect,
                or consequential damages arising from:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Electrical grid fluctuations, power cuts, or voltage surges originating from local distribution infrastructure.</li>
                <li>Faults, degradation, or tripping of vehicle onboard chargers or battery management systems.</li>
                <li>Host electrical panel failures or domestic wiring defects.</li>
                <li>Delays resulting from traffic congestion, road detours, or unconfirmed availability.</li>
              </ul>
              <p className="text-[11px] text-slate-500 pt-1">
                Drivers must always observe vehicle manufacturer charging instructions and verify charger compatibility before connecting.
              </p>
            </div>
          </section>

          {/* 7. Emergency Support & Contact */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>7. Emergency Support & Contact</span>
            </h2>
            <p className="text-xs text-slate-600">
              For questions regarding these pilot terms, email legal@chargenearby.in. For emergency vehicle flatbed towing
              and roadside assistance across Pune, call{' '}
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

export default TermsPage;
