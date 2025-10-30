'use client';

import { motion } from 'framer-motion';
import { pressFeatures } from '@/lib/landing-data';

export default function PressSection() {
  return (
    <section id="press" className="py-14 sm:py-16 bg-brand-dark-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-brand-red mb-3">
            Featured in
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Stories told across the press
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pressFeatures.map((title, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-xl border border-white/10 bg-brand-dark-900/60 backdrop-blur-xl py-4 px-3 text-center"
            >
              <span className="text-sm font-semibold text-gray-300">
                {title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


