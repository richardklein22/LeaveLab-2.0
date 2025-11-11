'use client';

import { motion } from 'framer-motion';
import { Plane, FileText, MapPin, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const stages = [
  {
    icon: Plane,
    number: '1',
    title: 'PLAN',
    subtitle: 'Book flights & accommodation',
    timeline: 'Pre-arrival',
    bgColor: 'from-blue-100 to-blue-50',
    borderColor: 'border-blue-300',
    iconColor: 'text-blue-600',
    badgeColor: 'bg-blue-500'
  },
  {
    icon: FileText,
    number: '2',
    title: 'VISA',
    subtitle: 'Tourist visa & exemptions',
    timeline: 'Day 1',
    bgColor: 'from-cyan-100 to-cyan-50',
    borderColor: 'border-cyan-300',
    iconColor: 'text-cyan-600',
    badgeColor: 'bg-cyan-500'
  },
  {
    icon: MapPin,
    number: '3',
    title: 'EXPLORE',
    subtitle: 'Custom itineraries',
    timeline: 'Throughout stay',
    bgColor: 'from-indigo-100 to-indigo-50',
    borderColor: 'border-indigo-300',
    iconColor: 'text-indigo-600',
    badgeColor: 'bg-indigo-500'
  },
  {
    icon: Sparkles,
    number: '4',
    title: 'CONNECT',
    subtitle: 'Join community & get support',
    timeline: 'Anytime',
    bgColor: 'from-purple-100 to-purple-50',
    borderColor: 'border-purple-300',
    iconColor: 'text-purple-600',
    badgeColor: 'bg-purple-500'
  }
];

export default function RoadmapOverviewTraveler() {
  return (
    <section className="py-12 sm:py-16 bg-white relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            Your Travel Journey
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need for <span className="text-blue-600">Thailand</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From planning to exploring, we've got you covered every step of the way.
          </p>
        </motion.div>

        {/* Desktop: 4 columns */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6 max-w-7xl mx-auto relative">
          {/* Connecting line */}
          <div 
            className="absolute top-24 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500"
            style={{ width: 'calc(100% - 128px)', left: '64px', zIndex: 0 }} 
          />
          
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <div className={`bg-white rounded-xl p-6 border-2 ${stage.borderColor} 
                                hover:border-opacity-80 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                  {/* Stage number badge */}
                  <div className={`absolute -top-4 left-6 w-8 h-8 rounded-full ${stage.badgeColor} 
                                  flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {stage.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stage.bgColor} 
                                  flex items-center justify-center mb-4 mx-auto mt-2 
                                  border-2 ${stage.borderColor}`}>
                    <Icon className={`h-8 w-8 ${stage.iconColor}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-2">
                    {stage.subtitle}
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    {stage.timeline}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: 2x2 Grid - All Visible */}
        <div className="lg:hidden grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className={`bg-white rounded-xl p-4 border-2 ${stage.borderColor} h-full shadow-md`}>
                  <div className={`absolute -top-2 -left-2 w-7 h-7 rounded-full ${stage.badgeColor} 
                                  flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                    {stage.number}
                  </div>
                  
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stage.bgColor} 
                                  flex items-center justify-center mb-3 mx-auto mt-1 
                                  border-2 ${stage.borderColor}`}>
                    <Icon className={`h-6 w-6 ${stage.iconColor}`} />
                  </div>
                  
                  <h3 className="text-sm font-bold text-gray-900 text-center mb-1">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-gray-600 text-center mb-1">
                    {stage.subtitle}
                  </p>
                  <p className="text-[10px] text-gray-500 text-center">
                    {stage.timeline}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

