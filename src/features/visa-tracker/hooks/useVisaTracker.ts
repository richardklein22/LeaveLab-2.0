/**
 * Custom hook for managing visa tracker entries
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { VisaTrackerEntry, CreateVisaEntryInput, UpdateVisaEntryInput } from '../types';

export function useVisaTracker() {
  const [entries, setEntries] = useState<VisaTrackerEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<VisaTrackerEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all visa tracker entries
   */
  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/visa-tracker');

      if (!response.ok) {
        throw new Error('Failed to fetch visa entries');
      }

      const data = await response.json();
      setEntries(data.entries || []);

      // Set the most recent entry as current
      if (data.entries && data.entries.length > 0) {
        const activeEntry = data.entries.find((e: VisaTrackerEntry) => !e.exitDate);
        setCurrentEntry(activeEntry || data.entries[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch visa entries');
      console.error('Error fetching visa entries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new visa tracker entry
   */
  const createEntry = useCallback(async (input: CreateVisaEntryInput) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/visa-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create visa entry');
      }

      const data = await response.json();
      setEntries((prev) => [data.entry, ...prev]);
      setCurrentEntry(data.entry);

      return data.entry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create visa entry';
      setError(errorMessage);
      console.error('Error creating visa entry:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing visa tracker entry
   */
  const updateEntry = useCallback(async (id: string, input: UpdateVisaEntryInput) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/visa-tracker/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update visa entry');
      }

      const data = await response.json();
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? data.entry : entry))
      );

      if (currentEntry?.id === id) {
        setCurrentEntry(data.entry);
      }

      return data.entry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update visa entry';
      setError(errorMessage);
      console.error('Error updating visa entry:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentEntry]);

  /**
   * Delete a visa tracker entry
   */
  const deleteEntry = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/visa-tracker/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete visa entry');
      }

      setEntries((prev) => prev.filter((entry) => entry.id !== id));

      if (currentEntry?.id === id) {
        const remaining = entries.filter((entry) => entry.id !== id);
        setCurrentEntry(remaining[0] || null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete visa entry';
      setError(errorMessage);
      console.error('Error deleting visa entry:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentEntry, entries]);

  /**
   * Record visa extension
   */
  const recordExtension = useCallback(async (id: string, extensionDate: Date) => {
    return updateEntry(id, { extensionDate });
  }, [updateEntry]);

  /**
   * Record exit from Thailand
   */
  const recordExit = useCallback(async (id: string, exitDate: Date) => {
    return updateEntry(id, { exitDate });
  }, [updateEntry]);

  // Fetch entries on mount
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    currentEntry,
    loading,
    error,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    recordExtension,
    recordExit,
  };
}
