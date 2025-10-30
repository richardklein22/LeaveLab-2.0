'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Home, FileText, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    memberBenefit: '20% discount on subscriptions',
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
    memberBenefit: '£100 discount on service',
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
    memberBenefit: 'Priority processing',
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
    memberBenefit: 'Guaranteed interview',
    color: 'brand-red'
  }
];

export default function OfficialPartnershipsNew() {
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-950 relative">
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

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-brand-red/20 
                           hover:border-brand-red/50 hover:bg-brand-dark-900/80 transition-all duration-300 
                           card-3d"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${partner.color}/20 to-${partner.color}/5 
                                    flex items-center justify-center border border-${partner.color}/20`}>
                      <Icon className={`h-7 w-7 text-${partner.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-red transition-colors">
                        {partner.name}
                      </h3>
                      <p className="text-sm text-gray-400">{partner.category}</p>
                      <p className="text-xs text-brand-red font-semibold">{partner.stage}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400 border-green-400/50 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1 inline" />
                    Verified
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4">
                  {partner.description}
                </p>

                {/* Benefits */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    What they help with:
                  </p>
                  <ul className="space-y-2">
                    {partner.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-3 h-3 text-brand-red flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Member Benefit */}
                <div className="bg-brand-red/10 rounded-lg px-4 py-2 border border-brand-red/30">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Member Benefit
                  </p>
                  <p className="text-sm font-semibold text-brand-red">
                    {partner.memberBenefit}
                  </p>
                </div>
              </motion.div>
            );
          })}
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

