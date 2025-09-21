"use client";

import Link from 'next/link';
import AuthButton from './AuthButton';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-rose-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">🌸</div>
            <div>
              <h1 className="text-xl font-bold text-rose-800">漢字学習</h1>
              <p className="text-xs text-rose-600 hidden sm:block">Kanji Learning</p>
            </div>
          </Link>

          {/* Auth Button */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}