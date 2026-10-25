import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FadeIn } from '../../components/motion';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      id: 'faq-address-safe',
      question: 'Is my residential address safe if I list my charger?',
      answer:
        'Yes, completely. Your exact street address, house/bungalow number, and gated society security instructions remain strictly confidential and encrypted. Public search only displays your general locality (e.g. "Koregaon Park, Pune"). Only after you manually review and accept a driver’s booking request is your precise location unlocked for that specific driver.',
    },
    {
      id: 'faq-connectors',
      question: 'What EV connectors and plug types are supported?',
      answer:
        'We support Type 2 AC (the standard for Tata Nexon EV, Tiago EV, MG ZS EV, Mahindra XUV400), CCS2 DC Fast (up to 60 kW at public hubs), and standard 15A 3-pin industrial sockets (used with portable charging cables for electric scooters, Ather, Ola, and two/three-wheelers). You can filter specifically by your vehicle socket in the search interface.',
    },
    {
      id: 'faq-pricing-calc',
      question: 'How is the session price calculated and paid?',
      answer:
        'Each host specifies their pricing structure: either Per kWh (metered energy delivered), Per Minute (session duration), or Fixed Session (a flat one-time emergency rescue charge). All prices are displayed upfront with zero hidden surge fees. Payment is settled transparently upon session completion.',
    },
    {
      id: 'faq-host-declines',
      question: 'What happens if a host is unavailable or declines my request?',
      answer:
        'If a host does not respond within 4 minutes or declines due to personal driveway use, our algorithm instantly highlights alternate reachable private chargers and routes you to the nearest verified 24/7 public DC fast hub (like Amanora Mall or Phoenix Marketcity) to ensure you are never stranded.',
    },
    {
      id: 'faq-reachability',
      question: 'How do I know for sure if my battery will make it to the charger?',
      answer:
        'Unlike basic maps that measure straight lines, ChargeNearby applies Pune-specific topology factors: an average 1.35x road detour multiplier, traffic choke-points, and elevation gradients. We calculate your estimated battery reserve upon arrival and mark each charger clearly as REACHABLE (safe margin), UNCERTAIN (single-digit reserve, turn off AC), or CRITICAL (do not attempt).',
    },
    {
      id: 'faq-become-host',
      question: 'How do I become a host and what equipment do I need?',
      answer:
        'Anyone with a safe parking spot (private driveway, portico, bungalow gate, or dedicated society visitor parking) and an existing EV wallbox or grounded 15A power socket can register. You will upload a photo of your installation and circuit breaker (MCB) for our admin safety check, after which you can begin receiving requests immediately.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Got Questions?
            </span>
            <h2 id="faq-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Everything you need to know about community charging, host security, and Pune EV rescue.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <FadeIn key={faq.id} delay={0.05 * index}>
                <div className="border border-slate-200 rounded-2xl overflow-hidden transition-colors bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={faq.id}
                    className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-slate-400"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={faq.id}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
