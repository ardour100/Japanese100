"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AcademicCapIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import AuthButton from './AuthButton';
import GojuonModal from './GojuonModal';

export default function Header() {
  const [isGojuonModalOpen, setIsGojuonModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
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

            {/* Center - Navigation Links */}
            <div className="flex items-center gap-3">
              {/* Introduction Link */}
              <Link
                href="/introduction"
                className="inline-flex items-center px-3 py-2 border border-rose-300 rounded-lg text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 transition-colors shadow-sm"
              >
                <InformationCircleIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">How to Use</span>
                <span className="sm:hidden">?</span>
              </Link>

              {/* Gojuon Button */}
              {isHydrated ? (
                <button
                  onClick={() => setIsGojuonModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-rose-300 rounded-lg text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 transition-colors shadow-sm"
                >
                  <AcademicCapIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Gojūon</span>
                  <span className="sm:hidden">あ</span>
                </button>
              ) : (
                <div className="w-20 h-10" />
              )}
            </div>

            {/* Right - Auth Button */}
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Gojuon Modal */}
      <GojuonModal
        isOpen={isGojuonModalOpen}
        onClose={() => setIsGojuonModalOpen(false)}
      />
    </>
  );
}