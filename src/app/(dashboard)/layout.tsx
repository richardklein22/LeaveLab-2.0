import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe, Home, Book, Plane, MapPin, User, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | LeaveLab',
  description: 'Your LeaveLab dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-dark-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-brand-dark-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-red blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red via-brand-red-600 to-brand-red-800 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-white via-brand-red-200 to-white bg-clip-text text-transparent">
                  LeaveLab
                </span>
                <span className="text-[9px] text-brand-red-400 tracking-wider uppercase">Digital Freedom</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group"
              >
                <Home className="w-4 h-4" />
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </Link>
              <Link 
                href="/courses" 
                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group"
              >
                <Book className="w-4 h-4" />
                Courses
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </Link>
              <Link 
                href="/visa-info" 
                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group"
              >
                <Plane className="w-4 h-4" />
                Visa Info
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </Link>
              <Link 
                href="/accommodation" 
                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group"
              >
                <MapPin className="w-4 h-4" />
                Accommodation
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Link href="/subscription">
                <button className="glass px-4 py-2 rounded-xl text-sm font-medium text-white hover:glass-red transition-all">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Subscription
                </button>
              </Link>
              <Link href="/profile">
                <button className="glass px-4 py-2 rounded-xl text-sm font-medium text-white hover:glass-red transition-all">
                  <User className="w-4 h-4 inline mr-2" />
                  Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {children}
    </div>
  );
}

