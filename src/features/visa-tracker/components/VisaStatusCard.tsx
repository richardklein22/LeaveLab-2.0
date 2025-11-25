/**
 * Visa Status Card - Displays current visa status and days remaining
 */

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { VisaTrackerEntry, VisaCalculation } from '../types';
import {
  formatDate,
  getStatusColor,
  getStatusBadgeVariant,
  getStatusMessage,
} from '../lib/visa-calculations';
import { VISA_TYPE_LABELS } from '../constants/visa-rules';
import { cn } from '@/lib/utils';

interface VisaStatusCardProps {
  entry: VisaTrackerEntry;
  calculation: VisaCalculation;
}

export function VisaStatusCard({ entry, calculation }: VisaStatusCardProps) {
  const statusColor = getStatusColor(calculation.daysRemaining, calculation.isExpired);
  const badgeVariant = getStatusBadgeVariant(calculation.daysRemaining, calculation.isExpired);

  return (
    <Card className="glass-red border-brand-red/30 p-6 card-3d transition-all duration-300 hover:border-brand-red/50">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Thailand Visa Status</h3>
            <p className="text-sm text-white/60 mt-1">
              {VISA_TYPE_LABELS[entry.visaType]}
              {entry.passportCountry && ` • ${entry.passportCountry} Passport`}
            </p>
          </div>
          <Badge variant={badgeVariant} className="text-xs">
            {calculation.isExpired ? 'EXPIRED' : 'ACTIVE'}
          </Badge>
        </div>

        {/* Days Remaining - Large Display */}
        <div className="py-6 text-center">
          <div className={cn('text-7xl font-black animate-pulse-scale', statusColor)}>
            {calculation.daysRemaining}
          </div>
          <div className="text-xl font-semibold text-white/80 mt-2">
            {calculation.daysRemaining === 1 ? 'Day' : 'Days'} Remaining
          </div>
        </div>

        {/* Status Message */}
        <Alert
          className={cn(
            'border-2',
            calculation.isExpired
              ? 'border-brand-red bg-brand-red/10'
              : calculation.isNearingExpiry
              ? 'border-brand-accent-orange bg-brand-accent-orange/10'
              : 'border-brand-accent-cyan bg-brand-accent-cyan/10'
          )}
        >
          {calculation.isExpired ? (
            <AlertTriangle className="h-4 w-4 text-brand-red" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-brand-accent-cyan" />
          )}
          <AlertDescription className="text-white">
            {getStatusMessage(calculation)}
          </AlertDescription>
        </Alert>

        {/* Entry Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
              <CalendarDays className="h-4 w-4" />
              <span>Entry Date</span>
            </div>
            <div className="text-white font-semibold">
              {formatDate(calculation.entryDate)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
              <CalendarDays className="h-4 w-4" />
              <span>Expiry Date</span>
            </div>
            <div className="text-white font-semibold">
              {formatDate(calculation.finalExpiryDate)}
            </div>
          </div>
        </div>

        {/* Extension Info */}
        {calculation.canExtend && (
          <div className="pt-4 border-t border-white/10">
            <div className="text-sm text-white/80">
              <span className="font-semibold text-brand-accent-cyan">Extension Available:</span>
              <br />
              You can extend your stay for an additional 30 days at any immigration office.
              <br />
              <span className="text-white/60">
                Must extend before: {formatDate(calculation.initialExpiryDate)}
              </span>
            </div>
          </div>
        )}

        {calculation.hasExtended && (
          <div className="pt-4 border-t border-white/10">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              Extended
            </Badge>
            <span className="text-sm text-white/60 ml-2">
              Your visa has been extended by {entry.extensionDays} days
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
