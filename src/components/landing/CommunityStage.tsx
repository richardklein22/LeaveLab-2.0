'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Network, MessageCircle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

      {/* Bento Grid Layout */}
      <div className="container mx-auto px-4 lg:px-8">
        {/* Desktop & Mobile: Bento Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-6 max-w-6xl mx-auto">
          {/* Large Card: Events (spans 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:row-span-2 bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl p-8 border border-brand-accent-pink/30 
                       hover:border-brand-accent-pink/50 transition-all duration-300 card-3d"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-accent-pink/20 to-brand-accent-pink/5 
                            flex items-center justify-center mb-6 border border-brand-accent-pink/20">
              <CalendarDays className="h-8 w-8 text-brand-accent-pink" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">
              Events & Meetups
            </h3>
            <p className="text-gray-400 mb-6">
              Weekly in-person gatherings across Thailand
            </p>

            <div className="space-y-4">
              <div className="bg-brand-dark-950/50 rounded-lg p-4 border border-brand-accent-pink/20">
                <p className="text-sm font-semibold text-white mb-1">Boat Parties</p>
                <p className="text-xs text-gray-400">Weekly in Bangkok, meet 30+ nomads</p>
              </div>
              <div className="bg-brand-dark-950/50 rounded-lg p-4 border border-brand-accent-pink/20">
                <p className="text-sm font-semibold text-white mb-1">Coworking Sessions</p>
                <p className="text-xs text-gray-400">Daily across all major cities</p>
              </div>
              <div className="bg-brand-dark-950/50 rounded-lg p-4 border border-brand-accent-pink/20">
                <p className="text-sm font-semibold text-white mb-1">Road Trips</p>
                <p className="text-xs text-gray-400">Monthly adventures to islands & mountains</p>
              </div>
              <div className="bg-brand-dark-950/50 rounded-lg p-4 border border-brand-accent-pink/20">
                <p className="text-sm font-semibold text-white mb-1">Workshops</p>
                <p className="text-xs text-gray-400">Skill-sharing sessions every week</p>
              </div>
            </div>
          </motion.div>

          {/* Top Right: Discord */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl p-6 border border-brand-accent-pink/20 
                       hover:border-brand-accent-pink/50 transition-all duration-300 card-3d"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-accent-pink/20 to-brand-accent-pink/5 
                              flex items-center justify-center flex-shrink-0 border border-brand-accent-pink/20">
                <MessageCircle className="h-7 w-7 text-brand-accent-pink" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">Discord Community</h3>
                  <Badge className="bg-brand-accent-pink/20 text-brand-accent-pink border-brand-accent-pink/30">
                    <Users className="w-3 h-3 mr-1 inline" />
                    1,247 Members
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">24/7 active community with channels for every need</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="bg-brand-dark-950/50 rounded-lg p-3 text-center border border-brand-accent-pink/20">
                <p className="text-xs text-gray-400 mb-1">City</p>
                <p className="text-sm font-semibold text-white">Channels</p>
              </div>
              <div className="bg-brand-dark-950/50 rounded-lg p-3 text-center border border-brand-accent-pink/20">
                <p className="text-xs text-gray-400 mb-1">Visa</p>
                <p className="text-sm font-semibold text-white">Help</p>
              </div>
              <div className="bg-brand-dark-950/50 rounded-lg p-3 text-center border border-brand-accent-pink/20">
                <p className="text-xs text-gray-400 mb-1">Job</p>
                <p className="text-sm font-semibold text-white">Board</p>
              </div>
              <div className="bg-brand-dark-950/50 rounded-lg p-3 text-center border border-brand-accent-pink/20">
                <p className="text-xs text-gray-400 mb-1">Social</p>
                <p className="text-sm font-semibold text-white">Events</p>
              </div>
            </div>
          </motion.div>

          {/* Bottom Right: Networking */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl p-6 border border-brand-accent-pink/20 
                       hover:border-brand-accent-pink/50 transition-all duration-300 card-3d"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-accent-pink/20 to-brand-accent-pink/5 
                              flex items-center justify-center flex-shrink-0 border border-brand-accent-pink/20">
                <Network className="h-7 w-7 text-brand-accent-pink" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Online Networking</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Connect with future roommates, travel buddies, and collaborators before you arrive
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-brand-accent-pink border-brand-accent-pink/50 bg-brand-accent-pink/5 text-xs">
                    Profile Matching
                  </Badge>
                  <Badge variant="outline" className="text-brand-accent-pink border-brand-accent-pink/50 bg-brand-accent-pink/5 text-xs">
                    City Groups
                  </Badge>
                  <Badge variant="outline" className="text-brand-accent-pink border-brand-accent-pink/50 bg-brand-accent-pink/5 text-xs">
                    Skill Matching
                  </Badge>
                  <Badge variant="outline" className="text-brand-accent-pink border-brand-accent-pink/50 bg-brand-accent-pink/5 text-xs">
                    Direct Messages
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile: Stacked Cards */}
        <div className="lg:hidden space-y-6 max-w-2xl mx-auto">
          {/* Events */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-accent-pink/30"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-accent-pink/20 to-brand-accent-pink/5 
                              flex items-center justify-center flex-shrink-0 border border-brand-accent-pink/20">
                <CalendarDays className="h-6 w-6 text-brand-accent-pink" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Events & Meetups</h3>
                <p className="text-sm text-gray-400">Weekly gatherings across Thailand</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-brand-dark-950/50 rounded-lg p-3 border border-brand-accent-pink/20">
                <p className="text-sm font-semibold text-white mb-1">Boat Parties</p>
                <p className="text-xs text-gray-400">Weekly in Bangkok</p>
              </div>
              <div className="bg-brand-dark-950/50 rounded-lg p-3 border border-brand-accent-pink/20">
                <p className="text-sm font-semibold text-white mb-1">Coworking</p>
                <p className="text-xs text-gray-400">Daily sessions</p>
              </div>
            </div>
          </motion.div>

          {/* Discord */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-accent-pink/20"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-accent-pink/20 to-brand-accent-pink/5 
                              flex items-center justify-center flex-shrink-0 border border-brand-accent-pink/20">
                <MessageCircle className="h-6 w-6 text-brand-accent-pink" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white">Discord</h3>
                  <Badge className="bg-brand-accent-pink/20 text-brand-accent-pink border-brand-accent-pink/30 text-xs">
                    1,247 Members
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">24/7 active community</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-brand-dark-950/50 rounded-lg p-2 text-center border border-brand-accent-pink/20">
                <p className="text-xs text-gray-400">City Channels</p>
              </div>
              <div className="bg-brand-dark-950/50 rounded-lg p-2 text-center border border-brand-accent-pink/20">
                <p className="text-xs text-gray-400">Visa Help</p>
              </div>
              <div className="bg-brand-dark-950/50 rounded-lg p-2 text-center border border-brand-accent-pink/20">
                <p className="text-xs text-gray-400">Job Board</p>
              </div>
              <div className="bg-brand-dark-950/50 rounded-lg p-2 text-center border border-brand-accent-pink/20">
                <p className="text-xs text-gray-400">Events</p>
              </div>
            </div>
          </motion.div>

          {/* Networking */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border border-brand-accent-pink/20"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-accent-pink/20 to-brand-accent-pink/5 
                              flex items-center justify-center flex-shrink-0 border border-brand-accent-pink/20">
                <Network className="h-6 w-6 text-brand-accent-pink" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Online Networking</h3>
                <p className="text-sm text-gray-400">Connect before you arrive</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-brand-accent-pink border-brand-accent-pink/50 bg-brand-accent-pink/5 text-xs">
                Profile Matching
              </Badge>
              <Badge variant="outline" className="text-brand-accent-pink border-brand-accent-pink/50 bg-brand-accent-pink/5 text-xs">
                City Groups
              </Badge>
              <Badge variant="outline" className="text-brand-accent-pink border-brand-accent-pink/50 bg-brand-accent-pink/5 text-xs">
                DM System
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Mobile: Bento Grid */}
        <div className="lg:hidden max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Events - Full Width (spans 2 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="col-span-2 bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-5 border border-brand-accent-pink/30"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-accent-pink/20 to-brand-accent-pink/5 
                                flex items-center justify-center flex-shrink-0 border border-brand-accent-pink/20">
                  <CalendarDays className="h-6 w-6 text-brand-accent-pink" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Events & Meetups</h3>
                  <p className="text-sm text-gray-400">Weekly gatherings across Thailand</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-brand-dark-950/50 rounded-lg p-2 border border-brand-accent-pink/20">
                  <p className="text-xs font-semibold text-white">Boat Parties</p>
                  <p className="text-[10px] text-gray-400">Weekly</p>
                </div>
                <div className="bg-brand-dark-950/50 rounded-lg p-2 border border-brand-accent-pink/20">
                  <p className="text-xs font-semibold text-white">Coworking</p>
                  <p className="text-[10px] text-gray-400">Daily</p>
                </div>
                <div className="bg-brand-dark-950/50 rounded-lg p-2 border border-brand-accent-pink/20">
                  <p className="text-xs font-semibold text-white">Road Trips</p>
                  <p className="text-[10px] text-gray-400">Monthly</p>
                </div>
                <div className="bg-brand-dark-950/50 rounded-lg p-2 border border-brand-accent-pink/20">
                  <p className="text-xs font-semibold text-white">Workshops</p>
                  <p className="text-[10px] text-gray-400">Weekly</p>
                </div>
              </div>
            </motion.div>

            {/* Discord - Bottom Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-4 border border-brand-accent-pink/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent-pink/20 to-brand-accent-pink/5 
                                flex items-center justify-center flex-shrink-0 border border-brand-accent-pink/20">
                  <MessageCircle className="h-5 w-5 text-brand-accent-pink" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Discord</h3>
                  <p className="text-[10px] text-brand-accent-pink font-semibold">1,247 Members</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">24/7 active community</p>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500">• City channels</p>
                <p className="text-[10px] text-gray-500">• Visa help</p>
                <p className="text-[10px] text-gray-500">• Job board</p>
              </div>
            </motion.div>

            {/* Networking - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-4 border border-brand-accent-pink/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent-pink/20 to-brand-accent-pink/5 
                                flex items-center justify-center flex-shrink-0 border border-brand-accent-pink/20">
                  <Network className="h-5 w-5 text-brand-accent-pink" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Networking</h3>
                  <p className="text-[10px] text-gray-400">Pre-arrival</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">Connect before you arrive</p>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500">• Profile matching</p>
                <p className="text-[10px] text-gray-500">• City groups</p>
                <p className="text-[10px] text-gray-500">• DM system</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

