'use client';

import { motion } from 'framer-motion';
import { Calendar, FileCheck, Handshake, Compass } from 'lucide-react';

const visaOptions = [
  {
    icon: Calendar,
    title: 'Short-term Visas',
    description: '1-3 months in Thailand',
    features: [
      'Tourist Visa (60 days)',
      'Visa Exemption (30 days)',
      'Visa on Arrival (15 days)',
      'Extensions available'
    ]
  },
  {
    icon: FileCheck,
    title: 'Long-term Visas',
    description: '6 months to 5 years',
    features: [
      'DTV - Digital Nomad (180 days)',
      'Non-B - Work Visa (90 days renewable)',
      'ED - Education (1 year)',
      'Elite, Retirement, Marriage visas'
    ]
  },
  {
    icon: Handshake,
    title: 'Visa Setup Partnerships',
    description: 'Verified agents handle everything',
    features: [
      'ISA Compass (DTV specialist)',
      'ATA Thailand (Non-B specialist)',
      'Document preparation',
      'Embassy booking assistance'
    ]
  },
  {
    icon: Compass,
    title: 'Visa Determination Guide',
    description: '2-minute quiz matches your situation',
    features: [
      'Interactive quiz tool',
      'Personalized recommendations',
      'Requirements checklist',
      'Cost calculator'
    ]
  }
];

export default function VisaStage() {
  return (
    <section id="visa" className="py-16 sm:py-20 bg-brand-dark-900 relative">
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
            <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                STAGE 2: <span className="text-brand-accent">VISA</span>
              </h2>
              <p className="text-lg text-gray-400 mt-1">
                94% approval rate with our complete guides
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Visa Options Grid */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {visaOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-accent/20 
                           hover:border-brand-accent/50 hover:bg-brand-dark-900/80 transition-all duration-300 
                           card-3d flex flex-col h-full"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 
                                flex items-center justify-center mb-4 border border-brand-accent/20">
                  <Icon className="h-7 w-7 text-brand-accent" />
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
                      <span className="w-1 h-1 rounded-full bg-brand-accent mt-1.5 flex-shrink-0" />
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

