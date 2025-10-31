'use client';

import { motion } from 'framer-motion';
import { DollarSign, FileText, Home, Users, Headphones, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: DollarSign,
    title: 'INCOME',
    color: 'brand-red',
    items: [
      '4 Complete mentorship programs',
      '1-on-1 Expert coaching',
      '200+ Job positions',
      'Priority partner listings'
    ]
  },
  {
    icon: FileText,
    title: 'VISA',
    color: 'brand-accent',
    items: [
      '9 Visa type guides',
      'Verified agency setup',
      'Agent contacts',
      'Document templates'
    ]
  },
  {
    icon: Home,
    title: 'HOUSING',
    color: 'brand-accent-orange',
    items: [
      'Agent matching service',
      '50+ Hostel directory',
      'Complete sourcing guide',
      'Worldpackers 20% discount'
    ]
  },
  {
    icon: Users,
    title: 'COMMUNITY',
    color: 'brand-accent-pink',
    items: [
      'Discord (1,247 members)',
      'Weekly events & meetups',
      'Networking platform',
      'City-based groups'
    ]
  },
  {
    icon: Headphones,
    title: 'SUPPORT',
    color: 'cyan-500',
    items: [
      '24/7 Chat support',
      'Email assistance',
      'Priority help desk',
      'Expert guidance'
    ]
  },
  {
    icon: Gift,
    title: 'BONUSES',
    color: 'green-500',
    items: [
      'Partner exclusive discounts',
      'Contract templates',
      'Travel checklists',
      'Member-only deals'
    ]
  }
];

export default function EverythingIncluded() {
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-900 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
            Complete Platform
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything <span className="text-brand-red">Included</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            One platform. Complete solution. All the tools you need.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const itemsLeft = feature.items.slice(0, 2);
            const itemsRight = feature.items.slice(2, 4);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border-2 border-${feature.color}/30 
                           hover:border-${feature.color}/50 hover:bg-brand-dark-900/80 transition-all duration-300 
                           card-3d`}
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/5 
                                  flex items-center justify-center border border-${feature.color}/20`}>
                    <Icon className={`h-5 w-5 text-${feature.color}`} />
                  </div>
                  <h3 className={`text-lg font-bold text-${feature.color}`}>
                    {feature.title}
                  </h3>
                </div>

                {/* Items - 2 Column Layout */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  {/* Left Column */}
                  <div className="space-y-2">
                    {itemsLeft.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full bg-${feature.color} mt-1.5 flex-shrink-0`} />
                        <span className="text-xs text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                  {/* Right Column */}
                  <div className="space-y-2">
                    {itemsRight.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full bg-${feature.color} mt-1.5 flex-shrink-0`} />
                        <span className="text-xs text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

