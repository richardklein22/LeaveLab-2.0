'use client';

import React from 'react';
import { Shield, Lock, CreditCard, Award, CheckCircle, RefreshCw, Zap } from 'lucide-react';

interface TrustBadge {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
}

const trustBadges: TrustBadge[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    label: "Secure Payments",
    sublabel: "Stripe Verified"
  },
  {
    icon: <Lock className="w-5 h-5" />,
    label: "SSL Encrypted",
    sublabel: "Your data is safe"
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    label: "Money-Back",
    sublabel: "7-day guarantee"
  },
  {
    icon: <Award className="w-5 h-5" />,
    label: "Verified Expert",
    sublabel: "50+ successes"
  },
];

const paymentMethods = [
  { name: 'Visa', symbol: '💳' },
  { name: 'Mastercard', symbol: '💳' },
  { name: 'Stripe', symbol: '🔒' },
];

interface TrustBadgesProps {
  variant?: 'full' | 'compact' | 'minimal';
  showPaymentMethods?: boolean;
  className?: string;
}

export default function TrustBadges({ 
  variant = 'compact', 
  showPaymentMethods = true,
  className = '' 
}: TrustBadgesProps) {
  
  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 text-xs ${className}`}>
        <div className="flex items-center gap-2 text-gray-400">
          <Shield className="w-4 h-4 text-brand-red" />
          <span>Secure Payment</span>
        </div>
        <div className="w-px h-4 bg-gray-600" />
        <div className="flex items-center gap-2 text-gray-400">
          <RefreshCw className="w-4 h-4 text-brand-red" />
          <span>Money-Back Guarantee</span>
        </div>
        <div className="w-px h-4 bg-gray-600" />
        <div className="flex items-center gap-2 text-gray-400">
          <Lock className="w-4 h-4 text-brand-red" />
          <span>SSL Encrypted</span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Trust Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 glass rounded-full px-4 py-2 hover:glass-red transition-all duration-300 cursor-pointer group"
            >
              <div className="text-brand-red group-hover:scale-110 transition-transform">
                {badge.icon}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white group-hover:text-brand-red transition-colors">
                  {badge.label}
                </p>
                {badge.sublabel && (
                  <p className="text-gray-400 text-[10px]">{badge.sublabel}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        {showPaymentMethods && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-gray-500">Accepted:</span>
            <div className="flex items-center gap-2">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 glass rounded-lg px-2 py-1 hover:glass-red transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-lg">{method.symbol}</span>
                  <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors">
                    {method.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`glass rounded-2xl p-6 hover:glass-red transition-all duration-500 ${className}`}>
      <div className="text-center mb-6">
        <h4 className="text-lg font-bold text-white mb-2">Your Security Matters</h4>
        <p className="text-xs text-gray-400">Protected by industry-leading security standards</p>
      </div>

      {/* Trust Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {trustBadges.map((badge, index) => (
          <div
            key={index}
            className="glass rounded-xl p-4 hover:glass-red transition-all duration-300 cursor-pointer group text-center"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <div className="text-brand-red">
                {badge.icon}
              </div>
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-brand-red transition-colors">
              {badge.label}
            </p>
            {badge.sublabel && (
              <p className="text-xs text-gray-400 mt-1">{badge.sublabel}</p>
            )}
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      {showPaymentMethods && (
        <div className="border-t border-white/10 pt-4">
          <p className="text-xs text-center text-gray-500 mb-3">Secure Payment Methods</p>
          <div className="flex items-center justify-center gap-4">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-center gap-2 glass rounded-lg px-3 py-2 hover:glass-red transition-all duration-300 cursor-pointer group"
              >
                <span className="text-2xl">{method.symbol}</span>
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                  {method.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GDPR/PCI Compliance Note */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-gray-500">
          <Lock className="w-3 h-3 inline mr-1" />
          GDPR Compliant • PCI DSS Certified • 256-bit Encryption
        </p>
      </div>
    </div>
  );
}

