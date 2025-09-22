"use client";

import { useState, useEffect, useCallback } from 'react';
import { Note, CreateNoteRequest, UpdateNoteRequest, SortOrder } from '@/types/notes';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fetch all notes for the current user
  const fetchNotes = useCallback(async () => {
    if (!isSupabaseConfigured() || !isAuthenticated || !user) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kanji_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        return;
      }

      const formattedNotes: Note[] = data.map(note => ({
        id: note.id,
        userId: note.user_id,
        kanjiId: note.kanji_id,
        kanjiCharacter: note.kanji_character,
        content: note.content,
        createdAt: note.created_at,
        updatedAt: note.updated_at
      }));

      setNotes(formattedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Get note for a specific kanji
  const getNoteForKanji = (kanjiId: number): Note | null => {
    return notes.find(note => note.kanjiId === kanjiId) || null;
  };

  // Create a new note
  const createNote = async (noteData: CreateNoteRequest): Promise<Note | null> => {
    if (!isSupabaseConfigured() || !isAuthenticated || !user) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('kanji_notes')
        .insert({
          user_id: user.id,
          kanji_id: noteData.kanjiId,
          kanji_character: noteData.kanjiCharacter,
          content: noteData.content
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating note:', error);
        return null;
      }

      const newNote: Note = {
        id: data.id,
        userId: data.user_id,
        kanjiId: data.kanji_id,
        kanjiCharacter: data.kanji_character,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      return null;
    }
  };

  // Update an existing note
  const updateNote = async (noteId: string, noteData: UpdateNoteRequest): Promise<Note | null> => {
    if (!isSupabaseConfigured() || !isAuthenticated || !user) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('kanji_notes')
        .update({
          content: noteData.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating note:', error);
        return null;
      }

      const updatedNote: Note = {
        id: data.id,
        userId: data.user_id,
        kanjiId: data.kanji_id,
        kanjiCharacter: data.kanji_character,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setNotes(prev => prev.map(note =>
        note.id === noteId ? updatedNote : note
      ));
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  };

  // Delete a note
  const deleteNote = async (noteId: string): Promise<boolean> => {
    if (!isSupabaseConfigured() || !isAuthenticated || !user) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('kanji_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting note:', error);
        return false;
      }

      setNotes(prev => prev.filter(note => note.id !== noteId));
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  };

  // Sort notes
  const getSortedNotes = (sortOrder: SortOrder = 'desc'): Note[] => {
    return [...notes].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  // Load notes when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && isSupabaseConfigured()) {
      fetchNotes();
    } else {
      setNotes([]);
    }
  }, [isAuthenticated, user, fetchNotes]);

  return {
    notes,
    loading,
    fetchNotes,
    getNoteForKanji,
    createNote,
    updateNote,
    deleteNote,
    getSortedNotes,
    isNotesSupported: isSupabaseConfigured() && isAuthenticated
  };
};