/**
 * Premium Content Client Component
 * 
 * Client-side component that handles subscription gate logic
 * and displays content based on user's subscription tier.
 */

'use client';

import { useSubscriptionGate } from '@/features/subscriptions/hooks/useSubscriptionGate';
import { UpgradePrompt } from '@/features/subscriptions/components/UpgradePrompt';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Star, TrendingUp, Users, BookOpen, Globe, Map } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function PremiumContentClient() {
  // Gate content behind Premium tier (requires long_term visa_info access)
  const { hasAccess, requiredTier, isLoading, currentTier } = useSubscriptionGate(
    'visa_info',
    'long_term'
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // User doesn't have premium access - show upgrade prompt
  if (!hasAccess) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Premium Content</h1>
          <p className="mt-2 text-muted-foreground">
            Exclusive resources and tools for Premium members
          </p>
        </div>

        <UpgradePrompt
          requiredTier={requiredTier || 'Premium'}
          title="Premium Content Locked"
          description="Upgrade to Premium to unlock exclusive long-term visa information, advanced accommodation guides, and one-on-one support."
        />

        {/* Preview of locked content */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">What's included in Premium:</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden opacity-60">
              <div className="absolute right-4 top-4">
                <Badge variant="secondary">Premium</Badge>
              </div>
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Long-term Visa Guides</CardTitle>
                <CardDescription>
                  Comprehensive guides for long-term visa applications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden opacity-60">
              <div className="absolute right-4 top-4">
                <Badge variant="secondary">Premium</Badge>
              </div>
              <CardHeader>
                <Map className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Accommodation Resources</CardTitle>
                <CardDescription>
                  Advanced housing search tools and neighborhood guides
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden opacity-60">
              <div className="absolute right-4 top-4">
                <Badge variant="secondary">Premium</Badge>
              </div>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">One-on-One Support</CardTitle>
                <CardDescription>
                  Direct access to immigration experts for personalized help
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // User has premium access - show the content
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Premium Content</h1>
            <p className="mt-2 text-muted-foreground">
              Exclusive resources for Premium members
            </p>
          </div>
          <Badge variant="default" className="w-fit">
            <Star className="mr-1 h-3 w-3" />
            {currentTier}
          </Badge>
        </div>
      </div>

      {/* Success Alert */}
      <Alert className="mb-8 border-green-500/50 bg-green-50 dark:bg-green-950/20">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-900 dark:text-green-100">
          Welcome to Premium Content!
        </AlertTitle>
        <AlertDescription className="text-green-800 dark:text-green-200">
          You have full access to all premium resources and exclusive content.
        </AlertDescription>
      </Alert>

      {/* Premium Content Cards */}
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Long-term Visa Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Complete Visa Application Guide</CardTitle>
                <CardDescription>
                  Step-by-step instructions for long-term visa applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Document checklist and requirements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Timeline and processing expectations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Common pitfalls to avoid</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Immigration Law Updates</CardTitle>
                <CardDescription>
                  Stay current with the latest visa policy changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Monthly policy briefings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Real-time alerts on rule changes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Expert analysis and commentary</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Accommodation & Living</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <Map className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Advanced Housing Search Tools</CardTitle>
                <CardDescription>
                  Find your perfect accommodation with premium filters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Curated neighborhood guides</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Landlord and agency database</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Lease negotiation templates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Cost of Living Calculator</CardTitle>
                <CardDescription>
                  Plan your budget with accurate cost estimates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Real-time price data for major cities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Personalized budget recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Currency exchange tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Expert Support</h2>
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>One-on-One Consultations</CardTitle>
              <CardDescription>
                Get personalized guidance from immigration experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  As a Premium member, you have access to direct consultations with our team of immigration specialists. 
                  Schedule a session to get personalized advice on your specific situation.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-2">Video Consultations</h4>
                    <p className="text-sm text-muted-foreground">
                      30-minute sessions with visa experts
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-2">Priority Email Support</h4>
                    <p className="text-sm text-muted-foreground">
                      24-hour response time guaranteed
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

