"use client";

import { isSupabaseConfigured } from '@/lib/supabase';
import { useSupabaseProgress } from './useSupabaseProgress';
import { useState, useEffect } from 'react';
import { KanjiProgress } from '@/types/progress';

const STORAGE_KEY = 'kanji-progress';

// Fallback localStorage-only hook
const useLocalStorageProgress = () => {
  const [progress, setProgress] = useState<KanjiProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load progress from localStorage on mount
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Failed to parse saved progress:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateProgress = (kanjiId: number, level: number) => {
    const newProgress = { ...progress, [kanjiId]: level };
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const getKanjiProgress = (kanjiId: number): number => {
    return progress[kanjiId] || 0;
  };

  const resetProgress = () => {
    setProgress({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    progress,
    updateProgress,
    getKanjiProgress,
    resetProgress,
    isLoaded,
    isLoading: false,
    isAuthenticated: false
  };
};

export const useProgress = () => {
  // Use Supabase hook if configured, otherwise fall back to localStorage
  if (isSupabaseConfigured()) {
    return useSupabaseProgress();
  } else {
    return useLocalStorageProgress();
  }
};