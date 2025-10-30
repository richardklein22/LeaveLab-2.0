'use client';

import { motion } from 'framer-motion';
import { DollarSign, FileText, Home, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const stories = [
  {
    name: 'Sarah M., 28',
    location: 'London → Chiang Mai',
    fromFlag: '🇬🇧',
    toFlag: '🇹🇭',
    quote: 'LeaveLab\'s Amazon FBA course helped me launch my business and now I make £8k/month from Thailand. I met my co-founder through the Discord community before I even landed. Best decision ever!',
    before: {
      job: '£45k office job',
      location: 'London',
      status: 'Stressed & unfulfilled'
    },
    after: {
      income: '£8k/month Amazon FBA',
      location: 'Chiang Mai',
      status: 'Living the dream'
    },
    helpedWith: [
      { icon: DollarSign, stage: 'Income', detail: 'Amazon FBA course & mentorship' },
      { icon: FileText, stage: 'Visa', detail: 'DTV application guide' },
      { icon: Home, stage: 'Housing', detail: 'Agent matched apartment' },
      { icon: Users, stage: 'Community', detail: 'Met 3 roommates pre-arrival' }
    ],
    date: 'Moved July 2024'
  },
  {
    name: 'Marcus T., 32',
    location: 'Manchester → Bangkok',
    fromFlag: '🇬🇧',
    toFlag: '🇹🇭',
    quote: 'LeaveLab\'s AI agency course helped me build a $15k/month business. The visa determination quiz matched me to the perfect DTV visa. Now I work from Bangkok beaches and love my life!',
    before: {
      job: '$120k corporate',
      location: 'Manchester',
      status: 'Burned out'
    },
    after: {
      income: '$15k/month AI agency',
      location: 'Bangkok',
      status: 'Freedom & fulfillment'
    },
    helpedWith: [
      { icon: DollarSign, stage: 'Income', detail: 'AI agency coaching' },
      { icon: FileText, stage: 'Visa', detail: 'ISA Compass DTV service' },
      { icon: Home, stage: 'Housing', detail: 'Found condo through network' },
      { icon: Users, stage: 'Community', detail: 'Weekly coworking meetups' }
    ],
    date: 'Moved September 2024'
  }
];

export default function SuccessStoriesNew() {
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-950 relative">
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
            Real Results
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Real People, <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Real Results</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join those who've already made the move to Thailand
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-brand-red/20 
                         hover:border-brand-red/50 hover:bg-brand-dark-900/80 transition-all duration-300 
                         card-3d"
            >
              {/* Journey Flags */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-3xl">{story.fromFlag}</div>
                <ArrowRight className="w-5 h-5 text-brand-red" />
                <div className="text-3xl">{story.toFlag}</div>
              </div>

              {/* Profile */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-red to-brand-accent 
                                flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto">
                  {story.name.split(' ')[0].charAt(0)}{story.name.split(' ')[1].charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{story.name}</h3>
                <p className="text-sm text-brand-red font-semibold">{story.location}</p>
                <p className="text-xs text-gray-500">{story.date}</p>
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-gray-300 leading-relaxed mb-4 italic text-center">
                "{story.quote}"
              </blockquote>

              {/* Before / After */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-brand-dark-950/50 rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-gray-500 uppercase mb-2 font-semibold">Before</p>
                  <p className="text-xs text-white mb-1">{story.before.job}</p>
                  <p className="text-xs text-gray-400">{story.before.location}</p>
                </div>
                <div className="bg-brand-red/10 rounded-lg p-3 border border-brand-red/30">
                  <p className="text-xs text-brand-red uppercase mb-2 font-semibold">After</p>
                  <p className="text-xs text-white mb-1">{story.after.income}</p>
                  <p className="text-xs text-gray-400">{story.after.location}</p>
                </div>
              </div>

              {/* How LeaveLab Helped */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  How LeaveLab Helped:
                </p>
                <div className="space-y-2">
                  {story.helpedWith.map((help, idx) => {
                    const Icon = help.icon;
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded bg-brand-red/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3 h-3 text-brand-red" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">{help.stage}</p>
                          <p className="text-xs text-gray-400">{help.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

