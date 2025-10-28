import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'LeaveLab - Live & Work in Thailand | Online Business + Visa Support',
  description: 'Featured in Daily Mail. Partner with Skyscanner & Worldpackers. Launch your online business, get visa support, and relocate to Thailand. Real success stories from UK & USA clients.',
  keywords: ['digital nomad Thailand', 'online business coaching', 'Thailand visa support', 'work from Thailand', 'remote business', 'Amazon FBA Thailand', 'digital nomad courses', 'relocate to Thailand'],
};
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Plane,
  MapPin,
  Home,
  CheckCircle,
  Sparkles,
  Globe,
  Users,
  TrendingUp,
  ArrowRight,
  Zap,
  Target,
  Shield,
  Award,
  Rocket,
  Briefcase,
  FileText,
  Handshake,
  Bot,
  DollarSign,
  Camera,
  Newspaper,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-dark-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-brand-dark-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </Link>
              <Link href="#courses" className="text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group">
                Courses
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </Link>
              <a href="#contact" className="text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="#contact">
                <Button variant="ghost" size="sm" className="text-white hover:text-brand-red hover:bg-white/5">
                  Contact Us
                </Button>
              </a>
              <a href="#cta">
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

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-brand-accent-pink/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
          
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
        
        <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8 animate-float">
              <Badge className="glass-red text-brand-red-200 border-brand-red/30 px-6 py-2 text-sm hover:bg-brand-red/20 transition-colors">
                <Award className="w-4 h-4 mr-2 inline animate-pulse" />
                Featured in Daily Mail ÔÇó 2 Global Partnerships
              </Badge>
            </div>
            
            {/* Main Headline - BOLD & EXPERIMENTAL */}
            <h1 className="text-center mb-8">
              <div className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4">
                <span className="inline-block hover:scale-110 transition-transform duration-300">Break</span>{' '}
                <span className="inline-block hover:scale-110 transition-transform duration-300">Free</span>
              </div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-black">
                <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent animate-gradient">
                  Live Anywhere
                </span>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-400 mt-4">
                Work <span className="text-white">Everywhere</span>
              </div>
        </h1>
            
            {/* Mobile-Optimized CTA */}
            <div className="flex flex-col items-center gap-6 mb-16">
              <Link href="#cta">
                <Button 
                  size="lg" 
                  className="bg-brand-red hover:bg-brand-red-600 text-xl px-12 py-8 tap-target magnetic-button relative group overflow-hidden text-white shadow-2xl shadow-brand-red/50"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Start Your Free Trial Now
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-red-600 to-brand-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 animate-glow" />
                </Button>
              </Link>
            </div>

            {/* Trust Indicators with Icons */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center group-hover:glass-red transition-all">
                  <CheckCircle className="h-5 w-5 text-brand-red" />
                </div>
                <span className="group-hover:text-white transition-colors">7-day free trial</span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center group-hover:glass-red transition-all">
                  <Shield className="h-5 w-5 text-brand-red" />
                </div>
                <span className="group-hover:text-white transition-colors">Secure payment</span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center group-hover:glass-red transition-all">
                  <Zap className="h-5 w-5 text-brand-red" />
                </div>
                <span className="group-hover:text-white transition-colors">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-10 left-10 glass p-4 rounded-2xl animate-float hidden lg:block">
          <div className="text-3xl font-bold text-brand-red">50+</div>
          <div className="text-xs text-gray-400">Relocations</div>
        </div>
        <div className="absolute top-1/3 right-10 glass p-4 rounded-2xl animate-float animation-delay-2000 hidden lg:block">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-brand-red" />
            <div className="text-2xl font-bold">4</div>
          </div>
          <div className="text-xs text-gray-400">Media Features</div>
        </div>
      </section>

      {/* Who This Is For Section - Mobile Optimized */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
              Perfect For You If
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              You're Ready to <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Break Free</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Persona 1 - Mobile Optimized */}
            <div className="glass rounded-2xl p-6 card-3d hover:glass-red transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">
                Stuck in 9-5
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Ready to build your first online business.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-red font-semibold">
                <CheckCircle className="w-3 h-3" />
                <span>Perfect for beginners</span>
              </div>
            </div>

            {/* Persona 2 - Mobile Optimized */}
            <div className="glass rounded-2xl p-6 card-3d hover:glass-red transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">
                Remote Worker
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Optimize your location and visa situation.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-red font-semibold">
                <CheckCircle className="w-3 h-3" />
                <span>Level up your setup</span>
              </div>
            </div>

            {/* Persona 3 - Mobile Optimized */}
            <div className="glass rounded-2xl p-6 card-3d hover:glass-red transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">
                Aspiring Nomad
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Need guidance on visas and business setup.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-red font-semibold">
                <CheckCircle className="w-3 h-3" />
                <span>Complete support</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Comprehensive Value Section - Mobile Optimized */}
      <section className="py-20 relative bg-brand-dark-900/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
              Complete Solution
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Live & Work Abroad</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Value 1 - Online Business Coaching */}
            <div className="glass rounded-2xl p-6 card-3d hover:glass-red transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-brand-red/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">
                Business Coaching
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Amazon FBA, AI agencies, remote sales with step-by-step courses.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-red font-semibold">
                <CheckCircle className="w-3 h-3" />
                <span>4 Proven Models</span>
              </div>
            </div>

            {/* Value 2 - Visa & Relocation Support */}
            <div className="glass rounded-2xl p-6 card-3d hover:glass-red transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-brand-red/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">
                Visa & Relocation
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Complete visa guidance and accommodation sourcing.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-red font-semibold">
                <CheckCircle className="w-3 h-3" />
                <span>50+ Countries</span>
              </div>
            </div>

            {/* Value 3 - Travel & Lifestyle Benefits */}
            <div className="glass rounded-2xl p-6 card-3d hover:glass-red transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-brand-red/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plane className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">
                Travel Benefits
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Exclusive flight deals and accommodation discounts.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-red font-semibold">
                <CheckCircle className="w-3 h-3" />
                <span>Official Partners</span>
              </div>
            </div>

            {/* Value 4 - Community & Support */}
            <div className="glass rounded-2xl p-6 card-3d hover:glass-red transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-brand-red/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">
                Community & Support
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Join 1,000+ digital nomads and get mentorship.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-red font-semibold">
                <CheckCircle className="w-3 h-3" />
                <span>Global Community</span>
              </div>
            </div>
          </div>

          {/* Intermediate CTA */}
          <div className="text-center mt-12">
            <Link href="#cta">
              <Button size="lg" className="bg-brand-red hover:bg-brand-red-600 text-lg px-8 py-4 magnetic-button text-white">
                <Sparkles className="mr-2 h-4 w-4" />
                Get All This + More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Consolidated Social Proof Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              Trusted & Featured
            </Badge>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Join <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">1,000+</span> Successful Nomads
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Featured in major publications and trusted by global partners
            </p>
          </div>

          {/* Featured In */}
          <div className="glass rounded-3xl p-8 mb-12 max-w-5xl mx-auto">
            <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">
              As Featured In
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center">
              <div className="group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                  <Newspaper className="w-6 h-6 text-gray-400 group-hover:text-brand-red transition-colors" />
                  <span className="text-xl font-bold text-gray-400 group-hover:text-brand-red transition-colors">
                    Daily Mail
                  </span>
                </div>
              </div>
              <div className="group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                  <Newspaper className="w-6 h-6 text-gray-400 group-hover:text-brand-red transition-colors" />
                  <span className="text-xl font-bold text-gray-400 group-hover:text-brand-red transition-colors">
                    The Mirror
                  </span>
                </div>
              </div>
              <div className="group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                  <Newspaper className="w-6 h-6 text-gray-400 group-hover:text-brand-red transition-colors" />
                  <span className="text-xl font-bold text-gray-400 group-hover:text-brand-red transition-colors">
                    The Sun
                  </span>
                </div>
              </div>
              <div className="group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                  <Newspaper className="w-6 h-6 text-gray-400 group-hover:text-brand-red transition-colors" />
                  <span className="text-xl font-bold text-gray-400 group-hover:text-brand-red transition-colors">
                    Joe.co.uk
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="glass rounded-3xl p-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-brand-red to-brand-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  1,000+
                </div>
                <div className="text-sm text-gray-400 group-hover:text-brand-red transition-colors">Community Members</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-brand-red to-brand-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  50+
                </div>
                <div className="text-sm text-gray-400 group-hover:text-brand-red transition-colors">Successful Relocations</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-brand-red to-brand-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  20+
                </div>
                <div className="text-sm text-gray-400 group-hover:text-brand-red transition-colors">Hours of Content</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-brand-red to-brand-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="text-sm text-gray-400 group-hover:text-brand-red transition-colors">Global Partnerships</div>
              </div>
            </div>
          </div>

          {/* Intermediate CTA */}
          <div className="text-center mt-12">
            <Link href="#cta">
              <Button size="lg" variant="outline" className="glass border-white/20 text-white hover:bg-white/10 hover:border-brand-red/50 px-8 py-6 magnetic-button">
                Join the Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Official Partners Section - NEW */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              Official Partners
            </Badge>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Trusted <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Partners</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Strategic partnerships to enhance your nomad experience
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8 max-w-6xl mx-auto">
            {/* Partner 1 - Skyscanner Official Widget */}
            <div className="glass rounded-3xl p-8 hover:scale-[1.01] transition-transform duration-500 ease-out group">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plane className="h-8 w-8 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold group-hover:text-brand-red transition-colors">
                      Skyscanner
                    </h3>
                    <p className="text-lg text-gray-400">
                      Official Flight Partner
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-brand-red border-brand-red/50 bg-brand-red/5">
                  <Handshake className="w-3 h-3 mr-2 inline" />
                  Verified Partner
                </Badge>
              </div>
              
              <p className="text-gray-400 leading-relaxed mb-6 text-center">
                Book your flight to Thailand with exclusive LeaveLab member deals
              </p>
              
              {/* Official Skyscanner Search Widget */}
              <div
                data-skyscanner-widget="SearchWidget"
                data-locale="en-GB"
                data-market="UK"
                data-currency="GBP"
                data-media-partner-id="6615071"
                data-colour="#161616"
                data-arrow-icon="true"
                data-powered-by-logo-colour="light"
                data-powered-by-size="1.2"
                data-font-colour="#EF4444"
                data-flight-button-text="LeaveLab Exclusive Deals"
                data-button-colour="#DC2626"
                data-responsive="true"
                data-widget-border-radius="24"
                data-widget-padding="32"
                data-widget-scale="1"
                data-button-text-size="1"
                data-origin-iata-code="LHR"
                data-origin-name="London Heathrow"
                data-destination-iata-code="BKK"
                data-destination-name="Bangkok"
                data-hide-powered-by="false"
              ></div>
            </div>

            {/* Partner 2 - Worldpackers */}
            <div className="relative rounded-3xl overflow-hidden card-3d transition-all duration-500 ease-out group cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-red/20 border-2 border-transparent hover:border-brand-red/30 min-h-[500px]">
              {/* Full Card Background - Worldpackers Banner */}
              <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out">
                <Image
                  src="/partners/worldpackers-banner.jpg"
                  alt="Worldpackers - Official Accommodation Partner"
                  fill
                  className="object-cover object-center"
                  priority={false}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Dark overlay for text readability - stronger at bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-dark-950/60 via-brand-dark-950/70 to-brand-dark-950/85 pointer-events-none" />
              
              {/* Subtle color overlay to reduce brightness */}
              <div className="absolute inset-0 bg-[#2C5F6F]/20 mix-blend-multiply pointer-events-none" />
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-red/0 via-brand-red/5 to-brand-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Animated gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
              </div>
              
              {/* Content Section - Centered, positioned upper portion */}
              <div className="relative h-full flex items-start justify-center p-10 pt-20">
                <div className="max-w-xl text-center">
                  {/* Verified Badge with animation */}
                  <div className="mb-4 flex items-center justify-center gap-2 animate-float">
                    <Badge variant="outline" className="text-brand-red border-brand-red/60 bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-md px-4 py-1.5">
                      <Handshake className="w-4 h-4 mr-2 inline animate-pulse" />
                      Official Partner
                    </Badge>
                  </div>
                  
                  {/* Title with gradient on hover */}
                  <h3 className="text-2xl font-black mb-2 transition-all duration-300 group-hover:scale-105">
                    <span className="bg-gradient-to-r from-white via-white to-white group-hover:from-brand-red group-hover:via-white group-hover:to-brand-red bg-clip-text text-transparent transition-all duration-500 drop-shadow-lg">
                      Worldpackers
                    </span>
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-base text-gray-300 mb-3 font-semibold group-hover:text-white transition-colors drop-shadow-md">
                    Official Accommodation Partner
                  </p>
                  
                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed text-xs group-hover:text-gray-300 transition-colors mb-6 drop-shadow-md">
                    Exclusive accommodation deals and verified stays worldwide. Connect with hosts, exchange skills for accommodation, and travel affordably.
                  </p>
                  
                  {/* Decorative elements */}
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-400 backdrop-blur-sm flex-wrap">
                    <div className="flex items-center gap-1.5 group-hover:text-brand-red transition-colors">
                      <Home className="w-3.5 h-3.5" />
                      <span>Global Network</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-500" />
                    <div className="flex items-center gap-1.5 group-hover:text-brand-red transition-colors">
                      <Users className="w-3.5 h-3.5" />
                      <span>Verified Hosts</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-500" />
                    <div className="flex items-center gap-1.5 group-hover:text-brand-red transition-colors">
                      <Globe className="w-3.5 h-3.5" />
                      <span>140+ Countries</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom glow effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section - Mobile Optimized */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
              Common Concerns Answered
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              We&apos;ve Got <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">You Covered</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {/* Pain Point 1 - Mobile Optimized */}
            <div className="glass rounded-xl p-4 hover:glass-red transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="h-5 w-5 text-brand-red" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Stuck in 9-5?</h3>
              <p className="text-brand-red font-semibold text-sm">ÔåÆ Business coaching gets you income-independent</p>
            </div>

            {/* Pain Point 2 - Mobile Optimized */}
            <div className="glass rounded-xl p-4 hover:glass-red transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5 text-brand-red" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Visa Confusion?</h3>
              <p className="text-brand-red font-semibold text-sm">ÔåÆ We handle visa setup A-Z with trusted agents</p>
            </div>

            {/* Pain Point 3 - Mobile Optimized */}
            <div className="glass rounded-xl p-4 hover:glass-red transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5 text-brand-red" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Income Stability?</h3>
              <p className="text-brand-red font-semibold text-sm">ÔåÆ 4 proven business models + ongoing support</p>
            </div>

            {/* Pain Point 4 - Mobile Optimized */}
            <div className="glass rounded-xl p-4 hover:glass-red transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MapPin className="h-5 w-5 text-brand-red" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Where to Start?</h3>
              <p className="text-brand-red font-semibold text-sm">ÔåÆ Step-by-step roadmap from planning to landing</p>
            </div>
          </div>

          {/* Intermediate CTA */}
          <div className="text-center mt-12">
            <Link href="#cta">
              <Button size="lg" className="bg-brand-red hover:bg-brand-red-600 text-lg px-8 py-4 magnetic-button text-white">
                <Sparkles className="mr-2 h-4 w-4" />
                Solve These Problems Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Courses Section - Modern Cards */}
      <section id="courses" className="py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              Featured Courses
            </Badge>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Start <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Learning</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Expert-led courses designed to help you earn from anywhere
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Course 1 - Amazon FBA Mastery */}
            <Card className="bg-brand-dark-900 border-white/10 overflow-hidden group hover:border-brand-red/50 transition-all duration-300 card-3d">
              <div className="h-56 bg-gradient-to-br from-brand-red to-brand-red-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="w-10 h-10 text-white" />
                  </div>
                </div>
                <Badge className="absolute top-4 left-4 bg-green-600 text-white border-0 animate-pulse-scale">
                  Complete Course
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-brand-red border-brand-red/50 bg-brand-red/5">
                    Full Access
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-brand-red transition-colors">
                  Amazon FBA Mastery
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Launch your profitable Amazon business from anywhere in the world
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-brand-red hover:bg-brand-red-600 magnetic-button text-white">
                  Start Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Course 2 - AI Automation Agency */}
            <Card className="bg-brand-dark-900 border-white/10 overflow-hidden group hover:border-brand-red/50 transition-all duration-300 card-3d">
              <div className="h-56 bg-gradient-to-br from-brand-accent to-brand-accent-pink relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                </div>
                <Badge className="absolute top-4 left-4 bg-brand-accent text-white border-0 animate-pulse-scale">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-brand-accent border-brand-accent/50 bg-brand-accent/5">
                    Tech-Focused
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-brand-red transition-colors">
                  AI Automation Agency
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Build an AI agency serving global clients with cutting-edge automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-brand-red hover:bg-brand-red-600 magnetic-button text-white">
                  Start Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Course 3 - Remote Sales */}
            <Card className="bg-brand-dark-900 border-white/10 overflow-hidden group hover:border-brand-red/50 transition-all duration-300 card-3d">
              <div className="h-56 bg-gradient-to-br from-brand-accent-orange to-brand-red relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-brand-accent-orange border-brand-accent-orange/50 bg-brand-accent-orange/5">
                    High Income
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-brand-red transition-colors">
                  Remote Sales
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Master high-ticket remote sales and earn from anywhere
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-brand-red hover:bg-brand-red-600 magnetic-button text-white">
                  Start Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Course 4 - Social Media Bootcamp */}
            <Card className="bg-brand-dark-900 border-white/10 overflow-hidden group hover:border-brand-red/50 transition-all duration-300 card-3d">
              <div className="h-56 bg-gradient-to-br from-pink-600 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                </div>
                <Badge className="absolute top-4 left-4 bg-brand-red text-white border-0 animate-pulse-scale">
                  New
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-pink-400 border-pink-400/50 bg-pink-400/5">
                    Content Creator
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-brand-red transition-colors">
                  Social Media Bootcamp
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Build your personal brand and generate remote income via social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-brand-red hover:bg-brand-red-600 magnetic-button text-white">
                  Start Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <Link href="#cta">
              <Button size="lg" className="bg-brand-red hover:bg-brand-red-600 text-lg px-10 py-6 magnetic-button text-white">
                <Sparkles className="mr-3 h-5 w-5" />
                Start Learning Today
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Join 1,000+ students already learning these skills
            </p>
          </div>
        </div>
      </section>

      {/* Real Success Stories - Mobile Optimized */}
      <section className="py-20 relative bg-brand-dark-900/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 glass-red text-brand-red-200 border-brand-red/30">
              <Award className="w-4 h-4 mr-2 inline" />
              Verified Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Real People, <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Real Results</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* UK Client Success Story - Mobile Optimized */}
            <div className="glass rounded-2xl p-6 card-3d hover:glass-red transition-all duration-300 border-2 border-transparent hover:border-brand-red/50">
              {/* Journey Flags */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-4xl">­ƒç¼­ƒçº</div>
                <ArrowRight className="w-6 h-6 text-brand-red" />
                <div className="text-4xl">­ƒç╣­ƒç¡</div>
              </div>

              <div className="text-center mb-4">
                <Badge className="mb-3 bg-green-600/20 text-green-400 border-green-400/50 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1 inline" />
                  Successfully Relocated
                </Badge>
                <h3 className="text-xl font-bold text-white mb-1">Sarah M.</h3>
                <p className="text-brand-red font-semibold text-sm">London ÔåÆ Chiang Mai</p>
                <p className="text-xs text-gray-400">┬ú45k ÔåÆ ┬ú8k/month in 6 months</p>
              </div>

              {/* Quote - Shortened */}
              <div className="mb-4">
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "LeaveLab's Amazon FBA course helped me launch my business and now I make ┬ú8k/month from Thailand. Best decision ever!"
                </p>
              </div>

              {/* Before / After - Compact */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-brand-dark-950/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase mb-1">Before</p>
                  <p className="text-white font-semibold text-sm">┬ú45k Office Job</p>
                </div>
                <div className="bg-brand-red/10 rounded-lg p-3 border border-brand-red/30">
                  <p className="text-xs text-brand-red uppercase mb-1">After</p>
                  <p className="text-white font-semibold text-sm">┬ú8k/month FBA</p>
                </div>
              </div>

              {/* CTA */}
              <Link href="#cta">
                <Button className="w-full bg-brand-red hover:bg-brand-red-600 magnetic-button text-white text-sm py-3">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* USA Client Success Story - Mobile Optimized */}
            <div className="glass rounded-2xl p-6 card-3d hover:glass-red transition-all duration-300 border-2 border-transparent hover:border-brand-red/50">
              {/* Journey Flags */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-4xl">­ƒç║­ƒç©</div>
                <ArrowRight className="w-6 h-6 text-brand-red" />
                <div className="text-4xl">­ƒç╣­ƒç¡</div>
              </div>

              <div className="text-center mb-4">
                <Badge className="mb-3 bg-green-600/20 text-green-400 border-green-400/50 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1 inline" />
                  Successfully Relocated
                </Badge>
                <h3 className="text-xl font-bold text-white mb-1">Mike R.</h3>
                <p className="text-brand-red font-semibold text-sm">USA ÔåÆ Bangkok</p>
                <p className="text-xs text-gray-400">$120k ÔåÆ $15k/month in 8 months</p>
              </div>

              {/* Quote - Shortened */}
              <div className="mb-4">
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "LeaveLab's AI agency course helped me build a $15k/month business. Now I work from Bangkok beaches and love my life!"
                </p>
              </div>

              {/* Before / After - Compact */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-brand-dark-950/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase mb-1">Before</p>
                  <p className="text-white font-semibold text-sm">$120k Corporate</p>
                </div>
                <div className="bg-brand-red/10 rounded-lg p-3 border border-brand-red/30">
                  <p className="text-xs text-brand-red uppercase mb-1">After</p>
                  <p className="text-white font-semibold text-sm">$15k/month AI</p>
                </div>
              </div>

              {/* CTA */}
              <Link href="#cta">
                <Button className="w-full bg-brand-red hover:bg-brand-red-600 magnetic-button text-white text-sm py-3">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section - Bold & Immersive with Thailand Focus */}
      <section id="cta" className="py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-red via-brand-red-600 to-brand-red-800 rounded-[3rem] animate-gradient" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 rounded-[3rem]" />
            
            {/* Content */}
            <div className="relative z-10 p-12 lg:p-20 text-center">
              <Badge className="mb-8 bg-white/20 text-white border-0 text-base px-6 py-2 animate-pulse-scale">
                <Rocket className="w-4 h-4 mr-2 inline" />
                Start Your Journey to Thailand
              </Badge>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white">
                Your Next Chapter
                <br />
                Starts Today
              </h2>
              
              <p className="text-2xl mb-6 text-white/90 max-w-3xl mx-auto font-medium">
                Join our verified success stories who relocated to Thailand
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mb-12 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  <span>Featured in Daily Mail</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/50" />
                <div className="flex items-center gap-2">
                  <Handshake className="h-4 w-4" />
                  <span>2 Official Partnerships</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/50" />
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>50+ Relocations</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Link href="#cta">
                  <Button 
                    size="lg" 
                    className="bg-white text-brand-red hover:bg-gray-100 text-xl px-12 py-8 tap-target magnetic-button shadow-2xl font-bold"
                  >
                    <Sparkles className="mr-3 h-6 w-6" />
                    Start Free Trial
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
          </Link>
                <Link href="#contact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-xl px-12 py-8 tap-target border-2 border-white text-white hover:bg-white/10 magnetic-button font-bold"
                  >
                    Talk to Success Coach
                  </Button>
          </Link>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>7-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Minimalist */}
      <section id="faq" className="py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              FAQ
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Questions?
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to know
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="glass rounded-2xl px-8 border-white/10 data-[state=open]:glass-red transition-all">
                <AccordionTrigger className="text-left hover:no-underline text-white hover:text-brand-red transition-colors py-6 text-lg font-semibold">
                  What&apos;s included in the free trial?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                  Full Premium access for 7 days: unlimited courses, visa guides for all countries, accommodation info, and community access. No credit card required.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="glass rounded-2xl px-8 border-white/10 data-[state=open]:glass-red transition-all">
                <AccordionTrigger className="text-left hover:no-underline text-white hover:text-brand-red transition-colors py-6 text-lg font-semibold">
                  Can I cancel anytime?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                  Absolutely! Cancel from your account settings anytime. During trial you won&apos;t be charged. After that, you retain access until the end of your billing period.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="glass rounded-2xl px-8 border-white/10 data-[state=open]:glass-red transition-all">
                <AccordionTrigger className="text-left hover:no-underline text-white hover:text-brand-red transition-colors py-6 text-lg font-semibold">
                  What countries do you cover?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                  50+ countries with comprehensive visa and accommodation guides. Focus on popular digital nomad destinations: Thailand, Portugal, Mexico, Spain, Bali, and more.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="glass rounded-2xl px-8 border-white/10 data-[state=open]:glass-red transition-all">
                <AccordionTrigger className="text-left hover:no-underline text-white hover:text-brand-red transition-colors py-6 text-lg font-semibold">
                  Basic vs Premium - what&apos;s the difference?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                  Basic: one course + short-term guides. Premium: unlimited courses + long-term visa info + advanced accommodation guides + one-on-one expert support.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section - Simple */}
      <section id="contact" className="py-20 relative bg-brand-dark-900/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              Get In Touch
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Start Your <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Journey?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Contact us to learn more about living and working from Thailand
            </p>
            <div className="glass rounded-2xl p-8">
              <p className="text-gray-300 mb-4">
                Email us at: <a href="mailto:hello@leavelab.com" className="text-brand-red hover:underline font-semibold">hello@leavelab.com</a>
              </p>
              <p className="text-gray-400 text-sm">
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Clean & Modern */}
      <footer className="border-t border-white/10 bg-brand-dark-900/50 backdrop-blur-xl py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-red-800 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">LeaveLab</div>
                  <div className="text-[10px] text-brand-red tracking-wider">DIGITAL FREEDOM</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Empowering digital nomads to live and work from anywhere in the world.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Handshake className="w-3 h-3 text-brand-red" />
                  <span>Official Partners: Skyscanner, Worldpackers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Newspaper className="w-3 h-3 text-brand-red" />
                  <span>Featured in 4 Major Publications</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-brand-red transition-colors">Features</Link></li>
                <li><Link href="#courses" className="hover:text-brand-red transition-colors">Courses</Link></li>
                <li><Link href="#contact" className="hover:text-brand-red transition-colors">Pricing</Link></li>
                <li><Link href="#faq" className="hover:text-brand-red transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-brand-red transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-brand-red transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-brand-red transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-brand-red transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-brand-red transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-brand-red transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-brand-red transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>┬® 2025 LeaveLab. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-brand-red transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-brand-red transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-brand-red transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-brand-red transition-colors">YouTube</Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Skyscanner Widget Script */}
      <Script 
        src="https://widgets.skyscanner.net/widget-server/js/loader.js" 
        strategy="afterInteractive"
      />
      </div>
  );
}
