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
        badgeClass: 'bg-[#22E58B]/10 text-[#22E58B] border-[#22E58B]/30',
        barColor: 'bg-[#22E58B]',
        advice: 'Safe to proceed. Buffer allows normal AC and road detours.',
        distanceCap: Math.round(soc * 1.8),
      };
    }
    if (soc >= 8) {
      return {
        label: 'UNCERTAIN',
        badgeClass: 'bg-[#FCD34D]/10 text-[#FCD34D] border-[#FCD34D]/30',
        barColor: 'bg-[#FCD34D]',
        advice: 'Turn off AC/blower immediately. Proceed only if terrain is flat.',
        distanceCap: Math.round(soc * 1.4),
      };
    }
    return {
      label: 'CRITICAL',
      badgeClass: 'bg-[#FF5A5F]/10 text-[#FF5A5F] border-[#FF5A5F]/30',
      barColor: 'bg-[#FF5A5F]',
      advice: 'Extremely high risk of stranding. Stop at safe shoulder and call helpline.',
      distanceCap: Math.round(soc * 1.1),
    };
  };

  const currentStatus = getSimulatedStatus(simulatedSoc);

  return (
    <section aria-labelledby="reachability-heading" className="py-20 bg-[#0A1210] border-t border-[#1E2F2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#22E58B] bg-[#22E58B]/10 px-3 py-1 rounded-full border border-[#22E58B]/30">
              Honest Physics & Real Traffic
            </span>
            <h2 id="reachability-heading" className="text-3xl sm:text-4xl font-extrabold text-[#E8F1EE] mt-3">
              We tell you if you'll actually make it.
            </h2>
            <p className="text-[#C5D5CF] text-sm sm:text-base mt-2">
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
              <div className="h-full bg-[#111C19] border border-[#22E58B]/40 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#22E58B]/10 text-[#22E58B] border border-[#22E58B]/30 uppercase tracking-wider">
                      REACHABLE
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-[#22E58B]" />
                  </div>
                  <h3 className="font-bold text-base text-[#E8F1EE] mb-2">Ample Safe Margin</h3>
                  <p className="text-[#C5D5CF] text-xs sm:text-sm leading-relaxed">
                    Remaining battery delivers a minimum 15% state-of-charge reserve upon arrival at the host gate. You can drive normally without anxiety.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E2F2A] text-[11px] font-mono text-[#22E58B] font-semibold">
                  Reserve at arrival: &gt; 15%
                </div>
              </div>
            </HoverLift>
          </StaggerItem>

          {/* Uncertain */}
          <StaggerItem>
            <HoverLift>
              <div className="h-full bg-[#111C19] border border-[#FCD34D]/40 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FCD34D]/10 text-[#FCD34D] border border-[#FCD34D]/30 uppercase tracking-wider">
                      UNCERTAIN
                    </span>
                    <AlertTriangle className="w-5 h-5 text-[#FCD34D]" />
                  </div>
                  <h3 className="font-bold text-base text-[#E8F1EE] mb-2">Borderline Reserve</h3>
                  <p className="text-[#C5D5CF] text-xs sm:text-sm leading-relaxed">
                    Estimated arrival SOC is between 5% and 14%. Unscheduled traffic lights or elevation climbs (like Senapati Bapat flyover) will risk depletion.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E2F2A] text-[11px] font-mono text-[#FCD34D] font-semibold">
                  Reserve at arrival: 5% - 14%
                </div>
              </div>
            </HoverLift>
          </StaggerItem>

          {/* Critical */}
          <StaggerItem>
            <HoverLift>
              <div className="h-full bg-[#111C19] border border-[#FF5A5F]/40 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FF5A5F]/10 text-[#FF5A5F] border border-[#FF5A5F]/30 uppercase tracking-wider">
                      CRITICAL
                    </span>
                    <XCircle className="w-5 h-5 text-[#FF5A5F]" />
                  </div>
                  <h3 className="font-bold text-base text-[#E8F1EE] mb-2">Immediate Stranding Danger</h3>
                  <p className="text-[#C5D5CF] text-xs sm:text-sm leading-relaxed">
                    Calculated energy required exceeds battery pack limits. We warn you NOT to attempt this drive, directing you to roadside flatbed towing.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E2F2A] text-[11px] font-mono text-[#FF5A5F] font-semibold">
                  Reserve at arrival: &lt; 5%
                </div>
              </div>
            </HoverLift>
          </StaggerItem>
        </Stagger>

        {/* Interactive Battery-to-Distance Visualizer */}
        <FadeIn delay={0.1}>
          <div className="bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2F2A]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#16241F] border border-[#1E2F2A] text-[#22E58B] flex items-center justify-center">
                  <BatteryMedium className="w-5 h-5 text-[#22E58B]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#E8F1EE]">Interactive Battery Range Visualizer</h4>
                  <p className="text-xs text-[#8DA39B]">Test how remaining battery translates to real Pune street distance</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-[#8DA39B] font-medium">Simulated SOC:</span>
                <span className="font-extrabold text-2xl font-mono text-[#E8F1EE]">{simulatedSoc}%</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${currentStatus.badgeClass}`}>
                  {currentStatus.label}
                </span>
              </div>
            </div>

            <div className="py-6 space-y-4">
              <div>
                <label className="flex justify-between text-xs font-semibold text-[#C5D5CF] mb-2">
                  <span>Slide to adjust test battery level:</span>
                  <span className="text-[#22E58B] font-mono font-bold">{simulatedSoc}% State of Charge</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="35"
                  value={simulatedSoc}
                  onChange={(e) => setSimulatedSoc(Number(e.target.value))}
                  className="w-full accent-[#22E58B] cursor-pointer h-2 bg-[#16241F] rounded-lg appearance-none"
                />
              </div>

              {/* Progress Bar Display */}
              <div className="space-y-1.5 pt-2">
                <div className="h-3 w-full bg-[#16241F] rounded-full overflow-hidden p-0.5 border border-[#1E2F2A]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${currentStatus.barColor}`}
                    style={{ width: `${(simulatedSoc / 35) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#8DA39B] font-mono">
                  <span>2% (Emergency cutoff)</span>
                  <span>10% (Uncertain threshold)</span>
                  <span>20%+ (Safe zone)</span>
                </div>
              </div>

              {/* Real Road Distance Output */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="p-4 bg-[#16241F] rounded-2xl border border-[#1E2F2A] flex items-start space-x-3">
                  <Compass className="w-5 h-5 text-[#22E58B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#C5D5CF] block">Max Safe Real-Road Distance</span>
                    <span className="text-xl font-extrabold text-[#FFD60A] font-mono">
                      ~{currentStatus.distanceCap} km
                    </span>
                    <span className="text-[11px] text-[#8DA39B] block mt-0.5">
                      Includes 1.35x road winding & traffic congestion factor
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#16241F] rounded-2xl border border-[#1E2F2A] flex items-start space-x-3">
                  <Info className="w-5 h-5 text-[#8DA39B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#C5D5CF] block">System Recommendation</span>
                    <p className="text-[#C5D5CF] text-xs mt-0.5">{currentStatus.advice}</p>
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
