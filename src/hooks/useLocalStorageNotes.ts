"use client";

import { useState, useEffect, useCallback } from 'react';
import { Note, CreateNoteRequest, UpdateNoteRequest, SortOrder } from '@/types/notes';

const NOTES_STORAGE_KEY = 'kanji-app-notes';

export const useLocalStorageNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading] = useState(false); // Always false for localStorage operations

  // Load notes from localStorage
  const loadNotesFromStorage = useCallback(() => {
    try {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
    }
  }, []);

  // Save notes to localStorage
  const saveNotesToStorage = useCallback((notesToSave: Note[]) => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
    }
  }, []);

  // Load notes on mount
  useEffect(() => {
    loadNotesFromStorage();
  }, [loadNotesFromStorage]);

  // Get note for a specific kanji
  const getNoteForKanji = (kanjiId: number): Note | null => {
    return notes.find(note => note.kanjiId === kanjiId) || null;
  };

  // Create a new note
  const createNote = async (noteData: CreateNoteRequest): Promise<Note | null> => {
    try {
      const newNote: Note = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: 'local-user',
        kanjiId: noteData.kanjiId,
        kanjiCharacter: noteData.kanjiCharacter,
        content: noteData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      return null;
    }
  };

  // Update an existing note
  const updateNote = async (noteId: string, noteData: UpdateNoteRequest): Promise<Note | null> => {
    try {
      const updatedNotes = notes.map(note =>
        note.id === noteId
          ? {
              ...note,
              content: noteData.content,
              updatedAt: new Date().toISOString()
            }
          : note
      );

      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);

      return updatedNotes.find(note => note.id === noteId) || null;
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  };

  // Delete a note
  const deleteNote = async (noteId: string): Promise<boolean> => {
    try {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
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

  // Export notes (for potential migration to database when user signs in)
  const exportNotes = (): Note[] => {
    return notes;
  };

  // Import notes (for migration from database or merging)
  const importNotes = (importedNotes: Note[]) => {
    // Merge with existing notes, avoiding duplicates based on kanjiId
    const existingKanjiIds = new Set(notes.map(note => note.kanjiId));
    const newNotes = importedNotes.filter(note => !existingKanjiIds.has(note.kanjiId));

    const mergedNotes = [...notes, ...newNotes];
    setNotes(mergedNotes);
    saveNotesToStorage(mergedNotes);
  };

  return {
    notes,
    loading,
    getNoteForKanji,
    createNote,
    updateNote,
    deleteNote,
    getSortedNotes,
    exportNotes,
    importNotes,
    isNotesSupported: true // Always supported for localStorage
  };
};