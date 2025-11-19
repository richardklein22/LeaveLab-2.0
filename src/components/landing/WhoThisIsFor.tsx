'use client';

import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Globe, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const personas = [
  {
    icon: Briefcase,
    title: 'Stuck in 9-5',
    description: 'Ready to build your first online business.',
    badge: 'Perfect for beginners'
  },
  {
    icon: TrendingUp,
    title: 'Remote Worker',
    description: 'Optimize your location and visa situation.',
    badge: 'Level up your setup'
  },
  {
    icon: Globe,
    title: 'Aspiring Nomad',
    description: 'Need guidance on visas and business setup.',
    badge: 'Complete support'
  }
];

export default function WhoThisIsFor() {
  return (
    <section className="py-16 sm:py-20 relative bg-brand-dark-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
              Perfect For You If
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black mb-4 text-white"
          >
            You&apos;re Ready to <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Break Free</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl p-6 card-3d hover:bg-brand-dark-900/80 transition-all duration-300 group cursor-pointer border border-brand-red/20 hover:border-brand-red/50"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-brand-red" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors text-white">
                  {persona.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {persona.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-brand-red font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  <span>{persona.badge}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

