import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { User, Settings, CheckCircle, AlertCircle, Sparkles, TrendingUp, Book, MapPin } from 'lucide-react';
import { DashboardSubscriptionStatus } from './components/DashboardSubscriptionStatus';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-400">
              Ready to continue your journey?
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <DashboardSubscriptionStatus />
            <LogoutButton />
          </div>
        </div>

        {/* Subscription upgrade prompt for Free tier users */}
        <DashboardSubscriptionStatus showUpgradePrompt />

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass border-white/10 overflow-hidden group hover:glass-red transition-all card-3d">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Book className="w-5 h-5 text-brand-red" />
                  Courses
                </CardTitle>
                <Badge className="bg-brand-accent/20 text-brand-accent border-0">
                  0/1
                </Badge>
              </div>
              <CardDescription className="text-gray-400">Enrolled courses</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-white">0</div>
              <p className="text-sm text-gray-500 mt-1">courses in progress</p>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 overflow-hidden group hover:glass-red transition-all card-3d">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent pointer-events-none" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-accent" />
                  Progress
                </CardTitle>
                <Badge className="bg-brand-accent/20 text-brand-accent border-0">
                  0%
                </Badge>
              </div>
              <CardDescription className="text-gray-400">Overall completion</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-white">0%</div>
              <p className="text-sm text-gray-500 mt-1">of content completed</p>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 overflow-hidden group hover:glass-red transition-all card-3d">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent-pink/5 to-transparent pointer-events-none" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-accent-pink" />
                  Destinations
                </CardTitle>
                <Badge className="bg-brand-accent-pink/20 text-brand-accent-pink border-0">
                  New
                </Badge>
              </div>
              <CardDescription className="text-gray-400">Countries explored</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-white">0</div>
              <p className="text-sm text-gray-500 mt-1">visa guides viewed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Info */}
          <Card className="glass border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <User className="w-6 h-6 text-brand-red" />
                Your Account
              </CardTitle>
              <CardDescription className="text-gray-400">Account information and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-lg text-white font-medium">{user.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">User ID</p>
                <p className="text-sm font-mono text-gray-400">{user.id}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Email Status</p>
                <div>
                  {user.email_confirmed_at ? (
                    <div className="inline-flex items-center gap-2 glass-red px-4 py-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-brand-accent" />
                      <span className="text-brand-accent font-semibold">Verified</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-brand-red/30">
                      <AlertCircle className="w-5 h-5 text-brand-red" />
                      <span className="text-brand-red font-semibold">Not Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-brand-accent" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-400">Manage your account and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <Link href="/profile">
                <Button 
                  variant="outline" 
                  className="w-full justify-start tap-target glass border-white/20 text-white hover:glass-red hover:border-brand-red/50 magnetic-button h-14 text-base"
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile Settings
                </Button>
              </Link>
              <Link href="/settings">
                <Button 
                  variant="outline" 
                  className="w-full justify-start tap-target glass border-white/20 text-white hover:glass-red hover:border-brand-red/50 magnetic-button h-14 text-base"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Account Settings
                </Button>
              </Link>
              <Link href="/subscription">
                <Button 
                  className="w-full justify-start tap-target bg-brand-red hover:bg-brand-red-600 text-white magnetic-button h-14 text-base font-bold"
                >
                  <TrendingUp className="mr-3 h-5 w-5" />
                  Manage Subscription
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
