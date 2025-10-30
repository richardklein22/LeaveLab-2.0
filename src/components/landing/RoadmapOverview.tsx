'use client';

import { motion } from 'framer-motion';
import { roadmapPhases } from '@/lib/landing-data';

export default function RoadmapOverview() {
  return (
    <section id="roadmap" className="py-16 sm:py-20 bg-brand-dark-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-brand-red mb-4">
            Your 90-day roadmap
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            One path. Four clear milestones.
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Every stage unlocks the next so you never wonder what to do or who to contact.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-4">
          {roadmapPhases.map((phase, index) => (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl bg-brand-dark-900/60 border border-white/10 backdrop-blur-xl p-6 text-left flex flex-col gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
                <phase.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {phase.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {phase.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Briefcase, FileText, Home, Users } from 'lucide-react';

const steps = [
  {
    title: 'Income',
    description: 'Launch a dependable £2K+/month income stream before you fly.',
    icon: Briefcase
  },
  {
    title: 'Visa',
    description: 'Pick the right visa route with partners who submit flawless files.',
    icon: FileText
  },
  {
    title: 'Accommodation',
    description: 'Secure short and long stays with vetted hosts, agents, and volunteering.',
    icon: Home
  },
  {
    title: 'Community',
    description: 'Land with instant friends, events, and accountability built in.',
    icon: Users
  }
];

export default function RoadmapOverview() {
  return (
    <section id="roadmap" className="py-16 sm:py-20 bg-brand-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-red/10 via-transparent to-brand-accent/10 opacity-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-black text-white text-center mb-10"
        >
          Your 90-Day Roadmap
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
          {steps.map(({ title, description, icon: Icon }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-brand-dark-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-brand-red/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-red/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-red" />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


