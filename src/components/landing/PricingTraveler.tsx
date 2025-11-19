'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PricingTraveler() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1.5 inline" />
            Special Launch Offer
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Start Your Thailand <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Adventure</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get lifetime access to exclusive deals, expert community, and personalized support
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 sm:p-8 md:p-10 border-2 border-blue-300 shadow-2xl relative overflow-hidden">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-2xl" />
            
            <div className="relative">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Join LeaveLab</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Community, resources, and Thailand travel support</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Free</span>
                  <span className="text-gray-600 text-sm sm:text-base">to join</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">No credit card required</p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  'Visa reminders & travel guides',
                  'Partner discounts (flights, hostels, insurance)',
                  'Community chat & local insights',
                  'Thailand travel resources'
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2 sm:gap-3"
                  >
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => window.location.href = '/signup'}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 
                         text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-xl shadow-lg
                         hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Join Free
              </button>

              <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                Join 5,000+ travelers in Thailand
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

