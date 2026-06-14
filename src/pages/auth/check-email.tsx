import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEOHead from '@/components/SEO/SEOHead';

export default function CheckEmail() {
  const router = useRouter();
  const { email } = router.query;
  const safeEmail = typeof email === 'string' ? email : '';

  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleResend = async () => {
    if (!safeEmail || resendState === 'sending' || resendState === 'sent') return;
    setResendState('sending');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: safeEmail }),
      });
      setResendState(res.ok ? 'sent' : 'error');
    } catch {
      setResendState('error');
    }
  };

  return (
    <>
      <SEOHead title="Check Your Email" description="Verify your TrendLensX account" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Check your inbox</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-1">
            We sent a verification link to
          </p>
          {safeEmail && (
            <p className="font-semibold text-gray-800 mb-4">{safeEmail}</p>
          )}
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Click the link in the email to verify your account. The link expires in <strong>24 hours</strong>.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Didn&apos;t receive it?</p>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure you used the correct email</li>
              <li>Wait a minute and try resending below</li>
            </ul>
          </div>

          {resendState === 'sent' ? (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
              ✓ A new verification link has been sent.
            </div>
          ) : resendState === 'error' ? (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
              Something went wrong. Please try again.
            </div>
          ) : null}

          {safeEmail && resendState !== 'sent' && (
            <button
              onClick={handleResend}
              disabled={resendState === 'sending'}
              className="w-full py-3 px-4 border border-indigo-300 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-50 mb-4"
            >
              {resendState === 'sending' ? 'Sending...' : 'Resend verification email'}
            </button>
          )}

          <Link
            href="/auth/signin"
            className="block text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </>
  );
}
