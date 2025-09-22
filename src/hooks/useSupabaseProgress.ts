"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { KanjiProgress } from '@/types/progress';

const STORAGE_KEY = 'kanji-progress';

export const useSupabaseProgress = () => {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<KanjiProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load progress from Supabase or localStorage
  const loadProgress = useCallback(async () => {
    if (isSupabaseConfigured() && isAuthenticated && user) {
      // Load from Supabase for authenticated users
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_progress')
          .select('kanji_id, progress_level')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading progress from Supabase:', error);
          return;
        }

        const progressMap: KanjiProgress = {};
        data?.forEach((item) => {
          progressMap[item.kanji_id] = item.progress_level;
        });

        setProgress(progressMap);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Load from localStorage for anonymous users or when Supabase is not configured
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        try {
          setProgress(JSON.parse(savedProgress));
        } catch (error) {
          console.error('Failed to parse saved progress:', error);
        }
      }
    }
    setIsLoaded(true);
  }, [isAuthenticated, user]);

  // Migrate localStorage progress to Supabase when user logs in
  const migrateLocalProgressToSupabase = useCallback(async () => {
    if (!isSupabaseConfigured() || !isAuthenticated || !user) return;

    const localProgress = localStorage.getItem(STORAGE_KEY);
    if (!localProgress) return;

    try {
      const parsedProgress: KanjiProgress = JSON.parse(localProgress);
      const progressEntries = Object.entries(parsedProgress);

      if (progressEntries.length === 0) return;

      // Insert all progress entries
      const { error } = await supabase
        .from('user_progress')
        .upsert(
          progressEntries.map(([kanjiId, level]) => ({
            user_id: user.id,
            kanji_id: parseInt(kanjiId),
            progress_level: level,
          })),
          { onConflict: 'user_id, kanji_id' }
        );

      if (error) {
        console.error('Error migrating progress to Supabase:', error);
      } else {
        // Clear localStorage after successful migration
        localStorage.removeItem(STORAGE_KEY);
        console.log('Successfully migrated progress to Supabase');
      }
    } catch (error) {
      console.error('Error during progress migration:', error);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    // Migrate local progress when user logs in
    if (isSupabaseConfigured() && isAuthenticated && user && isLoaded) {
      migrateLocalProgressToSupabase().then(() => {
        // Reload progress after migration
        loadProgress();
      });
    }
  }, [isAuthenticated, user, isLoaded, migrateLocalProgressToSupabase, loadProgress]);

  const updateProgress = useCallback(async (kanjiId: number, level: number) => {
    // Optimistically update local state
    const newProgress = { ...progress, [kanjiId]: level };
    setProgress(newProgress);

    if (isSupabaseConfigured() && isAuthenticated && user) {
      // Save to Supabase for authenticated users
      try {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            kanji_id: kanjiId,
            progress_level: level,
          }, { onConflict: 'user_id, kanji_id' });

        if (error) {
          console.error('Error saving progress to Supabase:', error);
          // Revert optimistic update
          setProgress(progress);
        }
      } catch (error) {
        console.error('Error updating progress:', error);
        // Revert optimistic update
        setProgress(progress);
      }
    } else {
      // Save to localStorage for anonymous users or when Supabase is not configured
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    }
  }, [progress, isAuthenticated, user]);

  const getKanjiProgress = useCallback((kanjiId: number): number => {
    // Before hydration, return 0 to prevent hydration mismatch
    if (!isHydrated) {
      return 0;
    }

    // If user is not authenticated and it's the first kanji, show as mastered (100%)
    if (!isAuthenticated && kanjiId === 1) {
      return 100;
    }

    return progress[kanjiId] || 0;
  }, [progress, isAuthenticated, isHydrated]);

  const resetProgress = useCallback(async () => {
    if (isSupabaseConfigured() && isAuthenticated && user) {
      // Clear from Supabase for authenticated users
      try {
        const { error } = await supabase
          .from('user_progress')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          console.error('Error resetting progress in Supabase:', error);
          return;
        }
      } catch (error) {
        console.error('Error resetting progress:', error);
        return;
      }
    } else {
      // Clear from localStorage for anonymous users or when Supabase is not configured
      localStorage.removeItem(STORAGE_KEY);
    }

    setProgress({});
  }, [isAuthenticated, user]);

  const getProgressStats = useCallback(() => {
    const totalKanji = Object.keys(progress).length;
    const completedKanji = Object.values(progress).filter(level => level === 100).length;
    const inProgressKanji = Object.values(progress).filter(level => level > 0 && level < 100).length;

    return {
      total: totalKanji,
      completed: completedKanji,
      inProgress: inProgressKanji,
      notStarted: 0 // This would need the total kanji count to calculate properly
    };
  }, [progress]);

  return {
    progress,
    updateProgress,
    getKanjiProgress,
    resetProgress,
    getProgressStats,
    isLoaded: isLoaded && isHydrated,
    isLoading,
    isAuthenticated: isSupabaseConfigured() ? isAuthenticated : false
  };
};