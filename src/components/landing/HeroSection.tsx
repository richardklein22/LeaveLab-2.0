'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { heroProgressStages } from '@/lib/landing-data';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 -z-10" />
      
      {/* Optional: Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5 -z-10" 
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z\' fill=\'%2310B981\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Content container */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Move to Thailand in 90 Days
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
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
            className="bg-green-500 hover:bg-green-600 text-white font-semibold 
                     px-8 py-3 sm:px-10 sm:py-4 rounded-lg text-base sm:text-lg shadow-lg 
                     hover:shadow-xl transition-all duration-300 
                     hover:scale-105 mb-4"
          >
            Start Free Trial
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm text-gray-500 mb-12"
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
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-md 
                            flex items-center justify-center text-lg sm:text-2xl mb-1 sm:mb-2 
                            border-2 border-gray-100">
                {stage.icon}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
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
        <ChevronDown className="w-8 h-8 text-gray-400" />
      </motion.div>
    </section>
  );
}

