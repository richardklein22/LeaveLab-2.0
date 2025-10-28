'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-red to-brand-red-800 animate-gradient" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-accent/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-red-700/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2"
        >
          Your Thailand Life Starts <span className="text-white/90">Today</span>—Not Someday
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-2"
        >
          1,247 nomads already started. Some teach. Some run FBA. Some travel.{' '}
          <strong className="text-white">What&apos;s your move?</strong>
        </motion.p>
        
        {/* Primary and secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-stretch gap-3 sm:gap-4 mb-6 sm:mb-8 px-2 
                     sm:flex-row sm:items-center sm:justify-center"
        >
          <button 
            onClick={() => window.location.href = '/signup'}
            className="bg-white text-brand-red font-bold px-8 py-3.5 sm:px-10 sm:py-4 
                     rounded-lg sm:rounded-xl text-base sm:text-lg shadow-2xl 
                     hover:shadow-3xl hover:scale-105 transition-all duration-300 
                     w-full sm:w-auto magnetic-button"
          >
            Start Free Trial
          </button>
          
          <button 
            onClick={() => window.location.href = '#'}
            className="border-2 border-white text-white font-semibold px-8 py-3.5 sm:px-10 sm:py-4 
                     rounded-lg sm:rounded-xl text-base sm:text-lg 
                     hover:bg-white hover:text-brand-red 
                     transition-all duration-300 w-full sm:w-auto"
          >
            Talk to a Mentor First
          </button>
        </motion.div>
        
        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 
                   text-white/80 text-xs sm:text-sm px-2"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>30-day guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Join 1,247 nomads</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
