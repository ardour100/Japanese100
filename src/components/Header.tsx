"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AcademicCapIcon, InformationCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import AuthButton from './AuthButton';
import GojuonModal from './GojuonModal';

export default function Header() {
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
              {/* Joyo Kanji Link */}
              <Link
                href="/joyo-kanji"
                className="inline-flex items-center px-2 sm:px-3 py-2 border border-indigo-300 rounded-lg text-sm font-medium text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors shadow-sm"
              >
                <span className="text-sm mr-1 sm:mr-2">📚</span>
                <span className="hidden md:inline">Jōyō Kanji</span>
                <span className="md:hidden">Jōyō</span>
              </Link>

              {/* Introduction Link */}
              <Link
                href="/introduction"
                className="inline-flex items-center px-2 sm:px-3 py-2 border border-rose-300 rounded-lg text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 transition-colors shadow-sm"
              >
                <InformationCircleIcon className="w-4 h-4 mr-1 sm:mr-2" />
                <span>How to Use</span>
              </Link>

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
              {/* Joyo Kanji Link */}
              <Link
                href="/joyo-kanji"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors border border-indigo-200"
              >
                <span className="text-lg mr-3">📚</span>
                <span className="font-medium">Jōyō Kanji</span>
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