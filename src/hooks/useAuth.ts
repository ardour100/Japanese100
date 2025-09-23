"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) {
      return;
    }
    initialized.current = true;

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
        // Only update state if there's an actual change
        setSession((prevSession) => {
          if (prevSession?.access_token !== session?.access_token) {
            return session;
          }
          return prevSession;
        });

        setUser((prevUser) => {
          if (prevUser?.id !== session?.user?.id) {
            return session?.user ?? null;
          }
          return prevUser;
        });

        setLoading(false);

        // Handle redirect after OAuth
        if (event === 'SIGNED_IN' && session) {
          // Redirect to home page after successful login
          window.location.href = '/';
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
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
  }, []);

  const signOut = useCallback(async () => {
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
  }, []);

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