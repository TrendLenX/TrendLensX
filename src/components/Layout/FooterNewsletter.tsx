'use client';
import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus(res.ok ? 'done' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p className="text-green-400 text-sm font-medium">
        ✓ Subscribed! Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
        placeholder="Enter your email"
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
      />
      {status === 'error' && (
        <p className="text-red-400 text-xs">Something went wrong. Try again.</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Mail className="w-4 h-4" />
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  );
}
