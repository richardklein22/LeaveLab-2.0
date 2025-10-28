'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { heroProgressStages } from '@/lib/landing-data';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark-950">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-brand-accent-pink/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(239, 68, 68, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>
      
      {/* Content container */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
        >
          <span className="inline-block hover:scale-110 transition-transform duration-300">Move</span>{' '}
          <span className="inline-block hover:scale-110 transition-transform duration-300">to</span>{' '}
          <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">
            Thailand
          </span>{' '}
          <span className="inline-block hover:scale-110 transition-transform duration-300">in</span>{' '}
          <span className="inline-block hover:scale-110 transition-transform duration-300">90</span>{' '}
          <span className="inline-block hover:scale-110 transition-transform duration-300">Days</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Join 1,247 digital nomads earning £2K+/month while living their dream life
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button 
            onClick={() => window.location.href = '/signup'}
            className="bg-brand-red hover:bg-brand-red-600 text-white font-semibold 
                     px-8 py-3 sm:px-10 sm:py-4 rounded-lg text-base sm:text-lg 
                     shadow-2xl shadow-brand-red/50
                     hover:shadow-brand-red/70 transition-all duration-300 
                     hover:scale-105 mb-4 magnetic-button relative group overflow-hidden"
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-red-600 to-brand-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm text-gray-400 mb-12"
        >
          No credit card • 2-minute signup
        </motion.p>

        {/* Progress Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-8 mt-8 sm:mt-12"
        >
          {heroProgressStages.map((stage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="flex flex-col items-center group"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full glass 
                            flex items-center justify-center text-lg sm:text-2xl mb-1 sm:mb-2 
                            border border-white/10 group-hover:glass-red transition-all duration-300
                            group-hover:scale-110">
                {stage.icon}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-brand-red transition-colors">
                {stage.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Arrow Indicator (bottom of viewport) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-8 h-8 text-brand-red" />
      </motion.div>
    </section>
  );
}
