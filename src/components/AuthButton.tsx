"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOut, isAuthenticated, isSupabaseConfigured } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Don't render anything until hydrated to prevent mismatch
  if (!isHydrated) {
    return <div className="w-24 h-10" />; // Placeholder with similar dimensions
  }

  // Always show the sign-in button, even if Supabase is not fully configured
  // This allows users to attempt sign-in and see any configuration messages

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-600"></div>
        <span className="text-rose-600 text-sm">Loading...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Debug logging
    console.log('User authenticated:', user);
    console.log('Avatar URL:', user.user_metadata?.avatar_url);

    return (
      <div className="flex items-center space-x-3">
        {/* User Avatar Only */}
        <div className="flex items-center">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="User"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-rose-200"
              onError={(e) => {
                console.error('Avatar image failed to load:', e);
              }}
            />
          ) : (
            <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center border border-rose-200">
              <UserIcon className="w-5 h-5 text-rose-600" />
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={signOut}
          className="inline-flex items-center px-3 py-2 border border-rose-300 rounded-lg text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 transition-colors shadow-sm"
          disabled={loading}
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Sign Out</span>
          <span className="sm:hidden">Out</span>
        </button>
      </div>
    );
  }

  const handleSignIn = async () => {
    if (!isSupabaseConfigured) {
      alert('Authentication is not configured. Please check the Supabase configuration.');
      return;
    }
    await signInWithGoogle();
  };

  return (
    <button
      onClick={handleSignIn}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md ${
        isSupabaseConfigured
          ? 'text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
          : 'text-gray-500 bg-gray-200 cursor-not-allowed'
      }`}
      disabled={loading || !isSupabaseConfigured}
    >
      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span className="hidden sm:inline">
        {isSupabaseConfigured ? 'Sign in' : 'Auth not configured'}
      </span>
      <span className="sm:hidden">
        {isSupabaseConfigured ? 'Sign in' : 'No auth'}
      </span>
    </button>
  );
}