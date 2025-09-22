"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ChevronUpIcon, ChevronDownIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useUnifiedNotes } from '@/hooks/useUnifiedNotes';
import { SortOrder } from '@/types/notes';
import Header from '@/components/Header';
import JapaneseBackground from '@/components/JapaneseBackground';

export default function NotesPage() {
  const { getSortedNotes, deleteNote, loading, isNotesSupported, storageType, isAuthenticated } = useUnifiedNotes();
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const sortedNotes = getSortedNotes(sortOrder);
  const filteredNotes = sortedNotes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.kanjiCharacter.includes(searchTerm)
  );

  const toggleExpanded = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  const handleDelete = async (noteId: string, kanjiCharacter: string) => {
    if (confirm(`Are you sure you want to delete the note for ${kanjiCharacter}?`)) {
      await deleteNote(noteId);
    }
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

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!isNotesSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative">
        <Header />
        <JapaneseBackground />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center relative z-10 max-w-md p-8">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-rose-800 mb-4">Notes Not Available</h1>
            <p className="text-rose-600 mb-6">
              Notes feature is currently not available.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-md"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-lg hover:from-rose-100 hover:to-pink-100 transition-all shadow-md border border-rose-200"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Kanji Grid
            </Link>

            <h1 className="text-3xl font-bold text-rose-800 flex items-center">
              <span className="text-4xl mr-3">📝</span>
              My Notes
              {!isAuthenticated && (
                <span className="ml-3 text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
                  Stored Locally
                </span>
              )}
              {isAuthenticated && storageType === 'supabase' && (
                <span className="ml-3 text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                  Synced to Cloud
                </span>
              )}
            </h1>
          </div>

          {/* Search and Sort Controls */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-rose-100">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search notes or kanji..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none"
                />
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Sort by date:</span>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="flex items-center px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium"
                >
                  {sortOrder === 'desc' ? (
                    <>
                      <ChevronDownIcon className="w-4 h-4 mr-1" />
                      Newest first
                    </>
                  ) : (
                    <>
                      <ChevronUpIcon className="w-4 h-4 mr-1" />
                      Oldest first
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-orange-100">
              <p className="text-sm text-gray-600">
                {filteredNotes.length} of {sortedNotes.length} notes
                {searchTerm && (
                  <span className="ml-2 text-orange-600 font-medium">
                    (filtered by &ldquo;{searchTerm}&rdquo;)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Notes List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-orange-600 font-medium">Loading notes...</span>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h2>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start learning kanji and add notes to track your progress!'
              }
            </p>
            {!searchTerm && (
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg hover:from-orange-500 hover:to-amber-600 transition-all shadow-md font-medium"
              >
                Start Learning Kanji
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => {
              const isExpanded = expandedNotes.has(note.id);
              const isLongNote = note.content.length > 150;

              return (
                <div
                  key={note.id}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* Kanji Character */}
                      <Link
                        href={`/kanji/${note.kanjiId}`}
                        className="text-4xl font-bold text-rose-800 hover:text-rose-600 transition-colors"
                        title={`View kanji ${note.kanjiCharacter}`}
                      >
                        {note.kanjiCharacter}
                      </Link>

                      {/* Note Info */}
                      <div>
                        <div className="text-sm text-orange-600 font-medium">
                          Kanji #{note.kanjiId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {formatDate(note.createdAt)}
                          {note.updatedAt !== note.createdAt && (
                            <span className="ml-2">
                              • Updated: {formatDate(note.updatedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/kanji/${note.kanjiId}`}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                        title="View kanji details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(note.id, note.kanjiCharacter)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete note"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Note Content */}
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {isExpanded || !isLongNote
                        ? note.content
                        : truncateText(note.content)
                      }
                    </p>

                    {/* Expand/Collapse Button */}
                    {isLongNote && (
                      <button
                        onClick={() => toggleExpanded(note.id)}
                        className="mt-3 text-sm text-orange-600 hover:text-orange-800 font-medium flex items-center"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUpIcon className="w-4 h-4 mr-1" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon className="w-4 h-4 mr-1" />
                            Show more
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}