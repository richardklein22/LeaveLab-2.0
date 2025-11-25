/**
 * Thailand Visa Exemption Rules by Country
 * Updated as of 2025 - UK and many countries get 60 days visa exemption + 30 day extension
 */

import type { PassportCountry, VisaExemptionRule, VisaType } from '../types';

export const VISA_EXEMPTION_RULES: Record<PassportCountry, VisaExemptionRule> = {
  'UK': {
    country: 'UK',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'USA': {
    country: 'USA',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Australia': {
    country: 'Australia',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Canada': {
    country: 'Canada',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Germany': {
    country: 'Germany',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'France': {
    country: 'France',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Italy': {
    country: 'Italy',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Spain': {
    country: 'Spain',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Netherlands': {
    country: 'Netherlands',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Belgium': {
    country: 'Belgium',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Switzerland': {
    country: 'Switzerland',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Austria': {
    country: 'Austria',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Sweden': {
    country: 'Sweden',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Norway': {
    country: 'Norway',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Denmark': {
    country: 'Denmark',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Finland': {
    country: 'Finland',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Ireland': {
    country: 'Ireland',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'New Zealand': {
    country: 'New Zealand',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Singapore': {
    country: 'Singapore',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Japan': {
    country: 'Japan',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'South Korea': {
    country: 'South Korea',
    initialDays: 60,
    extensionDays: 30,
    totalMaxDays: 90,
  },
  'Other': {
    country: 'Other',
    initialDays: 30,
    extensionDays: 30,
    totalMaxDays: 60,
  },
};

export const VISA_TYPE_LABELS: Record<VisaType, string> = {
  visa_exemption: 'Visa Exemption',
  tourist_visa_single: 'Tourist Visa (Single Entry)',
  tourist_visa_multiple: 'Tourist Visa (Multiple Entry)',
  education_visa: 'Education Visa (ED)',
  business_visa: 'Business Visa (B)',
  other: 'Other Visa Type',
};

export const VISA_TYPE_DURATIONS: Record<VisaType, number> = {
  visa_exemption: 60, // Default, varies by country
  tourist_visa_single: 60,
  tourist_visa_multiple: 60,
  education_visa: 90,
  business_visa: 90,
  other: 30,
};

export const PASSPORT_COUNTRIES: PassportCountry[] = [
  'UK',
  'USA',
  'Australia',
  'Canada',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Ireland',
  'New Zealand',
  'Singapore',
  'Japan',
  'South Korea',
  'Other',
];
