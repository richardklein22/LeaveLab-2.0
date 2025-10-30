'use client';

import { motion } from 'framer-motion';
import { Check, X, Calendar, FileCheck, Handshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const visaTypes = [
  {
    name: 'Tourist',
    duration: '30-60 days',
    cost: '£30-40',
    bestFor: 'Short visits',
    difficulty: 'Easy',
    renewable: false
  },
  {
    name: 'DTV',
    duration: '180 days',
    cost: '£320',
    bestFor: 'Digital nomads',
    difficulty: 'Medium',
    renewable: false,
    popular: true
  },
  {
    name: 'Non-B',
    duration: '90 days',
    cost: '£150-200',
    bestFor: 'Employed',
    difficulty: 'Medium',
    renewable: true
  },
  {
    name: 'Elite',
    duration: '5-20 years',
    cost: '£12k-48k',
    bestFor: 'Long-term',
    difficulty: 'Easy',
    renewable: false
  }
];

const visaServices = [
  {
    icon: Calendar,
    title: 'Short-term Visas',
    description: 'Tourist, exemption, visa on arrival options for 1-3 months'
  },
  {
    icon: FileCheck,
    title: 'Long-term Visas',
    description: 'DTV, Non-B, Elite, Education, Retirement, Marriage options'
  },
  {
    icon: Handshake,
    title: 'Setup Partners',
    description: 'ISA Compass (DTV) & ATA Thailand (Non-B) handle everything'
  }
];

export default function VisaStage() {
  return (
    <section id="visa" className="py-16 sm:py-20 bg-brand-dark-900 relative">
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
            <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                STAGE 2: <span className="text-brand-accent">VISA</span>
              </h2>
              <p className="text-lg text-gray-400 mt-1">
                94% approval rate with our complete guides
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Visa Comparison Table */}
      <div className="container mx-auto px-4 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Compare <span className="text-brand-accent">Visa Types</span>
          </h3>
          <p className="text-gray-400">
            Find your perfect visa at a glance
          </p>
        </motion.div>

        {/* Desktop: Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="hidden lg:block max-w-6xl mx-auto bg-brand-dark-900/60 backdrop-blur-xl rounded-2xl border border-brand-accent/20 overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-6 border-b border-white/10 bg-brand-dark-900/80">
            <div className="font-semibold text-gray-400 text-sm uppercase tracking-wider">Attribute</div>
            {visaTypes.map((visa) => (
              <div key={visa.name} className={`text-center ${visa.popular ? 'bg-brand-accent/10 rounded-lg p-2 border border-brand-accent/30' : ''}`}>
                <p className="font-bold text-white">{visa.name}</p>
                {visa.popular && <Badge className="mt-1 bg-brand-accent text-white text-xs border-0">Popular</Badge>}
              </div>
            ))}
          </div>

          {/* Duration Row */}
          <div className="grid grid-cols-5 gap-4 p-6 border-b border-white/10 hover:bg-white/5 transition-colors">
            <div className="font-medium text-white">Duration</div>
            {visaTypes.map((visa) => (
              <div key={visa.name} className="text-center text-gray-300 text-sm">{visa.duration}</div>
            ))}
          </div>

          {/* Cost Row */}
          <div className="grid grid-cols-5 gap-4 p-6 border-b border-white/10 hover:bg-white/5 transition-colors">
            <div className="font-medium text-white">Cost</div>
            {visaTypes.map((visa) => (
              <div key={visa.name} className="text-center text-gray-300 text-sm">{visa.cost}</div>
            ))}
          </div>

          {/* Best For Row */}
          <div className="grid grid-cols-5 gap-4 p-6 border-b border-white/10 hover:bg-white/5 transition-colors">
            <div className="font-medium text-white">Best For</div>
            {visaTypes.map((visa) => (
              <div key={visa.name} className="text-center text-gray-300 text-sm">{visa.bestFor}</div>
            ))}
          </div>

          {/* Difficulty Row */}
          <div className="grid grid-cols-5 gap-4 p-6 border-b border-white/10 hover:bg-white/5 transition-colors">
            <div className="font-medium text-white">Difficulty</div>
            {visaTypes.map((visa) => (
              <div key={visa.name} className="text-center">
                <span className={`text-sm font-semibold ${visa.difficulty === 'Easy' ? 'text-green-400' : visa.difficulty === 'Medium' ? 'text-yellow-400' : 'text-orange-400'}`}>
                  {visa.difficulty}
                </span>
              </div>
            ))}
          </div>

          {/* Renewable Row */}
          <div className="grid grid-cols-5 gap-4 p-6 hover:bg-white/5 transition-colors">
            <div className="font-medium text-white">Renewable</div>
            {visaTypes.map((visa) => (
              <div key={visa.name} className="flex justify-center">
                {visa.renewable ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <X className="w-5 h-5 text-gray-600" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile: Swipeable Cards */}
        <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
          <div className="flex gap-4 min-w-max">
            {visaTypes.map((visa, index) => (
              <motion.div
                key={visa.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-[280px] snap-start flex-shrink-0"
              >
                <div className={`bg-brand-dark-900/60 backdrop-blur-xl rounded-xl p-6 border h-full
                               ${visa.popular ? 'border-brand-accent/50 border-2' : 'border-brand-accent/20'}`}>
                  {visa.popular && (
                    <Badge className="mb-3 bg-brand-accent text-white text-xs border-0">Most Popular</Badge>
                  )}
                  <h4 className="text-xl font-bold text-white mb-4">{visa.name}</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Duration</p>
                      <p className="text-sm text-white font-semibold">{visa.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Cost</p>
                      <p className="text-sm text-white font-semibold">{visa.cost}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Best For</p>
                      <p className="text-sm text-white font-semibold">{visa.bestFor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Difficulty</p>
                      <p className={`text-sm font-semibold ${visa.difficulty === 'Easy' ? 'text-green-400' : visa.difficulty === 'Medium' ? 'text-yellow-400' : 'text-orange-400'}`}>
                        {visa.difficulty}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Renewable</p>
                      <div className="flex items-center gap-2">
                        {visa.renewable ? (
                          <><Check className="w-4 h-4 text-green-400" /><span className="text-sm text-white">Yes</span></>
                        ) : (
                          <><X className="w-4 h-4 text-gray-600" /><span className="text-sm text-gray-400">No</span></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator (mobile) */}
        <div className="lg:hidden text-center mt-6">
          <p className="text-xs text-gray-500">← Swipe to compare visa types →</p>
        </div>
      </div>

      {/* Visa Services - Simple Icons Row */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {visaServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 bg-brand-dark-900/40 backdrop-blur-xl rounded-xl p-4 border border-brand-accent/20"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 
                                flex items-center justify-center flex-shrink-0 border border-brand-accent/20">
                  <Icon className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{service.title}</h4>
                  <p className="text-xs text-gray-400">{service.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

