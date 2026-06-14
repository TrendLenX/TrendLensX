import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEOHead from '@/components/SEO/SEOHead';

export default function UnsubscribePage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async () => {
    if (!token || typeof token !== 'string') {
      setStatus('error');
      setMessage('Invalid unsubscribe link. Please try again or contact us.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('done');
        setMessage(data.message || 'You have been unsubscribed.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <>
      <SEOHead title="Unsubscribe" description="Unsubscribe from the TrendLensX newsletter" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">

          {status === 'done' ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Unsubscribed</h1>
              <p className="text-gray-500 text-sm mb-8">
                You&apos;ve been removed from the TrendLensX newsletter. You won&apos;t receive any more emails from us.
              </p>
              <p className="text-gray-400 text-sm mb-6">Changed your mind?</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Back to TrendLensX
              </Link>
            </>
          ) : status === 'error' ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Something went wrong</h1>
              <p className="text-gray-500 text-sm mb-8">{message}</p>
              <Link href="/contact" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Contact us for help
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Unsubscribe from newsletter?</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                You&apos;ll stop receiving the TrendLensX newsletter. You can always subscribe again from our homepage.
              </p>
              <button
                onClick={handleUnsubscribe}
                disabled={status === 'loading' || !token}
                className="w-full py-3 px-4 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 mb-4"
              >
                {status === 'loading' ? 'Processing…' : 'Yes, unsubscribe me'}
              </button>
              <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Never mind, keep me subscribed
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
