import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Plane,
  GraduationCap,
  MapPin,
  Home,
  MessageCircle,
  CheckCircle,
  Sparkles,
  Globe,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  Play,
  Star,
  Zap,
  Target,
  Shield,
  Award,
  Rocket,
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
              <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-brand-red transition-colors relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white hover:text-brand-red hover:bg-white/5">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
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
              </Link>
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
                <Zap className="w-4 h-4 mr-2 inline animate-pulse" />
                Join 10,000+ Digital Nomads Worldwide
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
            
            {/* Subheadline */}
            <p className="text-center text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Master <span className="text-white font-semibold">remote income</span>, navigate{' '}
              <span className="text-white font-semibold">global visas</span>, and find your{' '}
              <span className="text-brand-red font-semibold">perfect home</span> abroad. 
              <br className="hidden md:block" />
              Everything you need to become location-independent.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-brand-red hover:bg-brand-red-600 text-lg px-10 py-7 tap-target magnetic-button relative group overflow-hidden text-white shadow-2xl shadow-brand-red/50"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-red-600 to-brand-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 animate-glow" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="glass text-lg px-10 py-7 tap-target text-white border-white/20 hover:bg-white/10 hover:border-brand-red/50 magnetic-button"
              >
                <Play className="mr-3 h-6 w-6" />
                Watch Demo
              </Button>
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
                <span className="group-hover:text-white transition-colors">No credit card</span>
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
          <div className="text-3xl font-bold text-brand-red">10K+</div>
          <div className="text-xs text-gray-400">Members</div>
        </div>
        <div className="absolute top-1/3 right-10 glass p-4 rounded-2xl animate-float animation-delay-2000 hidden lg:block">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-brand-red fill-brand-red" />
            <div className="text-2xl font-bold">4.9</div>
          </div>
          <div className="text-xs text-gray-400">Rating</div>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="glass rounded-3xl p-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-brand-red to-brand-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  10K+
                </div>
                <div className="text-sm text-gray-400 group-hover:text-brand-red transition-colors">Active Members</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-brand-red to-brand-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  50+
                </div>
                <div className="text-sm text-gray-400 group-hover:text-brand-red transition-colors">Countries</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-brand-red to-brand-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  100+
                </div>
                <div className="text-sm text-gray-400 group-hover:text-brand-red transition-colors">Lessons</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-brand-red to-brand-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  4.9/5
                </div>
                <div className="text-sm text-gray-400 group-hover:text-brand-red transition-colors">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with 3D Cards */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              Everything You Need
            </Badge>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Your Complete
              <br />
              <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">
                Freedom Toolkit
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to break free from the 9-5 and live life on your terms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 - 3D Card */}
            <div className="glass rounded-3xl p-8 card-3d hover:glass-red transition-all duration-300 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-8 w-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-red transition-colors">
                Income Mastery
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Learn freelancing, remote work, and online business strategies that generate real income from anywhere.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-3xl p-8 card-3d hover:glass-red transition-all duration-300 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Plane className="h-8 w-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-red transition-colors">
                Visa Solutions
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Navigate complex visa requirements with step-by-step guides for 50+ countries worldwide.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-3xl p-8 card-3d hover:glass-red transition-all duration-300 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Home className="h-8 w-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-red transition-colors">
                Perfect Homes
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Find your ideal accommodation with insider tips on neighborhoods, costs, and safety ratings.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass rounded-3xl p-8 card-3d hover:glass-red transition-all duration-300 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-red transition-colors">
                Country Intel
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Deep dives into cost of living, culture, weather, and everything you need before moving.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass rounded-3xl p-8 card-3d hover:glass-red transition-all duration-300 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-red transition-colors">
                Global Community
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Connect with thousands of digital nomads, share experiences, and build lasting friendships.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass rounded-3xl p-8 card-3d hover:glass-red transition-all duration-300 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-red transition-colors">
                Expert Guidance
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Get personalized mentorship from experienced nomads who&apos;ve walked the path before you.
              </p>
            </div>
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

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Course 1 */}
            <Card className="bg-brand-dark-900 border-white/10 overflow-hidden group hover:border-brand-red/50 transition-all duration-300 card-3d">
              <div className="h-56 bg-gradient-to-br from-brand-red to-brand-red-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                </div>
                <Badge className="absolute top-4 left-4 bg-brand-accent text-white border-0 animate-pulse-scale">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-brand-red border-brand-red/50 bg-brand-red/5">
                    12 Lessons
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-brand-red fill-brand-red" />
                    <span className="font-bold text-white">4.9</span>
                  </div>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-brand-red transition-colors">
                  Freelancing Fundamentals
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Master freelancing from client acquisition to rate setting. Build a thriving independent career.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-brand-red" />
                    <span>6 hours total</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Users className="w-4 h-4 text-brand-red" />
                    <span>2,847 students</span>
                  </div>
                </div>
                <Button className="w-full bg-brand-red hover:bg-brand-red-600 magnetic-button text-white">
                  Start Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Course 2 */}
            <Card className="bg-brand-dark-900 border-white/10 overflow-hidden group hover:border-brand-red/50 transition-all duration-300 card-3d">
              <div className="h-56 bg-gradient-to-br from-brand-accent to-brand-accent-pink relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-brand-accent border-brand-accent/50 bg-brand-accent/5">
                    8 Lessons
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-brand-red fill-brand-red" />
                    <span className="font-bold text-white">4.8</span>
                  </div>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-brand-red transition-colors">
                  Online Business Builder
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Create sustainable income with digital products, SaaS, or e-commerce. Build once, earn forever.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-brand-red" />
                    <span>4.5 hours total</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Users className="w-4 h-4 text-brand-red" />
                    <span>1,923 students</span>
                  </div>
                </div>
                <Button className="w-full bg-brand-red hover:bg-brand-red-600 magnetic-button text-white">
                  Start Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Course 3 */}
            <Card className="bg-brand-dark-900 border-white/10 overflow-hidden group hover:border-brand-red/50 transition-all duration-300 card-3d">
              <div className="h-56 bg-gradient-to-br from-brand-accent-orange to-brand-red relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                </div>
                <Badge className="absolute top-4 left-4 bg-brand-red text-white border-0 animate-pulse-scale">
                  New
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-brand-accent-orange border-brand-accent-orange/50 bg-brand-accent-orange/5">
                    10 Lessons
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-brand-red fill-brand-red" />
                    <span className="font-bold text-white">4.9</span>
                  </div>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-brand-red transition-colors">
                  Remote Work Mastery
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Land high-paying remote positions. Perfect your resume, ace interviews, negotiate top dollar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-brand-red" />
                    <span>5 hours total</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Users className="w-4 h-4 text-brand-red" />
                    <span>1,456 students</span>
                  </div>
                </div>
                <Button className="w-full bg-brand-red hover:bg-brand-red-600 magnetic-button text-white">
                  Start Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <Link href="/signup">
              <Button size="lg" variant="outline" className="glass border-white/20 text-white hover:bg-white/10 hover:border-brand-red/50 px-8 py-6 magnetic-button">
                Browse All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              Success Stories
            </Badge>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Loved by <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">Nomads</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Testimonial 1 */}
            <div className="glass rounded-3xl p-8 card-3d hover:glass-red transition-all duration-300">
              <div className="flex items-center gap-2 text-brand-red mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-red" />
                ))}
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                &quot;LeaveLab gave me the blueprint to quit my 9-5. I&apos;m now making 3x more while exploring Southeast Asia!&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-red to-brand-red-600 flex items-center justify-center text-2xl font-bold">
                  S
                </div>
                <div>
                  <div className="font-bold text-white">Sarah Johnson</div>
                  <div className="text-sm text-gray-400">Designer • Bali</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="glass rounded-3xl p-8 card-3d hover:glass-red transition-all duration-300">
              <div className="flex items-center gap-2 text-brand-red mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-red" />
                ))}
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                &quot;The visa guides saved me weeks and thousands in legal fees. Clear, accurate, and invaluable.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent-pink flex items-center justify-center text-2xl font-bold">
                  M
                </div>
                <div>
                  <div className="font-bold text-white">Marcus Chen</div>
                  <div className="text-sm text-gray-400">Developer • Lisbon</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="glass rounded-3xl p-8 card-3d hover:glass-red transition-all duration-300">
              <div className="flex items-center gap-2 text-brand-red mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-red" />
                ))}
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                &quot;Best investment in my nomad journey. The community alone is worth it - lifelong friends and business partners!&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-accent-orange to-brand-red flex items-center justify-center text-2xl font-bold">
                  E
                </div>
                <div>
                  <div className="font-bold text-white">Emma Rodriguez</div>
                  <div className="text-sm text-gray-400">Creator • Mexico</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold & Immersive */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-red via-brand-red-600 to-brand-red-800 rounded-[3rem] animate-gradient" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 rounded-[3rem]" />
            
            {/* Content */}
            <div className="relative z-10 p-12 lg:p-20 text-center">
              <Badge className="mb-8 bg-white/20 text-white border-0 text-base px-6 py-2 animate-pulse-scale">
                <Rocket className="w-4 h-4 mr-2 inline" />
                Limited Time Offer
              </Badge>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white">
                Your Journey
                <br />
                Starts Today
              </h2>
              
              <p className="text-2xl mb-12 text-white/90 max-w-3xl mx-auto font-medium">
                Join thousands of successful nomads. Try Premium free for 7 days.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="bg-white text-brand-red hover:bg-gray-100 text-xl px-12 py-8 tap-target magnetic-button shadow-2xl font-bold"
                  >
                    <Sparkles className="mr-3 h-6 w-6" />
                    Start Free Trial
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
          </Link>
                <Link href="/pricing">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-xl px-12 py-8 tap-target border-2 border-white text-white hover:bg-white/10 magnetic-button font-bold"
                  >
                    View Pricing
                  </Button>
          </Link>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span>Instant access</span>
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
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering digital nomads to live and work from anywhere in the world.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-brand-red transition-colors">Features</Link></li>
                <li><Link href="#courses" className="hover:text-brand-red transition-colors">Courses</Link></li>
                <li><Link href="/pricing" className="hover:text-brand-red transition-colors">Pricing</Link></li>
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
            <p>© 2025 LeaveLab. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-brand-red transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-brand-red transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-brand-red transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-brand-red transition-colors">YouTube</Link>
            </div>
          </div>
        </div>
      </footer>
      </div>
  );
}
