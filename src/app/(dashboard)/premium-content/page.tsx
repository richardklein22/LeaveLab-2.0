/**
 * Premium Content Demo Page
 * 
 * Demonstrates tier-based access control using subscription gates.
 * Only users with Premium tier can access this content.
 */

import { Metadata } from 'next';
import { PremiumContentClient } from './PremiumContentClient';

export const metadata: Metadata = {
  title: 'Premium Content | LeaveLab',
  description: 'Exclusive premium content for LeaveLab Premium members',
};

export default function PremiumContentPage() {
  return <PremiumContentClient />;
}

