/**
 * Thailand Visa Tracker Types
 */

export type VisaType =
  | 'visa_exemption'
  | 'tourist_visa_single'
  | 'tourist_visa_multiple'
  | 'education_visa'
  | 'business_visa'
  | 'other';

export type PassportCountry =
  | 'UK'
  | 'USA'
  | 'Australia'
  | 'Canada'
  | 'Germany'
  | 'France'
  | 'Italy'
  | 'Spain'
  | 'Netherlands'
  | 'Belgium'
  | 'Switzerland'
  | 'Austria'
  | 'Sweden'
  | 'Norway'
  | 'Denmark'
  | 'Finland'
  | 'Ireland'
  | 'New Zealand'
  | 'Singapore'
  | 'Japan'
  | 'South Korea'
  | 'Other';

export interface VisaExemptionRule {
  country: PassportCountry;
  initialDays: number;
  extensionDays: number;
  totalMaxDays: number;
}

export interface VisaTrackerEntry {
  id: string;
  userId: string;
  country: string;
  visaType: VisaType;
  passportCountry?: PassportCountry;
  entryDate: Date;
  exitDate?: Date;
  initialStayDays: number;
  extensionDays?: number;
  hasExtended: boolean;
  extensionDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisaCalculation {
  entryDate: Date;
  currentDate: Date;
  daysElapsed: number;
  daysRemaining: number;
  initialExpiryDate: Date;
  canExtend: boolean;
  extensionDeadline?: Date;
  hasExtended: boolean;
  finalExpiryDate: Date;
  isExpired: boolean;
  isNearingExpiry: boolean; // Less than 7 days
}

export interface CreateVisaEntryInput {
  visaType: VisaType;
  passportCountry?: PassportCountry;
  entryDate: Date;
  notes?: string;
}

export interface UpdateVisaEntryInput {
  extensionDate?: Date;
  exitDate?: Date;
  notes?: string;
}
