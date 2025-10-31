'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const partners = [
  { name: 'Skyscanner', logo: '✈️' },
  { name: 'Worldpackers', logo: '🏠' },
  { name: 'ATA Thailand', logo: '📄' },
  { name: 'ISA Compass', logo: '🧭' },
  { name: 'AMZ Scout', logo: '📦' },
  { name: 'Global Work & Travel', logo: '🌍' },
  // Duplicate for seamless loop
  { name: 'Skyscanner', logo: '✈️' },
  { name: 'Worldpackers', logo: '🏠' },
  { name: 'ATA Thailand', logo: '📄' },
  { name: 'ISA Compass', logo: '🧭' },
];

export default function OfficialPartnershipsSimple() {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Top row scrolls left (from right to left)
    const topInterval = setInterval(() => {
      if (topRowRef.current) {
        topRowRef.current.scrollLeft += 1;
        if (topRowRef.current.scrollLeft >= topRowRef.current.scrollWidth / 2) {
          topRowRef.current.scrollLeft = 0;
        }
      }
    }, 30);

    // Bottom row scrolls right (from left to right)
    const bottomInterval = setInterval(() => {
      if (bottomRowRef.current) {
        bottomRowRef.current.scrollLeft -= 1;
        if (bottomRowRef.current.scrollLeft <= 0) {
          bottomRowRef.current.scrollLeft = bottomRowRef.current.scrollWidth / 2;
        }
      }
    }, 30);

    return () => {
      clearInterval(topInterval);
      clearInterval(bottomInterval);
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-brand-dark-950 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Trusted <span className="text-brand-red">Global Partners</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Official partnerships to enhance every step of your journey
          </p>
        </motion.div>

        {/* Two Rows Auto-Scrolling */}
        <div className="space-y-6">
          {/* Top Row - Scrolls Left */}
          <div
            ref={topRowRef}
            className="overflow-x-hidden flex gap-8"
            style={{ scrollBehavior: 'auto' }}
          >
            <div className="flex gap-8 min-w-max">
              {partners.map((partner, index) => (
                <div
                  key={`top-${index}`}
                  className="flex-shrink-0 w-32 h-32 bg-brand-dark-900/60 backdrop-blur-xl rounded-xl border border-brand-red/20 flex items-center justify-center flex-col p-4"
                >
                  <div className="text-4xl mb-2">{partner.logo}</div>
                  <p className="text-xs text-white text-center font-semibold">{partner.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row - Scrolls Right */}
          <div
            ref={bottomRowRef}
            className="overflow-x-auto flex gap-8 hide-scrollbar"
            style={{ scrollBehavior: 'auto' }}
          >
            <div className="flex gap-8 min-w-max">
              {partners.slice().reverse().map((partner, index) => (
                <div
                  key={`bottom-${index}`}
                  className="flex-shrink-0 w-32 h-32 bg-brand-dark-900/60 backdrop-blur-xl rounded-xl border border-brand-red/20 flex items-center justify-center flex-col p-4"
                >
                  <div className="text-4xl mb-2">{partner.logo}</div>
                  <p className="text-xs text-white text-center font-semibold">{partner.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

