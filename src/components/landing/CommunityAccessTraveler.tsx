'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, BookOpen, Bell, Compass, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Bell,
    title: 'Visa Reminders',
    description: 'Automatic alerts for tourist visa and exemption expiry dates'
  },
  {
    icon: BookOpen,
    title: 'Travel Guides',
    description: 'Comprehensive guides for first-time visitors to Thailand'
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Connect with fellow travelers and nomads'
  },
  {
    icon: MessageCircle,
    title: 'Ask the Community',
    description: 'Get real answers from experienced travelers and locals'
  },
  {
    icon: Compass,
    title: 'Travel Resources',
    description: 'Itineraries, tips, and recommendations for your trip'
  },
  {
    icon: Heart,
    title: 'Local Insights',
    description: 'Hidden gems, best restaurants, and authentic experiences'
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
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            <Users className="w-3 h-3 mr-1.5 inline" />
            Community & Support
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Get <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Expert Support</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community of travelers and get the guidance you need for your Thailand adventure
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 border-2 border-blue-200
                           hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 
                                flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-700 text-base mb-3 italic">
                "The community support made my Thailand trip so much easier. I got answers to all my questions from people who actually live there!"
              </p>
              <div>
                <p className="font-semibold text-gray-900">Sarah M.</p>
                <p className="text-sm text-gray-600">LeaveLab Member</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

