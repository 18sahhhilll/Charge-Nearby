import React from 'react';
import { ShieldCheck, Compass, Zap, MapPin, Layers, Shield } from 'lucide-react';
import { FadeIn, Stagger, StaggerItem, HoverLift } from '../../components/motion';

export const StatsStrip: React.FC = () => {
  const metrics = [
    {
      icon: <Compass className="w-5 h-5 text-[#22E58B]" />,
      value: '1.35x',
      label: 'Detour Physics',
      sublabel: 'Realistic road distance factor vs straight-line error',
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#22E58B]" />,
      value: '6 Zones',
      label: 'Pilot Coverage',
      sublabel: 'Shivajinagar, Baner, KP, Hinjawadi, Viman, Kothrud',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#22E58B]" />,
      value: '100%',
      label: 'Safety Checklist',
      sublabel: 'Dedicated MCB & earthing verification before approval',
    },
    {
      icon: <Layers className="w-5 h-5 text-[#22E58B]" />,
      value: 'Dual Tier',
      label: 'Rescue Fallback',
      sublabel: 'Community private wallboxes + 24/7 public DC hubs',
    },
  ];

  return (
    <section aria-labelledby="architecture-metrics-heading" className="py-12 bg-[#0A1210] border-y border-[#1E2F2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="architecture-metrics-heading" className="text-xs font-bold uppercase tracking-wider text-[#22E58B]">
              Pune Pilot Engineering Standards
            </h2>
            <p className="text-xl sm:text-2xl font-extrabold text-[#E8F1EE] mt-1">
              Engineered for genuine range safety and homeowner peace of mind
            </p>
          </div>
        </FadeIn>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m) => (
            <StaggerItem key={m.label}>
              <HoverLift>
                <div className="p-5 sm:p-6 rounded-2xl bg-[#111C19] border border-[#1E2F2A] hover:border-[#22E58B]/40 transition-colors shadow-xs flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8DA39B]">{m.label}</span>
                    <div className="w-9 h-9 rounded-xl bg-[#16241F] text-[#22E58B] flex items-center justify-center">
                      {m.icon}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight font-mono">
                      {m.value}
                    </div>
                    <div className="text-xs text-[#8DA39B] mt-1 font-medium">{m.sublabel}</div>
                  </div>
                </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
};
