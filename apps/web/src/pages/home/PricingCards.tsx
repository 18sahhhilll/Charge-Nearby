import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { FadeIn, Stagger, StaggerItem, HoverLift } from '../../components/motion';

export const PricingCards: React.FC = () => {
  const tiers = [
    {
      title: 'Per kWh Energy',
      tagline: 'Most Popular for Wallboxes',
      rate: '₹14 – ₹18',
      unit: '/ kWh',
      description: 'Pay solely for the actual electrical energy your EV pulls into its battery pack.',
      features: [
        'Precise meter calculation',
        'Ideal for AC 7.4 kW home chargers',
        'Zero idle fees for first 30 mins',
        'Fair compensation for host grid units',
      ],
      popular: true,
      cta: 'Search kWh Chargers',
    },
    {
      title: 'Per Minute Duration',
      tagline: 'Great for Fast Commercial Bays',
      rate: '₹2.50 – ₹4.00',
      unit: '/ minute',
      description: 'Time-metered billing for high-speed top-ups where high power is delivered quickly.',
      features: [
        'Encourages quick bay turnover',
        'Common at commercial hubs',
        'Transparent second-level billing',
        'Real-time timer in driver app',
      ],
      popular: false,
      cta: 'Explore Minute Chargers',
    },
    {
      title: 'Fixed Flat Session',
      tagline: 'Predictable Emergency Rescue',
      rate: '₹150 – ₹250',
      unit: '/ flat session',
      description: 'One lump sum for an emergency parking and charging slot without monitoring meters.',
      features: [
        'Single predictable fee',
        'Up to 3 hours included bay time',
        'Great for overnight neighborhood boosts',
        'No per-unit arithmetic needed',
      ],
      popular: false,
      cta: 'View Flat Rate Listings',
    },
  ];

  return (
    <section aria-labelledby="pricing-heading" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-300">
              Clear Economics
            </span>
            <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Transparent, Host-Set Rates with Zero Hidden Markups
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Every host chooses their own pricing structure. You see the exact rate before sending a request.
            </p>
          </div>
        </FadeIn>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier) => (
            <StaggerItem key={tier.title}>
              <HoverLift>
                <div
                  className={`h-full rounded-3xl p-7 flex flex-col justify-between relative transition duration-200 ${
                    tier.popular
                      ? 'bg-white border-2 border-emerald-500 shadow-xl'
                      : 'bg-white border border-slate-200 shadow-xs'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-500 text-slate-950 font-extrabold text-[11px] rounded-full shadow-sm uppercase tracking-wider flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 fill-current" />
                      <span>Most Common in Pune</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        {tier.tagline}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-1">{tier.title}</h3>
                    </div>

                    <div className="pt-2">
                      <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                        {tier.rate}
                      </span>
                      <span className="text-slate-500 text-xs font-semibold ml-1">{tier.unit}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed border-b border-slate-100 pb-4">
                      {tier.description}
                    </p>

                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start space-x-2.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      to="/find"
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center transition ${
                        tier.popular
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>

        {/* No Hidden Fees Guarantee */}
        <FadeIn delay={0.2}>
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 max-w-2xl mx-auto flex items-center justify-center space-x-3 text-xs text-emerald-950 font-medium text-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Our Promise:</strong> No platform subscription locks. No surge gouging during rain or power cuts. What the host lists is what you pay.
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
