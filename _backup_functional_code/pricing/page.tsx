/**
 * Pricing Page
 * 
 * Public-facing pricing page with tier comparison and FAQ.
 * Dark theme with red branding.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { PricingComparison } from '@/features/subscriptions/components/PricingComparison';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FAQ_ITEMS } from '@/features/subscriptions/constants/messages';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing | LeaveLab',
  description: 'Choose the right plan for your digital nomad journey. Compare features and pricing for Free, Basic, and Premium tiers.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-brand-dark-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-brand-dark-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-red transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 space-y-6">
          <Badge className="glass-red text-brand-red-200 border-brand-red/30 px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2 inline animate-pulse" />
            Flexible Plans for Every Nomad
          </Badge>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
            Choose Your
            <br />
            <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">
              Freedom Plan
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Start your digital nomad journey today with the plan that fits your needs.
            <br className="hidden md:block" />
            All plans include 7-day money-back guarantee.
          </p>
        </div>

        {/* Pricing Comparison */}
        <PricingComparison className="mb-24 md:mb-32" />

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 glass-red text-brand-red-200 border-brand-red/30">
              FAQ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Got Questions?
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to know
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass rounded-2xl px-8 border-white/10 data-[state=open]:glass-red transition-all"
              >
                <AccordionTrigger className="text-left hover:no-underline text-white hover:text-brand-red transition-colors py-6 text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-24 md:mt-32">
          <div className="glass rounded-3xl p-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-gray-400 mb-6">
              Our support team is here to help you choose the right plan
            </p>
            <a
              href="mailto:support@leavelab.com"
              className="inline-flex items-center gap-2 text-brand-red hover:text-brand-red-400 font-semibold transition-colors"
            >
              Contact Support
              <span className="text-xl">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

