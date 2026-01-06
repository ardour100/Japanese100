"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { UserIcon, ArrowRightOnRectangleIcon, PencilSquareIcon, ChevronDownIcon, BookOpenIcon, LanguageIcon } from '@heroicons/react/24/outline';

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOut, isAuthenticated, isSupabaseConfigured } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        {/* User Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
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
            <ChevronDownIcon className={`w-4 h-4 text-rose-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-rose-200 py-1 z-50">
              <Link
                href="/notes"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
              >
                <PencilSquareIcon className="w-4 h-4 mr-3 text-orange-600" />
                Notes
              </Link>
              <Link
                href="/dictionary"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <LanguageIcon className="w-4 h-4 mr-3 text-blue-600" />
                Dictionary
              </Link>
              <Link
                href="/vocabulary-book"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <BookOpenIcon className="w-4 h-4 mr-3 text-purple-600" />
                Vocabulary Book
              </Link>
              <hr className="border-rose-100 my-1" />
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  signOut();
                }}
                disabled={loading}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>
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