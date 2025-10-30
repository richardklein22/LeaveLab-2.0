import { Metadata } from 'next';
import {
  Navigation,
  HeroSection,
  RoadmapOverview,
  IncomeStage,
  VisaStage,
  AccommodationStage,
  CommunityStage,
  OfficialPartnershipsNew,
  MediaFeatures,
  SuccessStoriesNew,
  EverythingIncluded,
  SingleCTA,
  FAQ,
  Footer
} from '@/components/landing';

export const metadata: Metadata = {
  title: 'LeaveLab - Move to Thailand in 90 Days | Digital Nomad Platform',
  description: 'Featured in Daily Mail. Join 1,247 digital nomads earning £2K+/month while living their dream life in Thailand. Complete roadmap: Income → Visa → Housing → Community',
  keywords: [
    'digital nomad Thailand',
    'move to Thailand',
    'Thailand visa',
    'remote work Thailand',
    'digital nomad visa',
    'Thailand relocation',
    'work from Thailand',
    'Thailand expat',
    'Amazon FBA Thailand',
    'online business coaching'
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-dark-950 text-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <RoadmapOverview />
      <IncomeStage />
      <VisaStage />
      <AccommodationStage />
      <CommunityStage />
      <OfficialPartnershipsNew />
      <MediaFeatures />
      <SuccessStoriesNew />
      <EverythingIncluded />
      <SingleCTA />
      <FAQ />
      <Footer />
    </div>
  );
}
