'use client';

import { motion } from 'framer-motion';
import { DollarSign, FileText, Home, Users, Headphones, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: DollarSign,
    title: 'INCOME',
    items: [
      '4 Complete courses',
      '1-on-1 Mentorship',
      '200+ Job positions',
      'Priority listings'
    ]
  },
  {
    icon: FileText,
    title: 'VISA',
    items: [
      '9 Visa type guides',
      'Interactive quiz',
      'Agent contacts',
      'Document templates'
    ]
  },
  {
    icon: Home,
    title: 'HOUSING',
    items: [
      'Agent matching',
      '50+ Hostel directory',
      'Sourcing guide',
      'Worldpackers discount'
    ]
  },
  {
    icon: Users,
    title: 'COMMUNITY',
    items: [
      'Discord (1,247 members)',
      'Weekly events',
      'Networking platform',
      'City meetups'
    ]
  },
  {
    icon: Headphones,
    title: 'SUPPORT',
    items: [
      '24/7 Chat support',
      'Email assistance',
      'Priority help',
      'Expert advice'
    ]
  },
  {
    icon: Gift,
    title: 'BONUSES',
    items: [
      'Partner discounts',
      'Contract templates',
      'Travel checklists',
      'Exclusive deals'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-red/20 
                           hover:border-brand-red/50 hover:bg-brand-dark-900/80 transition-all duration-300 
                           card-3d"
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red/20 to-brand-red/5 
                                  flex items-center justify-center border border-brand-red/20">
                    <Icon className="h-5 w-5 text-brand-red" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {feature.title}
                  </h3>
                </div>

                {/* Items */}
                <ul className="space-y-2">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="w-1 h-1 rounded-full bg-brand-red mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Value Prop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-brand-red/30 max-w-3xl mx-auto"
        >
          <p className="text-2xl font-bold text-white mb-2">
            Worth <span className="line-through text-gray-500">£2,100+</span> if purchased separately
          </p>
          <p className="text-4xl font-black text-brand-red mb-4">
            Your Price: £79 one-time
          </p>
          <p className="text-sm text-gray-400">
            No monthly fees. Pay once, access forever.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

