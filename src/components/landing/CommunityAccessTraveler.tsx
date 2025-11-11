'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, BookOpen, Bell, Compass, Heart, Check, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const freeFeatures = [
  {
    icon: Bell,
    title: 'Visa Reminders',
    description: 'Automatic alerts for tourist visa and exemption expiry dates',
    badge: 'Free'
  },
  {
    icon: BookOpen,
    title: 'Travel Guides',
    description: 'Comprehensive guides for first-time visitors to Thailand',
    badge: 'Free'
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Connect with fellow travelers and nomads',
    badge: 'Free'
  }
];

const premiumFeatures = [
  {
    icon: MessageCircle,
    title: 'Direct Founder Access',
    description: 'Get real answers from founders living in Thailand',
    badge: 'Premium'
  },
  {
    icon: Compass,
    title: 'Custom Itineraries',
    description: 'Personalized travel plans based on your interests',
    badge: 'Premium'
  },
  {
    icon: Heart,
    title: 'Insider Tips',
    description: 'Hidden gems, best restaurants, and authentic experiences',
    badge: 'Premium'
  }
];

export default function CommunityAccessTraveler() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
            <Users className="w-3 h-3 mr-1.5 inline" />
            Community & Support
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Get <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Expert Support</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade to premium for direct founder access and personalized guidance
          </p>
        </motion.div>

        {/* Split Layout - Free vs Premium */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Free Access</h3>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Start Now
              </Badge>
            </div>
            
            <div className="space-y-4">
              {freeFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <button
              onClick={() => window.location.href = '/signup'}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 
                       text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Start Free
            </button>
          </motion.div>

          {/* Premium Tier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-300 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 blur-2xl" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-gray-900">Premium Access</h3>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                Upgrade
              </Badge>
            </div>
            
            <div className="space-y-4 relative z-10">
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <Lock className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-white/50 rounded-lg border border-purple-200 relative z-10">
              <p className="text-sm text-gray-700 text-center">
                Upgrade anytime in-app to unlock premium features
              </p>
            </div>
          </motion.div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-12 bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-700 text-base mb-3 italic">
                "The free community was already helpful, but upgrading to get direct access to the founders was a game-changer. They answered all my questions about Thailand!"
              </p>
              <div>
                <p className="font-semibold text-gray-900">Sarah M.</p>
                <p className="text-sm text-gray-600">Premium Member</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

