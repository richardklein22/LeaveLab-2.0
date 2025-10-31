'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const partners = [
  {
    name: 'Skyscanner',
    category: 'Flight & Hotel Partner',
    description: 'Exclusive travel deals and accommodation discounts',
    logo: '✈️' // Placeholder - replace with actual logo
  },
  {
    name: 'Worldpackers',
    category: 'Accommodation Partner',
    description: 'Work exchange platform with 140+ countries',
    logo: '🏠' // Placeholder
  },
  {
    name: 'ATA Thailand',
    category: 'Visa Service',
    description: 'Non-B work visa specialist with priority processing',
    logo: '📄' // Placeholder
  },
  {
    name: 'ISA Compass',
    category: 'Visa Service',
    description: 'DTV Digital Nomad visa specialist',
    logo: '🧭' // Placeholder
  },
  {
    name: 'AMZ Scout',
    category: 'Amazon FBA Partner',
    description: 'Amazon business tools and training resources',
    logo: '📦' // Placeholder
  },
  {
    name: 'Global Work & Travel',
    category: 'Job Placement',
    description: 'International job placement and work opportunities',
    logo: '🌍' // Placeholder
  }
];

export default function OfficialPartnershipsCarousel() {
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-950 relative overflow-hidden">
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

        {/* Partners Grid - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-brand-red/20 
                         hover:border-brand-red/50 transition-all duration-300 card-3d"
            >
              {/* Logo Placeholder */}
              <div className="w-full h-24 bg-brand-dark-950/50 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                <span className="text-4xl">{partner.logo}</span>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">{partner.name}</h3>
                <Badge className="bg-green-600/20 text-green-400 border-green-400/50 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1 inline" />
                  Verified
                </Badge>
              </div>

              {/* Category */}
              <p className="text-xs text-brand-red font-semibold mb-2">{partner.category}</p>

              {/* Description */}
              <p className="text-sm text-gray-400">{partner.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Partners Carousel - Mobile */}
        <div className="lg:hidden">
          {/* Horizontal Scrolling Row */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar">
            <div className="flex gap-4 min-w-max">
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-[280px] snap-start flex-shrink-0"
                >
                  <div className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-5 border-2 border-brand-red/20 h-full">
                    {/* Logo */}
                    <div className="w-full h-20 bg-brand-dark-950/50 rounded-lg flex items-center justify-center mb-3 border border-white/10">
                      <span className="text-3xl">{partner.logo}</span>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-white">{partner.name}</h3>
                      <Badge className="bg-green-600/20 text-green-400 border-green-400/50 text-[10px]">
                        <CheckCircle className="w-2.5 h-2.5 mr-0.5 inline" />
                        Verified
                      </Badge>
                    </div>

                    {/* Category */}
                    <p className="text-xs text-brand-red font-semibold mb-2">{partner.category}</p>

                    {/* Description */}
                    <p className="text-xs text-gray-400 leading-relaxed">{partner.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">← Swipe to see all partners →</p>
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

      {/* Hide scrollbar but keep functionality */}
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

