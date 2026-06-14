import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEOHead from '@/components/SEO/SEOHead';

type Status = 'invalid' | 'expired' | 'error' | 'success' | undefined;

const messages: Record<NonNullable<Status>, { icon: string; title: string; body: string; color: string; iconBg: string }> = {
  success: {
    icon: '✓',
    iconBg: 'bg-green-100',
    color: 'text-green-600',
    title: 'Email verified!',
    body: 'Your account is now active. You can sign in below.',
  },
  expired: {
    icon: '⏰',
    iconBg: 'bg-amber-100',
    color: 'text-amber-600',
    title: 'Link expired',
    body: 'This verification link has expired. Request a new one below.',
  },
  invalid: {
    icon: '✕',
    iconBg: 'bg-red-100',
    color: 'text-red-600',
    title: 'Invalid link',
    body: 'This verification link is invalid or has already been used. Request a new one below.',
  },
  error: {
    icon: '!',
    iconBg: 'bg-red-100',
    color: 'text-red-600',
    title: 'Something went wrong',
    body: 'We couldn\'t verify your email. Please try again or request a new link.',
  },
};

export default function VerifyEmail() {
  const router = useRouter();
  const status = router.query.status as Status;
  const meta = status ? messages[status] : null;

  const [email, setEmail] = useState('');
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || resendState === 'sending' || resendState === 'sent') return;
    setResendState('sending');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setResendState(res.ok ? 'sent' : 'error');
    } catch {
      setResendState('error');
    }
  };

  const showResend = status === 'expired' || status === 'invalid' || status === 'error';

  return (
    <>
      <SEOHead title="Verify Email" description="Email verification for TrendLensX" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          {meta && (
            <>
              <div className={`w-16 h-16 ${meta.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <span className={`text-2xl font-bold ${meta.color}`}>{meta.icon}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-3">{meta.title}</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">{meta.body}</p>
            </>
          )}

          {status === 'success' ? (
            <Link
              href="/auth/signin"
              className="block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Sign in now
            </Link>
          ) : showResend ? (
            <>
              {resendState === 'sent' ? (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-6">
                  ✓ A new verification link has been sent. Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3 mb-6 text-left">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Your email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {resendState === 'error' && (
                    <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
                  )}
                  <button
                    type="submit"
                    disabled={resendState === 'sending'}
                    className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {resendState === 'sending' ? 'Sending...' : 'Resend verification email'}
                  </button>
                </form>
              )}
              <Link href="/auth/signin" className="text-sm text-gray-500 hover:text-gray-700">
                ← Back to sign in
              </Link>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Go to sign in
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
