/**
 * PricingToggle Component
 * 
 * Toggle switch for selecting between monthly and annual billing cycles.
 * Shows "Save 20%" badge on annual option.
 */

'use client';

import { cn } from '@/lib/utils';
import { BILLING_CYCLES, type BillingCycle } from '../constants/tiers';

interface PricingToggleProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
  className?: string;
}

export function PricingToggle({ value, onChange, className }: PricingToggleProps) {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      {/* Monthly Label */}
      <button
        type="button"
        onClick={() => onChange(BILLING_CYCLES.MONTHLY)}
        className={cn(
          'text-lg font-bold transition-all',
          'min-h-[44px] min-w-[44px] px-6 py-3 rounded-xl',
          value === BILLING_CYCLES.MONTHLY
            ? 'text-white bg-white/10'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        )}
        aria-pressed={value === BILLING_CYCLES.MONTHLY}
      >
        Monthly
      </button>

      {/* Toggle Switch */}
      <div
        role="switch"
        aria-checked={value === BILLING_CYCLES.ANNUAL}
        className={cn(
          'relative inline-flex h-10 w-20 items-center rounded-full transition-all cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark-950',
          value === BILLING_CYCLES.ANNUAL
            ? 'bg-brand-red animate-glow'
            : 'bg-white/10'
        )}
        onClick={() =>
          onChange(
            value === BILLING_CYCLES.ANNUAL
              ? BILLING_CYCLES.MONTHLY
              : BILLING_CYCLES.ANNUAL
          )
        }
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(
              value === BILLING_CYCLES.ANNUAL
                ? BILLING_CYCLES.MONTHLY
                : BILLING_CYCLES.ANNUAL
            );
          }
        }}
      >
        <span
          className={cn(
            'inline-block h-8 w-8 transform rounded-full bg-white transition-all shadow-lg',
            value === BILLING_CYCLES.ANNUAL ? 'translate-x-10' : 'translate-x-1'
          )}
        />
      </div>

      {/* Annual Label with Badge */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(BILLING_CYCLES.ANNUAL)}
          className={cn(
            'text-lg font-bold transition-all',
            'min-h-[44px] min-w-[44px] px-6 py-3 rounded-xl',
            value === BILLING_CYCLES.ANNUAL
              ? 'text-white bg-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          )}
          aria-pressed={value === BILLING_CYCLES.ANNUAL}
        >
          Annual
        </button>
        <span className="inline-flex items-center rounded-full bg-brand-accent/20 px-3 py-1.5 text-sm font-bold text-brand-accent animate-pulse-scale">
          Save 20%
        </span>
      </div>
    </div>
  );
}

