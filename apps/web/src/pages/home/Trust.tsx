import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, CheckCircle2, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FadeIn, HoverLift } from '../../components/motion';

export const Trust: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const verificationItems = [
    {
      title: 'Photo-Verified Wallbox & Plug',
      description:
        'Every host must submit photographic proof of the charging hardware, socket type (Type 2, 15A), and clear vehicle parking bay clearance.',
      badge: 'Hardware Verified',
    },
    {
      title: 'Dedicated MCB & Earthing Test',
      description:
        'Hosts must verify individual circuit breakers and earthing voltage (&lt;3V neutral-earth) to safeguard EV onboard chargers from spikes.',
      badge: 'Safety Inspection',
    },
    {
      title: 'Admin-Approved Pune Listings',
      description:
        'Zero automated spam. Every community wallbox is manually vetted by our Pune team before going live on the search index.',
      badge: 'Manual Review',
    },
    {
      title: 'Zero Contact Info Leakage',
      description:
        'Phone numbers and exact flat/house numbers are never indexed on search engines or revealed to unconfirmed accounts.',
      badge: 'Identity Guard',
    },
  ];

  return (
    <section id="safety" aria-labelledby="privacy-trust-heading" className="py-20 bg-[#0A1210]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-3 py-1 rounded-full border border-[#38BDF8]/30">
              Security & Safety First
            </span>
            <h2 id="privacy-trust-heading" className="text-3xl sm:text-4xl font-extrabold text-[#E8F1EE] mt-3">
              Built for homeowner safety and driver peace of mind
            </h2>
            <p className="text-[#C5D5CF] text-sm sm:text-base mt-2">
              We understand opening your driveway to neighbours requires ironclad privacy controls.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Privacy Lock Visual */}
          <div className="lg:col-span-6">
            <FadeIn delay={0.1}>
              <div className="bg-[#111C19] text-[#E8F1EE] rounded-3xl p-6 sm:p-8 border border-[#1E2F2A] shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-[#1E2F2A]">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-[#22E58B] font-semibold">CONFIDENTIALITY ENGINE</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsUnlocked(!isUnlocked)}
                    className="text-xs font-bold px-3 py-1 bg-[#16241F] hover:bg-[#1E2F2A] text-[#22E58B] border border-[#1E2F2A] rounded-lg transition cursor-pointer"
                  >
                    Click to test {isUnlocked ? 'Lock' : 'Acceptance'}
                  </button>
                </div>

                <div className="py-8 text-center space-y-4">
                  {/* Animated Lock Icon */}
                  <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                    <motion.div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                        isUnlocked ? 'bg-[#22E58B] text-[#04130C] shadow-lg shadow-[#22E58B]/30' : 'bg-[#16241F] text-[#FCD34D] border border-[#1E2F2A]'
                      }`}
                      animate={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: isUnlocked ? [0.95, 1.05, 1] : 1,
                            }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      {isUnlocked ? <Unlock className="w-9 h-9" /> : <Lock className="w-9 h-9" />}
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#E8F1EE]">
                      {isUnlocked ? 'Booking Accepted: Address Revealed' : 'Exact address stays private until accepted'}
                    </h3>
                    <p className="text-xs text-[#8DA39B] max-w-sm mx-auto mt-1">
                      {isUnlocked
                        ? 'Confidential gate code, society security instructions, and driveway bay are now unlocked.'
                        : 'Public search displays only the broad neighborhood (e.g. Koregaon Park). Exact street location is masked.'}
                    </p>
                  </div>

                  {/* Address State Display */}
                  <div className="bg-[#16241F] rounded-2xl p-4 border border-[#1E2F2A] text-left font-mono text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between items-center text-[11px] text-[#8DA39B] pb-1 border-b border-[#1E2F2A]">
                      <span>Public Search View:</span>
                      <span className="text-[#22E58B] font-bold">Koregaon Park, Pune</span>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] text-[#8DA39B] block uppercase">Confidential Bungalow Address:</span>
                      {isUnlocked ? (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[#22E58B] font-bold mt-0.5"
                        >
                          Bungalow #14, Lane 7, Near South Main Rd, Koregaon Park
                        </motion.div>
                      ) : (
                        <div className="flex items-center space-x-2 text-[#8DA39B] italic mt-0.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>•••••••••••••••••••••••••••••••••••••••• (Encrypted)</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8DA39B] block uppercase">Gate Access Protocol:</span>
                      {isUnlocked ? (
                        <div className="text-[#C5D5CF] text-[11px] mt-0.5">
                          "Tell guard: visiting Kulkarni residence. Charger is on driveway pillar left of portico."
                        </div>
                      ) : (
                        <div className="text-[#8DA39B] italic text-[11px] mt-0.5">
                          Hidden until host confirms booking
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Verification Checklist */}
          <div className="lg:col-span-6 space-y-4">
            <FadeIn delay={0.2}>
              <h3 className="text-2xl font-bold text-[#E8F1EE] mb-6 flex items-center space-x-2">
                <ShieldCheck className="w-7 h-7 text-[#38BDF8]" />
                <span>Our 4-Point Host Safety Verification</span>
              </h3>
            </FadeIn>

            <div className="space-y-3">
              {verificationItems.map((item, index) => (
                <FadeIn key={item.title} delay={0.15 + index * 0.08}>
                  <div className="p-4 rounded-2xl bg-[#111C19] border border-[#1E2F2A] hover:border-[#22E58B]/40 transition duration-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-[#16241F] text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#E8F1EE]">{item.title}</h4>
                          <p className="text-[#C5D5CF] text-xs mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 whitespace-nowrap">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
