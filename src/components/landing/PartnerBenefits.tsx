'use client';

import { motion } from 'framer-motion';
import { Plane, Building2, Shield, Users, Ticket, MapPin, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const benefits = [
  {
    icon: Plane,
    partner: 'Skyscanner',
    title: 'Discounted Flight Deals',
    description: 'Access exclusive rates and price alerts for flights to Thailand',
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Building2,
    partner: 'Hostel World',
    title: 'Hostel Booking Discounts',
    description: 'Save up to 15% on verified hostels and guesthouses across Thailand',
    color: 'from-cyan-500 to-cyan-600',
    borderColor: 'border-cyan-300',
    bgColor: 'bg-cyan-50'
  },
  {
    icon: Shield,
    partner: 'Genki',
    title: 'Travel Insurance Deals',
    description: 'Comprehensive coverage with special member rates and recommendations',
    color: 'from-indigo-500 to-indigo-600',
    borderColor: 'border-indigo-300',
    bgColor: 'bg-indigo-50'
  },
  {
    icon: Users,
    partner: 'Worldpacker',
    title: 'Volunteering Opportunities',
    description: 'Discounted membership to connect with local volunteering programs',
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-300',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Ticket,
    partner: 'Local Partners',
    title: 'Activity Discounts',
    description: 'Exclusive deals on tours, experiences, and attractions',
    color: 'from-pink-500 to-pink-600',
    borderColor: 'border-pink-300',
    bgColor: 'bg-pink-50'
  },
  {
    icon: MapPin,
    partner: 'Verified Guides',
    title: 'Local Recommendations',
    description: 'Insider tips from founders and expats living in Thailand',
    color: 'from-amber-500 to-amber-600',
    borderColor: 'border-amber-300',
    bgColor: 'bg-amber-50'
  }
];

export default function PartnerBenefits() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            <Gift className="w-3 h-3 mr-1.5 inline" />
            Exclusive Member Perks
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Premium <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Partner Benefits</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Save money and get expert support through our carefully selected travel partners
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${benefit.bgColor} rounded-xl p-6 border-2 ${benefit.borderColor} 
                           hover:shadow-xl transition-all duration-300 group cursor-pointer`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} 
                                flex items-center justify-center mb-4 shadow-lg
                                group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                
                {/* Partner Badge */}
                <Badge className="mb-2 bg-white/80 text-gray-700 border-gray-200 text-xs">
                  {benefit.partner}
                </Badge>

                {/* Content */}
                <h4 className="text-base font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
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
          className="text-center mt-12"
        >
          <button 
            onClick={() => window.location.href = '/signup'}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 
                     text-white font-semibold px-8 py-3 rounded-lg shadow-lg
                     hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Unlock All Benefits
          </button>
        </motion.div>
      </div>
    </section>
  );
}

