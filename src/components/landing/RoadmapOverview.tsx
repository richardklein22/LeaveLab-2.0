'use client';

import { motion } from 'framer-motion';
import { DollarSign, FileText, Home, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const stages = [
  {
    icon: DollarSign,
    number: '1',
    title: 'INCOME',
    subtitle: 'Lock in £2K+/month',
    timeline: 'Days 1-30',
    color: 'from-brand-red/20 to-brand-red/5'
  },
  {
    icon: FileText,
    number: '2',
    title: 'VISA',
    subtitle: 'Secure your visa',
    timeline: 'Days 31-60',
    color: 'from-brand-accent/20 to-brand-accent/5'
  },
  {
    icon: Home,
    number: '3',
    title: 'HOUSING',
    subtitle: 'Find your home',
    timeline: 'Days 61-75',
    color: 'from-brand-accent-orange/20 to-brand-accent-orange/5'
  },
  {
    icon: Users,
    number: '4',
    title: 'COMMUNITY',
    subtitle: 'Join 1,247 nomads',
    timeline: 'Days 76-90',
    color: 'from-brand-accent-pink/20 to-brand-accent-pink/5'
  }
];

export default function RoadmapOverview() {
  return (
    <section className="py-12 sm:py-16 bg-brand-dark-900 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
            The Complete Roadmap
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Your 90-Day Journey to <span className="text-brand-red">Thailand</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Follow our proven 4-stage system. Each stage builds on the last.
          </p>
        </motion.div>

        {/* Desktop: 4 columns */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6 max-w-7xl mx-auto relative">
          {/* Connecting line */}
          <div 
            className="absolute top-24 h-0.5 bg-gradient-to-r from-brand-red via-brand-accent to-brand-accent-pink"
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
                <div className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-red/20 
                                hover:border-brand-red/50 transition-all duration-300 card-3d hover:bg-brand-dark-900/80">
                  {/* Stage number badge */}
                  <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-brand-red 
                                  flex items-center justify-center text-white font-bold text-sm">
                    {stage.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stage.color} 
                                  flex items-center justify-center mb-4 mx-auto mt-2 
                                  border border-brand-red/20`}>
                    <Icon className="h-8 w-8 text-brand-red" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-white text-center mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-gray-400 text-center mb-2">
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
                <div className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-4 border border-brand-red/20 h-full">
                  <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-brand-red 
                                  flex items-center justify-center text-white font-bold text-xs">
                    {stage.number}
                  </div>
                  
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stage.color} 
                                  flex items-center justify-center mb-3 mx-auto mt-1 
                                  border border-brand-red/20`}>
                    <Icon className="h-6 w-6 text-brand-red" />
                  </div>
                  
                  <h3 className="text-sm font-bold text-white text-center mb-1">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-gray-400 text-center mb-1">
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

