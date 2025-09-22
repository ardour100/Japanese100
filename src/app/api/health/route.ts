import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabaseConfigured: isSupabaseConfigured(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT || '3000'
  });
}