'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Network, MessageCircle } from 'lucide-react';

const communityOptions = [
  {
    icon: CalendarDays,
    title: 'Events & Meetups',
    description: 'Weekly meetups across Thailand',
    features: [
      'Boat parties (Bangkok)',
      'Coworking sessions',
      'Road trips',
      'Skill workshops'
    ]
  },
  {
    icon: Network,
    title: 'Online Networking',
    description: 'Connect before you arrive',
    features: [
      'Profile matching',
      'City-based groups',
      'Skill-based matching',
      'Direct messaging'
    ]
  },
  {
    icon: MessageCircle,
    title: 'Discord Community',
    description: '24/7 Discord server with 1,247 nomads',
    features: [
      'City channels',
      'Visa questions',
      'Job opportunities',
      'Social events'
    ]
  }
];

export default function CommunityStage() {
  return (
    <section id="community" className="py-16 sm:py-20 bg-brand-dark-900 relative">
      {/* Stage Header */}
      <div className="container mx-auto px-4 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Stage badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-accent-pink flex items-center justify-center text-white font-bold text-lg">
              4
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                STAGE 4: <span className="text-brand-accent-pink">COMMUNITY</span>
              </h2>
              <p className="text-lg text-gray-400 mt-1">
                Join 1,247 nomads already living in Thailand
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Community Options Grid */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {communityOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-accent-pink/20 
                           hover:border-brand-accent-pink/50 hover:bg-brand-dark-900/80 transition-all duration-300 
                           card-3d flex flex-col h-full"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-accent-pink/20 to-brand-accent-pink/5 
                                flex items-center justify-center mb-4 border border-brand-accent-pink/20">
                  <Icon className="h-7 w-7 text-brand-accent-pink" />
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {option.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-400 mb-4">
                  {option.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2 flex-grow">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="w-1 h-1 rounded-full bg-brand-accent-pink mt-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

