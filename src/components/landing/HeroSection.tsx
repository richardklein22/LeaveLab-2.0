'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Award, CheckCircle, Shield, Zap, Newspaper } from 'lucide-react';
import { heroProgressStages } from '@/lib/landing-data';
import { Badge } from '@/components/ui/badge';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-brand-dark-950">
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
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Credibility Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8 animate-float"
        >
          <Badge className="glass-red text-brand-red-200 border-brand-red/30 px-4 py-1.5 text-xs hover:bg-brand-red/20 transition-colors">
            <Award className="w-3 h-3 mr-1.5 inline animate-pulse" />
            Featured in Major Publications
          </Badge>
        </motion.div>

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
          className="text-base md:text-lg lg:text-xl text-gray-400 mb-8 max-w-xl mx-auto"
        >
          Complete platform for income, visa, housing & community
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <button 
            onClick={() => window.location.href = '/signup'}
            className="bg-brand-red hover:bg-brand-red-600 text-white font-semibold 
                     px-8 py-3 sm:px-10 sm:py-4 rounded-lg text-base sm:text-lg 
                     shadow-2xl shadow-brand-red/50
                     hover:shadow-brand-red/70 transition-all duration-300 
                     hover:scale-105 magnetic-button relative group overflow-hidden"
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-red-600 to-brand-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>
      </div>

      {/* Arrow Indicator (positioned between CTA and bottom, centered) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-[15vh] left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-8 h-8 text-brand-red" />
      </motion.div>

      {/* Floating Stats Elements (Desktop only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-10 left-10 bg-brand-dark-900/70 backdrop-blur-xl p-4 rounded-2xl animate-float hidden lg:block border border-brand-red/20"
      >
        <div className="text-3xl font-bold text-brand-red">50+</div>
        <div className="text-xs text-gray-400">Relocations</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute top-1/3 right-10 bg-brand-dark-900/70 backdrop-blur-xl p-4 rounded-2xl animate-float animation-delay-2000 hidden lg:block border border-brand-red/20"
      >
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-brand-red" />
          <div className="text-2xl font-bold text-white">4</div>
        </div>
        <div className="text-xs text-gray-400">Media Features</div>
      </motion.div>
    </section>
  );
}
