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
                      bg-white rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 
                      shadow-sm hover:shadow-md transition-shadow duration-300 
                      border border-gray-100">
        <div className="relative w-full h-full">
          {/* Fallback text if image fails to load */}
          <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-400">
            {name}
          </div>
          {/* Uncomment when logos are available */}
          {/* <Image
            src={logoUrl}
            alt={name}
            fill
            className="object-contain grayscale group-hover:grayscale-0 
                       transition-all duration-300 opacity-60 group-hover:opacity-100"
          /> */}
        </div>
      </div>
      
      {/* Tooltip on hover (desktop only) */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                      pointer-events-none hidden sm:block">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 
                        whitespace-nowrap shadow-lg">
          {description}
        </div>
      </div>
    </motion.a>
  );
}

export default function PartnershipLogos() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-2"
        >
          Trusted Partners
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-sm sm:text-base text-gray-600 text-center mb-8 sm:mb-10"
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

