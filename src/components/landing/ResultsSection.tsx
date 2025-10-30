'use client';

import { motion } from 'framer-motion';
import { resultsStories } from '@/lib/landing-data';

export default function ResultsSection() {
  return (
    <section id="results" className="py-16 sm:py-20 bg-brand-dark-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-brand-red mb-3">
            Real results
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            The roadmap in action
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Two members, two different starting points, the same playbook.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {resultsStories.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl bg-brand-dark-900/60 border border-white/10 backdrop-blur-xl p-6 flex flex-col gap-4"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-red mb-2">
                  {story.role}
                </p>
                <h3 className="text-xl font-semibold text-white">
                  {story.name}
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {story.journey}
              </p>
              <div className="rounded-xl border border-brand-red/30 bg-brand-red/10 p-4 text-sm text-white/90 font-medium">
                {story.outcome}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


