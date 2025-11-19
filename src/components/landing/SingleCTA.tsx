'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Shield, Zap } from 'lucide-react';

export default function SingleCTA() {
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Start Your Journey to <span className="text-brand-red">Thailand</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-400 mb-8">
            Join 1,247 digital nomads already living their dream life
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/placeholder'}
            className="bg-brand-red hover:bg-brand-red-600 text-white font-bold 
                     text-lg md:text-xl px-12 py-4 md:py-5 rounded-lg
                     shadow-2xl shadow-brand-red/50 hover:shadow-brand-red/70 
                     transition-all duration-300 mb-8 relative group overflow-hidden"
          >
            <span className="relative z-10">Create Your Free Account</span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-red-600 to-brand-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-brand-dark-900/70 backdrop-blur-xl flex items-center justify-center 
                              group-hover:bg-brand-red/20 transition-all border border-brand-red/30">
                <CheckCircle className="h-5 w-5 text-brand-red" />
              </div>
              <span className="group-hover:text-white transition-colors">No credit card required</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-brand-dark-900/70 backdrop-blur-xl flex items-center justify-center 
                              group-hover:bg-brand-red/20 transition-all border border-brand-red/30">
                <Zap className="h-5 w-5 text-brand-red" />
              </div>
              <span className="group-hover:text-white transition-colors">7-day premium trial</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-brand-dark-900/70 backdrop-blur-xl flex items-center justify-center 
                              group-hover:bg-brand-red/20 transition-all border border-brand-red/30">
                <Shield className="h-5 w-5 text-brand-red" />
              </div>
              <span className="group-hover:text-white transition-colors">Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

