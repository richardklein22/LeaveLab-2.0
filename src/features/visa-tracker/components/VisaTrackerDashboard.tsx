/**
 * Visa Tracker Dashboard - Main component for visa tracking
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plane, AlertCircle, Plus } from 'lucide-react';
import { useState } from 'react';
import { useVisaTracker } from '../hooks/useVisaTracker';
import { useVisaCalculation } from '../hooks/useVisaCalculation';
import { VisaStatusCard } from './VisaStatusCard';
import { CreateEntryForm } from './CreateEntryForm';
import { ExtensionCard } from './ExtensionCard';
import type { CreateVisaEntryInput } from '../types';

export function VisaTrackerDashboard() {
  const {
    currentEntry,
    loading,
    error,
    createEntry,
    recordExtension,
  } = useVisaTracker();

  const calculation = useVisaCalculation(currentEntry);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateEntry = async (input: CreateVisaEntryInput) => {
    await createEntry(input);
    setShowCreateForm(false);
  };

  const handleRecordExtension = async (extensionDate: Date) => {
    if (!currentEntry) return;
    await recordExtension(currentEntry.id, extensionDate);
  };

  if (loading && !currentEntry) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full bg-white/5" />
        <Skeleton className="h-48 w-full bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-brand-red bg-brand-red/10">
        <AlertCircle className="h-4 w-4 text-brand-red" />
        <AlertDescription className="text-white">{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Plane className="h-8 w-8 text-brand-red animate-float" />
            <h1 className="text-4xl md:text-5xl font-black text-white">
              Thailand Visa Tracker
            </h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Track your visa status, monitor remaining days, and never miss your extension deadline
          </p>
        </div>

        {/* Current Entry Status */}
        {currentEntry && calculation ? (
          <div className="space-y-6">
            <VisaStatusCard entry={currentEntry} calculation={calculation} />

            {/* Extension Card */}
            {calculation.canExtend && (
              <ExtensionCard
                entry={currentEntry}
                onExtend={handleRecordExtension}
                loading={loading}
              />
            )}

            {/* Add New Entry Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                {showCreateForm ? 'Hide Form' : 'Add New Entry'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Plane className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Active Visa Entry</h2>
            <p className="text-white/60 mb-6">
              Create your first entry to start tracking your visa status
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-brand-red hover:bg-brand-red/80 text-white font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Entry
            </Button>
          </div>
        )}

        {/* Create Entry Form */}
        {showCreateForm && (
          <CreateEntryForm onSubmit={handleCreateEntry} loading={loading} />
        )}

        {/* Information Box */}
        <div className="glass rounded-2xl p-6 border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• Most passports receive 60 days visa exemption upon entry to Thailand</li>
            <li>• You can extend for an additional 30 days at any immigration office</li>
            <li>• Extension must be done before your initial 60 days expire</li>
            <li>• Overstaying can result in fines of 500 THB per day</li>
            <li>• This tracker is for informational purposes only - always verify with official sources</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
