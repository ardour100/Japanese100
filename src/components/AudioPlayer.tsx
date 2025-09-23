"use client";

import { useState, useCallback } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

interface AudioPlayerProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AudioPlayer({ text, className = '', size = 'md' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  const playAudio = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Set Japanese voice preferences
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8; // Slightly slower for learning
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a Japanese voice
    const voices = window.speechSynthesis.getVoices();
    const japaneseVoice = voices.find(voice =>
      voice.lang.includes('ja') || voice.name.includes('Japanese')
    );

    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsSupported(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, isPlaying]);

  if (!isSupported) {
    return null; // Hide button if not supported
  }

  return (
    <button
      onClick={playAudio}
      className={`
        inline-flex items-center justify-center rounded-lg transition-all duration-200
        ${isPlaying
          ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
          : 'bg-rose-100 text-rose-600 hover:bg-rose-200 border border-rose-300'
        }
        ${buttonSizeClasses[size]}
        ${className}
      `}
      title={isPlaying ? "Stop audio" : "Play audio"}
      type="button"
    >
      {isPlaying ? (
        <SpeakerXMarkIcon className={sizeClasses[size]} />
      ) : (
        <SpeakerWaveIcon className={sizeClasses[size]} />
      )}
    </button>
  );
}