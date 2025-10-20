"use client";

import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const hasHandledSignInRef = useRef(false);

  useEffect(() => {
    // If Supabase is not configured, set loading to false and return
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, 'User:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle redirect after OAuth - only once and only from callback page
        if (event === 'SIGNED_IN' && session && !hasHandledSignInRef.current) {
          // Only redirect if we're on the auth callback page
          if (window.location.pathname.includes('/auth/callback')) {
            console.log('🔄 Redirecting from callback to home page');
            hasHandledSignInRef.current = true;
            window.location.href = '/';
          } else {
            console.log('✅ Already on app page, skipping redirect');
            hasHandledSignInRef.current = true;
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. Cannot sign in.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during Google sign in:', error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. Cannot sign out.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    isSupabaseConfigured: isSupabaseConfigured()
  };
};