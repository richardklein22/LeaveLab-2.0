import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authentication | LeaveLab',
  description: 'Sign in to your LeaveLab account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-dark-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(239, 68, 68, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-red blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red via-brand-red-600 to-brand-red-800 flex items-center justify-center">
              <Globe className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-brand-red-200 to-white bg-clip-text text-transparent">
              LeaveLab
            </span>
            <span className="text-[10px] text-brand-red-400 tracking-wider uppercase">Digital Freedom</span>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16 sm:py-20">
        <div className="w-full max-w-md animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  );
}
