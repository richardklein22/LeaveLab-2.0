/**
 * Custom hook for calculating visa status and days remaining
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import type { VisaTrackerEntry, VisaCalculation } from '../types';
import { calculateVisaStatus } from '../lib/visa-calculations';

export function useVisaCalculation(entry: VisaTrackerEntry | null) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update current date every minute for accurate countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const calculation = useMemo<VisaCalculation | null>(() => {
    if (!entry) return null;
    return calculateVisaStatus(entry, currentDate);
  }, [entry, currentDate]);

  return calculation;
}
