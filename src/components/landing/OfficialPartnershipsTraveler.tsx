'use client';

import { motion } from 'framer-motion';
import { Home, FileText, Plane, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const partners = [
  {
    name: 'Skyscanner',
    category: 'Flight Partner',
    icon: Plane,
    description: 'Find the best flight deals to Thailand',
    benefits: [
      'Exclusive member rates',
      'Price alerts',
      'Flexible date search',
      'Compare 1000+ airlines'
    ],
    memberBenefit: 'Special Discounts',
    logoUrl: '/logos/skyscanner.svg',
    websiteUrl: 'https://www.skyscanner.com',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Hostel World',
    category: 'Accommodation Partner',
    icon: Home,
    description: 'Book verified hostels across Thailand',
    benefits: [
      'Up to 15% off bookings',
      'Verified reviews',
      'Best price guarantee',
      'Instant confirmation'
    ],
    memberBenefit: 'Members Save 15%',
    logoUrl: '/logos/hostelworld.svg',
    websiteUrl: 'https://www.hostelworld.com',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    name: 'Genki',
    category: 'Travel Insurance',
    icon: Shield,
    description: 'Comprehensive travel insurance coverage',
    benefits: [
      'Special member rates',
      'Worldwide coverage',
      'Easy claims process',
      '24/7 support'
    ],
    memberBenefit: 'Member Discounts',
    logoUrl: '/logos/genki.svg',
    websiteUrl: 'https://www.genki.world',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: 'Worldpackers',
    category: 'Volunteering',
    icon: Home,
    description: 'Work exchange opportunities in Thailand',
    benefits: [
      'Discounted membership',
      'Verified hosts',
      'Community support',
      '140+ countries'
    ],
    memberBenefit: 'Membership Discount',
    logoUrl: '/partners/worldpackers.svg',
    websiteUrl: 'https://www.worldpackers.com',
    color: 'from-purple-500 to-purple-600'
  }
];

interface PartnerCardProps {
  name: string;
  logoUrl?: string;
  websiteUrl: string;
  memberBenefit: string;
  icon?: any;
  color: string;
}

function PartnerCard({ name, logoUrl, websiteUrl, memberBenefit, icon: Icon, color }: PartnerCardProps) {
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
                      bg-white rounded-lg px-2.5 py-3 
                      hover:shadow-xl transition-all duration-300 
                      border-2 border-blue-200 group-hover:border-blue-400">
        
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
        <div className={`w-full px-2 py-1 rounded-md bg-gradient-to-r ${color}
                        transition-all duration-300`}>
          <p className="text-[9px] sm:text-xs text-white text-center font-medium line-clamp-2 leading-tight">
            {memberBenefit}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

export default function OfficialPartnershipsTraveler() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-20 w-72 h-72 bg-blue-300 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-cyan-300 rounded-full blur-3xl" />
      </div>

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
            Official Partners
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Travel Partners</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exclusive partnerships to make your Thailand journey affordable and stress-free
          </p>
        </motion.div>

        {/* Partners Horizontal Scroll */}
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex overflow-x-auto pb-4 gap-3 sm:gap-4 lg:gap-6 snap-x snap-mandatory scrollbar-hide justify-center flex-wrap"
          >
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="snap-center"
              >
                <PartnerCard {...partner} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Join now to unlock all partner benefits and exclusive discounts
          </p>
          <button
            onClick={() => window.location.href = '/signup'}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 
                     text-white font-semibold px-8 py-3 rounded-lg shadow-lg
                     hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Get Started Free
          </button>
        </motion.div>
      </div>
    </section>
  );
}

