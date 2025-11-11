'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, BookOpen, Bell, Compass, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: MessageCircle,
    title: 'Ask the Founders',
    description: 'Direct access to founders who live in Thailand - get real answers to your questions'
  },
  {
    icon: Users,
    title: 'Connect with Nomads',
    description: 'Chat with digital nomads and expats who know Thailand inside and out'
  },
  {
    icon: Bell,
    title: 'Visa Reminders',
    description: 'Automatic alerts for tourist visa and exemption expiry dates'
  },
  {
    icon: Compass,
    title: 'Custom Itineraries',
    description: 'Personalized travel plans based on your interests and duration'
  },
  {
    icon: BookOpen,
    title: 'Travel Guides',
    description: 'Comprehensive guides for first-time visitors to Thailand'
  },
  {
    icon: Heart,
    title: 'Local Insights',
    description: 'Hidden gems, best restaurants, and authentic experiences'
  }
];

export default function CommunityAccessTraveler() {
  return (
    <section className="py-16 sm:py-20 bg-white relative">
      <div className="container mx-auto px-4 lg:px-8">
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
            Premium Community
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Get <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Expert Support</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our exclusive community and get personalized guidance from people who know Thailand best
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200
                           hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 
                                flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonial-style Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 border-2 border-purple-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-gray-700 text-lg mb-3 italic">
                "Having direct access to people who actually live in Thailand made my trip so much easier. 
                I got answers to questions I didn't even know I had!"
              </p>
              <div>
                <p className="font-semibold text-gray-900">Sarah M.</p>
                <p className="text-sm text-gray-600">First-time Thailand traveler</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

