'use client';

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, MapPin, Award, Play, TrendingUp } from 'lucide-react';

export default function FounderBio() {
  return (
    <section className="py-16 relative bg-brand-dark-900/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Badge */}
          <div className="text-center mb-8">
            <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
              Built by Real Digital Nomads
            </Badge>
          </div>

          {/* Main Content Container */}
          <div className="glass rounded-3xl p-8 md:p-12 hover:glass-red transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Founder Image and Quick Stats */}
              <div className="space-y-6">
                {/* Founder Image with Overlay */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-brand-red/5 rounded-2xl blur-xl group-hover:from-brand-red/30 group-hover:to-brand-red/10 transition-all duration-500" />
                  <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 hover:border-brand-red/50 transition-all duration-300">
                    {/* Placeholder image - replace with actual founder image */}
                    <div className="aspect-[4/5] bg-gradient-to-br from-brand-dark-800 to-brand-dark-900 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center">
                          <Users className="w-16 h-16 text-brand-red" />
                        </div>
                        <p className="text-gray-400 text-sm">Founder Image</p>
                        <p className="text-xs text-gray-500 mt-2">Replace with actual photo</p>
                      </div>
                    </div>
                    
                    {/* Video Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-16 h-16 rounded-full bg-brand-red/90 backdrop-blur-sm flex items-center justify-center hover:bg-brand-red transition-colors group/play">
                        <Play className="w-6 h-6 text-white ml-1 group-hover/play:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Achievement Badges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-3 text-center hover:glass-red transition-all duration-300 cursor-pointer group">
                    <div className="text-2xl font-black text-brand-red mb-1 group-hover:scale-110 transition-transform">50k+</div>
                    <div className="text-xs text-gray-400 group-hover:text-white transition-colors">Followers</div>
                  </div>
                  <div className="glass rounded-xl p-3 text-center hover:glass-red transition-all duration-300 cursor-pointer group">
                    <div className="text-2xl font-black text-brand-red mb-1 group-hover:scale-110 transition-transform">50+</div>
                    <div className="text-xs text-gray-400 group-hover:text-white transition-colors">Relocations</div>
                  </div>
                </div>
              </div>

              {/* Founder Story Content */}
              <div className="space-y-6">
                {/* Name and Title */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-black mb-2">
                    Meet <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Richard Klein</span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-red" />
                      <span>UK → Thailand</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-500" />
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-brand-red" />
                      <span>Digital Nomad Expert</span>
                    </div>
                  </div>
                </div>

                {/* Bio Text */}
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    <span className="font-semibold text-white">From corporate burnout to digital freedom.</span> After years trapped in the London grind, I made the leap to Thailand and built multiple successful online businesses whilst exploring Southeast Asia.
                  </p>
                  <p>
                    Featured in <span className="text-brand-red font-semibold">Daily Mail, The Mirror, The Sun</span>, and <span className="text-brand-red font-semibold">Joe.co.uk</span>, I&apos;ve helped <span className="text-white font-semibold">over 50 professionals</span> successfully relocate and build location-independent income streams.
                  </p>
                  <p className="font-semibold text-white">
                    &quot;I built LeaveLab to solve the exact challenges I faced – from visa confusion to income stability – giving you the blueprint I wish I&apos;d had.&quot;
                  </p>
                </div>

                {/* Credibility Points */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full glass flex items-center justify-center flex-shrink-0 group-hover:glass-red transition-all mt-0.5">
                      <CheckCircle className="w-4 h-4 text-brand-red" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-brand-red transition-colors">
                        50,000+ social media followers
                      </p>
                      <p className="text-xs text-gray-400">Building the nomad community daily</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full glass flex items-center justify-center flex-shrink-0 group-hover:glass-red transition-all mt-0.5">
                      <TrendingUp className="w-4 h-4 text-brand-red" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-brand-red transition-colors">
                        Leading credibility in relocation space
                      </p>
                      <p className="text-xs text-gray-400">Recognised expert in digital nomad visas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full glass flex items-center justify-center flex-shrink-0 group-hover:glass-red transition-all mt-0.5">
                      <Users className="w-4 h-4 text-brand-red" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-brand-red transition-colors">
                        Real-world experience, real results
                      </p>
                      <p className="text-xs text-gray-400">Living the lifestyle, not just teaching it</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <Button 
                    size="lg"
                    className="bg-brand-red hover:bg-brand-red-600 text-white magnetic-button group"
                  >
                    <span className="flex items-center gap-2">
                      Learn My Exact Methods
                      <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

