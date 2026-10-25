import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, BatteryMedium, Compass, Info } from 'lucide-react';
import { FadeIn, Stagger, StaggerItem, HoverLift } from '../../components/motion';

export const Reachability: React.FC = () => {
  const [simulatedSoc, setSimulatedSoc] = useState(12);

  // Dynamic status based on slider
  const getSimulatedStatus = (soc: number) => {
    if (soc >= 15) {
      return {
        label: 'REACHABLE',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        barColor: 'bg-emerald-500',
        advice: 'Safe to proceed. Buffer allows normal AC and road detours.',
        distanceCap: Math.round(soc * 1.8),
      };
    }
    if (soc >= 8) {
      return {
        label: 'UNCERTAIN',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        barColor: 'bg-amber-500',
        advice: 'Turn off AC/blower immediately. Proceed only if terrain is flat.',
        distanceCap: Math.round(soc * 1.4),
      };
    }
    return {
      label: 'CRITICAL',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      barColor: 'bg-rose-500',
      advice: 'Extremely high risk of stranding. Stop at safe shoulder and call helpline.',
      distanceCap: Math.round(soc * 1.1),
    };
  };

  const currentStatus = getSimulatedStatus(simulatedSoc);

  return (
    <section aria-labelledby="reachability-heading" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-300">
              Honest Physics & Real Traffic
            </span>
            <h2 id="reachability-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              We tell you if you'll actually make it.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Most map apps calculate straight-line distances that lure stranded EV drivers into rolling dead on flyovers.
              Our algorithm factors in Pune's 1.35x road detour, topography, and real battery degradation.
            </p>
          </div>
        </FadeIn>

        {/* Semantic Badges Grid */}
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Reachable */}
          <StaggerItem>
            <HoverLift>
              <div className="h-full bg-white border border-emerald-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                      REACHABLE
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">Ample Safe Margin</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Remaining battery delivers a minimum 15% state-of-charge reserve upon arrival at the host gate. You can drive normally without anxiety.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-emerald-700 font-semibold">
                  Reserve at arrival: &gt; 15%
                </div>
              </div>
            </HoverLift>
          </StaggerItem>

          {/* Uncertain */}
          <StaggerItem>
            <HoverLift>
              <div className="h-full bg-white border border-amber-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
                      UNCERTAIN
                    </span>
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">Borderline Reserve</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Estimated arrival SOC is between 5% and 14%. Unscheduled traffic lights or elevation climbs (like Senapati Bapat flyover) will risk depletion.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-amber-700 font-semibold">
                  Reserve at arrival: 5% - 14%
                </div>
              </div>
            </HoverLift>
          </StaggerItem>

          {/* Critical */}
          <StaggerItem>
            <HoverLift>
              <div className="h-full bg-white border border-rose-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 uppercase tracking-wider">
                      CRITICAL
                    </span>
                    <XCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">Immediate Stranding Danger</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Calculated energy required exceeds battery pack limits. We warn you NOT to attempt this drive, directing you to roadside flatbed towing.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-rose-700 font-semibold">
                  Reserve at arrival: &lt; 5%
                </div>
              </div>
            </HoverLift>
          </StaggerItem>
        </Stagger>

        {/* Interactive Battery-to-Distance Visualizer */}
        <FadeIn delay={0.1}>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <BatteryMedium className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Interactive Battery Range Visualizer</h4>
                  <p className="text-xs text-slate-500">Test how remaining battery translates to real Pune street distance</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-500 font-medium">Simulated SOC:</span>
                <span className="font-extrabold text-2xl font-mono text-slate-900">{simulatedSoc}%</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${currentStatus.badgeClass}`}>
                  {currentStatus.label}
                </span>
              </div>
            </div>

            <div className="py-6 space-y-4">
              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Slide to adjust test battery level:</span>
                  <span className="text-emerald-700 font-mono font-bold">{simulatedSoc}% State of Charge</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="35"
                  value={simulatedSoc}
                  onChange={(e) => setSimulatedSoc(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                />
              </div>

              {/* Progress Bar Display */}
              <div className="space-y-1.5 pt-2">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${currentStatus.barColor}`}
                    style={{ width: `${(simulatedSoc / 35) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>2% (Emergency cutoff)</span>
                  <span>10% (Uncertain threshold)</span>
                  <span>20%+ (Safe zone)</span>
                </div>
              </div>

              {/* Real Road Distance Output */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-3">
                  <Compass className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700 block">Max Safe Real-Road Distance</span>
                    <span className="text-xl font-extrabold text-slate-900 font-mono">
                      ~{currentStatus.distanceCap} km
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Includes 1.35x road winding & traffic congestion factor
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-3">
                  <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700 block">System Recommendation</span>
                    <p className="text-slate-600 text-xs mt-0.5">{currentStatus.advice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
