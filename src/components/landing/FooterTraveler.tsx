'use client';

import { Globe, Mail, MessageCircle } from 'lucide-react';

export default function FooterTraveler() {
  return (
    <footer className="bg-gradient-to-br from-gray-100 to-blue-50 border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-gray-800 bg-clip-text text-transparent">
                  LeaveLab
                </span>
                <p className="text-[10px] text-blue-600 tracking-wider uppercase">Travel Thailand</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Your trusted partner for unforgettable Thailand adventures
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#stages" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Travel Guide</a></li>
              <li><a href="#partners" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Partners</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Pricing</a></li>
              <li><a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">FAQ</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#visa" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Visa Guide</a></li>
              <li><a href="#accommodation" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Accommodation</a></li>
              <li><a href="#community" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Community</a></li>
              <li><a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Success Stories</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600 text-sm">
                <Mail className="w-4 h-4 text-blue-600" />
                <a href="mailto:support@leavelab.com" className="hover:text-blue-600 transition-colors">support@leavelab.com</a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 text-sm">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span>24/7 Community Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2024 LeaveLab. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#cookies" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

