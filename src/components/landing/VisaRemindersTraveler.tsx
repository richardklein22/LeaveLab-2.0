'use client';

import { motion } from 'framer-motion';
import { Calendar, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const visaTypes = [
  {
    name: 'Visa Exemption',
    duration: '30 days',
    extension: 'Can extend 30 days',
    difficulty: 'Easy',
    bestFor: 'Short visits',
    color: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-300',
    bgColor: 'bg-green-50'
  },
  {
    name: 'Tourist Visa (Single)',
    duration: '60 days',
    extension: 'Can extend 30 days',
    difficulty: 'Easy',
    bestFor: 'Longer holidays',
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    popular: true
  },
  {
    name: 'Tourist Visa (Multiple)',
    duration: '60 days per entry',
    extension: 'Valid 6 months',
    difficulty: 'Medium',
    bestFor: 'Multiple visits',
    color: 'from-purple-500 to-indigo-500',
    borderColor: 'border-purple-300',
    bgColor: 'bg-purple-50'
  }
];

const reminderFeatures = [
  {
    icon: Bell,
    title: 'Expiry Alerts',
    description: '7-day advance notification before your visa expires'
  },
  {
    icon: CheckCircle,
    title: 'Extension Guidance',
    description: 'Step-by-step instructions on how and where to extend'
  },
  {
    icon: Calendar,
    title: 'Smart Calendar',
    description: 'Track your visa dates and plan your travels accordingly'
  }
];

export default function VisaRemindersTraveler() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-cyan-50 via-blue-50 to-white relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            <Calendar className="w-3 h-3 mr-1.5 inline" />
            Never Miss a Deadline
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tourist Visa <span className="text-blue-600">Made Simple</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Automatic reminders and clear guidance for visa exemptions and tourist visas
          </p>
        </motion.div>

        {/* Visa Comparison Cards - Horizontal Scroll on Mobile */}
        <div className="max-w-5xl mx-auto mb-12">
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {visaTypes.map((visa, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${visa.bgColor} rounded-xl p-6 border-2 ${visa.borderColor} 
                           hover:shadow-xl transition-all duration-300 relative`}
              >
                {visa.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white border-0 text-xs">
                    Most Popular
                  </Badge>
                )}
                
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${visa.color} 
                                flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                  <Calendar className="h-7 w-7 text-white" />
                </div>

                <h4 className="text-lg font-bold text-gray-900 text-center mb-3">
                  {visa.name}
                </h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-gray-900">{visa.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Extension:</span>
                    <span className="font-semibold text-gray-900">{visa.extension}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className={`font-semibold ${
                      visa.difficulty === 'Easy' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {visa.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Best for:</span>
                    <span className="font-semibold text-gray-900">{visa.bestFor}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-4 min-w-max">
              {visaTypes.map((visa, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`${visa.bgColor} rounded-xl p-6 border-2 ${visa.borderColor} 
                             w-[280px] flex-shrink-0 snap-center relative shadow-lg`}
                >
                  {visa.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white border-0 text-xs">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${visa.color} 
                                  flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                    <Calendar className="h-7 w-7 text-white" />
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 text-center mb-3">
                    {visa.name}
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold text-gray-900">{visa.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Extension:</span>
                      <span className="font-semibold text-gray-900">{visa.extension}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className={`font-semibold ${
                        visa.difficulty === 'Easy' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {visa.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Best for:</span>
                      <span className="font-semibold text-gray-900">{visa.bestFor}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll indicator (mobile) */}
          <div className="md:hidden text-center mt-4">
            <p className="text-xs text-gray-500">← Swipe to compare visa types →</p>
          </div>
        </div>

        {/* Reminder Features */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {reminderFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 border-2 border-blue-200 text-center
                           hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 
                                flex items-center justify-center mb-4 mx-auto">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-blue-50 rounded-xl p-6 border-2 border-blue-200"
        >
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Stay Legal, Travel Worry-Free</h4>
              <p className="text-gray-700 text-sm">
                Our automated reminder system ensures you'll never overstay your visa. 
                Get notifications 7 days before expiry with detailed instructions on extending or leaving Thailand.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

