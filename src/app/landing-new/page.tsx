import { Metadata } from 'next';
import {
  HeroSection,
  ProblemComparison,
  StageJourney,
  TestimonialCarousel,
  PartnershipLogos,
  HowItWorks,
  PricingSection,
  FAQ,
  FinalCTA,
  Footer
} from '@/components/landing';

export const metadata: Metadata = {
  title: 'LeaveLab - Move to Thailand in 90 Days | Digital Nomad Platform',
  description: 'Join 1,247 digital nomads earning £2K+/month while living their dream life in Thailand. Complete roadmap: Income → Visa → Housing → Community',
  keywords: [
    'digital nomad Thailand',
    'move to Thailand',
    'Thailand visa',
    'remote work Thailand',
    'digital nomad visa',
    'Thailand relocation',
    'work from Thailand',
    'Thailand expat'
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ProblemComparison />
      <StageJourney />
      <TestimonialCarousel />
      <PartnershipLogos />
      <HowItWorks />
      <PricingSection />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

