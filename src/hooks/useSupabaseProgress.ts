"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { KanjiProgress } from '@/types/progress';

const STORAGE_KEY = 'kanji-progress';
const ARCHIVE_STORAGE_KEY = 'kanji-archived';

export const useSupabaseProgress = () => {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<KanjiProgress>({});
  const [archivedKanji, setArchivedKanji] = useState<Set<number>>(new Set());
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
      // Load ALL progress from Supabase in one bulk query for authenticated users
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_progress')
          .select('kanji_id, progress_level, is_archived')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading progress from Supabase:', error);
          return;
        }

        // Build complete progress map and archived set from bulk data
        const progressMap: KanjiProgress = {};
        const archivedSet = new Set<number>();

        data?.forEach((item) => {
          progressMap[item.kanji_id] = item.progress_level;
          if (item.is_archived) {
            archivedSet.add(item.kanji_id);
          }
        });

        setProgress(progressMap);
        setArchivedKanji(archivedSet);
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

      const savedArchived = localStorage.getItem(ARCHIVE_STORAGE_KEY);
      if (savedArchived) {
        try {
          setArchivedKanji(new Set(JSON.parse(savedArchived)));
        } catch (error) {
          console.error('Failed to parse saved archived kanji:', error);
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

  const toggleArchiveKanji = useCallback(async (kanjiId: number) => {
    const isCurrentlyArchived = archivedKanji.has(kanjiId);
    const newArchivedSet = new Set(archivedKanji);

    if (isCurrentlyArchived) {
      newArchivedSet.delete(kanjiId);
    } else {
      newArchivedSet.add(kanjiId);
    }

    // Optimistically update local state
    setArchivedKanji(newArchivedSet);

    if (isSupabaseConfigured() && isAuthenticated && user) {
      // Save to Supabase for authenticated users
      try {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            kanji_id: kanjiId,
            progress_level: progress[kanjiId] || 0,
            is_archived: !isCurrentlyArchived,
          }, { onConflict: 'user_id, kanji_id' });

        if (error) {
          console.error('Error updating archive status in Supabase:', error);
          // Revert optimistic update
          setArchivedKanji(archivedKanji);
        }
      } catch (error) {
        console.error('Error updating archive status:', error);
        // Revert optimistic update
        setArchivedKanji(archivedKanji);
      }
    } else {
      // Save to localStorage for anonymous users or when Supabase is not configured
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(Array.from(newArchivedSet)));
    }
  }, [archivedKanji, progress, isAuthenticated, user]);

  const isKanjiArchived = useCallback((kanjiId: number): boolean => {
    // Before hydration, return false to prevent hydration mismatch
    if (!isHydrated) {
      return false;
    }
    return archivedKanji.has(kanjiId);
  }, [archivedKanji, isHydrated]);

  const getArchivedKanji = useCallback((): number[] => {
    return Array.from(archivedKanji);
  }, [archivedKanji]);

  return {
    progress,
    updateProgress,
    getKanjiProgress,
    resetProgress,
    getProgressStats,
    toggleArchiveKanji,
    isKanjiArchived,
    getArchivedKanji,
    isLoaded: isLoaded && isHydrated,
    isLoading,
    isAuthenticated: isSupabaseConfigured() ? isAuthenticated : false
  };
};