"use client";

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { useLocalStorageNotes } from '@/hooks/useLocalStorageNotes';
import { isSupabaseConfigured } from '@/lib/supabase';

export const useUnifiedNotes = () => {
  const { isAuthenticated } = useAuth();
  const supabaseNotes = useNotes();
  const localStorageNotes = useLocalStorageNotes();

  // Determine which notes system to use
  const shouldUseSupabase = isAuthenticated && isSupabaseConfigured();
  const activeNotesHook = shouldUseSupabase ? supabaseNotes : localStorageNotes;

  // Handle migration from localStorage to Supabase when user signs in
  useEffect(() => {
    if (shouldUseSupabase && localStorageNotes.notes.length > 0) {
      // Check if we need to migrate localStorage notes to Supabase
      // This is a one-time operation when user first signs in with existing local notes
      const migrateLocalNotes = async () => {
        try {
          console.log('Migrating localStorage notes to Supabase...');

          // Get existing notes from localStorage
          const localNotes = localStorageNotes.exportNotes();

          // Create each note in Supabase
          for (const localNote of localNotes) {
            // Check if this kanji note already exists in Supabase
            const existingNote = supabaseNotes.getNoteForKanji(localNote.kanjiId);

            if (!existingNote) {
              await supabaseNotes.createNote({
                kanjiId: localNote.kanjiId,
                kanjiCharacter: localNote.kanjiCharacter,
                content: localNote.content
              });
            }
          }

          // Clear localStorage notes after successful migration
          // localStorage.removeItem('kanji-app-notes');
          console.log('Notes migration completed');
        } catch (error) {
          console.error('Error migrating notes:', error);
        }
      };

      // Only migrate if we have Supabase notes loaded and they're different from local notes
      if (supabaseNotes.notes.length === 0) {
        migrateLocalNotes();
      }
    }
  }, [shouldUseSupabase, localStorageNotes.notes.length, supabaseNotes.notes.length, localStorageNotes, supabaseNotes]);

  return {
    ...activeNotesHook,
    storageType: shouldUseSupabase ? 'supabase' : 'localStorage',
    isAuthenticated
  };
};