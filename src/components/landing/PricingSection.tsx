'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { freePlan, premiumPlan } from '@/lib/landing-data';

interface PricingCardProps {
  tier: 'free' | 'premium';
  price: string;
  period: string;
  features: string[];
  cta: string;
  ctaLink: string;
  featured?: boolean;
  valueCallout?: string;
}

function PricingCard({
  tier,
  price,
  period,
  features,
  cta,
  ctaLink,
  featured = false,
  valueCallout
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: featured ? -12 : -8 }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative rounded-xl md:rounded-2xl p-6 md:p-8 flex flex-col 
                  ${featured 
                    ? 'bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-400 shadow-xl' 
                    : 'bg-white border-2 border-gray-200 shadow-md'}`}
    >
      {/* "Most Popular" badge */}
      {featured && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 
                       bg-gradient-to-r from-green-500 to-green-600 
                       text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full 
                       shadow-lg">
          ⭐ Most Popular
        </div>
      )}
      
      {/* Tier name */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
        {tier}
      </h3>
      
      {/* Price */}
      <div className="mb-4 sm:mb-6">
        <span className="text-4xl sm:text-5xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-600 text-base sm:text-lg ml-2">{period}</span>
      </div>
      
      {/* Features list */}
      <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2.5 sm:gap-3">
            <Check className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 
                              ${featured ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-700 text-sm sm:text-base leading-snug">{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* Value callout */}
      {valueCallout && (
        <div className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium 
                       px-3 sm:px-4 py-2 rounded-lg mb-3 sm:mb-4 text-center">
          🎯 {valueCallout}
        </div>
      )}
      
      {/* CTA Button */}
      <button
        onClick={() => window.location.href = ctaLink}
        className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg 
                   transition-all duration-200 
                   ${featured 
                     ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-lg hover:shadow-xl' 
                     : 'border-2 border-gray-300 hover:border-green-500 active:border-green-500 text-gray-700 hover:text-green-600 hover:bg-green-50'}`}
      >
        {cta}
      </button>
      
      {/* Guarantee badge (premium only) */}
      {featured && (
        <p className="text-xs sm:text-sm text-gray-600 text-center mt-3 sm:mt-4">
          30-day money-back guarantee
        </p>
      )}
    </motion.div>
  );
}

export default function PricingSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-3 sm:mb-4"
        >
          Start Free. Upgrade When You&apos;re Ready.
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-base sm:text-xl text-gray-600 text-center mb-8 sm:mb-12"
        >
          No credit card required. Cancel anytime. Keep free access forever.
        </motion.p>
        
        {/* Pricing cards */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          <PricingCard tier="free" {...freePlan} />
          <PricingCard tier="premium" {...premiumPlan} featured />
        </div>
      </div>
    </section>
  );
}

