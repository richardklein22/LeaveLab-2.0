'use client';

import {
  Navigation,
  HeroSection,
  HeroSectionTraveler,
  RoadmapOverview,
  RoadmapOverviewTraveler,
  IncomeStage,
  VisaStage,
  VisaRemindersTraveler,
  AccommodationStage,
  CommunityStage,
  CommunityAccessTraveler,
  PartnerBenefits,
  PricingTraveler,
  FAQTraveler,
  FooterTraveler,
  OfficialPartnershipsNew,
  OfficialPartnershipsTraveler,
  MediaFeatures,
  MediaFeaturesTraveler,
  SuccessStoriesNew,
  EverythingIncluded,
  SingleCTA,
  FAQ,
  Footer
} from '@/components/landing';
import { TravelerTypeProvider, useTravelerType } from '@/contexts/TravelerTypeContext';
import { useEffect } from 'react';

function LandingPageContent() {
  const { travelerType } = useTravelerType();
  const isNomad = travelerType === 'nomad';
  const isTraveler = travelerType === 'traveler';

  // Update page title based on type
  useEffect(() => {
    if (isNomad) {
      document.title = 'LeaveLab - Move to Thailand in 90 Days | Digital Nomad Platform';
    } else {
      document.title = 'LeaveLab - Your Ultimate Thailand Travel Guide';
    }
  }, [isNomad]);

  return (
    <div className={`min-h-screen ${isNomad ? 'bg-brand-dark-950 text-white' : 'bg-white text-gray-900'} overflow-x-hidden`}>
      <Navigation />
      
      {/* Hero Section - Different for each type */}
      {isNomad && <HeroSection />}
      {isTraveler && <HeroSectionTraveler />}
      
      {/* Roadmap - Different for each type */}
      {isNomad && <RoadmapOverview />}
      {isTraveler && <RoadmapOverviewTraveler />}
      
      {/* Nomad-specific sections */}
      {isNomad && (
        <>
          <IncomeStage />
          <VisaStage />
          <AccommodationStage />
          <CommunityStage />
        </>
      )}
      
      {/* Traveler-specific sections */}
      {isTraveler && (
        <>
          <PartnerBenefits />
          <VisaRemindersTraveler />
          <CommunityAccessTraveler />
          <OfficialPartnershipsTraveler />
          <MediaFeaturesTraveler />
          <PricingTraveler />
        </>
      )}
      
      {/* Nomad-specific shared sections */}
      {isNomad && (
        <>
          <OfficialPartnershipsNew />
          <MediaFeatures />
          <SuccessStoriesNew />
          <EverythingIncluded />
        </>
      )}
      
      {isNomad && <SingleCTA />}
      
      {/* FAQ - Different for each type */}
      {isNomad && <FAQ />}
      {isTraveler && <FAQTraveler />}
      
      {/* Footer - Different for each type */}
      {isNomad && <Footer />}
      {isTraveler && <FooterTraveler />}
    </div>
  );
}

export default function LandingPage() {
  return (
    <TravelerTypeProvider>
      <LandingPageContent />
    </TravelerTypeProvider>
  );
}
