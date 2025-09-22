"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import kanjiData from "@/data/kanji.json";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { getProgressColors } from "@/types/progress";

function HomeContent() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const kanjiPerPage = 50;
  const totalPages = Math.ceil(kanjiData.length / kanjiPerPage);
  const { getKanjiProgress, isLoaded } = useProgress();
  const { isAuthenticated } = useAuth();

  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * kanjiPerPage;
  const endIndex = startIndex + kanjiPerPage;
  const currentKanji = kanjiData.slice(startIndex, endIndex);

  // Calculate overall user progress (only for authenticated users)
  const calculateOverallProgress = () => {
    // Only calculate progress for authenticated users
    if (!isLoaded || !isAuthenticated) return 0;

    let totalProgressPoints = 0;
    const totalKanjiCount = kanjiData.length;

    for (let i = 1; i <= totalKanjiCount; i++) {
      const kanjiProgress = getKanjiProgress(i);
      totalProgressPoints += kanjiProgress;
    }

    // Formula: sum of (each kanji progress * 1) / total kanji count
    const overallPercentage = totalProgressPoints / totalKanjiCount;
    return Math.round(overallPercentage * 100) / 100; // Round to 2 decimal places
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-800 mb-2 drop-shadow-sm">
            Most Frequent Kanji
          </h1>
          <div className="flex justify-center items-center mt-4 gap-4">
            <div className="text-2xl">🌸</div>
            <div className="text-slate-600 font-medium">
              Page {currentPage} of {totalPages} ({kanjiData.length} total kanji)
            </div>
            <div className="text-2xl">🌸</div>
          </div>
        </header>

        {/* Combined Navigation */}
        <nav className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 max-w-4xl mx-auto">
          {/* Previous Button */}
          <Link
            href={`/?page=${Math.max(1, currentPage - 1)}`}
            className={`px-4 py-2 rounded-lg transition-all shadow-sm text-center ${
              currentPage === 1
                ? 'bg-rose-100 text-rose-300 cursor-not-allowed border border-rose-200'
                : 'bg-gradient-to-r from-rose-300 to-pink-400 text-white hover:from-rose-400 hover:to-pink-500 hover:shadow-md'
            }`}
          >
            <span className="hidden sm:inline">Previous Page</span>
            <span className="sm:hidden">Previous</span>
          </Link>

          {/* Page Numbers - Responsive */}
          <div className="flex justify-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 sm:gap-2 min-w-max px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/?page=${page}`}
                  className={`px-3 py-2 rounded-lg transition-all text-sm sm:text-base ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <Link
            href={`/?page=${Math.min(totalPages, currentPage + 1)}`}
            className={`px-4 py-2 rounded-lg transition-all shadow-sm text-center ${
              currentPage === totalPages
                ? 'bg-rose-100 text-rose-300 cursor-not-allowed border border-rose-200'
                : 'bg-gradient-to-r from-rose-300 to-pink-400 text-white hover:from-rose-400 hover:to-pink-500 hover:shadow-md'
            }`}
          >
            <span className="hidden sm:inline">Next Page</span>
            <span className="sm:hidden">Next</span>
          </Link>
        </nav>

        {/* Page Info & Progress Legend */}
        <div className="max-w-sm sm:max-w-5xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            {/* Page Info & Overall Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="px-4 py-2 bg-white rounded-lg border border-rose-200 shadow-sm">
                <span className="text-slate-600 font-medium text-sm sm:text-base">
                  Showing {startIndex + 1}-{Math.min(endIndex, kanjiData.length)} of {kanjiData.length}
                </span>
              </div>

              {/* Overall Progress - Only for authenticated users */}
              {isLoaded && isAuthenticated && overallProgress > 0 && (
                <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-semibold text-sm">📈 Overall:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(overallProgress, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-emerald-700 font-bold text-sm whitespace-nowrap">
                        {overallProgress.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sign-in prompt for non-authenticated users */}
              {isLoaded && !isAuthenticated && (
                <div className="px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-700 font-semibold text-sm">🔑 Sign in to save progress</span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Legend */}
            <div className="px-4 py-2 bg-white rounded-lg border border-rose-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-slate-700 font-semibold text-sm whitespace-nowrap">🎯 Progress:</span>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                    <span className="text-slate-600">Locked</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
                    <span className="text-slate-700">Discovered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded"></div>
                    <span className="text-slate-700">Equipped</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                    <span className="text-slate-700">Skilled</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
                    <span className="text-slate-700">Mastered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-4 max-w-sm sm:max-w-5xl mx-auto">
          {currentKanji.map((kanji) => {
            const progress = isLoaded ? getKanjiProgress(kanji.id) : 0;
            const colors = getProgressColors(progress);

            return (
              <Link
                key={kanji.id}
                href={`/kanji/${kanji.id}`}
                className={`aspect-square rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center group backdrop-blur-sm hover:backdrop-blur-none relative ${colors.background} border-2 ${colors.border} hover:border-rose-300`}
              >
                <span className={`text-lg sm:text-2xl lg:text-3xl font-bold transition-colors drop-shadow-sm ${colors.text} group-hover:text-rose-600`}>
                  {kanji.kanji}
                </span>

                {/* Progress indicator badge - hidden on mobile */}
                {progress > 0 && (
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${colors.badge} items-center justify-center text-xs font-bold ${colors.text} shadow-sm border-2 border-white hidden sm:flex`}>
                    {progress === 100 ? '✓' : `${progress}`}
                  </div>
                )}
              </Link>
            );
          })}
        </main>


        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p className="font-medium">🌸 Click on any kanji to learn more and track your progress 🌸</p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-rose-600 text-xl">Loading kanji...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}