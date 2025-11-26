/**
 * Minimal Visa Tracker Dashboard - No Auth Required
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
  const [error, setError] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('visaTrackerEntries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load entries:', e);
      }
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('visaTrackerEntries', JSON.stringify(entries));
    }
  }, [entries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!entryDate) {
      setError('Please select an entry date');
      setLoading(false);
      return;
    }

    try {
      const newEntry: VisaEntry = {
        id: Date.now().toString(),
        entryDate: new Date(entryDate).toISOString(),
        initialStayDays: 60, // UK passport
        visaType: 'visa_exemption',
      };

      setEntries([newEntry, ...entries]);
      setEntryDate('');
    } catch (err) {
      setError('Failed to create entry');
      console.error('Error:', err);
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

  function handleReset() {
    if (confirm('Delete all entries?')) {
      setEntries([]);
      localStorage.removeItem('visaTrackerEntries');
    }
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
            Track your visa days remaining (UK Passport - 60 days)
          </p>
        </div>

        {/* Current Status */}
        {currentEntry && daysRemaining !== null && (
          <Card className="bg-brand-dark-900 border-brand-red/30 p-8">
            <div className="text-center">
              <div className="text-7xl font-bold text-brand-red mb-4">
                {daysRemaining}
              </div>
              <div className="text-2xl text-white/80 mb-2">
                Days Remaining
              </div>
              <div className="text-sm text-white/60 mb-4">
                Entry: {new Date(currentEntry.entryDate).toLocaleDateString('en-GB')}
              </div>
              <div className="text-sm text-white/60">
                Expires: {new Date(new Date(currentEntry.entryDate).getTime() + currentEntry.initialStayDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
              </div>
              <Button
                onClick={handleReset}
                variant="outline"
                className="mt-4 border-white/20 text-white hover:bg-white/10"
                size="sm"
              >
                Reset
              </Button>
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

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <Label className="text-white">When did you arrive in Thailand?</Label>
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
                className="w-full bg-brand-red hover:bg-brand-red/80 text-white font-semibold"
              >
                {loading ? 'Creating...' : 'Start Tracking'}
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
            <li>✓ UK passport: 60 days visa exemption</li>
            <li>✓ Can extend for 30 days at immigration office</li>
            <li>✓ Data saved in your browser only</li>
            <li>⚠️ This is for tracking purposes only - verify with official sources</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
