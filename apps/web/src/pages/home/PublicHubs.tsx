import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Navigation, ArrowRight, Building2, MapPin } from 'lucide-react';
import { FadeIn, Stagger, StaggerItem, HoverLift } from '../../components/motion';

export const PublicHubs: React.FC = () => {
  const hubs = [
    {
      name: 'Amanora Mall Fast Hub',
      locality: 'Hadapsar, Pune',
      power: '60 kW DC Fast',
      connector: 'Dual CCS2',
      status: 'Open 24/7',
      landmark: 'Basement 1, Gate 2',
      operator: 'Tata Power / Verified',
    },
    {
      name: 'Phoenix Marketcity Bay',
      locality: 'Viman Nagar, Pune',
      power: '50 kW DC + 22 kW AC',
      connector: 'CCS2 & Type 2',
      status: 'Open 24/7',
      landmark: 'Ground Level Open Parking',
      operator: 'Jio-bp / Verified',
    },
    {
      name: 'Balewadi High Street Hub',
      locality: 'Baner - Balewadi, Pune',
      power: '60 kW DC Fast',
      connector: 'Dual CCS2',
      status: 'Open 24/7',
      landmark: 'Near Starbucks Avenue',
      operator: 'ChargeZone / Verified',
    },
    {
      name: 'Pune Railway Station Bay',
      locality: 'Station Road, Central Pune',
      power: '30 kW DC Fast',
      connector: 'CCS2 + 15A Plug',
      status: 'Open 24/7',
      landmark: 'Main Parking Entry',
      operator: 'MSEDCL / Verified',
    },
  ];

  return (
    <section aria-labelledby="public-hubs-heading" className="py-20 bg-[#0A1210] border-t border-[#1E2F2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-3 py-1 rounded-full border border-[#38BDF8]/30">
                Public Fast Charging Fallback
              </span>
              <h2 id="public-hubs-heading" className="text-3xl sm:text-4xl font-extrabold text-[#E8F1EE] mt-3">
                No private host nearby? We route you to verified DC hubs.
              </h2>
              <p className="text-[#C5D5CF] text-sm sm:text-base mt-2 max-w-2xl">
                We index verified commercial fast chargers across Pune alongside residential wallboxes so you always have a guaranteed rescue lifeline.
              </p>
            </div>

            <Link
              to="/find"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#22E58B] hover:text-[#1BC878] transition py-2"
            >
              <span>Explore all hubs on map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubs.map((hub) => (
            <StaggerItem key={hub.name}>
              <HoverLift>
                <div className="h-full bg-[#111C19] border border-[#1E2F2A] hover:border-[#22E58B]/40 transition-colors rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Hub</span>
                      </span>
                      <span className="text-[10px] font-semibold text-[#22E58B] bg-[#22E58B]/10 px-2 py-0.5 rounded-md">
                        {hub.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-[#E8F1EE]">{hub.name}</h3>
                      <div className="flex items-center space-x-1 text-[#8DA39B] text-xs mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8DA39B] shrink-0" />
                        <span>{hub.locality}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#16241F] rounded-2xl border border-[#1E2F2A] space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#8DA39B] text-[11px]">Power Output:</span>
                        <span className="font-bold text-[#FFD60A] font-mono">{hub.power}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#8DA39B] text-[11px]">Connectors:</span>
                        <span className="font-medium text-[#38BDF8]">{hub.connector}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-[#1E2F2A] text-[10px]">
                        <span className="text-[#8DA39B]">Bay Landmark:</span>
                        <span className="text-[#C5D5CF] truncate max-w-[130px]">{hub.landmark}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#1E2F2A] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8DA39B]">{hub.operator}</span>
                    <Link
                      to="/find"
                      className="text-xs font-bold text-[#22E58B] hover:text-[#1BC878] flex items-center space-x-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </Link>
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
