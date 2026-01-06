"use client";

import Link from "next/link";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";

function JoyoKanjiContent() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-7xl mx-auto relative z-10 p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-2 drop-shadow-sm">
            Jōyō Kanji Learning Guide
          </h1>
          <p className="text-indigo-600 mb-4">
            Official 2,136 characters from Japanese Ministry of Education
          </p>
        </header>

        {/* Educational Information */}
        <div className="max-w-5xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* JLPT Requirements */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-800 mb-3 flex items-center">
              <span className="text-xl mr-2">🎌</span>
              JLPT Requirements
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-blue-600">N5 (Beginner):</span>
                <span className="text-slate-600">~100 kanji</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-green-600">N4:</span>
                <span className="text-slate-600">~300 kanji</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-yellow-600">N3:</span>
                <span className="text-slate-600">~650 kanji</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-orange-600">N2:</span>
                <span className="text-slate-600">~1,000 kanji</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-red-600">N1 (Advanced):</span>
                <span className="text-slate-600">~2,000+ kanji</span>
              </div>
            </div>
          </div>

          {/* Daily Use */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-purple-100">
            <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
              <span className="text-xl mr-2">📰</span>
              Daily Use
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-slate-600">
                <span className="font-medium text-purple-600">~1,000 kanji</span> cover
                <span className="font-semibold"> 98%</span> of newspaper text
              </p>
              <p className="text-slate-600">
                <span className="font-medium text-purple-600">~500 kanji</span> cover
                <span className="font-semibold"> 80%</span> of basic daily text
              </p>
              <p className="text-slate-600">
                The complete <span className="font-medium text-purple-600">2,136 Jōyō kanji</span> ensure
                full literacy for Japanese adults
              </p>
            </div>
          </div>

          {/* Student Requirements */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center">
              <span className="text-xl mr-2">🎓</span>
              Student Requirements
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-emerald-600">Elementary (1-6):</span>
                <span className="text-slate-600">1,026 kanji</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-emerald-600">Junior High:</span>
                <span className="text-slate-600">+1,110 kanji</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-emerald-600">High School:</span>
                <span className="text-slate-600">Total 2,136</span>
              </div>
              <p className="text-slate-600 mt-3">
                <span className="font-semibold">Foreigners</span> need ~1,000 kanji
                for basic daily life in Japan
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
          >
            <span className="mr-2">←</span>
            <span>Back to Frequent Kanji</span>
          </Link>
        </div>


        {/* Resource Links */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="text-xl mr-2">🔗</span>
              Complete Jōyō Kanji Resources
            </h3>
            <p className="text-slate-600 mb-4">
              Access the full 2,136 character list from these official and educational sources:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Official Sources */}
              <div>
                <h4 className="font-semibold text-indigo-700 mb-3">📋 Official Sources</h4>
                <div className="space-y-2">
                  <a
                    href="https://www.mext.go.jp/a_menu/shotou/new-cs/youryou/syo/koku/001.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    • MEXT Official Curriculum (Japanese)
                  </a>
                  <a
                    href="https://en.wikipedia.org/wiki/List_of_jōyō_kanji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    • Wikipedia: Complete Jōyō Kanji List
                  </a>
                  <a
                    href="https://x0213.org/joyo-kanji-code/index.en.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    • Jōyō Kanji Character Codes Table
                  </a>
                </div>
              </div>

              {/* Educational Resources */}
              <div>
                <h4 className="font-semibold text-purple-700 mb-3">📚 Educational Resources</h4>
                <div className="space-y-2">
                  <a
                    href="https://www.kanshudo.com/collections/joyo_kanji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    • Kanshudo: Jōyō Kanji Collection
                  </a>
                  <a
                    href="https://www.kanjidatabase.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    • Kanji Database (Frequency & Usage)
                  </a>
                  <a
                    href="https://github.com/davidluzgouveia/kanji-data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    • GitHub: Kanji Data (JSON Format)
                  </a>
                  <a
                    href="https://maikojapan.com/learn-all-2136-joyo-kanji-by-grade/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    • Maiko Japan: Grade-by-Grade Lists
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                <span className="font-medium">💡 Note:</span> These resources provide various formats including
                PDF downloads, CSV files, and interactive study tools for the complete 2,136 character set.
              </p>
            </div>
          </div>
        </div>

        {/* Information Footer */}
        <div className="text-center text-slate-600 text-sm">
          <p className="mb-2">
            The Jōyō kanji are the official list of characters for daily use in Japan.
          </p>
          <p>
            Last updated by MEXT in 2010 • Current list contains 2,136 characters
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JoyoKanjiPage() {
  return <JoyoKanjiContent />;
}