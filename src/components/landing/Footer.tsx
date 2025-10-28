'use client';

import { Instagram, Youtube, MessageCircle } from 'lucide-react';
import { footerNavigation } from '@/lib/landing-data';

export default function Footer() {
  return (
    <footer className="bg-brand-dark-900 border-t border-white/10 backdrop-blur-xl py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Column 1: About - Full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">
              LeaveLab
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-3 sm:mb-4">
              The all-in-one digital nomad platform for Thailand relocation
            </p>
            
            {/* Social icons */}
            <div className="flex gap-4">
              <a 
                href="#" 
                className="hover:text-brand-red transition-colors text-gray-400"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="hover:text-brand-red transition-colors text-gray-400"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="hover:text-brand-red transition-colors text-gray-400"
                aria-label="Discord"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {footerNavigation.platform.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-brand-red transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {footerNavigation.resources.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-brand-red transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Contact - Full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {footerNavigation.contact.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-brand-red transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 
                       flex flex-col items-center gap-4 text-xs sm:text-sm 
                       md:flex-row md:justify-between">
          <p className="text-center md:text-left text-gray-400">
            © 2024 LeaveLab. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="text-gray-400 hover:text-brand-red transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-red transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
