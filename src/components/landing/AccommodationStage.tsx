'use client';

import { motion } from 'framer-motion';
import { Plane, Heart, Search, Home, ArrowRight } from 'lucide-react';

const journeySteps = [
  {
    step: '1',
    icon: Plane,
    title: 'Arrive',
    subtitle: 'First 1-3 days',
    description: 'Start with volunteering or hostels',
    options: [
      'Worldpackers (20% discount)',
      '50+ verified hostels',
      'Work exchange options'
    ]
  },
  {
    step: '2',
    icon: Search,
    title: 'Explore',
    subtitle: 'Days 4-10',
    description: 'Discover areas and neighborhoods',
    options: [
      'Area recommendations',
      'Nomad-verified hostels',
      'City guides by locals'
    ]
  },
  {
    step: '3',
    icon: Home,
    title: 'Find Long-term',
    subtitle: 'Days 11-75',
    description: 'Secure your apartment or house',
    options: [
      'Agent matching',
      'Viewing support',
      'Contract templates'
    ]
  },
  {
    step: '4',
    icon: Heart,
    title: 'Settle In',
    subtitle: 'Days 76-90',
    description: 'Make it your home',
    options: [
      'Move-in checklist',
      'Utility setup',
      'Neighborhood integration'
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
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-accent-orange flex items-center justify-center text-white font-bold text-lg">
              3
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                STAGE 3: <span className="text-brand-accent-orange">ACCOMMODATION</span>
              </h2>
              <p className="text-lg text-gray-400 mt-1">
                Step by step from arrival to settled
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Journey Steps */}
      <div className="container mx-auto px-4 lg:px-8">

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block max-w-7xl mx-auto relative">
          {/* Connecting arrows */}
          <div className="absolute top-20 left-0 right-0 flex items-center justify-between px-32">
            <ArrowRight className="w-6 h-6 text-brand-accent-orange/30" />
            <ArrowRight className="w-6 h-6 text-brand-accent-orange/30" />
            <ArrowRight className="w-6 h-6 text-brand-accent-orange/30" />
          </div>

          <div className="grid grid-cols-4 gap-6">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-accent-orange/20 
                                  hover:border-brand-accent-orange/50 transition-all duration-300 card-3d">
                    {/* Step number */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-brand-accent-orange 
                                    flex items-center justify-center text-white font-bold shadow-lg">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-accent-orange/20 to-brand-accent-orange/5 
                                    flex items-center justify-center mb-4 mx-auto border border-brand-accent-orange/20">
                      <Icon className="h-8 w-8 text-brand-accent-orange" />
                    </div>

                    {/* Content */}
                    <h4 className="text-lg font-bold text-white text-center mb-1">{step.title}</h4>
                    <p className="text-xs text-brand-accent-orange text-center mb-3 font-semibold">{step.subtitle}</p>
                    <p className="text-sm text-gray-400 text-center mb-4">{step.description}</p>

                    {/* Options */}
                    <ul className="space-y-2">
                      {step.options.map((option, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                          <span className="w-1 h-1 rounded-full bg-brand-accent-orange mt-1.5 flex-shrink-0" />
                          <span>{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden max-w-2xl mx-auto relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-accent-orange/20 via-brand-accent-orange/50 to-brand-accent-orange/20" />

          <div className="space-y-8">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-16"
                >
                  {/* Step number circle */}
                  <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-brand-accent-orange 
                                  flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                    {step.step}
                  </div>

                  {/* Content card */}
                  <div className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-5 border border-brand-accent-orange/20">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent-orange/20 to-brand-accent-orange/5 
                                      flex items-center justify-center flex-shrink-0 border border-brand-accent-orange/20">
                        <Icon className="h-5 w-5 text-brand-accent-orange" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{step.title}</h4>
                        <p className="text-xs text-brand-accent-orange font-semibold">{step.subtitle}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3">{step.description}</p>

                    <ul className="space-y-2">
                      {step.options.map((option, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                          <span className="w-1 h-1 rounded-full bg-brand-accent-orange mt-1.5 flex-shrink-0" />
                          <span>{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

