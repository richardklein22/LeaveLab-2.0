'use client';

import { motion } from 'framer-motion';
import { Newspaper, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const publications = [
  { name: 'Daily Mail' },
  { name: 'The Mirror' },
  { name: 'The Sun' },
  { name: 'Joe.co.uk' }
];

const stats = [
  { number: '1,247', label: 'Digital Nomads' },
  { number: '50+', label: 'Successful Relocations' },
  { number: '20+', label: 'Hours of Content' },
  { number: '2', label: 'Global Partnerships' }
];

export default function SocialProof() {
  return (
    <section className="py-20 sm:py-32 relative bg-brand-dark-950">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              Trusted & Featured
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white"
          >
            Join <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">1,247+</span> Successful Nomads
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Featured in major publications and trusted by global partners
          </motion.p>
        </div>

        {/* Featured In */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-brand-dark-900/60 backdrop-blur-xl rounded-3xl p-8 mb-12 max-w-5xl mx-auto border border-brand-red/10"
        >
          <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">
            As Featured In
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center">
            {publications.map((pub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer transition-all duration-300 hover:scale-110"
              >
                <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                  <Newspaper className="w-6 h-6 text-gray-400 group-hover:text-brand-red transition-colors" />
                  <span className="text-xl font-bold text-gray-400 group-hover:text-brand-red transition-colors">
                    {pub.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-brand-dark-900/60 backdrop-blur-xl rounded-3xl p-8 max-w-5xl mx-auto border border-brand-accent/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group cursor-pointer"
              >
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-brand-red to-brand-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-gray-400 group-hover:text-brand-red transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

