'use client';

import { motion } from 'framer-motion';
import { Plane, Building2, Shield, Users, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const benefits = [
  {
    icon: Plane,
    partner: 'Skyscanner',
    title: 'Discounted Flight Deals',
    description: 'Access exclusive rates and price alerts for flights to Thailand. Compare 1000+ airlines and find the best deals for your journey.',
    color: 'from-blue-500 to-blue-600',
    features: ['Exclusive member rates', 'Price alerts', 'Compare 1000+ airlines']
  },
  {
    icon: Building2,
    partner: 'Hostel World',
    title: 'Hostel Booking Discounts',
    description: 'Save up to 15% on verified hostels and guesthouses across Thailand with our exclusive partnership.',
    color: 'from-cyan-500 to-cyan-600',
    features: ['Up to 15% savings', 'Verified properties', 'Instant confirmation']
  },
  {
    icon: Shield,
    partner: 'Genki',
    title: 'Travel Insurance Deals',
    description: 'Comprehensive travel insurance coverage with special member rates and expert recommendations for peace of mind.',
    color: 'from-indigo-500 to-indigo-600',
    features: ['Member discounts', 'Worldwide coverage', 'Easy claims process']
  },
  {
    icon: Users,
    partner: 'Worldpacker',
    title: 'Volunteering Opportunities',
    description: 'Discounted membership to connect with local volunteering programs and work exchanges throughout Thailand.',
    color: 'from-purple-500 to-purple-600',
    features: ['Discounted membership', 'Verified hosts', '140+ countries']
  }
];

export default function PartnerBenefits() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-200 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-200 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <Badge className="mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-xs sm:text-sm">
            Member Perks
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Travel <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Partner Benefits</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Save money through our carefully selected travel partners
          </p>
        </motion.div>

        {/* Alternating Layout */}
        <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 md:space-y-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 sm:gap-8 md:gap-12 items-center`}
              >
                {/* Icon Side */}
                <div className="w-full lg:w-1/3 flex justify-center">
                  <div className={`relative group w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`} />
                    <div className={`relative w-full h-full rounded-3xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-2/3 text-center lg:text-left">
                  <Badge className="mb-2 sm:mb-3 bg-blue-100 text-blue-700 border-blue-200 text-xs sm:text-sm">
                    {benefit.partner}
                  </Badge>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-2 sm:space-y-3">
                    {benefit.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                        <span className="text-sm sm:text-base text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 md:mt-20"
        >
          <button 
            onClick={() => window.location.href = '/signup'}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 
                     text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg shadow-lg
                     hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            Access All Partner Benefits
          </button>
        </motion.div>
      </div>
    </section>
  );
}

