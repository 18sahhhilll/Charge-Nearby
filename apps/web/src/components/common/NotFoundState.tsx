import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BatteryWarning, Zap, ArrowLeft, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface NotFoundStateProps {
  title?: string;
  description?: string;
  code?: string;
  attemptedPath?: string;
  showRadar?: boolean;
  primaryAction?: { label: string; to: string };
  secondaryAction?: { label: string; to: string };
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({
  title = "Looks like you've run out of charge",
  description = "The page you're looking for doesn't exist or has moved.",
  code = "404",
  attemptedPath,
  showRadar = true,
  primaryAction = { label: 'Back to home', to: '/' },
  secondaryAction = { label: 'Find chargers near me', to: '/find' },
}) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const pathToShow = attemptedPath ?? (location.pathname !== '/' ? location.pathname : undefined);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Animated Visual Motif */}
        <div className="relative flex items-center justify-center">
          {/* Radar search pulse (respects reduced motion) */}
          {showRadar && !shouldReduceMotion && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.6, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                className="w-24 h-24 rounded-full border-2 border-emerald-400/40"
              />
              <motion.div
                initial={{ scale: 0.6, opacity: 0.8 }}
                animate={{ scale: 2.8, opacity: 0 }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: 0.8,
                  ease: 'easeOut',
                }}
                className="w-24 h-24 rounded-full border border-emerald-500/25"
              />
            </div>
          )}

          {/* Center Card with Low Battery Motif */}
          <div className="relative z-10 bg-[#111C19] border border-[#1E2F2A] rounded-3xl p-6 shadow-xl space-y-3 max-w-[260px] mx-auto">
            {code && (
              <span className="text-4xl font-extrabold tracking-tight text-[#E8F1EE] block font-mono">
                {code}
              </span>
            )}

            {/* Low Battery Graphic (4% level) */}
            <div className="space-y-1.5">
              <div className="relative w-36 h-12 mx-auto border-2 border-[#1E2F2A] bg-[#16241F] rounded-xl p-1 flex items-center">
                {/* Battery terminal nipple */}
                <div className="absolute -right-2 w-1.5 h-4 bg-[#1E2F2A] rounded-r-xs" />
                {/* 4% charge level bar with subtle pulsing rose/amber indicator */}
                <div className="w-[10%] h-full bg-[#FF5A5F] rounded-lg animate-pulse flex items-center justify-center" />
                <div className="flex-1 text-center font-mono text-[11px] font-bold text-[#FF5A5F]">
                  4% Remaining
                </div>
              </div>
              <div className="flex items-center justify-center space-x-1 text-[11px] text-[#FCD34D] font-semibold">
                <BatteryWarning className="w-3.5 h-3.5" />
                <span>Station Range Depleted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E8F1EE] tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-[#C5D5CF] max-w-md mx-auto leading-relaxed">
            {description}
          </p>
          {pathToShow && (
            <div className="pt-1">
              <span className="inline-block font-mono text-xs px-3 py-1 bg-[#16241F] border border-[#1E2F2A] rounded-lg text-[#8DA39B] max-w-xs truncate">
                {pathToShow}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {primaryAction && (
            <Link
              to={primaryAction.to}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 bg-[#22E58B] hover:bg-[#1BC878] active:scale-[0.97] text-[#04130C] font-extrabold text-xs rounded-xl shadow-md transition duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{primaryAction.label}</span>
            </Link>
          )}

          {secondaryAction && (
            <Link
              to={secondaryAction.to}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 bg-[#16241F] hover:bg-[#1E2F2A] active:scale-[0.97] border border-[#1E2F2A] text-[#E8F1EE] font-bold text-xs rounded-xl shadow-xs transition duration-150"
            >
              <Search className="w-4 h-4 text-[#22E58B]" />
              <span>{secondaryAction.label}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
