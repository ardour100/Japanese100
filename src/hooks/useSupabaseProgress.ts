"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { KanjiProgress } from '@/types/progress';

const STORAGE_KEY = 'kanji-progress';
const ARCHIVE_STORAGE_KEY = 'kanji-archived';
const BROADCAST_CHANNEL_NAME = 'kanji-progress-sync';

// Message types for cross-tab communication
type BroadcastMessage =
  | { type: 'PROGRESS_LOADED'; progress: KanjiProgress; archived: number[]; userId: string }
  | { type: 'PROGRESS_UPDATED'; kanjiId: number; level: number; userId: string }
  | { type: 'ARCHIVE_TOGGLED'; kanjiId: number; isArchived: boolean; userId: string }
  | { type: 'REQUEST_PROGRESS'; userId: string };

export const useSupabaseProgress = () => {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<KanjiProgress>({});
  const [archivedKanji, setArchivedKanji] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);

  // BroadcastChannel for cross-tab sync
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const lastLoadedUserIdRef = useRef<string | null>(null);
  // Store latest progress and archived state in refs to avoid recreating BroadcastChannel
  const progressRef = useRef<KanjiProgress>({});
  const archivedKanjiRef = useRef<Set<number>>(new Set());
  // Use ref for isLoading to avoid it being in loadProgress dependencies
  const isLoadingRef = useRef(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Keep refs in sync with state
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    archivedKanjiRef.current = archivedKanji;
  }, [archivedKanji]);

  // Initialize BroadcastChannel for cross-tab communication
  useEffect(() => {
    // Check if BroadcastChannel is supported
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      console.warn('BroadcastChannel not supported');
      return;
    }

    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannelRef.current = channel;

      // Listen for messages from other tabs
      channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
        const message = event.data;

        // Only process messages for the current user
        if (message.userId !== user?.id) return;

        switch (message.type) {
          case 'PROGRESS_LOADED':
            // Another tab loaded progress, use its data
            console.log('📡 Received PROGRESS_LOADED from another tab');
            setProgress(message.progress);
            setArchivedKanji(new Set(message.archived));
            setIsLoaded(true);
            lastLoadedUserIdRef.current = message.userId;
            break;

          case 'PROGRESS_UPDATED':
            // Another tab updated progress, sync the change
            console.log('📡 Received PROGRESS_UPDATED from another tab');
            setProgress(prev => ({ ...prev, [message.kanjiId]: message.level }));
            break;

          case 'ARCHIVE_TOGGLED':
            // Another tab toggled archive, sync the change
            console.log('📡 Received ARCHIVE_TOGGLED from another tab');
            setArchivedKanji(prev => {
              const newSet = new Set(prev);
              if (message.isArchived) {
                newSet.add(message.kanjiId);
              } else {
                newSet.delete(message.kanjiId);
              }
              return newSet;
            });
            break;

          case 'REQUEST_PROGRESS':
            // Another tab is requesting progress data
            // Use refs to access latest values without adding dependencies
            if (lastLoadedUserIdRef.current === user?.id) {
              console.log('📡 Responding to REQUEST_PROGRESS from another tab');
              channel.postMessage({
                type: 'PROGRESS_LOADED',
                progress: progressRef.current,
                archived: Array.from(archivedKanjiRef.current),
                userId: user.id
              } as BroadcastMessage);
            }
            break;
        }
      };

      console.log('📡 BroadcastChannel initialized');

      return () => {
        channel.close();
        broadcastChannelRef.current = null;
        console.log('📡 BroadcastChannel closed');
      };
    } catch (error) {
      console.error('Error initializing BroadcastChannel:', error);
    }
  }, [user?.id]); // Only depend on user?.id, not on progress/archivedKanji

  // Migrate localStorage progress to Supabase when user logs in
  const migrateLocalProgressToSupabase = useCallback(async () => {
    if (!isSupabaseConfigured() || !isAuthenticated || !user || hasMigrated) return;

    const localProgress = localStorage.getItem(STORAGE_KEY);
    if (!localProgress) {
      setHasMigrated(true);
      return;
    }

    try {
      const parsedProgress: KanjiProgress = JSON.parse(localProgress);
      const progressEntries = Object.entries(parsedProgress);

      if (progressEntries.length === 0) {
        setHasMigrated(true);
        return;
      }

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
      setHasMigrated(true);
    } catch (error) {
      console.error('Error during progress migration:', error);
      setHasMigrated(true);
    }
  }, [isAuthenticated, user, hasMigrated]);

  // Load progress from Supabase or localStorage with cross-tab sync
  const loadProgress = useCallback(async () => {
    const userId = user?.id;

    if (isSupabaseConfigured() && isAuthenticated && userId) {
      // Check if already loading or already loaded for this user
      if (isLoadingRef.current) {
        console.log('⏳ Already loading, skipping duplicate request');
        return;
      }

      if (lastLoadedUserIdRef.current === userId) {
        console.log('✅ Already loaded for this user, skipping');
        return;
      }

      // First, request data from other tabs (non-blocking)
      if (broadcastChannelRef.current) {
        console.log('📡 Requesting progress from other tabs...');
        broadcastChannelRef.current.postMessage({
          type: 'REQUEST_PROGRESS',
          userId
        } as BroadcastMessage);

        // Wait briefly to see if another tab responds
        await new Promise(resolve => setTimeout(resolve, 100));

        // If another tab already loaded the data, skip loading
        if (lastLoadedUserIdRef.current === userId) {
          console.log('✅ Received data from another tab, skipping Supabase request');
          return;
        }
      }

      // First, attempt migration if not done yet
      if (!hasMigrated) {
        await migrateLocalProgressToSupabase();
      }

      // Load from Supabase for authenticated users
      try {
        isLoadingRef.current = true;
        setIsLoading(true);
        console.log('🔄 Loading progress from Supabase...');

        const { data, error } = await supabase
          .from('user_progress')
          .select('kanji_id, progress_level, is_archived')
          .eq('user_id', userId);

        if (error) {
          console.error('Error loading progress from Supabase:', error);
          return;
        }

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
        lastLoadedUserIdRef.current = userId;

        // Broadcast to other tabs
        if (broadcastChannelRef.current) {
          console.log('📡 Broadcasting PROGRESS_LOADED to other tabs');
          broadcastChannelRef.current.postMessage({
            type: 'PROGRESS_LOADED',
            progress: progressMap,
            archived: Array.from(archivedSet),
            userId
          } as BroadcastMessage);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        isLoadingRef.current = false;
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
  }, [isAuthenticated, user?.id, hasMigrated, migrateLocalProgressToSupabase]); // Removed isLoading from dependencies, using ref instead

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const updateProgress = useCallback(async (kanjiId: number, level: number) => {
    const userId = user?.id;

    // Optimistically update local state
    const newProgress = { ...progress, [kanjiId]: level };
    setProgress(newProgress);

    // Broadcast to other tabs
    if (broadcastChannelRef.current && userId) {
      broadcastChannelRef.current.postMessage({
        type: 'PROGRESS_UPDATED',
        kanjiId,
        level,
        userId
      } as BroadcastMessage);
    }

    if (isSupabaseConfigured() && isAuthenticated && userId) {
      // Save to Supabase for authenticated users
      try {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
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
  }, [progress, isAuthenticated, user?.id]);

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
    const userId = user?.id;
    const isCurrentlyArchived = archivedKanji.has(kanjiId);
    const newArchivedSet = new Set(archivedKanji);

    if (isCurrentlyArchived) {
      newArchivedSet.delete(kanjiId);
    } else {
      newArchivedSet.add(kanjiId);
    }

    // Optimistically update local state
    setArchivedKanji(newArchivedSet);

    // Broadcast to other tabs
    if (broadcastChannelRef.current && userId) {
      broadcastChannelRef.current.postMessage({
        type: 'ARCHIVE_TOGGLED',
        kanjiId,
        isArchived: !isCurrentlyArchived,
        userId
      } as BroadcastMessage);
    }

    if (isSupabaseConfigured() && isAuthenticated && userId) {
      // Save to Supabase for authenticated users
      try {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
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
  }, [archivedKanji, progress, isAuthenticated, user?.id]);

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