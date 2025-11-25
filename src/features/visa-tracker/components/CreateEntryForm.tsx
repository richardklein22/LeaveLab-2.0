/**
 * Create Entry Form - Form to create a new visa tracker entry
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlaneTakeoff, AlertCircle } from 'lucide-react';
import type { VisaType, PassportCountry, CreateVisaEntryInput } from '../types';
import { VISA_TYPE_LABELS, PASSPORT_COUNTRIES } from '../constants/visa-rules';
import { getInitialStayDays, validateEntryDate } from '../lib/visa-calculations';

interface CreateEntryFormProps {
  onSubmit: (input: CreateVisaEntryInput) => Promise<void>;
  loading?: boolean;
}

export function CreateEntryForm({ onSubmit, loading = false }: CreateEntryFormProps) {
  const [visaType, setVisaType] = useState<VisaType>('visa_exemption');
  const [passportCountry, setPassportCountry] = useState<PassportCountry>('UK');
  const [entryDate, setEntryDate] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!entryDate) {
      setError('Please select an entry date');
      return;
    }

    // Combine date and time
    const dateTimeString = entryTime
      ? `${entryDate}T${entryTime}`
      : `${entryDate}T12:00`;
    const entryDateTime = new Date(dateTimeString);

    // Validate entry date
    if (!validateEntryDate(entryDateTime)) {
      setError('Entry date cannot be in the future');
      return;
    }

    const input: CreateVisaEntryInput = {
      visaType,
      entryDate: entryDateTime,
      notes: notes.trim() || undefined,
    };

    // Add passport country for visa exemption
    if (visaType === 'visa_exemption') {
      input.passportCountry = passportCountry;
    }

    try {
      await onSubmit(input);
      // Reset form
      setEntryDate('');
      setEntryTime('');
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create entry');
    }
  };

  const estimatedDays = getInitialStayDays(
    visaType,
    visaType === 'visa_exemption' ? passportCountry : undefined
  );

  return (
    <Card className="glass border-white/10 p-6 card-3d">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <PlaneTakeoff className="h-6 w-6 text-brand-red" />
          <h3 className="text-2xl font-bold text-white">Record Thailand Entry</h3>
        </div>

        {error && (
          <Alert className="border-brand-red bg-brand-red/10">
            <AlertCircle className="h-4 w-4 text-brand-red" />
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}

        {/* Visa Type */}
        <div className="space-y-2">
          <Label htmlFor="visaType" className="text-white">
            Visa Type
          </Label>
          <Select value={visaType} onValueChange={(value) => setVisaType(value as VisaType)}>
            <SelectTrigger id="visaType" className="bg-brand-dark-800 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-brand-dark-900 border-white/20">
              {Object.entries(VISA_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-white">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Passport Country (only for visa exemption) */}
        {visaType === 'visa_exemption' && (
          <div className="space-y-2">
            <Label htmlFor="passportCountry" className="text-white">
              Passport Country
            </Label>
            <Select
              value={passportCountry}
              onValueChange={(value) => setPassportCountry(value as PassportCountry)}
            >
              <SelectTrigger id="passportCountry" className="bg-brand-dark-800 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-brand-dark-900 border-white/20">
                {PASSPORT_COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country} className="text-white">
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-white/60">
              Initial stay: {estimatedDays} days + 30 day extension available
            </p>
          </div>
        )}

        {/* Entry Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="entryDate" className="text-white">
              Entry Date
            </Label>
            <Input
              id="entryDate"
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              className="bg-brand-dark-800 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryTime" className="text-white">
              Entry Time (Optional)
            </Label>
            <Input
              id="entryTime"
              type="time"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
              className="bg-brand-dark-800 border-white/20 text-white"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-white">
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any relevant notes about your entry..."
            rows={3}
            className="bg-brand-dark-800 border-white/20 text-white placeholder:text-white/40"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-red hover:bg-brand-red/80 text-white font-semibold"
        >
          {loading ? 'Creating Entry...' : 'Create Entry'}
        </Button>
      </form>
    </Card>
  );
}
