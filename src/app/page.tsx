"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import kanjiData from "@/data/kanji.json";
import JapaneseBackground from "@/components/JapaneseBackground";

function HomeContent() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const kanjiPerPage = 50;
  const totalPages = Math.ceil(kanjiData.length / kanjiPerPage);

  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * kanjiPerPage;
  const endIndex = startIndex + kanjiPerPage;
  const currentKanji = kanjiData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-4 sm:p-8 relative">
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-rose-800 mb-2 drop-shadow-sm">
            漢字学習
          </h1>
          <p className="text-xl text-rose-600">
            Most Frequent Japanese Kanji
          </p>
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
          {currentKanji.map((kanji) => (
            <Link
              key={kanji.id}
              href={`/kanji/${kanji.id}`}
              className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:from-rose-100 hover:to-pink-100 flex items-center justify-center group border border-rose-200 hover:border-rose-300 backdrop-blur-sm hover:backdrop-blur-none"
            >
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-rose-800 group-hover:text-rose-600 transition-colors drop-shadow-sm">
                {kanji.kanji}
              </span>
            </Link>
          ))}
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

        <footer className="text-center mt-12 text-rose-500 text-sm">
          <p>🌸 Click on any kanji to learn more about it 🌸</p>
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