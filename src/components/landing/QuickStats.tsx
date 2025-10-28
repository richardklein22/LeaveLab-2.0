'use client';

import React from 'react';
import { TrendingUp, Users, Globe, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
  color?: string;
}

const stats: Stat[] = [
  {
    value: '50',
    suffix: '+',
    label: 'Members Relocated',
    icon: <Users className="w-5 h-5" />,
    color: 'from-brand-red to-brand-red-600'
  },
  {
    value: '12',
    suffix: '+',
    label: 'Countries Covered',
    icon: <Globe className="w-5 h-5" />,
    color: 'from-brand-accent to-brand-accent-pink'
  },
  {
    value: '95',
    suffix: '%',
    label: 'Success Rate',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'from-green-500 to-green-600'
  },
  {
    value: '4.9',
    suffix: '★',
    label: 'Member Rating',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'from-yellow-500 to-yellow-600'
  },
];

interface QuickStatsProps {
  variant?: 'inline' | 'grid' | 'hero';
  className?: string;
}

export default function QuickStats({ variant = 'inline', className = '' }: QuickStatsProps) {
  
  if (variant === 'hero') {
    return (
      <div className={`${className}`}>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          {stats.slice(0, 3).map((stat, index) => (
            <React.Fragment key={index}>
              {index > 0 && <div className="w-px h-8 bg-gray-600 hidden md:block" />}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} blur-lg opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative w-10 h-10 rounded-full glass flex items-center justify-center group-hover:glass-red transition-all">
                    <div className="text-brand-red group-hover:text-white transition-colors">
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white group-hover:text-brand-red transition-colors">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-lg font-bold text-brand-red">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    {stat.label}
                  </p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
                Proven Track Record
              </Badge>
              <h3 className="text-2xl md:text-3xl font-black mb-2">
                Numbers That <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Speak</span>
              </h3>
            </div>

            <div className="glass rounded-3xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center group cursor-pointer card-3d"
                  >
                    <div className="relative inline-block mb-4">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} blur-2xl opacity-30 group-hover:opacity-60 transition-opacity animate-pulse-scale`} />
                      <div className="relative">
                        <div className="text-5xl md:text-6xl font-black bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent group-hover:from-brand-red group-hover:to-brand-red-400 transition-all duration-300">
                          {stat.value}
                          {stat.suffix && (
                            <span className="text-4xl md:text-5xl text-brand-red">
                              {stat.suffix}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white group-hover:text-brand-red transition-colors">
                        {stat.label}
                      </p>
                      <div className="w-8 h-0.5 bg-brand-red/30 mx-auto group-hover:w-full transition-all duration-300" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievement Bar */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-red" />
                  <p className="text-xs text-gray-400">
                    Growing by <span className="text-brand-red font-semibold">20%</span> month-over-month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Inline variant (default)
  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 md:gap-8 ${className}`}>
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          {index > 0 && <div className="hidden md:block w-px h-12 bg-gray-700" />}
          <div className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
            <div className={`text-3xl md:text-4xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors max-w-[80px]">
              {stat.label}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

