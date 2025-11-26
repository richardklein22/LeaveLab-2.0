/**
 * Minimal Visa Tracker Dashboard
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VisaEntry {
  id: string;
  entryDate: string;
  initialStayDays: number;
  visaType: string;
}

export function VisaTrackerDashboard() {
  const [entries, setEntries] = useState<VisaEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [entryDate, setEntryDate] = useState('');

  // Fetch entries
  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const response = await fetch('/api/v1/visa-tracker');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/v1/visa-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visaType: 'visa_exemption',
          passportCountry: 'UK',
          entryDate: new Date(entryDate).toISOString(),
        }),
      });

      if (response.ok) {
        await fetchEntries();
        setEntryDate('');
      }
    } catch (error) {
      console.error('Failed to create entry:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateDaysRemaining(entry: VisaEntry): number {
    const entryTime = new Date(entry.entryDate).getTime();
    const expiryTime = entryTime + (entry.initialStayDays * 24 * 60 * 60 * 1000);
    const now = Date.now();
    const daysRemaining = Math.floor((expiryTime - now) / (24 * 60 * 60 * 1000));
    return Math.max(0, daysRemaining);
  }

  const currentEntry = entries[0];
  const daysRemaining = currentEntry ? calculateDaysRemaining(currentEntry) : null;

  return (
    <div className="min-h-screen bg-brand-dark py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Thailand Visa Tracker
          </h1>
          <p className="text-white/70">
            Track your visa days remaining
          </p>
        </div>

        {/* Current Status */}
        {currentEntry && daysRemaining !== null && (
          <Card className="bg-brand-dark-900 border-brand-red/30 p-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-brand-red mb-4">
                {daysRemaining}
              </div>
              <div className="text-xl text-white/80">
                Days Remaining
              </div>
              <div className="mt-4 text-sm text-white/60">
                Entry: {new Date(currentEntry.entryDate).toLocaleDateString()}
              </div>
            </div>
          </Card>
        )}

        {/* Create Entry Form */}
        {!currentEntry && (
          <Card className="bg-brand-dark-900 border-white/10 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                Record Thailand Entry
              </h2>

              <div>
                <Label className="text-white">Entry Date</Label>
                <Input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="bg-brand-dark-800 border-white/20 text-white mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-red hover:bg-brand-red/80 text-white"
              >
                {loading ? 'Creating...' : 'Create Entry'}
              </Button>
            </form>
          </Card>
        )}

        {/* Info */}
        <Card className="bg-brand-dark-900/50 border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Information
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• UK passport: 60 days visa exemption</li>
            <li>• Can extend for 30 days at immigration office</li>
            <li>• This is for tracking purposes only</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
