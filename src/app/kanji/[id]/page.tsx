"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArchiveBoxIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import kanjiData from "@/data/kanji.json";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";
import ProgressLadder from "@/components/ProgressLadder";
import { useProgress } from "@/hooks/useProgress";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function KanjiDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const kanji = kanjiData.find((item) => item.id === parseInt(resolvedParams.id)) || null;
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(0);
  const currentEntry = kanji?.entries[selectedEntryIndex] || null;
  const { getKanjiProgress, updateProgress, toggleArchiveKanji, isKanjiArchived, isLoaded } = useProgress();

  const currentProgress = isLoaded && kanji ? getKanjiProgress(kanji.id) : 0;
  const isArchived = isLoaded && kanji ? isKanjiArchived(kanji.id) : false;

  // Calculate which page this kanji belongs to
  const kanjiPerPage = 50;
  const pageNumber = kanji ? Math.ceil(kanji.id / kanjiPerPage) : 1;

  const handleProgressChange = (level: number) => {
    if (kanji) {
      updateProgress(kanji.id, level);
    }
  };

  const handleToggleArchive = () => {
    if (kanji) {
      toggleArchiveKanji(kanji.id);
    }
  };

  if (!kanji || !currentEntry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative">
        <Header />
        <JapaneseBackground />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center relative z-10">
            <h1 className="text-2xl font-bold text-rose-800 mb-4">Kanji not found</h1>
            <Link
              href={`/?page=${pageNumber}`}
              className="inline-flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-md"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Grid
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
      <div className="max-w-4xl mx-auto relative z-10 p-4 sm:p-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex justify-between items-center">
            <Link
              href={`/?page=${pageNumber}`}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-lg hover:from-rose-100 hover:to-pink-100 transition-all shadow-md border border-rose-200"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Grid
            </Link>

            <div className="text-rose-600 font-medium">
              <span className="hidden sm:inline">🌸 </span>
              {kanji.id} of {kanjiData.length}
              <span className="hidden sm:inline"> 🌸</span>
            </div>

            <div className="flex gap-2 items-center">
              {/* Archive Button */}
              <button
                onClick={handleToggleArchive}
                className={`p-2 rounded-lg transition-all shadow-sm ${
                  isArchived
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                }`}
                title={isArchived ? "Unarchive kanji" : "Archive kanji"}
              >
                {isArchived ? (
                  <ArchiveBoxXMarkIcon className="w-5 h-5" />
                ) : (
                  <ArchiveBoxIcon className="w-5 h-5" />
                )}
              </button>

              <Link
                href={`/kanji/${Math.max(1, kanji.id - 1)}`}
                className={`px-4 py-2 rounded-lg transition-all shadow-sm ${
                  kanji.id === 1
                    ? 'bg-rose-100 text-rose-300 cursor-not-allowed border border-rose-200'
                    : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 hover:shadow-md'
                }`}
              >
                Previous
              </Link>
              <Link
                href={`/kanji/${Math.min(kanjiData.length, kanji.id + 1)}`}
                className={`px-4 py-2 rounded-lg transition-all shadow-sm ${
                  kanji.id === kanjiData.length
                    ? 'bg-rose-100 text-rose-300 cursor-not-allowed border border-rose-200'
                    : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 hover:shadow-md'
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Kanji Details */}
          <div className="lg:col-span-2 bg-gradient-to-br from-rose-25 to-pink-25 bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-rose-100">
          {/* Header with Kanji and Audio */}
          <div className="text-center mb-12">
            {/* Entry Selection - only show if multiple entries */}
            {kanji.entries.length > 1 && (
              <div className="flex justify-center gap-2 mb-6">
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

            {/* Kana Reading (on top) */}
            <div className="text-4xl sm:text-5xl font-bold text-pink-600 mb-4">
              {currentEntry.hiragana}
            </div>

            {/* Kanji Character */}
            <div className="mb-4">
              <h1 className="text-8xl sm:text-9xl font-bold text-rose-800 drop-shadow-sm">
                {kanji.kanji}
              </h1>
            </div>

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


          {/* Example Sentence */}
          <div className="bg-gradient-to-r from-pink-25 to-rose-25 rounded-xl p-8 border border-rose-100 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">🗾</span>
                <div className="text-sm text-pink-600 leading-relaxed">
                  {currentEntry.exampleKana || '[Full sentence kana reading - requires data update]'}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📝</span>
                <div className="text-lg font-medium text-rose-800 leading-relaxed">
                  {currentEntry.example.split('(')[0].trim()}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🌍</span>
                <div className="text-base text-slate-700 font-medium leading-relaxed">
                  {currentEntry.example.includes('(') ? currentEntry.example.split('(')[1].replace(')', '') : ''}
                </div>
              </div>
            </div>
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