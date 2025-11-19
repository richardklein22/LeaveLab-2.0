'use client';

import { motion } from 'framer-motion';
import { Target, FileText, DollarSign, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const painPoints = [
  {
    icon: Target,
    question: 'Stuck in 9-5?',
    solution: '→ Business coaching gets you income-independent'
  },
  {
    icon: FileText,
    question: 'Visa Confusion?',
    solution: '→ We handle visa setup A-Z with trusted agents'
  },
  {
    icon: DollarSign,
    question: 'Income Stability?',
    solution: '→ 4 proven business models + ongoing support'
  },
  {
    icon: MapPin,
    question: 'Where to Start?',
    solution: '→ Step-by-step roadmap from planning to landing'
  }
];

export default function PainPoints() {
  return (
    <section className="py-16 sm:py-20 relative bg-brand-dark-950">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
              Common Concerns Answered
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black mb-4 text-white"
          >
            We&apos;ve Got <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">You Covered</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-4 hover:bg-brand-dark-900/80 transition-all duration-300 group border border-brand-red/20 hover:border-brand-red/50"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5 text-brand-red" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{point.question}</h3>
                <p className="text-brand-red font-semibold text-sm">{point.solution}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

