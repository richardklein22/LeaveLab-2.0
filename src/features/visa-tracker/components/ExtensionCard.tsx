/**
 * Extension Card - UI for recording visa extension
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClockIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { VisaTrackerEntry } from '../types';

interface ExtensionCardProps {
  entry: VisaTrackerEntry;
  onExtend: (extensionDate: Date) => Promise<void>;
  loading?: boolean;
}

export function ExtensionCard({ entry, onExtend, loading = false }: ExtensionCardProps) {
  const [extensionDate, setExtensionDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!extensionDate) {
      setError('Please select an extension date');
      return;
    }

    const date = new Date(extensionDate);

    try {
      await onExtend(date);
      setSuccess(true);
      setExtensionDate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record extension');
    }
  };

  if (entry.hasExtended) {
    return (
      <Card className="glass border-green-500/30 p-6 card-3d">
        <div className="flex items-center gap-3 text-green-400">
          <CheckCircle2 className="h-6 w-6" />
          <div>
            <h4 className="text-lg font-semibold">Extension Recorded</h4>
            <p className="text-sm text-white/60">
              Your visa has been extended by {entry.extensionDays} days
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass border-brand-accent-cyan/30 p-6 card-3d">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <ClockIcon className="h-5 w-5 text-brand-accent-cyan" />
          <h4 className="text-lg font-semibold text-white">Record Extension</h4>
        </div>

        {error && (
          <Alert className="border-brand-red bg-brand-red/10">
            <AlertCircle className="h-4 w-4 text-brand-red" />
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-white">
              Extension recorded successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="extensionDate" className="text-white">
            Extension Date
          </Label>
          <Input
            id="extensionDate"
            type="date"
            value={extensionDate}
            onChange={(e) => setExtensionDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
            className="bg-brand-dark-800 border-white/20 text-white"
          />
          <p className="text-xs text-white/60">
            When did you extend your visa at the immigration office?
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-accent-cyan hover:bg-brand-accent-cyan/80 text-white font-semibold"
        >
          {loading ? 'Recording...' : 'Record Extension'}
        </Button>
      </form>
    </Card>
  );
}
