"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import kanjiData from "@/data/kanji.json";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";
import { useProgress } from "@/hooks/useProgress";

const KANJI_PER_PAGE = 50;

export default function ArchivePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { getArchivedKanji, toggleArchiveKanji, isLoaded } = useProgress();

  const archivedKanjiIds = useMemo(() => {
    return isLoaded ? getArchivedKanji() : [];
  }, [getArchivedKanji, isLoaded]);

  const archivedKanjiData = useMemo(() => {
    return kanjiData.filter(kanji => archivedKanjiIds.includes(kanji.id));
  }, [archivedKanjiIds]);

  const totalPages = Math.ceil(archivedKanjiData.length / KANJI_PER_PAGE);
  const startIndex = (currentPage - 1) * KANJI_PER_PAGE;
  const endIndex = startIndex + KANJI_PER_PAGE;
  const currentKanji = archivedKanjiData.slice(startIndex, endIndex);

  const handleUnarchive = async (kanjiId: number) => {
    await toggleArchiveKanji(kanjiId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-rose-600 border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="text-rose-400">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 border rounded-lg transition-colors ${
            currentPage === i
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-500'
              : 'text-rose-600 border-rose-300 hover:bg-rose-50'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="text-rose-400">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-rose-600 border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative">
      <Header />
      <JapaneseBackground />

      <div className="max-w-7xl mx-auto relative z-10 p-4 sm:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-lg hover:from-rose-100 hover:to-pink-100 transition-all shadow-md border border-rose-200"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Main
            </Link>

            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-rose-800 mb-2">
                📦 Archived Kanji
              </h1>
              <p className="text-rose-600">
                {archivedKanjiData.length} kanji archived
              </p>
            </div>

            <div className="w-24" /> {/* Spacer for centering */}
          </div>

          {archivedKanjiData.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-rose-800 mb-2">No Archived Kanji</h2>
              <p className="text-rose-600 mb-4">
                You haven't archived any kanji yet. Archive kanji from the main page or detail pages to hide them from your main learning flow.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md"
              >
                Start Learning
              </Link>
            </div>
          )}
        </div>

        {archivedKanjiData.length > 0 && (
          <>
            {/* Kanji Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-rose-100 mb-8">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-4">
                {currentKanji.map((kanji) => (
                  <div key={kanji.id} className="relative group">
                    <Link
                      href={`/kanji/${kanji.id}`}
                      className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-100 to-pink-100 hover:from-rose-200 hover:to-pink-200 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md border border-rose-200"
                    >
                      <span className="text-xl sm:text-2xl font-bold text-rose-800">
                        {kanji.kanji}
                      </span>
                    </Link>

                    {/* Unarchive button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleUnarchive(kanji.id);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
                      title="Unarchive kanji"
                    >
                      <ArchiveBoxXMarkIcon className="w-4 h-4" />
                    </button>

                    {/* Kanji ID */}
                    <div className="text-xs text-rose-500 text-center mt-1">
                      {kanji.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'text-rose-300 cursor-not-allowed'
                      : 'text-rose-600 hover:bg-rose-50 border border-rose-300'
                  }`}
                >
                  Previous
                </button>

                {renderPageNumbers()}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'text-rose-300 cursor-not-allowed'
                      : 'text-rose-600 hover:bg-rose-50 border border-rose-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            {/* Info */}
            <div className="text-center mt-8 text-rose-600">
              <p>
                Showing {startIndex + 1}-{Math.min(endIndex, archivedKanjiData.length)} of {archivedKanjiData.length} archived kanji
              </p>
              <p className="text-sm mt-2">
                Click the ✖️ button to unarchive a kanji and return it to your main learning flow
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}