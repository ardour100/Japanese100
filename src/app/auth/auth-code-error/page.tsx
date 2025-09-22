import Link from 'next/link';
import Header from '@/components/Header';
import JapaneseBackground from '@/components/JapaneseBackground';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <JapaneseBackground />
      <Header />

      <div className="relative z-10 flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
            <p className="text-gray-600 mb-6">
              There was an error during the sign-in process. This might be due to:
            </p>
            <ul className="text-left text-sm text-gray-500 mb-6 space-y-1">
              <li>• OAuth configuration issues</li>
              <li>• Network connectivity problems</li>
              <li>• Temporary service unavailability</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-colors"
            >
              Return to Home
            </Link>
            <Link
              href="/introduction"
              className="block w-full border border-rose-300 text-rose-700 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors"
            >
              View Setup Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}