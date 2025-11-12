'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PricingTraveler() {
  return (
    <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
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
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-10 border-2 border-blue-300 shadow-2xl relative overflow-hidden">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-2xl" />
            
            <div className="relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Join LeaveLab</h3>
                <p className="text-gray-600 mb-6">Get access to our community, resources, and Thailand travel support</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Free</span>
                  <span className="text-gray-600">to join</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">No credit card required • Cancel anytime</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  'Community chat with fellow travelers',
                  'Automatic visa expiry reminders',
                  'Travel guides & recommendations',
                  'Connect with experienced travelers',
                  'Thailand travel resources',
                  'Partner discounts & deals',
                  'Community support',
                  'Insider tips & local insights'
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => window.location.href = '/signup'}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 
                         text-white font-bold py-4 rounded-xl shadow-lg
                         hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Join Free
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                🎉 Join 5,000+ travelers exploring Thailand
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

