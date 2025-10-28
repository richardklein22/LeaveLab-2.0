'use client';

import { motion } from 'framer-motion';
import { partners } from '@/lib/landing-data';

interface PartnerLogoProps {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
}

function PartnerLogo({ name, logoUrl: _logoUrl, websiteUrl, description }: PartnerLogoProps) {
  return (
    <motion.a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative block"
    >
      <div className="h-14 w-32 sm:h-16 sm:w-40 flex items-center justify-center 
                      glass rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 
                      hover:shadow-lg hover:shadow-brand-red/20 transition-all duration-300 
                      border border-white/10 group-hover:border-brand-red/30">
        <div className="relative w-full h-full">
          {/* Fallback text */}
          <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-400 group-hover:text-brand-red transition-colors">
            {name}
          </div>
        </div>
      </div>
      
      {/* Tooltip on hover (desktop only) */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                      pointer-events-none hidden sm:block z-10">
        <div className="bg-brand-dark-900 text-white text-xs rounded-lg py-2 px-3 
                        whitespace-nowrap shadow-lg border border-brand-red/30">
          {description}
        </div>
      </div>
    </motion.a>
  );
}

export default function PartnershipLogos() {
  return (
    <section className="py-12 sm:py-16 bg-brand-dark-950 relative">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 via-transparent to-brand-red/5 opacity-30" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl font-bold text-center text-white mb-2"
        >
          Trusted <span className="text-brand-red">Partners</span>
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-10"
        >
          Official partnerships that enhance your journey
        </motion.p>
        
        {/* Grid layout for mobile, flex for desktop */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto 
                       lg:flex lg:flex-wrap lg:items-center lg:justify-center lg:gap-8 lg:max-w-none">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PartnerLogo {...partner} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
