/**
 * Minimal Visa Tracker Dashboard - Debug Version
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
}

export function VisaTrackerDashboard() {
  const [entry, setEntry] = useState<VisaEntry | null>(null);
  const [entryDate, setEntryDate] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    console.log('Loading from localStorage...');
    const saved = localStorage.getItem('visaEntry');
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        console.log('Loaded entry:', loaded);
        setEntry(loaded);
      } catch (e) {
        console.error('Failed to load:', e);
      }
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Form submitted with date:', entryDate);

    if (!entryDate) {
      alert('Please select a date');
      return;
    }

    const newEntry: VisaEntry = {
      id: Date.now().toString(),
      entryDate: entryDate,
      initialStayDays: 60,
    };

    console.log('Creating entry:', newEntry);

    // Save to state
    setEntry(newEntry);

    // Save to localStorage
    localStorage.setItem('visaEntry', JSON.stringify(newEntry));

    console.log('Entry saved!');
    alert('Entry created! Refresh if countdown doesn\'t appear.');
  }

  function calculateDaysRemaining(): number {
    if (!entry) return 0;

    const entryTime = new Date(entry.entryDate).getTime();
    const expiryTime = entryTime + (entry.initialStayDays * 24 * 60 * 60 * 1000);
    const now = Date.now();
    const daysRemaining = Math.floor((expiryTime - now) / (24 * 60 * 60 * 1000));

    console.log('Days remaining:', daysRemaining);
    return Math.max(0, daysRemaining);
  }

  function handleReset() {
    console.log('Resetting...');
    setEntry(null);
    localStorage.removeItem('visaEntry');
    setEntryDate('');
    alert('Reset complete!');
  }

  const daysRemaining = entry ? calculateDaysRemaining() : null;

  console.log('Current state:', { entry, daysRemaining });

  return (
    <div className="min-h-screen bg-brand-dark py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Thailand Visa Tracker
          </h1>
          <p className="text-white/70">
            UK Passport - 60 days visa exemption
          </p>
        </div>

        {/* Debug Info */}
        <Card className="bg-blue-900/20 border-blue-500/30 p-4">
          <div className="text-xs text-blue-300 font-mono">
            <div>Entry exists: {entry ? 'YES' : 'NO'}</div>
            <div>Entry date: {entry?.entryDate || 'none'}</div>
            <div>Days remaining: {daysRemaining ?? 'N/A'}</div>
          </div>
        </Card>

        {/* Countdown Display */}
        {entry && daysRemaining !== null ? (
          <Card className="bg-brand-dark-900 border-brand-red/30 p-8">
            <div className="text-center space-y-4">
              <div className="text-8xl font-bold text-brand-red">
                {daysRemaining}
              </div>
              <div className="text-3xl text-white">
                Days Remaining
              </div>
              <div className="text-white/60 space-y-1">
                <div>Entry: {new Date(entry.entryDate).toLocaleDateString('en-GB')}</div>
                <div>Expires: {new Date(new Date(entry.entryDate).getTime() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}</div>
              </div>
              <Button
                onClick={handleReset}
                className="mt-4 bg-white/10 hover:bg-white/20 text-white"
              >
                Reset / Start Over
              </Button>
            </div>
          </Card>
        ) : (
          /* Entry Form */
          <Card className="bg-brand-dark-900 border-white/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-3xl font-bold text-white text-center">
                When did you arrive in Thailand?
              </h2>

              <div className="space-y-2">
                <Label className="text-white text-lg">Entry Date</Label>
                <Input
                  type="date"
                  value={entryDate}
                  onChange={(e) => {
                    console.log('Date changed:', e.target.value);
                    setEntryDate(e.target.value);
                  }}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="bg-brand-dark-800 border-brand-red/30 text-white text-lg h-14"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red/80 text-white text-xl font-bold h-16"
              >
                Start Tracking →
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
            <li>✓ 60 days visa exemption on entry</li>
            <li>✓ Can extend 30 days at immigration</li>
            <li>✓ Data saved in browser only</li>
            <li>✓ Check browser console for debug info</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
