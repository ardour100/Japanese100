"use client";

import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { gojuonData, gojuonHeaders } from '@/data/gojuon';

interface GojuonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GojuonModal({ isOpen, onClose }: GojuonModalProps) {
  // Play pronunciation for a character
  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-rose-200 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
          <div>
            <h2 className="text-2xl font-bold text-rose-800">🌸 Gojūon</h2>
            <p className="text-sm text-rose-600">Hiragana Syllabary</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-rose-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-rose-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Column Headers */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {gojuonHeaders.map((header) => (
              <div key={header} className="text-center">
                <div className="text-sm font-semibold text-rose-600 uppercase tracking-wider">
                  {header}
                </div>
              </div>
            ))}
          </div>

          {/* Gojuon Grid */}
          <div className="space-y-2">
            {gojuonData.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-5 gap-2">
                {row.map((char, charIndex) => (
                  <div
                    key={`${rowIndex}-${charIndex}`}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all ${
                      char.hiragana
                        ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-rose-200 hover:border-rose-300 hover:shadow-md hover:scale-105 cursor-pointer'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => char.hiragana && playPronunciation(char.hiragana)}
                  >
                    {char.hiragana && (
                      <>
                        <div className="text-2xl sm:text-3xl font-bold text-rose-800 mb-1">
                          {char.hiragana}
                        </div>
                        <div className="text-xs sm:text-sm text-rose-600 font-medium">
                          {char.romaji}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-rose-200">
            <p className="text-sm text-rose-600 text-center">
              <span className="font-semibold">Gojūon</span> - The traditional ordering of Japanese syllables
            </p>
            <p className="text-xs text-rose-500 text-center mt-1">
              Click on any character to hear its pronunciation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}