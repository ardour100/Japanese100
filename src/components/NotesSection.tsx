"use client";

import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useUnifiedNotes } from '@/hooks/useUnifiedNotes';

interface NotesSectionProps {
  kanjiId: number;
  kanjiCharacter: string;
}

export default function NotesSection({ kanjiId, kanjiCharacter }: NotesSectionProps) {
  const {
    getNoteForKanji,
    createNote,
    updateNote,
    deleteNote,
    isNotesSupported,
    loading,
    storageType,
    isAuthenticated
  } = useUnifiedNotes();

  const [noteContent, setNoteContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false);

  const existingNote = getNoteForKanji(kanjiId);

  // Initialize with existing note content
  useEffect(() => {
    if (existingNote) {
      setNoteContent(existingNote.content);
      setIsExpanded(true);
    } else {
      setNoteContent('');
      setIsExpanded(false);
    }
  }, [existingNote]);

  const handleSave = async () => {
    if (!noteContent.trim() || noteContent.length > 5000) return;

    setIsSaving(true);
    try {
      if (existingNote) {
        await updateNote(existingNote.id, { content: noteContent.trim() });
      } else {
        await createNote({
          kanjiId,
          kanjiCharacter,
          content: noteContent.trim()
        });
      }
      setShowTextarea(false);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingNote) return;

    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(existingNote.id);
      setNoteContent('');
      setShowTextarea(false);
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    if (existingNote) {
      setNoteContent(existingNote.content);
    } else {
      setNoteContent('');
    }
    setShowTextarea(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isNotesSupported) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-orange-800 flex items-center">
          <span className="text-xl mr-2">📝</span>
          My Notes
          {!isAuthenticated && (
            <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
              Local
            </span>
          )}
          {isAuthenticated && storageType === 'supabase' && (
            <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              Cloud
            </span>
          )}
        </h3>
        {existingNote && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-orange-600 hover:text-orange-800 transition-colors"
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Existing Note Display */}
      {existingNote && isExpanded && !showTextarea && (
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-orange-100">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {existingNote.content}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm text-orange-600">
            <span>
              Saved: {formatDate(existingNote.createdAt)}
              {existingNote.updatedAt !== existingNote.createdAt && (
                <span className="ml-2">(Updated: {formatDate(existingNote.updatedAt)})</span>
              )}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTextarea(true)}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium flex items-center"
              >
                <TrashIcon className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Input/Edit Form */}
      {(!existingNote || showTextarea) && (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Add your notes about this kanji... (5000 characters max)"
              className="w-full h-32 p-4 border border-orange-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none text-gray-800 bg-white"
              maxLength={5000}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {noteContent.length}/5000
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-orange-600">
              {noteContent.length > 4900 && (
                <span className="text-red-600 font-medium">
                  Character limit almost reached
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {(existingNote || noteContent.trim()) && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!noteContent.trim() || noteContent.length > 5000 || isSaving}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg hover:from-orange-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm"
              >
                {isSaving ? 'Saving...' : existingNote ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
          <span className="ml-2 text-orange-600 text-sm">Loading notes...</span>
        </div>
      )}
    </div>
  );
}