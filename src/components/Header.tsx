"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AcademicCapIcon, InformationCircleIcon, Bars3Icon, XMarkIcon, ArchiveBoxIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import AuthButton from './AuthButton';
import GojuonModal from './GojuonModal';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [isGojuonModalOpen, setIsGojuonModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) { // sm breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl">🌸</div>
              <div>
                <h1 className="text-xl font-bold text-rose-800">漢字学習</h1>
                <p className="text-xs text-slate-600 hidden sm:block font-medium">Kanji Learning</p>
              </div>
            </Link>

            {/* Center - Navigation Links (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              {/* Archive Link */}
              <Link
                href="/archive"
                className="inline-flex items-center px-2 sm:px-3 py-2 border border-amber-300 rounded-lg text-sm font-medium text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 transition-colors shadow-sm"
              >
                <ArchiveBoxIcon className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden md:inline">Archive</span>
                <span className="md:hidden">📦</span>
              </Link>

              {/* Progress Link */}
              <Link
                href="/progress"
                className="inline-flex items-center px-2 sm:px-3 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors shadow-sm"
              >
                <span className="text-sm mr-1 sm:mr-2">📊</span>
                <span className="hidden md:inline">Progress</span>
                <span className="md:hidden">📊</span>
              </Link>

              {/* Daily Phrases Link */}
              <Link
                href="/phrases"
                className="inline-flex items-center px-2 sm:px-3 py-2 border border-green-300 rounded-lg text-sm font-medium text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors shadow-sm"
              >
                <span className="text-sm mr-1 sm:mr-2">💬</span>
                <span className="hidden md:inline">Phrases</span>
                <span className="md:hidden">💬</span>
              </Link>

              {/* Vocabulary Link */}
              <Link
                href="/vocabulary"
                className="inline-flex items-center px-2 sm:px-3 py-2 border border-purple-300 rounded-lg text-sm font-medium text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors shadow-sm"
              >
                <span className="text-sm mr-1 sm:mr-2">📚</span>
                <span className="hidden md:inline">Vocabulary</span>
                <span className="md:hidden">📚</span>
              </Link>

              {/* Dictionary Link */}
              <Link
                href="/dictionary"
                className="inline-flex items-center px-2 sm:px-3 py-2 border border-cyan-300 rounded-lg text-sm font-medium text-cyan-700 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-colors shadow-sm"
              >
                <span className="text-sm mr-1 sm:mr-2">📘</span>
                <span className="hidden md:inline">Dictionary</span>
                <span className="md:hidden">📘</span>
              </Link>

              {/* Introduction Link */}
              <Link
                href="/introduction"
                className="inline-flex items-center px-2 sm:px-3 py-2 border border-rose-300 rounded-lg text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 transition-colors shadow-sm"
              >
                <InformationCircleIcon className="w-4 h-4 mr-1 sm:mr-2" />
                <span>How to Use</span>
              </Link>

              {/* Notes Link - only show for non-authenticated users */}
              {isHydrated && !isAuthenticated && (
                <Link
                  href="/notes"
                  className="inline-flex items-center px-2 sm:px-3 py-2 border border-orange-300 rounded-lg text-sm font-medium text-orange-700 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors shadow-sm"
                >
                  <PencilSquareIcon className="w-4 h-4 mr-1 sm:mr-2" />
                  <span>Notes</span>
                </Link>
              )}

              {/* Gojuon Button */}
              {isHydrated ? (
                <button
                  onClick={() => setIsGojuonModalOpen(true)}
                  className="inline-flex items-center px-2 sm:px-3 py-2 border border-rose-300 rounded-lg text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 transition-colors shadow-sm"
                >
                  <AcademicCapIcon className="w-4 h-4 mr-1 sm:mr-2" />
                  <span>Gojūon</span>
                </button>
              ) : (
                <div className="w-20 h-10" />
              )}
            </div>

            {/* Right side - Mobile Menu Button + Auth Button */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden inline-flex items-center p-2 border border-rose-300 rounded-lg text-rose-700 bg-white hover:bg-rose-50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-5 h-5" />
                ) : (
                  <Bars3Icon className="w-5 h-5" />
                )}
              </button>

              {/* Auth Button */}
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-rose-200 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-2">
              {/* Archive Link */}
              <Link
                href="/archive"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 transition-colors border border-amber-200"
              >
                <ArchiveBoxIcon className="w-5 h-5 mr-3" />
                <span className="font-medium">Archive</span>
              </Link>

              {/* Progress Link */}
              <Link
                href="/progress"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors border border-blue-200"
              >
                <span className="text-lg mr-3">📊</span>
                <span className="font-medium">Progress</span>
              </Link>

              {/* Daily Phrases Link */}
              <Link
                href="/phrases"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors border border-green-200"
              >
                <span className="text-lg mr-3">💬</span>
                <span className="font-medium">Daily Phrases</span>
              </Link>

              {/* Vocabulary Link */}
              <Link
                href="/vocabulary"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors border border-purple-200"
              >
                <span className="text-lg mr-3">📚</span>
                <span className="font-medium">Vocabulary</span>
              </Link>

              {/* Dictionary Link */}
              <Link
                href="/dictionary"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-cyan-700 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-colors border border-cyan-200"
              >
                <span className="text-lg mr-3">📘</span>
                <span className="font-medium">Dictionary</span>
              </Link>

              {/* Introduction Link */}
              <Link
                href="/introduction"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-rose-700 bg-white hover:bg-rose-50 transition-colors border border-rose-200"
              >
                <InformationCircleIcon className="w-5 h-5 mr-3" />
                <span className="font-medium">How to Use</span>
              </Link>

              {/* Notes Link - only show for non-authenticated users */}
              {isHydrated && !isAuthenticated && (
                <Link
                  href="/notes"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-3 rounded-lg text-orange-700 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors border border-orange-200"
                >
                  <PencilSquareIcon className="w-5 h-5 mr-3" />
                  <span className="font-medium">Notes</span>
                </Link>
              )}

              {/* Gojuon Button */}
              {isHydrated && (
                <button
                  onClick={() => {
                    setIsGojuonModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 rounded-lg text-rose-700 bg-white hover:bg-rose-50 transition-colors border border-rose-200"
                >
                  <AcademicCapIcon className="w-5 h-5 mr-3" />
                  <span className="font-medium">Gojūon Chart</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Gojuon Modal */}
      <GojuonModal
        isOpen={isGojuonModalOpen}
        onClose={() => setIsGojuonModalOpen(false)}
      />
    </>
  );
}