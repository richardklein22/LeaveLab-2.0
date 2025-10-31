'use client';

import { motion } from 'framer-motion';
import { Home, FileText, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const partnerCategories = [
  {
    title: 'Accommodation Partners',
    icon: Home,
    color: 'brand-accent-orange',
    partners: [
      { name: 'Worldpackers', benefit: '20% discount' },
      { name: 'Skyscanner Hotels', benefit: 'Exclusive deals' },
      { name: 'Revolutions Hostel', benefit: 'Priority booking' }
    ]
  },
  {
    title: 'Visa Partners',
    icon: FileText,
    color: 'brand-accent',
    partners: [
      { name: 'ISA Compass', benefit: '£100 discount' },
      { name: 'ATA Thailand', benefit: 'Priority processing' }
    ]
  },
  {
    title: 'Income Partners',
    icon: DollarSign,
    color: 'brand-red',
    partners: [
      { name: 'Amazon Scouts', benefit: 'Member access' },
      { name: 'Teaching Agencies', benefit: 'Direct placement' }
    ]
  }
];

export default function OfficialPartnershipsScalable() {
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-950 relative">
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

        {/* Partner Categories */}
        <div className="max-w-6xl mx-auto space-y-8">
          {partnerCategories.map((category, catIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={catIndex}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                viewport={{ once: true }}
                className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-red/20"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${category.color}/20 to-${category.color}/5 
                                  flex items-center justify-center border border-${category.color}/20`}>
                    <Icon className={`h-5 w-5 text-${category.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>

                {/* Partners List - Mobile Optimized */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.partners.map((partner, index) => (
                    <div
                      key={index}
                      className="bg-brand-dark-950/50 rounded-lg p-4 border border-white/10 
                                 hover:border-brand-red/50 transition-all duration-300"
                    >
                      <p className="text-sm font-bold text-white mb-1">{partner.name}</p>
                      <p className="text-xs text-brand-red">{partner.benefit}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Verification Note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          All partnerships verified and exclusive to LeaveLab members
        </motion.p>
      </div>
    </section>
  );
}

