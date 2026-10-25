import React, { Suspense, lazy, useEffect } from 'react';
import { PageTransition } from '../components/motion';
import { Hero } from './home/Hero';

// Lazy-load below-the-fold sections for optimal first paint performance
const StatsStrip = lazy(() =>
  import('./home/StatsStrip').then((m) => ({ default: m.StatsStrip }))
);
const HowItWorks = lazy(() =>
  import('./home/HowItWorks').then((m) => ({ default: m.HowItWorks }))
);
const Reachability = lazy(() =>
  import('./home/Reachability').then((m) => ({ default: m.Reachability }))
);
const Trust = lazy(() =>
  import('./home/Trust').then((m) => ({ default: m.Trust }))
);
const PublicHubs = lazy(() =>
  import('./home/PublicHubs').then((m) => ({ default: m.PublicHubs }))
);
const ForHosts = lazy(() =>
  import('./home/ForHosts').then((m) => ({ default: m.ForHosts }))
);
const PricingCards = lazy(() =>
  import('./home/PricingCards').then((m) => ({ default: m.PricingCards }))
);
const Faq = lazy(() =>
  import('./home/Faq').then((m) => ({ default: m.Faq }))
);
const FinalCta = lazy(() =>
  import('./home/FinalCta').then((m) => ({ default: m.FinalCta }))
);

const SectionSkeleton: React.FC<{ heightClass?: string }> = ({ heightClass = 'h-64' }) => (
  <div
    className={`w-full ${heightClass} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center`}
    aria-hidden="true"
  >
    <div className="w-full h-full bg-[#16241F] border border-[#1E2F2A] animate-pulse rounded-3xl" />
  </div>
);

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'ChargeNearby | EV Emergency-Charging Marketplace (Pune, India)';
  }, []);

  return (
    <PageTransition>
      <div className="w-full flex flex-col overflow-x-hidden bg-[#0A1210] text-[#E8F1EE]">
        {/* 1. Hero (Above the fold, rendered eagerly) */}
        <Hero />

        {/* 2. Live Stats Strip */}
        <Suspense fallback={<SectionSkeleton heightClass="h-48" />}>
          <StatsStrip />
        </Suspense>

        {/* 3. How It Works (Driver Steps) */}
        <Suspense fallback={<SectionSkeleton heightClass="h-96" />}>
          <HowItWorks />
        </Suspense>

        {/* 4. Honest Reachability & Range Physics */}
        <Suspense fallback={<SectionSkeleton heightClass="h-96" />}>
          <Reachability />
        </Suspense>

        {/* 5. Privacy & Verification Checklist */}
        <Suspense fallback={<SectionSkeleton heightClass="h-96" />}>
          <Trust />
        </Suspense>

        {/* 6. Public DC Hubs Fallback */}
        <Suspense fallback={<SectionSkeleton heightClass="h-80" />}>
          <PublicHubs />
        </Suspense>

        {/* 7. For Hosts & Earnings Estimator */}
        <Suspense fallback={<SectionSkeleton heightClass="h-96" />}>
          <ForHosts />
        </Suspense>

        {/* 8. Pricing Transparency */}
        <Suspense fallback={<SectionSkeleton heightClass="h-96" />}>
          <PricingCards />
        </Suspense>

        {/* 9. Accessible FAQ Accordion */}
        <Suspense fallback={<SectionSkeleton heightClass="h-96" />}>
          <Faq />
        </Suspense>

        {/* 10. Final CTA Banner */}
        <Suspense fallback={<SectionSkeleton heightClass="h-64" />}>
          <FinalCta />
        </Suspense>
      </div>
    </PageTransition>
  );
};
