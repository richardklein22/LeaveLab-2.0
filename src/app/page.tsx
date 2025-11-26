/**
 * Home Page - Visa Tracker
 */

import { VisaTrackerDashboard } from '@/features/visa-tracker/components/VisaTrackerDashboard';

export const metadata = {
  title: 'Thailand Visa Tracker | LeaveLab',
  description: 'Track your Thailand visa status',
};

export default function HomePage() {
  return <VisaTrackerDashboard />;
}
