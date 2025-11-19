'use client';

import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';

const publications = [
  { name: 'Daily Mail' },
  { name: 'The Mirror' },
  { name: 'The Sun' },
  { name: 'Joe.co.uk' }
];

export default function MediaFeatures() {
  return (
    <section className="py-12 sm:py-16 bg-brand-dark-900 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-6">
            As Featured In
          </p>
        </motion.div>

        {/* Publications Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {publications.map((pub, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer transition-all duration-300 hover:scale-110"
            >
              <div className="flex flex-col items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                <Newspaper className="w-8 h-8 text-gray-400 group-hover:text-brand-red transition-colors" />
                <span className="text-base font-bold text-gray-400 group-hover:text-brand-red transition-colors text-center">
                  {pub.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

