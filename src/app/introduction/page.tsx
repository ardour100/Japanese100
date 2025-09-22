"use client";

import Link from "next/link";
import { ArrowLeftIcon, BookOpenIcon, ChartBarIcon, EyeIcon, PlayIcon } from "@heroicons/react/24/outline";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative">
      <Header />
      <JapaneseBackground />

      <div className="max-w-4xl mx-auto relative z-10 p-4 sm:p-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-lg hover:from-rose-100 hover:to-pink-100 transition-all shadow-md border border-rose-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Kanji Grid
          </Link>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-rose-100">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🌸</div>
            <h1 className="text-4xl font-bold text-rose-800 mb-4">Welcome to 漢字学習</h1>
            <p className="text-xl text-rose-600 mb-2">Your Journey to Mastering Japanese Kanji</p>
            <p className="text-lg text-slate-600">Learn the 1000+ most frequent kanji characters with our interactive platform</p>
          </div>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rose-800 mb-6 flex items-center">
              <PlayIcon className="w-6 h-6 mr-3 text-rose-600" />
              Getting Started
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                Welcome to your kanji learning journey! This platform helps you learn Japanese kanji characters
                systematically, starting with the most frequently used characters in modern Japanese.
              </p>
              <div className="bg-gradient-to-r from-rose-25 to-pink-25 rounded-lg p-6 border border-rose-100">
                <h3 className="font-semibold text-rose-800 mb-3">🎯 What You&apos;ll Learn:</h3>
                <ul className="space-y-2">
                  <li>• <strong>1000+ Essential Kanji:</strong> The most frequently used characters in Japanese</li>
                  <li>• <strong>Multiple Readings:</strong> Hiragana, romaji, and pronunciation guides</li>
                  <li>• <strong>Meanings & Usage:</strong> English translations and example sentences</li>
                  <li>• <strong>Word Classes:</strong> Nouns, verbs, adjectives, and more</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Navigate */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rose-800 mb-6 flex items-center">
              <EyeIcon className="w-6 h-6 mr-3 text-rose-600" />
              How to Navigate
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-rose-25 to-pink-25 rounded-lg p-6 border border-rose-100">
                <h3 className="font-semibold text-rose-800 mb-3">📱 Main Grid</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Browse kanji in a 10×5 grid layout (50 per page)</li>
                  <li>• Use pagination to navigate through different sets</li>
                  <li>• Click any kanji to view detailed information</li>
                  <li>• Progress indicators show your learning status</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-rose-25 to-pink-25 rounded-lg p-6 border border-rose-100">
                <h3 className="font-semibold text-rose-800 mb-3">📖 Detail Pages</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Large kanji display with pronunciation guides</li>
                  <li>• Multiple entries for different meanings</li>
                  <li>• Example sentences with translations</li>
                  <li>• Previous/Next navigation between characters</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Learning System */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rose-800 mb-6 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-3 text-rose-600" />
              Progress Tracking System
            </h2>
            <div className="space-y-6">
              <p className="text-slate-700">
                Track your learning progress with our 5-level mastery system. Each kanji can be marked at different skill levels:
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-sm">0</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700">Locked</div>
                    <div className="text-xs text-gray-600">Not started</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-red-25 rounded-lg border border-red-200">
                  <div className="w-8 h-8 bg-red-100 border border-red-300 rounded flex items-center justify-center">
                    <span className="text-red-700 font-bold text-sm">20</span>
                  </div>
                  <div>
                    <div className="font-semibold text-red-700">Discovered</div>
                    <div className="text-xs text-red-600">Basic recognition</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-yellow-25 rounded-lg border border-yellow-200">
                  <div className="w-8 h-8 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center">
                    <span className="text-yellow-700 font-bold text-sm">60</span>
                  </div>
                  <div>
                    <div className="font-semibold text-yellow-700">Equipped</div>
                    <div className="text-xs text-yellow-600">Know meaning</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-25 rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-sm">80</span>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-700">Skilled</div>
                    <div className="text-xs text-blue-600">Can read & write</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-25 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-100 border border-green-300 rounded flex items-center justify-center">
                    <span className="text-green-700 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-green-700">Mastered</div>
                    <div className="text-xs text-green-600">Fully learned</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Study Tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rose-800 mb-6 flex items-center">
              <BookOpenIcon className="w-6 h-6 mr-3 text-rose-600" />
              Study Tips & Best Practices
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-rose-25 to-pink-25 rounded-lg p-6 border border-rose-100">
                  <h3 className="font-semibold text-rose-800 mb-3">🎯 Effective Learning</h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li>• Start with the first page and work sequentially</li>
                    <li>• Focus on 10-20 kanji per study session</li>
                    <li>• Review previously learned characters regularly</li>
                    <li>• Pay attention to stroke order and radicals</li>
                    <li>• Practice writing each character multiple times</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-rose-25 to-pink-25 rounded-lg p-6 border border-rose-100">
                  <h3 className="font-semibold text-rose-800 mb-3">💡 Memory Techniques</h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li>• Create stories connecting the meaning to the shape</li>
                    <li>• Learn kanji in context through example sentences</li>
                    <li>• Group similar kanji by radicals or themes</li>
                    <li>• Use spaced repetition for long-term retention</li>
                    <li>• Practice reading real Japanese texts</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rose-800 mb-6">🌟 Platform Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-rose-25 to-pink-25 rounded-lg border border-rose-100">
                <h3 className="font-semibold text-rose-800 mb-2">📱 Responsive Design</h3>
                <p className="text-sm text-slate-700">Works perfectly on mobile, tablet, and desktop devices</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-rose-25 to-pink-25 rounded-lg border border-rose-100">
                <h3 className="font-semibold text-rose-800 mb-2">🎌 Cultural Context</h3>
                <p className="text-sm text-slate-700">Beautiful Japanese-inspired design with cultural elements</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-rose-25 to-pink-25 rounded-lg border border-rose-100">
                <h3 className="font-semibold text-rose-800 mb-2">💾 Progress Saving</h3>
                <p className="text-sm text-slate-700">Your learning progress is automatically saved locally</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-rose-25 to-pink-25 rounded-lg border border-rose-100">
                <h3 className="font-semibold text-rose-800 mb-2">🔄 Easy Navigation</h3>
                <p className="text-sm text-slate-700">Intuitive pagination and character-to-character navigation</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-rose-25 to-pink-25 rounded-lg border border-rose-100">
                <h3 className="font-semibold text-rose-800 mb-2">📊 Visual Progress</h3>
                <p className="text-sm text-slate-700">Color-coded progress indicators and achievement tracking</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-rose-25 to-pink-25 rounded-lg border border-rose-100">
                <h3 className="font-semibold text-rose-800 mb-2">🎯 Focused Learning</h3>
                <p className="text-sm text-slate-700">Structured approach focusing on the most important kanji</p>
              </div>
            </div>
          </section>

          {/* Contact & Feedback */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rose-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact & Feedback
            </h2>
            <div className="bg-gradient-to-r from-rose-25 to-pink-25 rounded-xl p-8 border border-rose-100">
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  We value your feedback and are constantly working to improve your kanji learning experience.
                  Whether you have suggestions, found a bug, or just want to share your learning progress,
                  we&apos;d love to hear from you!
                </p>

                <div className="flex items-start gap-4 p-6 bg-white rounded-lg border border-rose-200 shadow-sm">
                  <div className="text-2xl">📧</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-rose-800 mb-2">Get in Touch</h3>
                    <p className="text-slate-700 mb-3">
                      Send us your feedback, suggestions, or questions:
                    </p>
                    <a
                      href="mailto:feedback@kanjilearning.app"
                      className="inline-flex items-center justify-center px-4 py-3 sm:py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-lg hover:from-rose-500 hover:to-pink-600 transition-colors shadow-md font-medium min-h-[48px] sm:min-h-[auto] w-full sm:w-auto text-center"
                    >
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="break-all sm:break-normal">feedback@kanjilearning.app</span>
                    </a>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-white rounded-lg border border-rose-200">
                    <h4 className="font-semibold text-rose-800 mb-2">💡 Suggestions Welcome</h4>
                    <p className="text-sm text-slate-700">
                      Have ideas for new features or improvements? We&apos;re always looking for ways to enhance the learning experience.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-rose-200">
                    <h4 className="font-semibold text-rose-800 mb-2">🐛 Bug Reports</h4>
                    <p className="text-sm text-slate-700">
                      Found something that isn&apos;t working correctly? Let us know and we&apos;ll fix it as soon as possible.
                    </p>
                  </div>
                </div>

                <div className="text-center mt-6 p-4 bg-white rounded-lg border border-rose-200">
                  <p className="text-sm text-slate-600">
                    <strong>Response Time:</strong> We typically respond to emails within 24-48 hours.
                    Thank you for helping us make this platform better! 🌸
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Kanji Journey?</h2>
            <p className="text-rose-100 mb-6">
              Begin with the first kanji and work your way through the most essential characters in Japanese!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-white text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shadow-md font-semibold"
            >
              Start Learning Now
              <ArrowLeftIcon className="w-5 h-5 ml-2 rotate-180" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>🌸 Master kanji at your own pace with our comprehensive learning platform 🌸</p>
        </footer>
      </div>
    </div>
  );
}