"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";

interface SavedWord {
  word: string;
  englishDefinition: string;
  chineseDefinition: string;
  timestamp: number;
  audioUrl?: string;
}

export default function VocabularyBookPage() {
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [expandedWords, setExpandedWords] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const WORDS_PER_PAGE = 20;
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'done'>('idle');

  // Load saved words from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("dictionarySavedWords");
    if (stored) {
      try {
        const words = JSON.parse(stored);
        setSavedWords(words);
      } catch (e) {
        console.error("Failed to load saved words:", e);
      }
    }
  }, []);

  const migrateWords = async () => {
    setMigrationStatus('running');
    const wordsToMigrate = savedWords.filter(word => !word.audioUrl);
    if (wordsToMigrate.length === 0) {
      setMigrationStatus('done');
      alert('All words are already up-to-date.');
      return;
    }

    let updatedCount = 0;
    const updatedWords = [...savedWords];

    for (const word of wordsToMigrate) {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.word}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data[0]) {
            let audio = '';
            if (data[0].phonetics && data[0].phonetics.length > 0) {
              const phoneticWithAudio = data[0].phonetics.find(
                (p: { text?: string; audio?: string }) => p.text && p.audio
              );
              if (phoneticWithAudio) {
                audio = phoneticWithAudio.audio || '';
              } else {
                const audioObj = data[0].phonetics.find((p: { audio?: string }) => p.audio);
                if (audioObj && audioObj.audio) {
                  audio = audioObj.audio;
                }
              }
            }
            if (audio) {
              const wordIndex = updatedWords.findIndex(w => w.timestamp === word.timestamp);
              if (wordIndex !== -1) {
                updatedWords[wordIndex].audioUrl = audio;
                updatedCount++;
              }
            }
          }
        }
      } catch (e) {
        console.error(`Failed to migrate word: ${word.word}`, e);
      }
    }

    setSavedWords(updatedWords);
    localStorage.setItem('dictionarySavedWords', JSON.stringify(updatedWords));
    setMigrationStatus('done');
    alert(`Complete! ${updatedCount} words updated.`);
  };

  const deleteWord = (timestamp: number) => {
    const updated = savedWords.filter((word) => word.timestamp !== timestamp);
    setSavedWords(updated);
    localStorage.setItem("dictionarySavedWords", JSON.stringify(updated));
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all words?")) {
      setSavedWords([]);
      localStorage.removeItem("dictionarySavedWords");
    }
  };

  const toggleExpand = (timestamp: number) => {
    setExpandedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(timestamp)) {
        newSet.delete(timestamp);
      } else {
        newSet.add(timestamp);
      }
      return newSet;
    });
  };

  // Filter words based on search
  const filteredWords = savedWords.filter((word) =>
    word.word.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / WORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * WORDS_PER_PAGE;
  const endIndex = startIndex + WORDS_PER_PAGE;
  const currentWords = filteredWords.slice(startIndex, endIndex);

  // Reset to page 1 when search filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-2 drop-shadow-sm">
            My Vocabulary Book
          </h1>
          <p className="text-purple-600 mb-4">
            View and manage your saved words · Total {savedWords.length} words
            {filteredWords.length !== savedWords.length && ` · Search Results: ${filteredWords.length}`}
            {totalPages > 1 && ` · Page ${currentPage}/${totalPages}`}
          </p>
        </header>

        {/* Search and Actions */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg p-4 shadow-lg border border-purple-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search words..."
                className="flex-1 px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
              />
              <div className="flex gap-2">
                <Link
                  href="/dictionary"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  + Add Word
                </Link>
                {savedWords.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                  >
                    Clear All
                  </button>
                )}
                {savedWords.length > 0 && (
                  <button
                    onClick={migrateWords}
                    disabled={migrationStatus === 'running'}
                    className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {migrationStatus === 'running' ? 'Updating...' : 'Update Old Words'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Controls - Top */}
        {totalPages > 1 && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous Page
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;

                  const showEllipsis =
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return (
                      <span key={page} className="px-2 text-slate-400">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-purple-600 text-white"
                          : "bg-white border border-purple-300 text-purple-700 hover:bg-purple-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next Page
              </button>
            </div>
          </div>
        )}

        {/* Words List */}
        <div className="max-w-4xl mx-auto">
          {filteredWords.length === 0 ? (
            <div className="bg-white rounded-lg p-12 shadow-md border border-slate-200 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {searchFilter
                  ? "No matching words found"
                  : savedWords.length === 0
                  ? "Vocabulary book is empty"
                  : "No matching words"}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchFilter
                  ? "Try other search terms"
                  : "Search and save words from English-Chinese dictionary here"}
              </p>
              {!searchFilter && savedWords.length === 0 && (
                <Link
                  href="/dictionary"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
                >
                  <span className="mr-2">🔍</span>
                  <span>Go to Dictionary</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {currentWords.map((word) => {
                const isExpanded = expandedWords.has(word.timestamp);
                return (
                  <div
                    key={word.timestamp}
                    className="bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
                  >
                    {/* Collapsed header - always visible */}
                    <div className="flex items-center justify-between p-4">
                      <button
                        onClick={() => toggleExpand(word.timestamp)}
                        className="flex items-center gap-3 flex-1 text-left hover:bg-slate-50 rounded p-2 transition-colors"
                      >
                        <span
                          className={`text-slate-500 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        >
                          ▶
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-purple-800">
                              {word.word}
                            </h3>
                            {word.audioUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent the word from expanding when clicking the button
                                  const audio = new Audio(word.audioUrl);
                                  audio.play();
                                }}
                                className="p-2 rounded-full hover:bg-purple-100 transition-colors"
                                title="Play audio"
                              >
                                <span className="text-xl">🔊</span>
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            {new Date(word.timestamp).toLocaleString("zh-CN")}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => deleteWord(word.timestamp)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors ml-2"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Expanded content - only show when expanded */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="bg-slate-50 rounded p-4 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 leading-relaxed">
                            {word.englishDefinition}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-medium rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all shadow-md hover:shadow-lg"
          >
            <span className="mr-2">←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
