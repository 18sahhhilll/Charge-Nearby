import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { FadeIn } from '../../components/motion';

export const FinalCta: React.FC = () => {
  return (
    <section aria-labelledby="cta-heading" className="py-20 bg-[#0A1210]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative rounded-3xl overflow-hidden bg-[#111C19] border border-[#1E2F2A] text-[#E8F1EE] p-8 sm:p-12 lg:p-16 shadow-2xl">
            {/* Subtle background radial brand glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(34, 229, 139, 0.25), transparent 70%)',
              }}
            />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#22E58B]/10 text-[#22E58B] border border-[#22E58B]/30 text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pune EV Community Safety Net</span>
              </div>

              <h2
                id="cta-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#E8F1EE] tracking-tight leading-tight"
              >
                Don’t get stranded. Get charged.
              </h2>

              <p className="text-base sm:text-lg text-[#C5D5CF] font-medium max-w-2xl mx-auto leading-relaxed">
                Whether you need an emergency 10% battery boost to make it home or want to turn your unused driveway
                charger into passive income, Pune’s neighbourhood network has your back.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/find"
                  className="w-full sm:w-auto px-8 py-4 bg-[#22E58B] hover:bg-[#1BC878] text-[#04130C] font-extrabold rounded-2xl shadow-xl transition-transform active:scale-[0.97] flex items-center justify-center space-x-2 text-base group cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Find a charger nearby</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-[#16241F] hover:bg-[#1E2F2A] text-[#E8F1EE] border border-[#1E2F2A] font-extrabold rounded-2xl shadow-md transition-transform active:scale-[0.97] flex items-center justify-center space-x-2 text-base cursor-pointer"
                >
                  <span>Host your charger</span>
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center space-x-6 text-xs text-[#8DA39B] font-medium">
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
