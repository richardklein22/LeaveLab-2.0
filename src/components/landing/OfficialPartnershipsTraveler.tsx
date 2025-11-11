'use client';

import { motion } from 'framer-motion';
import { Home, Plane, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const partners = [
  {
    name: 'Skyscanner',
    icon: Plane,
    memberBenefit: 'Special Discounts',
    logoUrl: '/logos/skyscanner.svg',
    websiteUrl: 'https://www.skyscanner.com'
  },
  {
    name: 'Hostel World',
    icon: Home,
    memberBenefit: 'Members Save 15%',
    logoUrl: '/logos/hostelworld.svg',
    websiteUrl: 'https://www.hostelworld.com'
  },
  {
    name: 'Genki',
    icon: Shield,
    memberBenefit: 'Member Discounts',
    logoUrl: '/logos/genki.svg',
    websiteUrl: 'https://www.genki.world'
  },
  {
    name: 'Worldpackers',
    icon: Home,
    memberBenefit: 'Membership Discount',
    logoUrl: '/partners/worldpackers.svg',
    websiteUrl: 'https://www.worldpackers.com'
  }
];

interface PartnerCardProps {
  name: string;
  logoUrl?: string;
  websiteUrl: string;
  memberBenefit: string;
  icon?: any;
}

function PartnerCard({ name, logoUrl, websiteUrl, memberBenefit, icon: Icon }: PartnerCardProps) {
  return (
    <motion.a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative flex-shrink-0 w-28 sm:w-36 lg:w-44 mx-1.5 lg:mx-2"
    >
      <div className="h-full flex flex-col items-center justify-center 
                      bg-white/80 backdrop-blur-xl rounded-lg px-2.5 py-3 
                      hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 
                      border-2 border-blue-200 group-hover:border-blue-400 group-hover:bg-white">
        
        {/* Logo/Picture Placeholder */}
        <div className="relative w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 mb-2 flex items-center justify-center
                        bg-blue-50 rounded-lg overflow-hidden">
          {logoUrl && logoUrl !== '#' ? (
            <Image
              src={logoUrl}
              alt={name}
              width={64}
              height={64}
              className="object-contain p-1.5 lg:p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const parent = target.parentElement;
                if (parent) {
                  target.style.display = 'none';
                  const placeholder = document.createElement('div');
                  placeholder.className = 'w-full h-full flex items-center justify-center text-xl text-gray-400';
                  placeholder.textContent = name.charAt(0);
                  parent.appendChild(placeholder);
                }
              }}
            />
          ) : Icon ? (
            <Icon className="w-7 h-7 text-blue-600" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl text-gray-400">
              {name.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Brand Name */}
        <h4 className="text-[11px] sm:text-sm font-semibold text-gray-900 text-center mb-1.5 line-clamp-2 leading-tight">
          {name}
        </h4>
        
        {/* Benefit Button */}
        <div className="w-full px-2 py-1 rounded-md 
                        bg-blue-500/20 border border-blue-500/30 
                        group-hover:bg-blue-500/30 group-hover:border-blue-500/50
                        transition-all duration-300">
          <p className="text-[9px] sm:text-xs text-blue-700 text-center font-medium line-clamp-2 leading-tight">
            {memberBenefit}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

export default function OfficialPartnershipsTraveler() {
  // Duplicate partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners, ...partners];
  
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100/30 via-transparent to-cyan-100/30 opacity-50" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            Official Partnerships
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Travel Partners</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verified partners to support your Thailand adventure
          </p>
        </motion.div>

        {/* Two-row scrolling container with fade edges */}
        <div className="space-y-6 max-w-7xl mx-auto relative">
          {/* Fade overlays for left and right edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 lg:w-40 bg-gradient-to-r from-blue-50 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 lg:w-40 bg-gradient-to-l from-blue-50 to-transparent z-20" />
          
          {/* Top row - scrolling right to left */}
          <div className="relative overflow-hidden scroll-row">
            <div className="flex animate-scroll-right">
              {duplicatedPartners.map((partner, index) => (
                <PartnerCard 
                  key={`top-${index}`} 
                  name={partner.name}
                  logoUrl={partner.logoUrl}
                  websiteUrl={partner.websiteUrl}
                  memberBenefit={partner.memberBenefit}
                  icon={partner.icon}
                />
              ))}
            </div>
          </div>
          
          {/* Bottom row - scrolling left to right */}
          <div className="relative overflow-hidden scroll-row">
            <div className="flex animate-scroll-left">
              {duplicatedPartners.map((partner, index) => (
                <PartnerCard 
                  key={`bottom-${index}`} 
                  name={partner.name}
                  logoUrl={partner.logoUrl}
                  websiteUrl={partner.websiteUrl}
                  memberBenefit={partner.memberBenefit}
                  icon={partner.icon}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-500 mt-12"
        >
          All partnerships verified and exclusive to LeaveLab members
        </motion.p>
      </div>
    </section>
  );
}

