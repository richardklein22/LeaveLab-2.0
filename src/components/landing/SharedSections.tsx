'use client';

import { useTravelerType } from '@/contexts/TravelerTypeContext';
import OfficialPartnershipsNew from './OfficialPartnershipsNew';
import MediaFeatures from './MediaFeatures';
import SuccessStoriesNew from './SuccessStoriesNew';
import EverythingIncluded from './EverythingIncluded';
import FAQ from './FAQ';
import Footer from './Footer';
import SingleCTA from './SingleCTA';

export function ThemedOfficialPartnerships() {
  const { travelerType } = useTravelerType();
  return (
    <div className={travelerType === 'traveler' ? 'themed-light' : ''}>
      <OfficialPartnershipsNew />
    </div>
  );
}

export function ThemedMediaFeatures() {
  const { travelerType } = useTravelerType();
  return (
    <div className={travelerType === 'traveler' ? 'themed-light' : ''}>
      <MediaFeatures />
    </div>
  );
}

export function ThemedSuccessStories() {
  const { travelerType } = useTravelerType();
  return (
    <div className={travelerType === 'traveler' ? 'themed-light' : ''}>
      <SuccessStoriesNew />
    </div>
  );
}

export function ThemedEverythingIncluded() {
  const { travelerType } = useTravelerType();
  return (
    <div className={travelerType === 'traveler' ? 'themed-light' : ''}>
      <EverythingIncluded />
    </div>
  );
}

export function ThemedFAQ() {
  const { travelerType } = useTravelerType();
  return (
    <div className={travelerType === 'traveler' ? 'themed-light' : ''}>
      <FAQ />
    </div>
  );
}

export function ThemedFooter() {
  const { travelerType } = useTravelerType();
  return (
    <div className={travelerType === 'traveler' ? 'themed-light' : ''}>
      <Footer />
    </div>
  );
}

export function ThemedSingleCTA() {
  const { travelerType } = useTravelerType();
  if (travelerType === 'traveler') return null;
  return <SingleCTA />;
}

