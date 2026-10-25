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
import { fadeUp, staggerContainer, viewportSettings } from '../lib/motion';

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
      <div className="max-w-5xl mx-auto py-6 sm:py-10 space-y-10 text-[#E8F1EE]">
        {/* ========================================================= */}
        {/* HERO BANNER & EMERGENCY SOS STRIP                         */}
        {/* ========================================================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative rounded-3xl overflow-hidden bg-[#111C19] border border-[#1E2F2A] p-6 sm:p-10 shadow-xl text-[#E8F1EE]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(34, 229, 139, 0.25), transparent 60%)',
            }}
          />

          <div className="relative z-10 space-y-4 max-w-2xl">
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#22E58B]/10 border border-[#22E58B]/30 text-[#22E58B] text-xs font-semibold backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22E58B]" />
                <span>Pune Pilot Safety & Compliance Hub</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#E8F1EE] tracking-tight">
              Safety, Standards &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22E58B] via-emerald-300 to-[#38BDF8]">
                Emergency Support
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-sm sm:text-base text-[#C5D5CF] leading-relaxed">
              Essential guidelines, electrical verification protocols, and real-time assistance procedures for EV
              drivers and private hosts participating in the Pune pilot.
            </motion.p>
          </div>

          {/* Emergency Helpline Urgent Callout Bar */}
          <motion.div variants={fadeUp} className="mt-8 pt-6 border-t border-[#1E2F2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center shrink-0 border border-[#FF5A5F]/30">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#FF5A5F] uppercase tracking-wider block">
                  Critical Roadside Emergency Helpline (24/7)
                </span>
                <span className="text-xs text-[#C5D5CF]">
                  Towing, mobile power pack, and roadside safety support across Pune
                </span>
              </div>
            </div>

            <a
              href="tel:18002097979"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#FF5A5F] hover:bg-[#FF5A5F]/90 text-white font-black text-xs sm:text-sm shadow-lg transition active:scale-[0.98]"
            >
              <span>Call 1800-209-7979</span>
            </a>
          </motion.div>
        </motion.div>

        {/* ========================================================= */}
        {/* CORE PILLARS: 4 STRUCTURED SAFETY SECTIONS                */}
        {/* ========================================================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportSettings}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* 1. Reachability Transparency */}
          <motion.div variants={fadeUp} className="h-full">
            <Card className="space-y-4 h-full">
            <div className="flex items-center justify-between border-b border-[#1E2F2A] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#16241F] text-[#FCD34D] flex items-center justify-center border border-[#1E2F2A]">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-[#E8F1EE]">Honest Reachability Physics</h3>
              </div>
              <Badge variant="amber" size="sm">
                1.35x Multiplier
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-[#C5D5CF] leading-relaxed">
              Standard GPS apps measure straight lines, misleading drivers on low battery. ChargeNearby applies:
            </p>

            <ul className="space-y-2.5 text-xs text-[#C5D5CF]">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#E8F1EE]">1.35x Road Detour Factor</strong>: Accounts for Pune winding street curves and diversions.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#E8F1EE]">Elevation Losses</strong>: Flyovers and hills (e.g. Senapati Bapat, Katraj) draw additional kWh.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#E8F1EE]">AC Draw Allowance</strong>: If your battery is under 10%, turn off cabin climate immediately.
                </span>
              </li>
            </ul>

            <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-[#22E58B]/10 text-[#22E58B] border border-[#22E58B]/30 font-semibold">
                REACHABLE: &gt;15% reserve
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#FCD34D]/10 text-[#FCD34D] border border-[#FCD34D]/30 font-semibold">
                UNCERTAIN: 5-14%
              </span>
            </div>
          </Card>
          </motion.div>

          {/* 2. Host Equipment Suitability */}
          <motion.div variants={fadeUp} className="h-full">
            <Card className="space-y-4 h-full">
            <div className="flex items-center justify-between border-b border-[#1E2F2A] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#16241F] text-[#22E58B] flex items-center justify-center border border-[#1E2F2A]">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-[#E8F1EE]">Host Electrical Suitability</h3>
              </div>
              <Badge variant="emerald" size="sm">
                Hardware Verified
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-[#C5D5CF] leading-relaxed">
              Every host charger listed on the Pune platform undergoes manual admin verification:
            </p>

            <ul className="space-y-2.5 text-xs text-[#C5D5CF]">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#E8F1EE]">Dedicated MCB & RCD</strong>: Independent Miniature Circuit Breaker preventing domestic overload.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#E8F1EE]">Earthing Inspection</strong>: Neutral-earth voltage must verify below 3V to protect onboard inverters.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#E8F1EE]">No Daisy Chaining</strong>: Unapproved household extension reels are strictly prohibited.
                </span>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-[#8DA39B] border-t border-[#1E2F2A]">
              Photographic proof of the wallbox and switchboard is required before listings are activated.
            </div>
          </Card>
          </motion.div>

          {/* 3. Address Privacy Protocols */}
          <motion.div variants={fadeUp} className="h-full">
            <Card className="space-y-4 h-full">
            <div className="flex items-center justify-between border-b border-[#1E2F2A] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#16241F] text-[#38BDF8] flex items-center justify-center border border-[#1E2F2A]">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-[#E8F1EE]">Address Privacy Protocols</h3>
              </div>
              <Badge variant="blue" size="sm">
                100% Encrypted
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-[#C5D5CF] leading-relaxed">
              We understand homeowner security concerns when sharing private driveway wallboxes:
            </p>

            <ul className="space-y-2.5 text-xs text-[#C5D5CF]">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#E8F1EE]">General Locality Only</strong>: Public maps only show neighborhood zones (e.g. Koregaon Park).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#E8F1EE]">Two-Way Confirmation</strong>: Exact bungalow/gate numbers unlock only after the host clicks Accept.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22E58B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#E8F1EE]">Gate Guard Instructions</strong>: Society gate protocols are shared directly inside the booking HUD.
                </span>
              </li>
            </ul>
          </Card>
          </motion.div>

          {/* 4. Public Fast Hubs Backup */}
          <motion.div variants={fadeUp} className="h-full">
            <Card className="space-y-4 h-full">
            <div className="flex items-center justify-between border-b border-[#1E2F2A] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#16241F] text-[#38BDF8] flex items-center justify-center border border-[#1E2F2A]">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-[#E8F1EE]">Public Hub Fallback Lifeline</h3>
              </div>
              <Badge variant="blue" size="sm">
                24/7 Available
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-[#C5D5CF] leading-relaxed">
              If all private hosts in your zone are busy, ChargeNearby automatically surfaces verified 24/7 commercial DC hubs:
            </p>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#16241F] border border-[#1E2F2A]">
                <span className="text-[#8DA39B] text-[10px] font-bold uppercase tracking-wider block">Hadapsar</span>
                <span className="font-extrabold text-[#E8F1EE] text-xs sm:text-sm">Amanora Mall 60kW</span>
              </div>
              <div className="p-3 rounded-xl bg-[#16241F] border border-[#1E2F2A]">
                <span className="text-[#8DA39B] text-[10px] font-bold uppercase tracking-wider block">Viman Nagar</span>
                <span className="font-extrabold text-[#E8F1EE] text-xs sm:text-sm">Phoenix 50kW DC</span>
              </div>
              <div className="p-3 rounded-xl bg-[#16241F] border border-[#1E2F2A]">
                <span className="text-[#8DA39B] text-[10px] font-bold uppercase tracking-wider block">Baner</span>
                <span className="font-extrabold text-[#E8F1EE] text-xs sm:text-sm">Balewadi High St</span>
              </div>
              <div className="p-3 rounded-xl bg-[#16241F] border border-[#1E2F2A]">
                <span className="text-[#8DA39B] text-[10px] font-bold uppercase tracking-wider block">Central Pune</span>
                <span className="font-extrabold text-[#E8F1EE] text-xs sm:text-sm">Pune Station 30kW</span>
              </div>
            </div>
          </Card>
          </motion.div>
        </motion.div>

        {/* ========================================================= */}
        {/* FREQUENTLY ASKED SAFETY & SUPPORT QUESTIONS                */}
        {/* ========================================================= */}
        <div className="space-y-4 pt-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportSettings}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#22E58B] bg-[#22E58B]/10 px-3 py-1 rounded-full border border-[#22E58B]/30 inline-block mb-2">
              Safety Protocols
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight">
              Frequently Asked Safety Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#8DA39B] mt-1">
              Clear answers regarding electrical safeguards, billing, and cancellations.
            </p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all duration-200 bg-[#111C19] overflow-hidden shadow-sm ${
                    isOpen ? 'border-[#22E58B]/50 ring-1 ring-[#22E58B]/20' : 'border-[#1E2F2A] hover:border-[#22E58B]/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#E8F1EE] flex items-center justify-between gap-4 hover:bg-[#16241F] transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-[#22E58B]' : 'text-[#8DA39B]'}`} />
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
                        <div className="px-4 sm:px-5 pb-5 pt-2 text-xs sm:text-sm text-[#C5D5CF] leading-relaxed border-t border-[#1E2F2A] bg-[#16241F]">
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
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportSettings}
          className="p-6 sm:p-8 rounded-3xl bg-[#111C19] border border-[#1E2F2A] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-extrabold text-[#E8F1EE] text-base sm:text-lg block">ChargeNearby Pilot Support Desk</span>
            <span className="text-xs sm:text-sm text-[#8DA39B]">Managed locally by our Pune mobility engineering team.</span>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="mailto:support@chargenearby.in"
              className="px-4 py-2.5 rounded-xl bg-[#16241F] hover:bg-[#1E2F2A] text-[#E8F1EE] font-bold text-xs sm:text-sm border border-[#1E2F2A] transition"
            >
              support@chargenearby.in
            </a>
            <a
              href="tel:18002097979"
              className="px-4 py-2.5 rounded-xl bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.98] text-[#04130C] font-extrabold text-xs sm:text-sm shadow-sm transition"
            >
              1800-209-7979
            </a>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};
