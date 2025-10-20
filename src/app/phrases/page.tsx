"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";
import AudioPlayer from "@/components/AudioPlayer";
import travelPhrasesData from "@/data/travel-phrases.json";

interface Phrase {
  id: number;
  japanese: string;
  hiragana: string;
  romaji: string;
  english: string;
  context: string;
}

interface Category {
  id: number;
  category: string;
  icon: string;
  phrases: Phrase[];
}

export default function TravelPhrasesPage() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const categories: Category[] = travelPhrasesData;
  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-7xl mx-auto relative z-10 p-4 sm:p-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 rounded-lg hover:from-teal-100 hover:to-cyan-100 transition-all shadow-md border border-teal-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-teal-800 mb-4 drop-shadow-sm">
            🗾 Travel Phrases
          </h1>
          <p className="text-lg text-teal-600 mb-2">
            Essential Japanese phrases for travelers
          </p>
          <p className="text-sm text-teal-500">
            Learn practical phrases for daily situations in Japan
          </p>
        </header>

        {/* Category Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all shadow-md ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white scale-105'
                    : 'bg-white text-teal-700 hover:bg-teal-50 border border-teal-200'
                }`}
              >
                <span className="text-xl mr-2">{category.icon}</span>
                {category.category}
              </button>
            ))}
          </div>
        </div>

        {/* Phrases Display */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-teal-100">
            <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">{currentCategory.icon}</span>
              {currentCategory.category}
              <span className="ml-3 text-sm font-normal text-teal-600">
                ({currentCategory.phrases.length} phrases)
              </span>
            </h2>

            <div className="space-y-4">
              {currentCategory.phrases.map((phrase) => (
                <div
                  key={phrase.id}
                  className="bg-gradient-to-r from-teal-25 to-cyan-25 rounded-xl p-5 border border-teal-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {/* Japanese */}
                      <div className="text-2xl font-bold text-teal-900 mb-2">
                        {phrase.japanese}
                      </div>

                      {/* Hiragana/Furigana */}
                      <div className="text-lg text-cyan-700 mb-1">
                        {phrase.hiragana}
                      </div>

                      {/* Romaji */}
                      <div className="text-base text-teal-600 italic mb-2">
                        {phrase.romaji}
                      </div>
                    </div>

                    {/* Audio Player */}
                    <AudioPlayer
                      text={phrase.japanese}
                      size="md"
                      className="flex-shrink-0 ml-4"
                    />
                  </div>

                  {/* English Translation */}
                  <div className="text-lg font-medium text-slate-800">
                    💬 {phrase.english}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
            <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center">
              <span className="text-xl mr-2">💡</span>
              Travel Tips
            </h3>
            <ul className="space-y-2 text-sm text-amber-900">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Politeness is highly valued - always use polite forms (です/ます)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Bowing while saying greetings shows respect</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>すみません (sumimasen) is useful for both &quot;excuse me&quot; and &quot;sorry&quot;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Speaking slowly and clearly helps communication</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Download a translation app as backup for complex situations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mt-8 text-sm text-teal-600">
          <p>
            Total: {categories.reduce((sum, cat) => sum + cat.phrases.length, 0)} essential travel phrases across {categories.length} categories
          </p>
        </div>
      </div>
    </div>
  );
}
