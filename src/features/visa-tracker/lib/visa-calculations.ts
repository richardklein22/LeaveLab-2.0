/**
 * Visa calculation helpers for Thailand visa tracking
 */

import type {
  VisaCalculation,
  VisaTrackerEntry,
  PassportCountry,
  VisaType,
} from '../types';
import { VISA_EXEMPTION_RULES, VISA_TYPE_DURATIONS } from '../constants/visa-rules';

/**
 * Calculate days between two dates
 */
export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Reset time to start of day for accurate day calculation
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return Math.floor((end.getTime() - start.getTime()) / msPerDay);
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get initial stay duration for a visa type and passport country
 */
export function getInitialStayDays(
  visaType: VisaType,
  passportCountry?: PassportCountry
): number {
  if (visaType === 'visa_exemption' && passportCountry) {
    const rule = VISA_EXEMPTION_RULES[passportCountry];
    return rule?.initialDays || 60;
  }

  return VISA_TYPE_DURATIONS[visaType] || 30;
}

/**
 * Get extension days available for a visa type
 */
export function getExtensionDays(
  visaType: VisaType,
  passportCountry?: PassportCountry
): number {
  if (visaType === 'visa_exemption' && passportCountry) {
    const rule = VISA_EXEMPTION_RULES[passportCountry];
    return rule?.extensionDays || 30;
  }

  // Most visa types can be extended for 30 days
  return 30;
}

/**
 * Calculate visa status and remaining days
 */
export function calculateVisaStatus(
  entry: VisaTrackerEntry,
  currentDate: Date = new Date()
): VisaCalculation {
  const entryDate = new Date(entry.entryDate);
  const daysElapsed = calculateDaysBetween(entryDate, currentDate);

  // Calculate initial expiry date
  const initialExpiryDate = addDays(entryDate, entry.initialStayDays);

  // Determine if extension is available
  const extensionDays = getExtensionDays(entry.visaType, entry.passportCountry);
  const canExtend = !entry.hasExtended && extensionDays > 0;

  // Calculate extension deadline (usually must extend before initial period expires)
  const extensionDeadline = canExtend ? initialExpiryDate : undefined;

  // Calculate final expiry date
  const totalDays = entry.hasExtended
    ? entry.initialStayDays + (entry.extensionDays || 0)
    : entry.initialStayDays;
  const finalExpiryDate = addDays(entryDate, totalDays);

  // Calculate days remaining
  const daysRemaining = calculateDaysBetween(currentDate, finalExpiryDate);

  // Determine status flags
  const isExpired = daysRemaining < 0;
  const isNearingExpiry = daysRemaining <= 7 && daysRemaining >= 0;

  return {
    entryDate,
    currentDate,
    daysElapsed,
    daysRemaining: Math.max(0, daysRemaining),
    initialExpiryDate,
    canExtend,
    extensionDeadline,
    hasExtended: entry.hasExtended,
    finalExpiryDate,
    isExpired,
    isNearingExpiry,
  };
}

/**
 * Format date for display (British format: DD/MM/YYYY)
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Format datetime for display (British format with time)
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(date));
}

/**
 * Get status color based on days remaining
 */
export function getStatusColor(daysRemaining: number, isExpired: boolean): string {
  if (isExpired) return 'text-brand-red';
  if (daysRemaining <= 7) return 'text-brand-accent-orange';
  if (daysRemaining <= 30) return 'text-brand-accent-cyan';
  return 'text-green-400';
}

/**
 * Get status badge variant
 */
export function getStatusBadgeVariant(daysRemaining: number, isExpired: boolean): 'destructive' | 'default' | 'secondary' {
  if (isExpired) return 'destructive';
  if (daysRemaining <= 7) return 'destructive';
  return 'default';
}

/**
 * Get status message
 */
export function getStatusMessage(calculation: VisaCalculation): string {
  if (calculation.isExpired) {
    return 'Your visa has expired. You must leave Thailand or face penalties.';
  }

  if (calculation.isNearingExpiry) {
    return `Your visa expires in ${calculation.daysRemaining} days. ${
      calculation.canExtend
        ? 'Visit an immigration office to extend your stay.'
        : 'Please prepare to leave Thailand.'
    }`;
  }

  if (calculation.canExtend && calculation.daysRemaining <= 30) {
    return `You have ${calculation.daysRemaining} days remaining. You can extend for ${
      getExtensionDays(
        'visa_exemption' as VisaType,
        'UK' as PassportCountry
      )
    } additional days at an immigration office.`;
  }

  return `You have ${calculation.daysRemaining} days remaining on your visa.`;
}

/**
 * Validate entry date is not in the future
 */
export function validateEntryDate(entryDate: Date): boolean {
  const now = new Date();
  return entryDate <= now;
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}
