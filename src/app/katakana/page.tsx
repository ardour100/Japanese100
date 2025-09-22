"use client";

import Link from "next/link";
import { useState } from "react";
import katakanaData from "@/data/katakana_words.json";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";

export default function KatakanaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Function to highlight katakana characters in words
  const highlightKatakana = (word: string, targetKana: string) => {
    if (!word || !targetKana) return word;

    const parts = word.split(targetKana);
    if (parts.length === 1) return word;

    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <span className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-1 rounded font-bold">
            {targetKana}
          </span>
        )}
      </span>
    ));
  };

  // Filter katakana data based on search term
  const filteredKatakana = katakanaData.filter(
    (item) =>
      item.kana.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-2 drop-shadow-sm">
            🌸 Katakana Words 🌸
          </h1>
          <p className="text-purple-600 text-lg mb-4">
            Learn katakana characters with common English loanwords
          </p>
          <div className="flex justify-center items-center mt-4 gap-4">
            <div className="text-2xl">🌸</div>
            <div className="text-slate-600 font-medium">
              {filteredKatakana.length} katakana words
            </div>
            <div className="text-2xl">🌸</div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md font-semibold"
          >
            <span>← Back to Kanji</span>
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search katakana, words, or meanings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none shadow-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400">
              🔍
            </div>
          </div>
        </div>

        {/* Katakana Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredKatakana.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-purple-800 mb-2">
                No katakana words found
              </h3>
              <p className="text-purple-600 mb-4">
                Try searching with different terms
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md"
              >
                Show All Words
              </button>
            </div>
          ) : (
            filteredKatakana.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-4 text-center group"
              >
                {/* English meaning on top */}
                <div className="text-sm sm:text-base font-semibold text-purple-700 mb-3 min-h-[3rem] flex items-center justify-center border-b border-purple-100 pb-2">
                  {item.english}
                </div>

                {/* Featured katakana character */}
                <div className="text-3xl sm:text-4xl font-bold text-purple-800 mb-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg py-3 border border-purple-200 group-hover:from-purple-200 group-hover:to-indigo-200 transition-all">
                  {item.kana}
                </div>

                {/* Katakana word with highlighting */}
                <div className="text-xl sm:text-2xl font-bold text-slate-700 min-h-[2.5rem] flex items-center justify-center">
                  {highlightKatakana(item.word, item.kana)}
                </div>
              </div>
            ))
          )}
        </main>

        {/* Info Section */}
        <section className="max-w-4xl mx-auto mt-12 bg-white rounded-xl border border-purple-200 shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">
            💡 About Katakana
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-700">
            <div>
              <h3 className="font-semibold text-purple-700 mb-2">What is Katakana?</h3>
              <p className="text-sm leading-relaxed">
                Katakana (カタカナ) is one of the three Japanese writing systems, primarily used for foreign loanwords,
                onomatopoeia, and emphasis. It consists of 46 basic characters representing syllables.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-purple-700 mb-2">Learning Tips</h3>
              <p className="text-sm leading-relaxed">
                The highlighted characters show which katakana is featured in each word. This helps you
                recognize how katakana characters appear in real Japanese words borrowed from English.
              </p>
            </div>
          </div>
        </section>

        <footer className="text-center mt-8 text-purple-500 text-sm">
          <p className="font-medium">🌸 Master katakana with these common English loanwords 🌸</p>
        </footer>
      </div>
    </div>
  );
}