import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { FadeIn } from '../../components/motion';

export const FinalCta: React.FC = () => {
  return (
    <section aria-labelledby="cta-heading" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-slate-950 p-8 sm:p-12 lg:p-16 shadow-2xl">
            {/* Subtle background circuit overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/15 text-slate-950 text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pune EV Community Safety Net</span>
              </div>

              <h2
                id="cta-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight"
              >
                Don’t get stranded. Get charged.
              </h2>

              <p className="text-base sm:text-lg text-emerald-950 font-medium max-w-2xl mx-auto leading-relaxed">
                Whether you need an emergency 10% battery boost to make it home or want to turn your unused driveway
                charger into passive income, Pune’s neighbourhood network has your back.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/find"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-extrabold rounded-2xl shadow-xl transition-transform active:scale-[0.97] flex items-center justify-center space-x-2 text-base group"
                >
                  <Zap className="w-4 h-4 text-emerald-400 fill-current" />
                  <span>Find a charger nearby</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-emerald-400" />
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-white/90 hover:bg-white text-slate-950 font-extrabold rounded-2xl shadow-md transition-transform active:scale-[0.97] flex items-center justify-center space-x-2 text-base"
                >
                  <span>Host your charger</span>
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center space-x-6 text-xs text-emerald-950/80 font-medium">
                <span>✓ Instant Pune Search</span>
                <span>•</span>
                <span>✓ Free Driver Registration</span>
                <span>•</span>
                <span>✓ Verified Community</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
