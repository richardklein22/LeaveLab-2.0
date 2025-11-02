'use client';

import { motion } from 'framer-motion';
import { partners } from '@/lib/landing-data';
import Image from 'next/image';

interface PartnerLogoProps {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  benefit: string;
}

function PartnerCard({ name, logoUrl, websiteUrl, benefit }: PartnerLogoProps) {
  return (
    <motion.a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative flex-shrink-0 w-48 sm:w-56 mx-3"
    >
      <div className="h-full flex flex-col items-center justify-center 
                      bg-brand-dark-900/60 backdrop-blur-xl rounded-lg px-4 py-5 
                      hover:shadow-lg hover:shadow-brand-red/20 transition-all duration-300 
                      border border-brand-red/20 group-hover:border-brand-red/50 group-hover:bg-brand-dark-900/80">
        
        {/* Logo/Picture Placeholder */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 flex items-center justify-center
                        bg-brand-dark-800/50 rounded-lg overflow-hidden">
          {logoUrl && logoUrl !== '#' ? (
            <Image
              src={logoUrl}
              alt={name}
              width={96}
              height={96}
              className="object-contain p-2"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                const parent = target.parentElement;
                if (parent) {
                  target.style.display = 'none';
                  const placeholder = document.createElement('div');
                  placeholder.className = 'w-full h-full flex items-center justify-center text-3xl text-gray-500';
                  placeholder.textContent = name.charAt(0);
                  parent.appendChild(placeholder);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-gray-500">
              {name.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Brand Name */}
        <h4 className="text-sm sm:text-base font-semibold text-white text-center mb-2 line-clamp-2">
          {name}
        </h4>
        
        {/* Benefit Button */}
        <div className="w-full px-3 py-1.5 rounded-md 
                        bg-brand-red/20 border border-brand-red/30 
                        group-hover:bg-brand-red/30 group-hover:border-brand-red/50
                        transition-all duration-300">
          <p className="text-xs sm:text-sm text-brand-red-200 text-center font-medium line-clamp-2">
            {benefit}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

export default function PartnershipLogos() {
  // Duplicate partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners, ...partners];
  
  return (
    <section className="py-12 sm:py-16 bg-brand-dark-900 relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 via-transparent to-brand-red/5 opacity-30" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
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
          className="text-sm sm:text-base text-gray-400 text-center mb-10 sm:mb-12"
        >
          Official partnerships that enhance your journey
        </motion.p>
        
        {/* Two-row scrolling container */}
        <div className="space-y-6">
          {/* Top row - scrolling right to left */}
          <div className="relative overflow-hidden scroll-row">
            <div className="flex animate-scroll-right">
              {duplicatedPartners.map((partner, index) => (
                <PartnerCard key={`top-${index}`} {...partner} />
              ))}
            </div>
          </div>
          
          {/* Bottom row - scrolling left to right */}
          <div className="relative overflow-hidden scroll-row">
            <div className="flex animate-scroll-left">
              {duplicatedPartners.map((partner, index) => (
                <PartnerCard key={`bottom-${index}`} {...partner} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
