import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Clock, Zap, MapPin } from 'lucide-react';
import { useInView, useReducedMotion } from 'motion/react';
import { FadeIn, Stagger, StaggerItem } from '../../components/motion';

interface StatMetricProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
}

const StatMetric: React.FC<StatMetricProps> = ({
  icon,
  value,
  suffix,
  prefix = '',
  label,
  sublabel,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? value : 0);

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      if (shouldReduceMotion) setDisplayValue(value);
      return;
    }

    let startTime: number | null = null;
    const duration = 1400; // ms

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo formula
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isInView, value, shouldReduceMotion]);

  return (
    <div
      ref={ref}
      className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {prefix}
          {displayValue}
          {suffix}
        </div>
        <div className="text-xs text-slate-500 mt-1 font-medium">{sublabel}</div>
      </div>
    </div>
  );
};

export const StatsStrip: React.FC = () => {
  const stats = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      value: 48,
      suffix: '+',
      label: 'Verified Hosts',
      sublabel: 'Inspected residential wallboxes',
    },
    {
      icon: <Clock className="w-5 h-5 text-emerald-600" />,
      value: 4,
      suffix: ' min',
      label: 'Avg Host Response',
      sublabel: 'Median acceptance time in Pune',
    },
    {
      icon: <Zap className="w-5 h-5 text-emerald-600" />,
      value: 360,
      suffix: ' kW',
      prefix: '',
      label: 'Network Capacity',
      sublabel: 'Combined AC & DC active charging power',
    },
    {
      icon: <MapPin className="w-5 h-5 text-emerald-600" />,
      value: 12,
      suffix: ' Hubs',
      label: 'Pune Zones',
      sublabel: 'Koregaon, Baner, Kothrud, Viman Nagar+',
    },
  ];

  return (
    <section aria-labelledby="live-metrics-heading" className="py-12 bg-slate-50 border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="live-metrics-heading" className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Real-Time Pune Network Health
            </h2>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Community chargers ready when you're in a pinch
            </p>
          </div>
        </FadeIn>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <StatMetric {...s} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
};
