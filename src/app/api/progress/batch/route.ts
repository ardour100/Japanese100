import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { kanjiIds, userId } = await request.json();

    if (!kanjiIds || !Array.isArray(kanjiIds) || !userId) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    // Fetch progress for specific kanji IDs in batch
    const { data, error } = await supabase
      .from('user_progress')
      .select('kanji_id, progress_level, is_archived')
      .eq('user_id', userId)
      .in('kanji_id', kanjiIds);

    if (error) {
      console.error('Error fetching batch progress:', error);
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }

    // Convert to a map for easier lookup
    const progressMap: Record<number, { progress: number; isArchived: boolean }> = {};

    data?.forEach((item) => {
      progressMap[item.kanji_id] = {
        progress: item.progress_level,
        isArchived: item.is_archived || false
      };
    });

    // Fill in missing kanji with default values
    kanjiIds.forEach((kanjiId: number) => {
      if (!progressMap[kanjiId]) {
        progressMap[kanjiId] = {
          progress: 0,
          isArchived: false
        };
      }
    });

    return NextResponse.json({ progress: progressMap });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}