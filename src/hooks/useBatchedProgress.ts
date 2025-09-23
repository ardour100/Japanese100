"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

interface BatchedProgressResult {
  progress: Record<number, { progress: number; isArchived: boolean }>;
}

export const useBatchedProgress = () => {
  const { user, isAuthenticated } = useAuth();
  const [batchedProgress, setBatchedProgress] = useState<Record<number, { progress: number; isArchived: boolean }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadedBatches, setLoadedBatches] = useState<Set<string>>(new Set());

  const loadProgressBatch = useCallback(async (kanjiIds: number[]): Promise<Record<number, { progress: number; isArchived: boolean }>> => {
    // Create a cache key for this batch
    const batchKey = kanjiIds.sort().join(',');

    // Return cached data if already loaded
    if (loadedBatches.has(batchKey)) {
      const cachedData: Record<number, { progress: number; isArchived: boolean }> = {};
      kanjiIds.forEach(id => {
        if (batchedProgress[id]) {
          cachedData[id] = batchedProgress[id];
        }
      });
      return cachedData;
    }

    // For unauthenticated users or when Supabase is not configured, return defaults
    if (!isSupabaseConfigured() || !isAuthenticated || !user) {
      const defaultProgress: Record<number, { progress: number; isArchived: boolean }> = {};
      kanjiIds.forEach(id => {
        // Special case: kanji #1 shows as mastered for demo purposes
        defaultProgress[id] = {
          progress: id === 1 ? 100 : 0,
          isArchived: false
        };
      });
      return defaultProgress;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/progress/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kanjiIds,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: BatchedProgressResult = await response.json();

      // Update cache
      setBatchedProgress(prev => ({
        ...prev,
        ...result.progress
      }));

      // Mark this batch as loaded
      setLoadedBatches(prev => new Set([...prev, batchKey]));

      return result.progress;
    } catch (error) {
      console.error('Error loading progress batch:', error);

      // Return defaults on error
      const defaultProgress: Record<number, { progress: number; isArchived: boolean }> = {};
      kanjiIds.forEach(id => {
        defaultProgress[id] = {
          progress: 0,
          isArchived: false
        };
      });
      return defaultProgress;
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated, batchedProgress, loadedBatches]);

  const getKanjiProgress = useCallback((kanjiId: number): number => {
    return batchedProgress[kanjiId]?.progress || 0;
  }, [batchedProgress]);

  const isKanjiArchived = useCallback((kanjiId: number): boolean => {
    return batchedProgress[kanjiId]?.isArchived || false;
  }, [batchedProgress]);

  const clearCache = useCallback(() => {
    setBatchedProgress({});
    setLoadedBatches(new Set());
  }, []);

  return {
    loadProgressBatch,
    getKanjiProgress,
    isKanjiArchived,
    isLoading,
    clearCache,
  };
};