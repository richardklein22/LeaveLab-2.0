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
      className={`relative rounded-xl md:rounded-2xl p-6 md:p-8 flex flex-col card-3d backdrop-blur-xl
                  ${featured 
                    ? 'bg-brand-dark-900/60 border-2 border-brand-red/50 shadow-xl shadow-brand-red/20 hover:bg-brand-dark-900/80' 
                    : 'bg-brand-dark-900/40 border-2 border-white/10 shadow-md hover:bg-brand-dark-900/60'}`}
    >
      {/* "Most Popular" badge */}
      {featured && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 
                       bg-gradient-to-r from-brand-red to-brand-red-700 
                       text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full 
                       shadow-lg animate-pulse-scale">
          ⭐ Most Popular
        </div>
      )}
      
      {/* Tier name */}
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 uppercase tracking-wide">
        {tier}
      </h3>
      
      {/* Price */}
      <div className="mb-4 sm:mb-6">
        <span className="text-4xl sm:text-5xl font-bold text-white">{price}</span>
        <span className="text-gray-400 text-base sm:text-lg ml-2">{period}</span>
      </div>
      
      {/* Features list */}
      <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2.5 sm:gap-3">
            <Check className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 
                              ${featured ? 'text-brand-red' : 'text-gray-500'}`} />
            <span className="text-gray-300 text-sm sm:text-base leading-snug">{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* Value callout */}
      {valueCallout && (
        <div className="bg-brand-red/10 text-brand-red text-xs sm:text-sm font-medium 
                       px-3 sm:px-4 py-2 rounded-lg mb-3 sm:mb-4 text-center
                       border border-brand-red/20">
          🎯 {valueCallout}
        </div>
      )}
      
      {/* CTA Button */}
      <button
        onClick={() => window.location.href = ctaLink}
        className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg 
                   transition-all duration-200 magnetic-button relative group overflow-hidden
                   ${featured 
                     ? 'bg-brand-red hover:bg-brand-red-600 text-white shadow-lg shadow-brand-red/30' 
                     : 'border-2 border-white/20 hover:border-brand-red text-gray-300 hover:text-brand-red hover:bg-brand-red/10'}`}
      >
        <span className="relative z-10">{cta}</span>
        {featured && (
          <div className="absolute inset-0 bg-gradient-to-r from-brand-red-600 to-brand-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
      
      {/* Guarantee badge (premium only) */}
      {featured && (
        <p className="text-xs sm:text-sm text-gray-400 text-center mt-3 sm:mt-4">
          30-day money-back guarantee
        </p>
      )}
    </motion.div>
  );
}

export default function PricingSection() {
  return (
    <section className="py-16 sm:py-20 bg-brand-dark-900 relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 via-transparent to-brand-red/5 opacity-30" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-white mb-3 sm:mb-4"
        >
          Start Free. Upgrade When You&apos;re <span className="text-brand-red">Ready</span>.
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-base sm:text-xl text-gray-400 text-center mb-8 sm:mb-12"
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
