/**
 * Visa Tracker API Routes (Single Entry)
 * PATCH /api/v1/visa-tracker/[id] - Update a visa entry
 * DELETE /api/v1/visa-tracker/[id] - Delete a visa entry
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getExtensionDays } from '@/features/visa-tracker/lib/visa-calculations';
import type { VisaType, PassportCountry } from '@/features/visa-tracker/types';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: RouteParams) {
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

    const { id } = params;

    // Parse request body
    const body = await request.json();
    const { extensionDate, exitDate, notes } = body;

    // Fetch existing entry
    const { data: existingEntry, error: fetchError } = await supabase
      .from('visa_tracker_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingEntry) {
      return NextResponse.json({ error: 'Visa entry not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    if (extensionDate !== undefined) {
      const extensionDaysAvailable = getExtensionDays(
        existingEntry.visa_type as VisaType,
        existingEntry.passport_country as PassportCountry | undefined
      );

      updateData.extension_date = extensionDate;
      updateData.has_extended = true;
      updateData.extension_days = extensionDaysAvailable;
    }

    if (exitDate !== undefined) {
      updateData.exit_date = exitDate;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Update entry
    const { data: entry, error: updateError } = await supabase
      .from('visa_tracker_entries')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating visa entry:', updateError);
      return NextResponse.json(
        { error: 'Failed to update visa entry' },
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

    return NextResponse.json({ entry: transformedEntry });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/v1/visa-tracker/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
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

    const { id } = params;

    // Delete entry
    const { error: deleteError } = await supabase
      .from('visa_tracker_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting visa entry:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete visa entry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/v1/visa-tracker/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
