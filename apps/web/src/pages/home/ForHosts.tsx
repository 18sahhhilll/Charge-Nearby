import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, DollarSign, Sliders, CheckCircle2, ArrowRight, ShieldCheck, CalendarCheck } from 'lucide-react';
import { FadeIn, HoverLift } from '../../components/motion';

export const ForHosts: React.FC = () => {
  const [sessionsPerWeek, setSessionsPerWeek] = useState(6);
  const [avgKwh, setAvgKwh] = useState(15);
  const ratePerKwh = 16; // ₹16 charged to driver
  const baseElectricityCost = 9.5; // Average MSEDCL residential tier unit rate
  const netMarginPerKwh = ratePerKwh - baseElectricityCost; // ~₹6.50/kWh profit

  const monthlyGross = Math.round(sessionsPerWeek * 4.33 * avgKwh * ratePerKwh);
  const monthlyNetProfit = Math.round(sessionsPerWeek * 4.33 * avgKwh * netMarginPerKwh);

  const benefits = [
    {
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      title: 'Flexible Pricing Models',
      description:
        'Choose whether to charge per kWh (e.g. ₹15–₹18), per minute for quick top-ups, or a flat fixed session fee (e.g. ₹150) for hassle-free billing.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-emerald-400" />,
      title: 'One-Tap Availability Control',
      description:
        'Going out for the weekend? Toggle your charger offline with a single tap in your dashboard. You decide exactly when your driveway is open.',
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-emerald-400" />,
      title: 'You Approve Every Booking',
      description:
        'No surprise visitors. Review the driver’s profile, car make, and requested kWh before approving. Your exact address is only disclosed after you accept.',
    },
  ];

  return (
    <section id="for-hosts" aria-labelledby="hosts-heading" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Decorative Emerald Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Benefits & Header */}
          <div className="lg:col-span-7 space-y-8">
            <FadeIn>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                Residential & Commercial Hosts
              </span>
              <h2 id="hosts-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-3">
                Turn your wallbox into steady monthly income.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-xl">
                Your 7.4 kW home wallbox sits idle 90% of the day. Offset your electricity bills and help stranded EV neighbours while keeping total control over your driveway.
              </p>
            </FadeIn>

            <div className="space-y-4">
              {benefits.map((b, idx) => (
                <FadeIn key={b.title} delay={0.1 + idx * 0.08}>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      {b.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{b.title}</h3>
                      <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.35}>
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>List your charger</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-slate-400">Zero listing fees during Pune pilot</span>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Earnings Estimator Card */}
          <div className="lg:col-span-5">
            <FadeIn delay={0.2} direction="up">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Earnings Estimator</h3>
                      <span className="text-[10px] text-slate-400 block font-mono">Illustrative calculation</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">
                    Pune Rates
                  </span>
                </div>

                <div className="py-6 space-y-6 text-xs">
                  {/* Slider 1: Sessions per week */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-300 font-medium">Sessions per week:</label>
                      <span className="font-extrabold text-base font-mono text-emerald-400">{sessionsPerWeek}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={sessionsPerWeek}
                      onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>1 session/wk</span>
                      <span>10 sessions/wk</span>
                      <span>20 sessions/wk</span>
                    </div>
                  </div>

                  {/* Slider 2: Average kWh per session */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-300 font-medium">Avg kWh delivered per session:</label>
                      <span className="font-extrabold text-base font-mono text-emerald-400">{avgKwh} kWh</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="35"
                      value={avgKwh}
                      onChange={(e) => setAvgKwh(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>5 kWh (Quick boost)</span>
                      <span>20 kWh</span>
                      <span>35 kWh (Full top-up)</span>
                    </div>
                  </div>

                  {/* Calculated Output Box */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-400 text-xs">Estimated Monthly Revenue</span>
                      <span className="text-2xl font-black text-white font-mono">
                        ₹{monthlyGross.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                      <div>
                        <span className="text-emerald-400 font-bold text-xs block">Estimated Net Profit</span>
                        <span className="text-[10px] text-slate-500">After electricity unit costs</span>
                      </div>
                      <span className="text-xl font-black text-emerald-400 font-mono">
                        ~₹{monthlyNetProfit.toLocaleString('en-IN')}/mo
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-normal pt-1 italic">
                      * Illustrative estimate based on ₹16/kWh driver rate minus ~₹9.5/kWh average domestic residential slab in Pune.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/register"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-center block text-xs transition"
                  >
                    Start Hosting in 3 Minutes
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
