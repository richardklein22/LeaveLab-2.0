/**
 * Visa Tracker Page
 * Accessible route: /visa-tracker
 */

import { VisaTrackerDashboard } from '@/features/visa-tracker';

export const metadata = {
  title: 'Thailand Visa Tracker | LeaveLab',
  description: 'Track your Thailand visa status, monitor remaining days, and never miss your extension deadline',
};

export default function VisaTrackerPage() {
  return <VisaTrackerDashboard />;
}
