"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";
import AudioPlayer from "@/components/AudioPlayer";
import vocabularyData from "@/data/vocabulary.json";

interface Word {
  id: number;
  english: string;
  kanji: string;
  hiragana: string;
  romaji: string;
  example: string;
}

interface Category {
  id: number;
  category: string;
  icon: string;
  words: Word[];
}

export default function VocabularyPage() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const categories: Category[] = vocabularyData;
  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-7xl mx-auto relative z-10 p-4 sm:p-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all shadow-md border border-purple-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-800 mb-4 drop-shadow-sm">
            📚 Japanese Vocabulary (単語)
          </h1>
          <p className="text-lg text-purple-600 mb-2">
            Essential Japanese words for travelers
          </p>
          <p className="text-sm text-purple-500">
            Learn common vocabulary for food, stores, and travel
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
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white scale-105'
                    : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
                }`}
              >
                <span className="text-xl mr-2">{category.icon}</span>
                {category.category}
              </button>
            ))}
          </div>
        </div>

        {/* Vocabulary Display */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">{currentCategory.icon}</span>
              {currentCategory.category}
              <span className="ml-3 text-sm font-normal text-purple-600">
                ({currentCategory.words.length} words)
              </span>
            </h2>

            {/* Table View */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-300">
                    <th className="text-left px-4 py-3 text-purple-800 font-semibold">English</th>
                    <th className="text-left px-4 py-3 text-purple-800 font-semibold">Kanji</th>
                    <th className="text-left px-4 py-3 text-purple-800 font-semibold">Hiragana</th>
                    <th className="text-left px-4 py-3 text-purple-800 font-semibold">Romaji</th>
                    <th className="text-left px-4 py-3 text-purple-800 font-semibold">Example Sentence</th>
                    <th className="text-center px-4 py-3 text-purple-800 font-semibold w-16">Audio</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategory.words.map((word, index) => (
                    <tr
                      key={word.id}
                      className={`border-b border-purple-100 hover:bg-purple-25 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-purple-25/50'
                      }`}
                    >
                      <td className="px-4 py-3 text-slate-800 font-medium">{word.english}</td>
                      <td className="px-4 py-3 text-purple-900 text-lg font-bold">{word.kanji}</td>
                      <td className="px-4 py-3 text-pink-700">{word.hiragana}</td>
                      <td className="px-4 py-3 text-purple-600 italic">{word.romaji}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{word.example}</td>
                      <td className="px-4 py-3 text-center">
                        <AudioPlayer
                          text={word.example.split('(')[0].trim()}
                          size="sm"
                          className="inline-flex"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
            <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center">
              <span className="text-xl mr-2">💡</span>
              Vocabulary Tips
            </h3>
            <ul className="space-y-2 text-sm text-amber-900">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Practice pronunciation using the audio buttons for each word</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Many store names use katakana - the angular Japanese script for foreign words</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Learning food names helps you order at restaurants and read menus</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Most convenience stores (コンビニ) are open 24/7 in major cities</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Chain restaurants often have picture menus and ticket vending machines</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mt-8 text-sm text-purple-600">
          <p>
            Total: {categories.reduce((sum, cat) => sum + cat.words.length, 0)} essential vocabulary words across {categories.length} categories
          </p>
        </div>
      </div>
    </div>
  );
}
