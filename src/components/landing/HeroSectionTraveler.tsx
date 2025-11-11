'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Award, Plane, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function HeroSectionTraveler() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Animated Background Blobs - Light Theme */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-blob animation-delay-4000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
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
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1.5 text-xs hover:bg-blue-200 transition-colors">
            <Award className="w-3 h-3 mr-1.5 inline animate-pulse" />
            Trusted by 5,000+ Travelers
          </Badge>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
        >
          <span className="inline-block hover:scale-110 transition-transform duration-300">Your</span>{' '}
          <span className="inline-block hover:scale-110 transition-transform duration-300">Ultimate</span>{' '}
          <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
            Thailand
          </span>{' '}
          <span className="inline-block hover:scale-110 transition-transform duration-300">Adventure</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 max-w-xl mx-auto"
        >
          Expert guidance, exclusive deals & insider tips for unforgettable Thailand travels
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
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold 
                     px-8 py-3 sm:px-10 sm:py-4 rounded-lg text-base sm:text-lg 
                     shadow-2xl shadow-blue-500/50
                     hover:shadow-blue-600/70 transition-all duration-300 
                     hover:scale-105 magnetic-button relative group overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              Start Your Journey
              <Plane className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>

        {/* Arrow Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center mt-8 animate-bounce"
        >
          <ChevronDown className="w-8 h-8 text-blue-500" />
        </motion.div>
      </div>

      {/* Floating Stats Elements (Desktop only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-10 left-10 bg-white/80 backdrop-blur-xl p-4 rounded-2xl animate-float hidden lg:block border border-blue-200 shadow-lg"
      >
        <div className="text-3xl font-bold text-blue-600">5,000+</div>
        <div className="text-xs text-gray-600">Happy Travelers</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute top-1/3 right-10 bg-white/80 backdrop-blur-xl p-4 rounded-2xl animate-float animation-delay-2000 hidden lg:block border border-cyan-200 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-600" />
          <div className="text-2xl font-bold text-gray-900">50+</div>
        </div>
        <div className="text-xs text-gray-600">Destinations</div>
      </motion.div>
    </section>
  );
}

