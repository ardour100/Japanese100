"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import kanjiData from "@/data/kanji.json";
import JapaneseBackground from "@/components/JapaneseBackground";
import ProgressLadder from "@/components/ProgressLadder";
import { useProgress } from "@/hooks/useProgress";

interface KanjiEntry {
  entryId: number;
  romaji: string;
  hiragana: string;
  meaning: string;
  wordClass: string;
  example: string;
}

interface KanjiItem {
  id: number;
  kanji: string;
  entries: KanjiEntry[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function KanjiDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const kanji = kanjiData.find((item) => item.id === parseInt(resolvedParams.id)) || null;
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(0);
  const currentEntry = kanji?.entries[selectedEntryIndex] || null;
  const { getKanjiProgress, updateProgress, isLoaded } = useProgress();

  const currentProgress = isLoaded && kanji ? getKanjiProgress(kanji.id) : 0;

  const handleProgressChange = (level: number) => {
    if (kanji) {
      updateProgress(kanji.id, level);
    }
  };

  if (!kanji || !currentEntry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center relative">
        <JapaneseBackground />
        <div className="text-center relative z-10">
          <h1 className="text-2xl font-bold text-rose-800 mb-4">Kanji not found</h1>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-md"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Grid
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-4 sm:p-8 relative">
      <JapaneseBackground />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-lg hover:from-rose-100 hover:to-pink-100 transition-all shadow-md border border-rose-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Grid
          </Link>
        </nav>

        {/* Main Content - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Kanji Details */}
          <div className="lg:col-span-2 bg-gradient-to-br from-rose-25 to-pink-25 bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-rose-100">
          {/* Header with Kanji and Audio */}
          <div className="text-center mb-12">
            {/* Kanji Character */}
            <div className="mb-6">
              <h1 className="text-8xl sm:text-9xl font-bold text-rose-800 drop-shadow-sm">
                {kanji.kanji}
              </h1>
            </div>

            {/* Entry Selection - only show if multiple entries */}
            {kanji.entries.length > 1 && (
              <div className="flex justify-center gap-2 mb-4">
                {kanji.entries.map((entry, index) => (
                  <button
                    key={entry.entryId}
                    onClick={() => setSelectedEntryIndex(index)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedEntryIndex === index
                        ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md'
                        : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    }`}
                  >
                    {entry.wordClass}
                  </button>
                ))}
              </div>
            )}


            {/* Romaji */}
            <div className="text-3xl sm:text-4xl font-semibold text-rose-600 mb-2">
              {currentEntry.romaji}
            </div>

            {/* Meaning and Word Class */}
            <div className="text-xl text-rose-500 italic">
              {currentEntry.meaning}
            </div>
            <div className="text-sm text-rose-400 mt-1">
              [{currentEntry.wordClass}]
            </div>
          </div>

          {/* Reading Information */}
          <div className="max-w-md mx-auto mb-12">
            {/* Hiragana */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-6 text-center border border-pink-200 shadow-sm">
              <h3 className="text-lg font-semibold text-rose-700 mb-3">
                ひらがな (Hiragana)
              </h3>
              <div className="text-4xl font-bold text-pink-600">
                {currentEntry.hiragana}
              </div>
            </div>
          </div>

          {/* Example Sentence */}
          <div className="bg-gradient-to-r from-pink-25 to-rose-25 rounded-xl p-8 border border-rose-100 shadow-sm">
            <h3 className="text-xl font-semibold text-rose-700 mb-4 text-center">
              🌸 Example Sentence 🌸
            </h3>
            <div className="text-center">
              <div className="text-lg font-medium text-rose-800 mb-2 leading-relaxed">
                {currentEntry.example}
              </div>
            </div>
          </div>

          {/* Navigation to Next/Previous */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-rose-200">
            <Link
              href={`/kanji/${Math.max(1, kanji.id - 1)}`}
              className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
                kanji.id === 1
                  ? 'bg-rose-100 text-rose-300 cursor-not-allowed border border-rose-200'
                  : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 hover:shadow-md'
              }`}
            >
              Previous
            </Link>

            <div className="text-rose-600 font-medium">
              🌸 {kanji.id} of {kanjiData.length} 🌸
              {kanji.entries.length > 1 && (
                <div className="text-sm text-rose-400 mt-1">
                  Entry {selectedEntryIndex + 1} of {kanji.entries.length}
                </div>
              )}
            </div>

            <Link
              href={`/kanji/${Math.min(kanjiData.length, kanji.id + 1)}`}
              className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
                kanji.id === kanjiData.length
                  ? 'bg-rose-100 text-rose-300 cursor-not-allowed border border-rose-200'
                  : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 hover:shadow-md'
              }`}
            >
              Next
            </Link>
          </div>
        </div>

        {/* Right Column - Progress Ladder */}
        <div className="lg:col-span-1">
          <ProgressLadder
            currentProgress={currentProgress}
            onProgressChange={handleProgressChange}
          />
        </div>
      </div>
      </div>
    </div>
  );
}