"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import kanjiData from "@/data/kanji.json";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";
import { useProgress } from "@/hooks/useProgress";
import { getProgressColors } from "@/types/progress";

function HomeContent() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const kanjiPerPage = 50;
  const totalPages = Math.ceil(kanjiData.length / kanjiPerPage);
  const { getKanjiProgress, isLoaded } = useProgress();

  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * kanjiPerPage;
  const endIndex = startIndex + kanjiPerPage;
  const currentKanji = kanjiData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-800 mb-2 drop-shadow-sm">
            Most Frequent Japanese Kanji
          </h1>
          <div className="flex justify-center items-center mt-4 gap-4">
            <div className="text-2xl">🌸</div>
            <div className="text-rose-600 font-medium">
              Page {currentPage} of {totalPages} ({kanjiData.length} total kanji)
            </div>
            <div className="text-2xl">🌸</div>
          </div>
        </header>

        {/* Page Navigation */}
        <nav className="flex justify-center mb-8">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/?page=${page}`}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md'
                    : 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200'
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        </nav>

        <main className="grid grid-cols-10 gap-2 sm:gap-4 max-w-5xl mx-auto">
          {currentKanji.map((kanji) => {
            const progress = isLoaded ? getKanjiProgress(kanji.id) : 0;
            const colors = getProgressColors(progress);

            return (
              <Link
                key={kanji.id}
                href={`/kanji/${kanji.id}`}
                className={`aspect-square rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group backdrop-blur-sm hover:backdrop-blur-none relative ${colors.background} border-2 ${colors.border} hover:border-rose-300`}
              >
                <span className={`text-xl sm:text-2xl lg:text-3xl font-bold transition-colors drop-shadow-sm ${colors.text} group-hover:text-rose-600`}>
                  {kanji.kanji}
                </span>

                {/* Progress indicator badge */}
                {progress > 0 && (
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${colors.badge} flex items-center justify-center text-xs font-bold ${colors.text} shadow-sm border-2 border-white`}>
                    {progress === 100 ? '✓' : `${progress}`}
                  </div>
                )}
              </Link>
            );
          })}
        </main>

        {/* Bottom Navigation */}
        <nav className="flex justify-center mt-12 gap-4">
          <Link
            href={`/?page=${Math.max(1, currentPage - 1)}`}
            className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
              currentPage === 1
                ? 'bg-rose-100 text-rose-300 cursor-not-allowed border border-rose-200'
                : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 hover:shadow-md'
            }`}
          >
            Previous Page
          </Link>

          <div className="flex items-center px-4 py-3 bg-white rounded-lg border border-rose-200 shadow-sm">
            <span className="text-rose-600 font-medium">
              Showing {startIndex + 1}-{Math.min(endIndex, kanjiData.length)} of {kanjiData.length}
            </span>
          </div>

          <Link
            href={`/?page=${Math.min(totalPages, currentPage + 1)}`}
            className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
              currentPage === totalPages
                ? 'bg-rose-100 text-rose-300 cursor-not-allowed border border-rose-200'
                : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 hover:shadow-md'
            }`}
          >
            Next Page
          </Link>
        </nav>

        {/* Progress Legend */}
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-sm border border-rose-200">
          <h3 className="text-center text-rose-700 font-semibold mb-3">🎯 Learning Progress Legend</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-gray-600">Locked (0%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
              <span className="text-red-700">Discovered (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
              <span className="text-yellow-700">Equipped (60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
              <span className="text-blue-700">Skilled (80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
              <span className="text-green-700">Mastered (100%)</span>
            </div>
          </div>
        </div>

        <footer className="text-center mt-8 text-rose-500 text-sm">
          <p>🌸 Click on any kanji to learn more and track your progress 🌸</p>
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