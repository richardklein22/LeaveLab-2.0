// Health check endpoint
import { NextResponse } from 'next/server';
import { isStripeConfigured, isSupabaseConfigured } from '@/lib/utils/fallback';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      stripe: isStripeConfigured(),
      supabase: isSupabaseConfigured(),
    },
    environment: process.env.NODE_ENV,
  });
}
