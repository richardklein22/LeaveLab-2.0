'use client';

import { motion } from 'framer-motion';
import { UserPlus, Map, MapPin } from 'lucide-react';
import { howItWorksSteps } from '@/lib/landing-data';

interface StepProps {
  number: string;
  title: string;
  description: string;
  index: number;
}

const icons = [UserPlus, Map, MapPin];

function HowItWorksStep({ number, title, description, index }: StepProps) {
  const Icon = icons[index];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      viewport={{ once: true }}
      className="flex items-start gap-4 sm:gap-6 relative z-10 lg:flex-col lg:items-center lg:text-center"
    >
      {/* Number circle */}
      <div className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-brand-red to-brand-red-700 
                      flex items-center justify-center text-white font-bold text-2xl lg:text-3xl 
                      shadow-lg shadow-brand-red/30 relative">
        <span>{number}</span>
        
        {/* Icon overlay */}
        <div className="absolute -bottom-2 -right-2 lg:-bottom-3 lg:-right-3 
                       w-10 h-10 lg:w-12 lg:h-12 rounded-full 
                       bg-brand-dark-900/80 backdrop-blur-xl shadow-lg flex items-center justify-center 
                       border-2 border-brand-red/40">
          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-brand-red" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow pt-2 lg:pt-0">
        <h3 className="text-lg lg:text-xl font-bold text-white mb-2 lg:mb-3">
          {title}
        </h3>
        <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-900/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 sm:mb-16"
        >
          How It <span className="text-brand-red">Works</span>
        </motion.h2>
        
        {/* Container with connecting line */}
        <div className="relative">
          {/* Vertical connecting line (mobile/tablet) */}
          <div className="absolute left-10 top-16 bottom-16 w-0.5 
                          bg-gradient-to-b from-brand-red/20 via-brand-red/50 to-brand-red/20 
                          lg:hidden" />
          
          {/* Horizontal connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 
                          bg-gradient-to-r from-brand-red/20 via-brand-red/50 to-brand-red/20" 
               style={{ width: 'calc(100% - 128px)', left: '64px' }} />
          
          {/* Steps */}
          <div className="space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
            {howItWorksSteps.map((step, index) => (
              <HowItWorksStep key={index} {...step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
