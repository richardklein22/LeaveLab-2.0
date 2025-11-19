'use client';

import Link from 'next/link';
import { Globe, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTravelerType } from '@/contexts/TravelerTypeContext';
import TravelerTypeSwitcher from './TravelerTypeSwitcher';

export default function Navigation() {
  const { travelerType } = useTravelerType();
  const isDark = travelerType === 'nomad';

  return (
    <nav className={`border-b ${isDark ? 'border-white/10 bg-brand-dark-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-xl sticky top-0 z-50`}>
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`absolute inset-0 ${isDark ? 'bg-brand-red' : 'bg-blue-500'} blur-xl opacity-50 animate-pulse-scale`} />
              <div className={`relative w-12 h-12 rounded-xl ${isDark ? 'bg-gradient-to-br from-brand-red via-brand-red-600 to-brand-red-800' : 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600'} flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500`}>
                <Globe className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-bold ${isDark ? 'bg-gradient-to-r from-white via-brand-red-200 to-white bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-800 via-blue-600 to-gray-800 bg-clip-text text-transparent'}`}>
                LeaveLab
              </span>
              <span className={`text-[10px] ${isDark ? 'text-brand-red-400' : 'text-blue-600'} tracking-wider uppercase`}>
                {isDark ? 'Digital Freedom' : 'Travel Thailand'}
              </span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#stages" className={`text-sm font-medium ${isDark ? 'text-gray-300 hover:text-brand-red' : 'text-gray-700 hover:text-blue-600'} transition-colors relative group`}>
              Roadmap
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? 'bg-brand-red' : 'bg-blue-600'} transition-all group-hover:w-full`} />
            </a>
            <a href="#testimonials" className={`text-sm font-medium ${isDark ? 'text-gray-300 hover:text-brand-red' : 'text-gray-700 hover:text-blue-600'} transition-colors relative group`}>
              Success Stories
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? 'bg-brand-red' : 'bg-blue-600'} transition-all group-hover:w-full`} />
            </a>
            <a href="#pricing" className={`text-sm font-medium ${isDark ? 'text-gray-300 hover:text-brand-red' : 'text-gray-700 hover:text-blue-600'} transition-colors relative group`}>
              Pricing
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? 'bg-brand-red' : 'bg-blue-600'} transition-all group-hover:w-full`} />
            </a>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden sm:block">
              <Button variant="ghost" size="sm" className={`${isDark ? 'text-white hover:text-brand-red hover:bg-white/5' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'}`}>
                Contact Us
              </Button>
            </a>
            <a href="/signup">
              <Button 
                size="sm" 
                className={`${isDark ? 'bg-brand-red hover:bg-brand-red-600' : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'} tap-target magnetic-button relative group overflow-hidden`}
              >
                <span className="relative z-10 flex items-center gap-2 text-white">
                  Get Started
                  <Rocket className="w-4 h-4" />
                </span>
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-brand-red-600 to-brand-red-800' : 'bg-gradient-to-r from-blue-600 to-cyan-700'} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* Type Switcher Below Nav */}
      <TravelerTypeSwitcher />
    </nav>
  );
}

