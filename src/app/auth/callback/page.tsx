"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error during auth callback:', error);
          router.push('/?error=auth_error');
          return;
        }

        if (data?.session) {
          // Successfully authenticated
          router.push('/');
        } else {
          // No session, redirect to home
          router.push('/');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        router.push('/?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mb-4"></div>
        <p className="text-rose-600 text-lg">Completing sign in...</p>
      </div>
    </div>
  );
}