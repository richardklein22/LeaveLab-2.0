'use client';

import { motion } from 'framer-motion';
import { partnershipDetails } from '@/lib/landing-data';

export default function PartnershipDetails() {
  return (
    <section id="partners" className="py-16 sm:py-20 bg-brand-dark-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-brand-red mb-3">
            Official partners
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Built with teams who do this every day
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Each partner covers a critical hand-off so the roadmap keeps moving.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {partnershipDetails.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl bg-brand-dark-900/60 border border-white/10 backdrop-blur-xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center">
                  <partner.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {partner.description}
              </p>
              <p className="text-sm text-brand-red/80 font-medium">
                {partner.support}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


