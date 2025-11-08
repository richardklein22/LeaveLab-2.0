'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Home, FileText, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const partners = [
  {
    name: 'Worldpackers',
    category: 'Accommodation Partner',
    icon: Home,
    stage: 'Stage 3',
    description: 'Work exchange platform with 140+ countries',
    benefits: [
      'Short-term housing solutions',
      'Work exchange opportunities',
      'Community verified hosts',
      'Global network access'
    ],
    memberBenefit: 'Members get 20% off',
    logoUrl: '/partners/worldpackers.svg',
    websiteUrl: 'https://www.worldpackers.com',
    color: 'brand-accent-orange'
  },
  {
    name: 'ISA Compass',
    category: 'DTV Visa Service',
    icon: FileText,
    stage: 'Stage 2',
    description: 'Specialist in Digital Nomad Visa applications',
    benefits: [
      'DTV visa application support',
      '94% approval rate',
      'Document preparation',
      'Embassy booking assistance'
    ],
    memberBenefit: 'Official DTV Visa Provider',
    logoUrl: '/logos/isa-compass.svg',
    websiteUrl: 'https://www.isacompass.com',
    color: 'brand-accent'
  },
  {
    name: 'ATA Thailand',
    category: 'Non-B Visa Service',
    icon: FileText,
    stage: 'Stage 2',
    description: 'Work visa application specialists',
    benefits: [
      'Non-B visa applications',
      'In-country support',
      'Embassy connections',
      'Priority processing'
    ],
    memberBenefit: 'Official Non-B Visa Provider',
    logoUrl: '/logos/ata-thailand.svg',
    websiteUrl: '#',
    color: 'brand-accent'
  },
  {
    name: 'Revolutions Hostel',
    category: 'Employer Sponsor',
    icon: Briefcase,
    stage: 'Stage 2 & 3',
    description: 'Work visa sponsorship + accommodation',
    benefits: [
      'Employer sponsorship',
      'Work visa support',
      'Accommodation included',
      'Community integration'
    ],
    memberBenefit: 'Official Employer Sponsor Provider',
    logoUrl: '/logos/revolutions-hostel.svg',
    websiteUrl: '#',
    color: 'brand-red'
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
                      bg-brand-dark-900/60 backdrop-blur-xl rounded-lg px-2.5 py-3 
                      hover:shadow-lg hover:shadow-brand-red/20 transition-all duration-300 
                      border border-brand-red/20 group-hover:border-brand-red/50 group-hover:bg-brand-dark-900/80">
        
        {/* Logo/Picture Placeholder */}
        <div className="relative w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 mb-2 flex items-center justify-center
                        bg-brand-dark-800/50 rounded-lg overflow-hidden">
          {logoUrl && logoUrl !== '#' ? (
            <Image
              src={logoUrl}
              alt={name}
              width={64}
              height={64}
              className="object-contain p-1.5 lg:p-2"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                const parent = target.parentElement;
                if (parent) {
                  target.style.display = 'none';
                  const placeholder = document.createElement('div');
                  placeholder.className = 'w-full h-full flex items-center justify-center text-xl text-gray-500';
                  placeholder.textContent = name.charAt(0);
                  parent.appendChild(placeholder);
                }
              }}
            />
          ) : Icon ? (
            <Icon className="w-7 h-7 text-gray-400" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl text-gray-500">
              {name.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Brand Name */}
        <h4 className="text-[11px] sm:text-sm font-semibold text-white text-center mb-1.5 line-clamp-2 leading-tight">
          {name}
        </h4>
        
        {/* Benefit Button */}
        <div className="w-full px-2 py-1 rounded-md 
                        bg-brand-red/20 border border-brand-red/30 
                        group-hover:bg-brand-red/30 group-hover:border-brand-red/50
                        transition-all duration-300">
          <p className="text-[9px] sm:text-xs text-brand-red-200 text-center font-medium line-clamp-2 leading-tight">
            {memberBenefit}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

export default function OfficialPartnershipsNew() {
  // Duplicate partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners, ...partners];
  
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-950 relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 via-transparent to-brand-red/5 opacity-30" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
            Official Partnerships
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Global Partners</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Verified partners to support every stage of your journey
          </p>
        </motion.div>

        {/* Two-row scrolling container with fade edges */}
        <div className="space-y-6 max-w-7xl mx-auto relative">
          {/* Fade overlays for left and right edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-40 bg-gradient-to-r from-brand-dark-950 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-40 bg-gradient-to-l from-brand-dark-950 to-transparent z-20 pointer-events-none" />
          
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
