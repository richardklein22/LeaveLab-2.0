/**
 * Visa Tracker Feature - Exports
 */

// Components
export { VisaTrackerDashboard } from './components/VisaTrackerDashboard';
export { VisaStatusCard } from './components/VisaStatusCard';
export { CreateEntryForm } from './components/CreateEntryForm';
export { ExtensionCard } from './components/ExtensionCard';

// Hooks
export { useVisaTracker } from './hooks/useVisaTracker';
export { useVisaCalculation } from './hooks/useVisaCalculation';

// Types
export type {
  VisaType,
  PassportCountry,
  VisaTrackerEntry,
  VisaCalculation,
  CreateVisaEntryInput,
  UpdateVisaEntryInput,
} from './types';

// Constants
export {
  VISA_EXEMPTION_RULES,
  VISA_TYPE_LABELS,
  VISA_TYPE_DURATIONS,
  PASSPORT_COUNTRIES,
} from './constants/visa-rules';

// Utilities
export {
  calculateDaysBetween,
  addDays,
  getInitialStayDays,
  getExtensionDays,
  calculateVisaStatus,
  formatDate,
  formatDateTime,
  getStatusColor,
  getStatusMessage,
  validateEntryDate,
} from './lib/visa-calculations';
