'use client';

import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { problemComparison } from '@/lib/landing-data';

export default function ProblemComparison() {
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-900/30 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Before (Red tint with glass) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-xl md:rounded-2xl p-6 md:p-8 
                      border-2 border-brand-red/20 relative card-3d
                      hover:glass-red transition-all duration-300"
          >
            {/* Sad emoji illustration at top */}
            <div className="text-5xl md:text-6xl text-center mb-4 md:mb-6 opacity-50">
              {problemComparison.without.emoji}
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">
              {problemComparison.without.title}
            </h3>
            
            <ul className="space-y-4">
              {problemComparison.without.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-base sm:text-lg">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Right Column - After (Purple/Cyan tint with glass) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-xl md:rounded-2xl p-6 md:p-8 
                      border-2 border-brand-accent/30 relative card-3d
                      hover:border-brand-accent/50 transition-all duration-300"
          >
            {/* Happy emoji illustration at top */}
            <div className="text-5xl md:text-6xl text-center mb-4 md:mb-6">
              {problemComparison.with.emoji}
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">
              {problemComparison.with.title}
            </h3>
            
            <ul className="space-y-4">
              {problemComparison.with.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-brand-accent flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-base sm:text-lg">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 mt-8 text-base sm:text-lg"
        >
          Stop winging it. Start with a plan.
        </motion.p>
      </div>
    </section>
  );
}
