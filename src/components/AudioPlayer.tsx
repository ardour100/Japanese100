"use client";

import { useState, useRef, useEffect } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

interface AudioPlayerProps {
  audioSrc: string;
  kanjiId: number;
  className?: string;
}

export default function AudioPlayer({ audioSrc, kanjiId, className = "" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [audioExists, setAudioExists] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Check if audio file exists
  useEffect(() => {
    const checkAudioExists = async () => {
      try {
        const response = await fetch(audioSrc, { method: 'HEAD' });
        setAudioExists(response.ok);
        if (!response.ok) {
          setHasError(true);
        }
      } catch (error) {
        setAudioExists(false);
        setHasError(true);
      }
    };

    checkAudioExists();
  }, [audioSrc]);

  const playAudio = async () => {
    if (!audioRef.current || hasError || !audioExists) {
      // Fallback to speech synthesis for kanji without audio files
      await playWithSpeechSynthesis();
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);

      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      setHasError(true);
      // Fallback to speech synthesis
      await playWithSpeechSynthesis();
    } finally {
      setIsLoading(false);
    }
  };

  const playWithSpeechSynthesis = async () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);

      // Get the hiragana reading from the kanji data
      const kanjiData = await import('@/data/kanji.json');
      const kanji = kanjiData.default.find(k => k.id === kanjiId);

      if (kanji) {
        const utterance = new SpeechSynthesisUtterance(kanji?.hiragana);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => {
          setIsPlaying(false);
          setHasError(true);
        };

        speechSynthesis.speak(utterance);
      } else {
        setIsPlaying(false);
        setHasError(true);
      }
    } else {
      setHasError(true);
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleAudioError = () => {
    setHasError(true);
    setIsPlaying(false);
    setIsLoading(false);
  };

  const getButtonIcon = () => {
    if (hasError && !audioExists) {
      return <SpeakerXMarkIcon className="w-6 h-6" />;
    }
    return <SpeakerWaveIcon className="w-6 h-6" />;
  };

  const getButtonClass = () => {
    const baseClass = `p-3 rounded-full transition-all shadow-lg ${className}`;

    if (isLoading) {
      return `${baseClass} bg-rose-300 text-rose-700 cursor-wait`;
    }

    if (isPlaying) {
      return `${baseClass} bg-rose-200 text-rose-600 animate-pulse`;
    }

    if (hasError && !audioExists) {
      return `${baseClass} bg-yellow-200 text-yellow-700 hover:bg-yellow-300`;
    }

    return `${baseClass} bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600`;
  };

  const getTooltipText = () => {
    if (hasError && !audioExists) {
      return "Audio file not available - using speech synthesis";
    }
    if (isLoading) {
      return "Loading audio...";
    }
    if (isPlaying) {
      return "Playing...";
    }
    return audioExists ? "Play native audio" : "Play with speech synthesis";
  };

  return (
    <div className="relative">
      <button
        onClick={playAudio}
        disabled={isLoading}
        className={getButtonClass()}
        title={getTooltipText()}
        aria-label={getTooltipText()}
      >
        {getButtonIcon()}
      </button>

      {/* Hidden audio element for real audio files */}
      {audioExists && (
        <audio
          ref={audioRef}
          preload="metadata"
          onEnded={handleAudioEnd}
          onError={handleAudioError}
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
        >
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Status indicator */}
      {(hasError && !audioExists) && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
      )}
      {audioExists && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
      )}
    </div>
  );
}