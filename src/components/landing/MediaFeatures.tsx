'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ExternalLink, Award } from 'lucide-react';

interface MediaFeature {
  name: string;
  year?: string;
  description?: string;
  logo?: React.ReactNode;
}

const mediaFeatures: MediaFeature[] = [
  { 
    name: 'Daily Mail', 
    year: '2024',
    description: 'Featured story on digital nomad success',
    logo: <Newspaper className="w-8 h-8" />
  },
  { 
    name: 'The Mirror', 
    year: '2024',
    description: 'Profile on remote work revolution',
    logo: <Newspaper className="w-8 h-8" />
  },
  { 
    name: 'The Sun', 
    year: '2023',
    description: 'Thailand relocation guide feature',
    logo: <Newspaper className="w-8 h-8" />
  },
  { 
    name: 'Joe.co.uk', 
    year: '2024',
    description: 'Digital nomad lifestyle interview',
    logo: <Newspaper className="w-8 h-8" />
  },
  { 
    name: 'Forbes', 
    year: '2024',
    description: 'Remote business strategies',
    logo: <Newspaper className="w-8 h-8" />
  },
];

export default function MediaFeatures() {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Glass Container */}
          <div className="glass rounded-3xl p-8 md:p-10 hover:glass-red transition-all duration-500">
            {/* Header */}
            <div className="text-center mb-8">
              <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
                <Award className="w-3 h-3 mr-2 inline" />
                Media Recognition
              </Badge>
              <h3 className="text-2xl md:text-3xl font-black mb-2">
                As <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Featured In</span>
              </h3>
              <p className="text-sm text-gray-400">Trusted by major publications worldwide</p>
            </div>

            {/* Logo Grid - Desktop */}
            <div className="hidden md:grid grid-cols-5 gap-8 items-center">
              {mediaFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer"
                >
                  <div className="relative">
                    {/* Hover Card */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-10">
                      <div className="glass-red rounded-xl p-3 whitespace-nowrap">
                        <p className="text-xs font-semibold text-white">{feature.description}</p>
                        <p className="text-xs text-brand-red-200">{feature.year}</p>
                      </div>
                      {/* Arrow pointing down */}
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/10 absolute left-1/2 -translate-x-1/2 -bottom-1.5" />
                    </div>

                    {/* Logo Container */}
                    <div className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-110">
                      <div className="text-gray-400 group-hover:text-brand-red transition-colors">
                        {feature.logo}
                      </div>
                      <span className="text-sm font-bold text-gray-400 group-hover:text-brand-red transition-colors text-center">
                        {feature.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Logo Carousel - Mobile */}
            <div className="md:hidden">
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {mediaFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 snap-center"
                  >
                    <div className="glass rounded-xl p-4 hover:glass-red transition-all duration-300 min-w-[140px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-gray-400 hover:text-brand-red transition-colors">
                          {feature.logo}
                        </div>
                        <span className="text-sm font-bold text-gray-300 text-center">
                          {feature.name}
                        </span>
                        <span className="text-xs text-brand-red">
                          {feature.year}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">Swipe to see more →</p>
            </div>

            {/* Bottom Stats */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-black text-brand-red">5+</div>
                  <div className="text-xs text-gray-400">Major Publications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-brand-red">100k+</div>
                  <div className="text-xs text-gray-400">Article Readers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-brand-red">2024</div>
                  <div className="text-xs text-gray-400">Latest Feature</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

