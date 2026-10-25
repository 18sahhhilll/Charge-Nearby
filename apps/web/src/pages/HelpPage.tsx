import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Phone,
  Zap,
  Lock,
  Compass,
  FileCheck2,
  ChevronDown,
  Info,
  CheckCircle2,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from '../components/motion';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

interface HelpFaq {
  q: string;
  a: string;
}

const FAQS: HelpFaq[] = [
  {
    q: 'What should I do if my battery depletes before reaching the host gate?',
    a: 'Safely pull over to the road shoulder, engage hazard flashers, and call the 24/7 EV roadside helpline at 1800-209-7979. Flatbed tow trucks equipped with emergency battery boosters are stationed across Pune to transport your vehicle safely.',
  },
  {
    q: 'How does ChargeNearby calculate if my car can reach a charger?',
    a: 'We never use straight-line radar distance alone. Our algorithm applies Pune-specific topology factors: an average 1.35x real road detour multiplier, traffic choke-points, and air-conditioning draw to output honest REACHABLE, UNCERTAIN, or CRITICAL badges.',
  },
  {
    q: 'Why is the host’s exact house number hidden during initial search?',
    a: 'To safeguard homeowner privacy, public listings only reveal the broad locality (e.g. Koregaon Park). The exact bungalow number, society name, and gate guard instructions are unlocked only after the host reviews and confirms your booking.',
  },
  {
    q: 'What electrical specifications must a host wallbox meet?',
    a: 'All listed equipment must connect to a dedicated Miniature Circuit Breaker (MCB) with an active Residual Current Device (RCD). Neutral-to-earth voltage must be under 3V to prevent high-voltage tripping of onboard EV inverters.',
  },
];

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto py-6 sm:py-10 space-y-10 text-slate-900">
        {/* ========================================================= */}
        {/* HERO BANNER & EMERGENCY SOS STRIP                         */}
        {/* ========================================================= */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-xl text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.3), transparent 60%)',
            }}
          />

          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pune Pilot Safety & Compliance Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Safety, Standards &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Emergency Support
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Essential guidelines, electrical verification protocols, and real-time assistance procedures for EV
              drivers and private hosts participating in the Pune pilot.
            </p>
          </div>

          {/* Emergency Helpline Urgent Callout Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                  Critical Roadside Emergency Helpline (24/7)
                </span>
                <span className="text-xs text-slate-300">
                  Towing, mobile power pack, and roadside safety support across Pune
                </span>
              </div>
            </div>

            <a
              href="tel:18002097979"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition active:scale-[0.98]"
            >
              <span>Call 1800-209-7979</span>
            </a>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CORE PILLARS: 4 STRUCTURED SAFETY SECTIONS                */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Reachability Transparency */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Honest Reachability Physics</h3>
              </div>
              <Badge variant="amber" size="sm">
                1.35x Multiplier
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard GPS apps measure straight lines, misleading drivers on low battery. ChargeNearby applies:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">1.35x Road Detour Factor</strong>: Accounts for Pune winding street curves and diversions.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Elevation Losses</strong>: Flyovers and hills (e.g. Senapati Bapat, Katraj) draw additional kWh.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">AC Draw Allowance</strong>: If your battery is under 10%, turn off cabin climate immediately.
                </span>
              </li>
            </ul>

            <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                REACHABLE: &gt;15% reserve
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                UNCERTAIN: 5-14%
              </span>
            </div>
          </Card>

          {/* 2. Host Equipment Suitability */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Host Electrical Suitability</h3>
              </div>
              <Badge variant="emerald" size="sm">
                Hardware Verified
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every host charger listed on the Pune platform undergoes manual admin verification:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Dedicated MCB & RCD</strong>: Independent Miniature Circuit Breaker preventing domestic overload.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Earthing Inspection</strong>: Neutral-earth voltage must verify below 3V to protect onboard inverters.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">No Daisy Chaining</strong>: Unapproved household extension reels are strictly prohibited.
                </span>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100">
              Photographic proof of the wallbox and switchboard is required before listings are activated.
            </div>
          </Card>

          {/* 3. Address Privacy Protocols */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Address Privacy Protocols</h3>
              </div>
              <Badge variant="blue" size="sm">
                100% Encrypted
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We understand homeowner security concerns when sharing private driveway wallboxes:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">General Locality Only</strong>: Public maps only show neighborhood zones (e.g. Koregaon Park).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Two-Way Confirmation</strong>: Exact bungalow/gate numbers unlock only after the host clicks Accept.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Gate Guard Instructions</strong>: Society gate protocols are shared directly inside the booking HUD.
                </span>
              </li>
            </ul>
          </Card>

          {/* 4. Public Fast Hubs Backup */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Public Hub Fallback Lifeline</h3>
              </div>
              <Badge variant="blue" size="sm">
                24/7 Available
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              If all private hosts in your zone are busy, ChargeNearby automatically surfaces verified 24/7 commercial DC hubs:
            </p>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Hadapsar</span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">Amanora Mall 60kW</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Viman Nagar</span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">Phoenix 50kW DC</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Baner</span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">Balewadi High St</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Central Pune</span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">Pune Station 30kW</span>
              </div>
            </div>
          </Card>
        </div>

        {/* ========================================================= */}
        {/* FREQUENTLY ASKED SAFETY & SUPPORT QUESTIONS                */}
        {/* ========================================================= */}
        <div className="space-y-4 pt-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
              Safety Protocols
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Safety Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Clear answers regarding electrical safeguards, billing, and cancellations.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all duration-200 bg-white overflow-hidden shadow-sm ${
                    isOpen ? 'border-emerald-300 ring-1 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Desk Footer Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-extrabold text-slate-900 text-base sm:text-lg block">ChargeNearby Pilot Support Desk</span>
            <span className="text-xs sm:text-sm text-slate-500">Managed locally by our Pune mobility engineering team.</span>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="mailto:support@chargenearby.in"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition"
            >
              support@chargenearby.in
            </a>
            <a
              href="tel:18002097979"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-sm transition"
            >
              1800-209-7979
            </a>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
