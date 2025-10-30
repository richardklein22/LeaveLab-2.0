'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Laptop, BookOpen, Star, Globe } from 'lucide-react';

const incomeOptions = [
  {
    icon: GraduationCap,
    title: '1-on-1 Mentorship',
    description: 'Expert guidance to launch your online business',
    features: [
      'Amazon FBA mentorship',
      'AI agency coaching',
      'Remote sales training',
      'Social media strategy'
    ]
  },
  {
    icon: Laptop,
    title: 'Online Job Platform',
    description: 'Remote positions from verified employers',
    features: [
      '200+ remote positions',
      'Vetted employers',
      'Application support',
      'Resume optimization'
    ]
  },
  {
    icon: BookOpen,
    title: 'English Teaching Board',
    description: '£18-25/hour teaching English online',
    features: [
      'No degree required (some roles)',
      'Flexible hours',
      '50+ schools hiring',
      'Interview preparation'
    ]
  },
  {
    icon: Star,
    title: 'Priority Listings',
    description: 'Exclusive jobs from LeaveLab partners',
    features: [
      'Early access to positions',
      'Partner company jobs',
      'Higher acceptance rates',
      'Direct employer contact'
    ]
  },
  {
    icon: Globe,
    title: 'Remote Opportunities',
    description: 'Work from anywhere positions',
    features: [
      'Tech, design, marketing',
      'Customer service roles',
      'Writing & content',
      'Virtual assistant'
    ]
  }
];

export default function IncomeStage() {
  return (
    <section id="income" className="py-16 sm:py-20 bg-brand-dark-950 relative">
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
            <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                STAGE 1: <span className="text-brand-red">INCOME</span>
              </h2>
              <p className="text-lg text-gray-400 mt-1">
                Lock in £2K+/month before you fly
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Income Options Grid */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {incomeOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-red/20 
                           hover:border-brand-red/50 hover:bg-brand-dark-900/80 transition-all duration-300 
                           card-3d flex flex-col h-full"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 
                                flex items-center justify-center mb-4 border border-brand-red/20">
                  <Icon className="h-7 w-7 text-brand-red" />
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
                      <span className="w-1 h-1 rounded-full bg-brand-red mt-1.5 flex-shrink-0" />
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

