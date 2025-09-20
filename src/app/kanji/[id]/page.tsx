"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import kanjiData from "@/data/kanji.json";
import JapaneseBackground from "@/components/JapaneseBackground";

interface KanjiItem {
  id: number;
  kanji: string;
  romaji: string;
  hiragana: string;
  katakana: string;
  meaning: string;
  example: string;
  audio: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function KanjiDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [isPlaying, setIsPlaying] = useState(false);

  const kanji = kanjiData.find((item) => item.id === parseInt(resolvedParams.id)) || null;

  const playAudio = () => {
    if (!kanji) return;

    setIsPlaying(true);

    // Use Web Speech API for pronunciation since we don't have actual audio files
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(kanji.romaji);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } else {
      // Fallback if speech synthesis is not available
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  if (!kanji) {
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

        {/* Main Content */}
        <div className="bg-gradient-to-br from-rose-25 to-pink-25 bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-rose-100">
          {/* Header with Kanji and Audio */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="text-3xl">🌸</div>
            </div>
            <div className="relative inline-block">
              <h1 className="text-8xl sm:text-9xl font-bold text-rose-800 mb-4 drop-shadow-sm">
                {kanji.kanji}
              </h1>
              <div className="absolute -top-2 -right-2">
                <button
                  onClick={playAudio}
                  disabled={isPlaying}
                  className={`p-3 rounded-full transition-all ${
                    isPlaying
                      ? 'bg-rose-200 text-rose-600'
                      : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600'
                  } shadow-lg`}
                >
                  <SpeakerWaveIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Romaji */}
            <div className="text-3xl sm:text-4xl font-semibold text-rose-600 mb-2">
              {kanji.romaji}
            </div>

            {/* Meaning */}
            <div className="text-xl text-rose-500 italic">
              {kanji.meaning}
            </div>
          </div>

          {/* Reading Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Hiragana */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-6 text-center border border-pink-200 shadow-sm">
              <h3 className="text-lg font-semibold text-rose-700 mb-3">
                ひらがな (Hiragana)
              </h3>
              <div className="text-4xl font-bold text-pink-600">
                {kanji.hiragana}
              </div>
            </div>

            {/* Katakana */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-xl p-6 text-center border border-rose-200 shadow-sm">
              <h3 className="text-lg font-semibold text-rose-700 mb-3">
                カタカナ (Katakana)
              </h3>
              <div className="text-4xl font-bold text-rose-600">
                {kanji.katakana}
              </div>
            </div>
          </div>

          {/* Example Sentence */}
          <div className="bg-gradient-to-r from-pink-25 to-rose-25 rounded-xl p-8 border border-rose-100 shadow-sm">
            <h3 className="text-xl font-semibold text-rose-700 mb-4 text-center">
              🌸 Example Sentence 🌸
            </h3>
            <div className="text-center">
              <div className="text-2xl font-medium text-rose-800 mb-2">
                {kanji.example}
              </div>
              <div className="text-rose-600">
                Click the audio button to hear the pronunciation
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
              🌸 {kanji.id} of 100 🌸
            </div>

            <Link
              href={`/kanji/${Math.min(100, kanji.id + 1)}`}
              className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
                kanji.id === 100
                  ? 'bg-rose-100 text-rose-300 cursor-not-allowed border border-rose-200'
                  : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 hover:shadow-md'
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}