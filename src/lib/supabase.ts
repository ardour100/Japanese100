import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a placeholder client for build time if env vars are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time
    console.warn('Supabase environment variables not found. Creating mock client for build.');
    return createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
};

export const supabase = createSupabaseClient();

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');
};

// Database types
export interface UserProgress {
  id: string;
  user_id: string;
  kanji_id: number;
  progress_level: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_progress: {
        Row: UserProgress;
        Insert: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}