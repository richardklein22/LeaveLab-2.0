/**
 * Visa Tracker API Routes
 * GET /api/v1/visa-tracker - Fetch all visa entries for current user
 * POST /api/v1/visa-tracker - Create a new visa entry
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInitialStayDays } from '@/features/visa-tracker/lib/visa-calculations';
import type { VisaType, PassportCountry } from '@/features/visa-tracker/types';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    // Fetch visa tracker entries
    const { data: entries, error: fetchError } = await supabase
      .from('visa_tracker_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false });

    if (fetchError) {
      console.error('Error fetching visa entries:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch visa entries' },
        { status: 500 }
      );
    }

    // Transform snake_case to camelCase
    const transformedEntries = entries?.map((entry) => ({
      id: entry.id,
      userId: entry.user_id,
      country: entry.country,
      visaType: entry.visa_type as VisaType,
      passportCountry: entry.passport_country as PassportCountry | undefined,
      entryDate: new Date(entry.entry_date),
      exitDate: entry.exit_date ? new Date(entry.exit_date) : undefined,
      initialStayDays: entry.initial_stay_days,
      extensionDays: entry.extension_days || 0,
      hasExtended: entry.has_extended,
      extensionDate: entry.extension_date ? new Date(entry.extension_date) : undefined,
      notes: entry.notes,
      createdAt: new Date(entry.created_at),
      updatedAt: new Date(entry.updated_at),
    }));

    return NextResponse.json({ entries: transformedEntries || [] });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/visa-tracker:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { visaType, passportCountry, entryDate, notes } = body;

    // Validate required fields
    if (!visaType || !entryDate) {
      return NextResponse.json(
        { error: 'Missing required fields: visaType, entryDate' },
        { status: 400 }
      );
    }

    // Calculate initial stay days
    const initialStayDays = getInitialStayDays(
      visaType as VisaType,
      passportCountry as PassportCountry | undefined
    );

    // Insert new entry
    const { data: entry, error: insertError } = await supabase
      .from('visa_tracker_entries')
      .insert({
        user_id: user.id,
        country: 'Thailand',
        visa_type: visaType,
        passport_country: passportCountry,
        entry_date: entryDate,
        initial_stay_days: initialStayDays,
        extension_days: 0,
        has_extended: false,
        notes: notes || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating visa entry:', insertError);
      return NextResponse.json(
        { error: 'Failed to create visa entry' },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedEntry = {
      id: entry.id,
      userId: entry.user_id,
      country: entry.country,
      visaType: entry.visa_type as VisaType,
      passportCountry: entry.passport_country as PassportCountry | undefined,
      entryDate: new Date(entry.entry_date),
      exitDate: entry.exit_date ? new Date(entry.exit_date) : undefined,
      initialStayDays: entry.initial_stay_days,
      extensionDays: entry.extension_days || 0,
      hasExtended: entry.has_extended,
      extensionDate: entry.extension_date ? new Date(entry.extension_date) : undefined,
      notes: entry.notes,
      createdAt: new Date(entry.created_at),
      updatedAt: new Date(entry.updated_at),
    };

    return NextResponse.json({ entry: transformedEntry }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/visa-tracker:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
