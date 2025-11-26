/**
 * Simplified Visa Tracker Page
 */

import { VisaTrackerDashboard } from '@/features/visa-tracker/components/VisaTrackerDashboard';

export const metadata = {
  title: 'Visa Tracker | LeaveLab',
  description: 'Track your Thailand visa status',
};

export default function VisaTrackerPage() {
  return <VisaTrackerDashboard />;
}
