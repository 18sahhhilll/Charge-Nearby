import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, MapPin, Navigation, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FadeIn } from '../../components/motion';

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#0A1210] text-[#E8F1EE] pt-12 pb-20 md:pt-20 md:pb-28"
    >
      {/* Subtle Background Radial Emerald Glow & Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(34, 229, 139, 0.25), transparent 60%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(#22E58B 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <FadeIn delay={0.05} direction="down">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#22E58B]/10 border border-[#22E58B]/30 text-[#22E58B] text-xs font-semibold backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22E58B] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22E58B]" />
                </span>
                <span>Live in Pune</span>
                <span className="text-[#1E2F2A]">•</span>
                <span className="text-[#C5D5CF]">Emergency & Community Network</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#E8F1EE] leading-[1.12]"
              >
                Battery low?{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22E58B] to-emerald-200">
                  Charge from a neighbour
                </span>{' '}
                in minutes.
              </h1>
            </FadeIn>

            <FadeIn delay={0.25}>
              <p className="text-base sm:text-lg text-[#C5D5CF] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Don’t get stranded on Pune’s roads. ChargeNearby connects EV drivers facing critical battery with
                pre-verified private wallboxes, society bays, and reliable public DC fast hubs nearby.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.35}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/find"
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#22E58B] hover:bg-[#1BC878] text-[#04130C] font-extrabold rounded-2xl shadow-lg shadow-[#22E58B]/25 transition-all flex items-center justify-center space-x-2 text-base group cursor-pointer"
                >
                  <span className="relative flex h-2.5 w-2.5 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#04130C] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#04130C]" />
                  </span>
                  <span>Find a charger now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#for-hosts"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#111C19] hover:bg-[#16241F] text-[#E8F1EE] font-bold rounded-2xl border border-[#1E2F2A] hover:border-[#22E58B]/40 transition flex items-center justify-center space-x-2 text-base backdrop-blur-sm cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#22E58B]" />
                  <span>Become a host</span>
                </a>
              </div>
            </FadeIn>

            {/* Trust Row */}
            <FadeIn delay={0.45}>
              <div className="pt-4 border-t border-[#1E2F2A] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#8DA39B]">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22E58B] shrink-0" />
                  <span className="text-[#C5D5CF]">Verified Pune hosts</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <span className="text-[#C5D5CF]">Address hidden until accepted</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Zap className="w-4 h-4 text-[#FFD60A] shrink-0" />
                  <span className="text-[#C5D5CF]">Transparent flat rates</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Animated App UI Mock */}
          <div className="lg:col-span-5 relative">
            <FadeIn delay={0.2} direction="up">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Stylized Pune Map Card */}
                <div className="relative rounded-3xl bg-[#111C19] border border-[#1E2F2A] p-4 shadow-2xl overflow-hidden backdrop-blur-md">
                  {/* Map Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1E2F2A]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FCD34D]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#22E58B]" />
                      <span className="text-xs font-mono text-[#8DA39B] ml-2">pune-radar.chargenearby.in</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#22E58B] bg-[#22E58B]/10 border border-[#22E58B]/30 px-2 py-0.5 rounded-full">
                      Radius: 4.8 km
                    </span>
                  </div>

                  {/* Stylized Simulated Map Surface */}
                  <div className="relative h-64 sm:h-72 w-full mt-3 rounded-2xl bg-[#0A1210] overflow-hidden border border-[#1E2F2A]">
                    {/* Road Network Lines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="90" x2="100%" y2="120" stroke="#1E2F2A" strokeWidth="2" />
                      <line x1="0" y1="180" x2="100%" y2="160" stroke="#1E2F2A" strokeWidth="3" />
                      <line x1="120" y1="0" x2="200" y2="100%" stroke="#1E2F2A" strokeWidth="2" />
                      <line x1="280" y1="0" x2="220" y2="100%" stroke="#1E2F2A" strokeWidth="2.5" />
                      <circle cx="180" cy="140" r="45" stroke="#22E58B" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                    </svg>

                    {/* Animated Pulsing Radar from Driver Location */}
                    <div className="absolute top-[52%] left-[46%] -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        className="absolute -inset-8 rounded-full border border-[#22E58B]/40"
                        animate={shouldReduceMotion ? {} : { scale: [1, 2.2], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                      />
                      <motion.div
                        className="absolute -inset-14 rounded-full border border-[#22E58B]/20"
                        animate={shouldReduceMotion ? {} : { scale: [1, 2], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, delay: 0.8, ease: 'easeOut' }}
                      />
                      {/* Driver Marker */}
                      <div className="relative w-6 h-6 rounded-full bg-[#22E58B] border-2 border-[#0A1210] shadow-lg flex items-center justify-center text-[#04130C]">
                        <Navigation className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>

                    {/* Color-Coded Host Pins */}
                    {/* Pin 1: Reachable (Emerald) - Koregaon Park */}
                    <div className="absolute top-[28%] left-[68%] flex flex-col items-center">
                      <div className="px-2 py-0.5 rounded-md bg-[#22E58B] text-[#04130C] text-[10px] font-extrabold shadow-md mb-1 whitespace-nowrap">
                        7.4 kW • 1.2 km
                      </div>
                      <div className="w-4 h-4 rounded-full bg-[#22E58B] border-2 border-[#0A1210] shadow-md flex items-center justify-center">
                        <Zap className="w-2.5 h-2.5 text-[#04130C] fill-current" />
                      </div>
                    </div>

                    {/* Pin 2: Uncertain (Amber) - Viman Nagar */}
                    <div className="absolute top-[18%] left-[24%] flex flex-col items-center">
                      <div className="px-1.5 py-0.5 rounded-md bg-[#FCD34D] text-[#04130C] text-[9px] font-bold shadow-md mb-1 whitespace-nowrap">
                        3.3 kW • 3.8 km
                      </div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#FCD34D] border-2 border-[#0A1210] shadow-md" />
                    </div>

                    {/* Pin 3: Public Hub (Blue) - Amanora Mall */}
                    <div className="absolute bottom-[20%] right-[16%] flex flex-col items-center">
                      <div className="px-1.5 py-0.5 rounded-md bg-[#38BDF8] text-[#04130C] text-[9px] font-bold shadow-md mb-1 whitespace-nowrap">
                        60 kW DC
                      </div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#38BDF8] border-2 border-[#0A1210] shadow-md" />
                    </div>
                  </div>

                  {/* Quick Filter Pill Bar */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#8DA39B]">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#22E58B]" />
                      <span className="text-[#C5D5CF]">Pune East Zone (Koregaon Park)</span>
                    </span>
                    <span className="text-[#22E58B] font-semibold">Active Pilot Radar</span>
                  </div>
                </div>

                {/* Floating Charger Highlight Card (bobs gently) */}
                <motion.div
                  className="sm:absolute -bottom-8 -left-4 sm:-left-6 right-auto bg-[#16241F] text-[#E8F1EE] rounded-2xl p-4 shadow-2xl shadow-black/60 border border-[#1E2F2A] mt-4 sm:mt-0 max-w-xs backdrop-blur-md"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: [0, -6, 0],
                        }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-sm text-[#E8F1EE]">Koregaon Park Wallbox</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                      </div>
                      <p className="text-[11px] text-[#8DA39B] mt-0.5">7.4 kW Type 2 • 1.2 km away</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#22E58B]/10 text-[#22E58B] border border-[#22E58B]/30 uppercase tracking-wider">
                      Reachable
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#1E2F2A] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#8DA39B] block">Host Price</span>
                      <span className="font-extrabold text-[#FFD60A]">₹14</span>
                      <span className="text-[10px] text-[#8DA39B]">/kWh</span>
                    </div>
                    <Link
                      to="/find"
                      className="px-3 py-1 bg-[#22E58B] hover:bg-[#1BC878] text-[#04130C] font-bold rounded-lg text-[11px] transition shadow-sm"
                    >
                      Request Bay
                    </Link>
                  </div>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
