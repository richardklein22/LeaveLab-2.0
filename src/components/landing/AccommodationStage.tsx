'use client';

import { motion } from 'framer-motion';
import { Heart, Building, Bed, UserCheck } from 'lucide-react';

const accommodationOptions = [
  {
    icon: Heart,
    title: 'Volunteering Partnerships',
    description: 'Free accommodation through Worldpackers',
    features: [
      '20% discount for members',
      '140+ countries covered',
      'Work exchange opportunities',
      'Community verified hosts'
    ]
  },
  {
    icon: Building,
    title: 'Long-term Guide',
    description: 'Complete guide to finding your home',
    features: [
      'Area recommendations',
      'Price expectations by city',
      'Contract templates',
      'Negotiation tips'
    ]
  },
  {
    icon: Bed,
    title: 'Hostel Directory',
    description: 'Nomad-verified hostels by city',
    features: [
      'Bangkok (15 hostels)',
      'Chiang Mai (12 hostels)',
      'Phuket (8 hostels)',
      'Pattaya (5 hostels)'
    ]
  },
  {
    icon: UserCheck,
    title: 'Real Estate Agents',
    description: 'Connect with trusted local agents',
    features: [
      'Free agent matching',
      'English-speaking agents',
      'No commission from you',
      'Move-in support'
    ]
  }
];

export default function AccommodationStage() {
  return (
    <section id="accommodation" className="py-16 sm:py-20 bg-brand-dark-950 relative">
      {/* Stage Header */}
      <div className="container mx-auto px-4 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Stage badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-accent-orange flex items-center justify-center text-white font-bold text-lg">
              3
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                STAGE 3: <span className="text-brand-accent-orange">ACCOMMODATION</span>
              </h2>
              <p className="text-lg text-gray-400 mt-1">
                From hostels to apartments in 11 days average
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Accommodation Options Grid */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {accommodationOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-accent-orange/20 
                           hover:border-brand-accent-orange/50 hover:bg-brand-dark-900/80 transition-all duration-300 
                           card-3d flex flex-col h-full"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-accent-orange/20 to-brand-accent-orange/5 
                                flex items-center justify-center mb-4 border border-brand-accent-orange/20">
                  <Icon className="h-7 w-7 text-brand-accent-orange" />
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {option.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-400 mb-4">
                  {option.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2 flex-grow">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="w-1 h-1 rounded-full bg-brand-accent-orange mt-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

