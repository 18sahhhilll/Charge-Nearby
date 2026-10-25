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
      icon: <Search className="w-6 h-6 text-emerald-600" />,
      tagline: 'Instant GPS reachability',
      description:
        'Input your remaining battery percentage and connector type (Type 2, CCS2, 15A socket). Our Pune traffic algorithm flags each charger as REACHABLE, UNCERTAIN, or CRITICAL before you drive.',
      badge: 'Step 1: REQUESTED',
    },
    {
      number: '02',
      title: 'Host Acceptance',
      icon: <Send className="w-6 h-6 text-emerald-600" />,
      tagline: 'Median response under 4 mins',
      description:
        'The host receives your request with estimated arrival time. To protect host privacy, exact bungalow numbers and access codes are revealed only after the host approves your session.',
      badge: 'Step 2: ACCEPTED',
    },
    {
      number: '03',
      title: 'Plug In & Go',
      icon: <Zap className="w-6 h-6 text-emerald-600" />,
      tagline: 'Verified earthing & MCB',
      description:
        'Follow private gate instructions, park in the dedicated driveway, plug in, and mark ARRIVED. Complete your emergency charge with transparent per-kWh or fixed flat pricing.',
      badge: 'Step 3: CHARGING & COMPLETED',
    },
  ];

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Driver Flow
            </span>
            <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              How ChargeNearby rescues you in 3 simple steps
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Designed specifically for EV drivers on single-digit battery who cannot risk driving to broken chargers.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Animated Connecting Horizontal Line on Desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-28 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-0"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500"
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
                  <div className="h-full bg-slate-50 border border-slate-200 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                          {step.icon}
                        </div>
                        <span className="text-2xl font-black text-slate-300 font-mono">{step.number}</span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                          {step.tagline}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                        {step.badge}
                      </span>
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* 5-step booking lifecycle footnote */}
        <FadeIn delay={0.2}>
          <div className="mt-12 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Complete 5-Step Lifecycle:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[11px]">
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">1. REQUESTED</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">2. ACCEPTED</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">3. ARRIVED</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">4. CHARGING</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold">
                5. COMPLETED
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
