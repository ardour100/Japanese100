"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo, useEffect } from "react";
import kanjiData from "@/data/kanji.json";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { getProgressColors } from "@/types/progress";

type ProgressFilter = 'all' | 'locked' | 'discovered' | 'equipped' | 'skilled' | 'mastered';

function ProgressContent() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const kanjiPerPage = 50;
  const { getKanjiProgress, isKanjiArchived, isLoaded, progress } = useProgress();
  const { isAuthenticated } = useAuth();

  const [progressFilter, setProgressFilter] = useState<ProgressFilter>('all');

  // Sync filter with URL params on mount
  useEffect(() => {
    const filterParam = searchParams.get('filter') as ProgressFilter;
    if (filterParam && ['all', 'locked', 'discovered', 'equipped', 'skilled', 'mastered'].includes(filterParam)) {
      setProgressFilter(filterParam);
    }
  }, [searchParams]);

  // Helper function to categorize progress
  const getProgressCategory = (progress: number): ProgressFilter => {
    if (progress === 0) return 'locked';
    if (progress > 0 && progress <= 25) return 'discovered';
    if (progress > 25 && progress <= 50) return 'equipped';
    if (progress > 50 && progress <= 99) return 'skilled';
    if (progress === 100) return 'mastered';
    return 'locked';
  };

  // Filter out archived kanji and apply progress filter
  const filteredKanjiData = useMemo(() => {
    let filtered = kanjiData.filter(kanji => !isKanjiArchived(kanji.id));

    if (progressFilter !== 'all' && isLoaded) {
      filtered = filtered.filter(kanji => {
        const progress = getKanjiProgress(kanji.id);
        return getProgressCategory(progress) === progressFilter;
      });
    }

    return filtered;
  }, [progressFilter, isKanjiArchived, isLoaded, getKanjiProgress]);

  const totalPages = Math.ceil(filteredKanjiData.length / kanjiPerPage);

  // Handle case where current page is out of bounds after filtering
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  // Calculate start and end indices for current page
  const startIndex = (safePage - 1) * kanjiPerPage;
  const endIndex = startIndex + kanjiPerPage;
  const currentKanji = filteredKanjiData.slice(startIndex, endIndex);

  // Calculate overall user progress (only for authenticated users)
  // Optimized: Use useMemo and iterate only over progress entries instead of all kanji
  const overallProgress = useMemo(() => {
    // Only calculate progress for authenticated users
    if (!isLoaded || !isAuthenticated) return 0;

    // Sum up all progress values directly from the progress object
    // This only iterates over kanji that have progress (not all 2000+ kanji)
    let totalProgressPoints = 0;
    Object.values(progress).forEach(level => {
      totalProgressPoints += level;
    });

    // Formula: sum of all progress / total kanji count
    const totalKanjiCount = kanjiData.length;
    const overallPercentage = totalProgressPoints / totalKanjiCount;
    return Math.round(overallPercentage * 100) / 100; // Round to 2 decimal places
  }, [isLoaded, isAuthenticated, progress]);

  // Calculate counts for each progress category
  const progressCounts = useMemo(() => {
    if (!isLoaded) return { all: 0, locked: 0, discovered: 0, equipped: 0, skilled: 0, mastered: 0 };

    const nonArchivedKanji = kanjiData.filter(kanji => !isKanjiArchived(kanji.id));
    const counts = { all: nonArchivedKanji.length, locked: 0, discovered: 0, equipped: 0, skilled: 0, mastered: 0 };

    nonArchivedKanji.forEach(kanji => {
      const progress = getKanjiProgress(kanji.id);
      const category = getProgressCategory(progress);
      counts[category]++;
    });

    return counts;
  }, [isLoaded, isKanjiArchived, getKanjiProgress]);

  // Helper function to build URL with current filter
  const buildUrl = (page: number, filter?: ProgressFilter) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if ((filter || progressFilter) !== 'all') {
      params.set('filter', filter || progressFilter);
    }
    return `/progress?${params.toString()}`;
  };


  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: ProgressFilter) => {
    setProgressFilter(filter);
    // Reset page to 1 when changing filters
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (filter === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', filter);
      }
      url.searchParams.set('page', '1');
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-800 mb-2 drop-shadow-sm">
            {progressFilter === 'all' ? 'Most Frequent Kanji' :
             progressFilter === 'locked' ? '🔒 Locked Kanji' :
             progressFilter === 'discovered' ? '🔍 Discovered Kanji' :
             progressFilter === 'equipped' ? '⚡ Equipped Kanji' :
             progressFilter === 'skilled' ? '🎯 Skilled Kanji' :
             '🏆 Mastered Kanji'}
          </h1>
          <div className="flex justify-center items-center mt-4 gap-4">
            <div className="text-2xl">🌸</div>
            <div className="text-slate-600 font-medium">
              Page {safePage} of {totalPages} ({filteredKanjiData.length} {progressFilter !== 'all' ? `${progressFilter} ` : ''}kanji)
            </div>
            <div className="text-2xl">🌸</div>
          </div>
        </header>

        {/* Combined Navigation */}
        <nav className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 max-w-4xl mx-auto">
          {/* Previous Button */}
          <Link
            href={buildUrl(Math.max(1, safePage - 1))}
            className={`px-4 py-2 rounded-lg transition-all shadow-sm text-center ${
              safePage === 1
                ? 'bg-rose-100 text-rose-300 cursor-not-allowed border border-rose-200'
                : 'bg-gradient-to-r from-rose-300 to-pink-400 text-white hover:from-rose-400 hover:to-pink-500 hover:shadow-md'
            }`}
          >
            <span className="hidden sm:inline">Previous Page</span>
            <span className="sm:hidden">Previous</span>
          </Link>

          {/* Page Numbers - Smart Pagination */}
          <div className="flex justify-center gap-1 sm:gap-2 overflow-x-auto">
            <div className="flex gap-1 sm:gap-2 min-w-max px-2">
              {(() => {
                const pages = [];
                const current = safePage;
                const total = totalPages;

                // Always show first page
                if (current > 3) {
                  pages.push(1);
                  if (current > 4) {
                    pages.push('...');
                  }
                }

                // Show pages around current page
                const start = Math.max(1, current - 2);
                const end = Math.min(total, current + 2);

                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }

                // Always show last page
                if (current < total - 2) {
                  if (current < total - 3) {
                    pages.push('...');
                  }
                  pages.push(total);
                }

                return pages.map((page, index) => {
                  if (page === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 sm:px-3 py-2 text-rose-500 flex-shrink-0"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={page}
                      href={buildUrl(page as number)}
                      className={`px-2 sm:px-3 py-2 rounded-lg transition-all text-sm sm:text-base flex-shrink-0 ${
                        safePage === page
                          ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200'
                      }`}
                    >
                      {page}
                    </Link>
                  );
                });
              })()}
            </div>
          </div>

          {/* Next Button */}
          <Link
            href={buildUrl(Math.min(totalPages, safePage + 1))}
            className={`px-4 py-2 rounded-lg transition-all shadow-sm text-center ${
              safePage === totalPages
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

            {/* Progress Legend - Clickable Filters */}
            <div className="px-4 py-2 bg-white rounded-lg border border-rose-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-slate-700 font-semibold text-sm whitespace-nowrap">🎯 Progress:</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {/* All */}
                  <button
                    onClick={() => handleFilterChange('all')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                      progressFilter === 'all'
                        ? 'bg-rose-100 border-2 border-rose-400 text-rose-700 font-semibold'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="w-3 h-3 bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-300 rounded"></div>
                    <span className="text-slate-600">All ({progressCounts.all})</span>
                  </button>

                  {/* Locked */}
                  <button
                    onClick={() => handleFilterChange('locked')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                      progressFilter === 'locked'
                        ? 'bg-gray-100 border-2 border-gray-400 text-gray-700 font-semibold'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                    <span className="text-slate-600">Locked ({progressCounts.locked})</span>
                  </button>

                  {/* Discovered */}
                  <button
                    onClick={() => handleFilterChange('discovered')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                      progressFilter === 'discovered'
                        ? 'bg-red-50 border-2 border-red-400 text-red-700 font-semibold'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
                    <span className="text-slate-600">Discovered ({progressCounts.discovered})</span>
                  </button>

                  {/* Equipped */}
                  <button
                    onClick={() => handleFilterChange('equipped')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                      progressFilter === 'equipped'
                        ? 'bg-yellow-50 border-2 border-yellow-400 text-yellow-700 font-semibold'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded"></div>
                    <span className="text-slate-600">Equipped ({progressCounts.equipped})</span>
                  </button>

                  {/* Skilled */}
                  <button
                    onClick={() => handleFilterChange('skilled')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                      progressFilter === 'skilled'
                        ? 'bg-blue-50 border-2 border-blue-400 text-blue-700 font-semibold'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                    <span className="text-slate-600">Skilled ({progressCounts.skilled})</span>
                  </button>

                  {/* Mastered */}
                  <button
                    onClick={() => handleFilterChange('mastered')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                      progressFilter === 'mastered'
                        ? 'bg-green-50 border-2 border-green-400 text-green-700 font-semibold'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
                    <span className="text-slate-600">Mastered ({progressCounts.mastered})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <main className="grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-4 max-w-sm sm:max-w-5xl mx-auto">
          {currentKanji.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">
                {progressFilter === 'locked' ? '🔒' :
                 progressFilter === 'discovered' ? '🔍' :
                 progressFilter === 'equipped' ? '⚡' :
                 progressFilter === 'skilled' ? '🎯' :
                 progressFilter === 'mastered' ? '🏆' : '🌸'}
              </div>
              <h3 className="text-2xl font-bold text-rose-800 mb-2">
                No {progressFilter === 'all' ? '' : progressFilter + ' '}kanji found
              </h3>
              <p className="text-rose-600 mb-4">
                {progressFilter === 'all'
                  ? "There are no kanji to display."
                  : progressFilter === 'locked'
                  ? "You&apos;ve started learning all the kanji! Great progress!"
                  : `You don&apos;t have any ${progressFilter} kanji yet. Keep learning!`
                }
              </p>
              <button
                onClick={() => handleFilterChange('all')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md"
              >
                Show All Kanji
              </button>
            </div>
          ) : (
            currentKanji.map((kanji) => {
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
            })
          )}
        </main>


        {/* Katakana Entry Button */}
        <div className="text-center mt-8 mb-6">
          <Link
            href="/katakana"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-violet-200 hover:text-purple-800 transition-all shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 font-medium border border-purple-200 hover:border-purple-300"
          >
            <span className="text-xl">🌸</span>
            <span>Learn Katakana Words</span>
            <span className="text-xl">🌸</span>
          </Link>
          <p className="text-purple-600 text-sm mt-2">
            Practice katakana with common English loanwords
          </p>
        </div>

        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p className="font-medium">🌸 Click on any kanji to learn more and track your progress 🌸</p>
        </footer>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-rose-600 text-xl">Loading progress...</div>
      </div>
    }>
      <ProgressContent />
    </Suspense>
  );
}