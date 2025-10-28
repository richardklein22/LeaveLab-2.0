'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: window.innerWidth < 640 ? '20px 20px' : '30px 30px'
          }} 
        />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2"
        >
          Your Thailand Life Starts Today—Not Someday
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-base sm:text-lg lg:text-xl text-green-50 mb-6 sm:mb-8 leading-relaxed px-2"
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
            className="bg-white text-green-600 font-bold px-8 py-3.5 sm:px-10 sm:py-4 
                     rounded-lg sm:rounded-xl text-base sm:text-lg shadow-xl 
                     hover:shadow-2xl hover:scale-105 transition-all duration-300 
                     w-full sm:w-auto animate-pulse-subtle hover:animate-none"
          >
            Start Free Trial
          </button>
          
          <button 
            onClick={() => window.location.href = '#'}
            className="border-2 border-white text-white font-semibold px-8 py-3.5 sm:px-10 sm:py-4 
                     rounded-lg sm:rounded-xl text-base sm:text-lg 
                     hover:bg-white hover:text-green-600 
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
                   text-green-50 text-xs sm:text-sm px-2"
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

