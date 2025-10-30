'use client';
import { Globe, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  return (
    <nav className="border-b border-white/10 bg-brand-dark-900/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-red blur-xl opacity-50 animate-pulse-scale" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red via-brand-red-600 to-brand-red-800 flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500">
                <Globe className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-brand-red-200 to-white bg-clip-text text-transparent">
                LeaveLab
              </span>
              <span className="text-[10px] text-brand-red-400 tracking-wider uppercase">Digital Freedom</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#roadmap" className="text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group">
              Roadmap
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
            </a>
            <a href="#income" className="text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group">
              Income
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
            </a>
            <a href="#visa" className="text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group">
              Visa
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
            </a>
            <a href="#community" className="text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group">
              Community
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
            </a>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a href="/signup">
              <Button 
                size="sm" 
                className="bg-brand-red hover:bg-brand-red-600 tap-target magnetic-button relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <Rocket className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-red-600 to-brand-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

