'use client';

import { motion } from 'framer-motion';
import { Backpack, Plane } from 'lucide-react';
import { useTravelerType } from '@/contexts/TravelerTypeContext';

export default function TravelerTypeSwitcher() {
  const { travelerType, setTravelerType } = useTravelerType();

  return (
    <div className="flex items-center justify-center py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-white/10 dark:bg-brand-dark-900/60 backdrop-blur-xl rounded-full p-1.5 border border-white/20"
      >
        <button
          onClick={() => setTravelerType('nomad')}
          className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
            travelerType === 'nomad'
              ? 'text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          {travelerType === 'nomad' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-brand-red rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Backpack className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Digital Nomad</span>
        </button>
        
        <button
          onClick={() => setTravelerType('traveler')}
          className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
            travelerType === 'traveler'
              ? 'text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          {travelerType === 'traveler' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Plane className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Short-Term Traveler</span>
        </button>
      </motion.div>
    </div>
  );
}

