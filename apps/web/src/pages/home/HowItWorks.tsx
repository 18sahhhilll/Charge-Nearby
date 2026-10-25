import React from 'react';
import { Search, Send, Zap, ArrowRight, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FadeIn, Stagger, StaggerItem, HoverLift } from '../../components/motion';

export const HowItWorks: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    {
      number: '01',
      title: 'Search & Calculate',
      icon: <Search className="w-6 h-6 text-[#22E58B]" />,
      tagline: 'Instant GPS reachability',
      description:
        'Input your remaining battery percentage and connector type (Type 2, CCS2, 15A socket). Our Pune traffic algorithm flags each charger as REACHABLE, UNCERTAIN, or CRITICAL before you drive.',
      badge: 'Step 1: REQUESTED',
    },
    {
      number: '02',
      title: 'Host Acceptance',
      icon: <Send className="w-6 h-6 text-[#22E58B]" />,
      tagline: 'Direct mobile dispatch',
      description:
        'The host receives your request with estimated arrival time. To protect host privacy, exact bungalow numbers and access codes are revealed only after the host approves your session.',
      badge: 'Step 2: ACCEPTED',
    },
    {
      number: '03',
      title: 'Plug In & Go',
      icon: <Zap className="w-6 h-6 text-[#22E58B]" />,
      tagline: 'Verified earthing & MCB',
      description:
        'Follow private gate instructions, park in the dedicated driveway, plug in, and mark ARRIVED. Complete your emergency charge with transparent per-kWh or fixed flat pricing.',
      badge: 'Step 3: CHARGING & COMPLETED',
    },
  ];

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-20 bg-[#0A1210]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#22E58B] bg-[#22E58B]/10 px-3 py-1 rounded-full border border-[#22E58B]/30">
              Driver Flow
            </span>
            <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-extrabold text-[#E8F1EE] mt-3">
              How ChargeNearby rescues you in 3 simple steps
            </h2>
            <p className="text-[#C5D5CF] text-sm sm:text-base mt-2">
              Designed specifically for EV drivers on single-digit battery who cannot risk driving to broken chargers.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Animated Connecting Horizontal Line on Desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-28 left-[16%] right-[16%] h-0.5 bg-[#1E2F2A] -z-0"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[#22E58B] via-emerald-300 to-[#22E58B]"
              initial={{ width: 0 }}
              whileInView={shouldReduceMotion ? { width: '100%' } : { width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
          </div>

          <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => (
              <StaggerItem key={step.number}>
                <HoverLift>
                  <div className="h-full bg-[#111C19] border border-[#1E2F2A] hover:border-[#22E58B]/40 transition-colors rounded-3xl p-7 shadow-xs flex flex-col justify-between">
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#16241F] border border-[#1E2F2A] shadow-sm flex items-center justify-center">
                          {step.icon}
                        </div>
                        <span className="text-2xl font-black text-[#8DA39B]/40 font-mono">{step.number}</span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#22E58B]">
                          {step.tagline}
                        </span>
                        <h3 className="text-xl font-bold text-[#E8F1EE]">{step.title}</h3>
                        <p className="text-[#C5D5CF] text-xs sm:text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#1E2F2A] flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#16241F] border border-[#1E2F2A] text-[#8DA39B]">
                        {step.badge}
                      </span>
                      <Check className="w-4 h-4 text-[#22E58B]" />
                    </div>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* 5-step booking lifecycle footnote */}
        <FadeIn delay={0.2}>
          <div className="mt-12 p-4 rounded-2xl bg-[#111C19] border border-[#1E2F2A] max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8DA39B]">
            <span className="font-bold text-[#E8F1EE]">Complete 5-Step Lifecycle:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[11px]">
              <span className="px-2 py-0.5 bg-[#16241F] border border-[#1E2F2A] rounded text-[#C5D5CF]">1. REQUESTED</span>
              <ArrowRight className="w-3 h-3 text-[#8DA39B]" />
              <span className="px-2 py-0.5 bg-[#16241F] border border-[#1E2F2A] rounded text-[#C5D5CF]">2. ACCEPTED</span>
              <ArrowRight className="w-3 h-3 text-[#8DA39B]" />
              <span className="px-2 py-0.5 bg-[#16241F] border border-[#1E2F2A] rounded text-[#C5D5CF]">3. ARRIVED</span>
              <ArrowRight className="w-3 h-3 text-[#8DA39B]" />
              <span className="px-2 py-0.5 bg-[#16241F] border border-[#1E2F2A] rounded text-[#C5D5CF]">4. CHARGING</span>
              <ArrowRight className="w-3 h-3 text-[#8DA39B]" />
              <span className="px-2 py-0.5 bg-[#22E58B]/10 text-[#22E58B] border border-[#22E58B]/30 rounded font-bold">
                5. COMPLETED
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
