/**
 * Simplified Visa Tracker API Routes
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: entries } = await supabase
      .from('visa_tracker_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false });

    const transformedEntries = entries?.map((entry) => ({
      id: entry.id,
      userId: entry.user_id,
      country: entry.country,
      visaType: entry.visa_type,
      passportCountry: entry.passport_country,
      entryDate: entry.entry_date,
      exitDate: entry.exit_date,
      initialStayDays: entry.initial_stay_days,
      extensionDays: entry.extension_days || 0,
      hasExtended: entry.has_extended,
      extensionDate: entry.extension_date,
      notes: entry.notes,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at,
    }));

    return NextResponse.json({ entries: transformedEntries || [] });
  } catch (error) {
    console.error('Error in GET /api/v1/visa-tracker:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { visaType, passportCountry, entryDate } = body;

    if (!visaType || !entryDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simple: UK gets 60 days, others get 30 days
    const initialStayDays = passportCountry === 'UK' ? 60 : 30;

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

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/v1/visa-tracker:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
