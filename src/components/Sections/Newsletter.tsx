import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-16">
      <div className="container-custom text-center">
        <Mail className="w-12 h-12 text-white/80 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Stay Updated with TrendLensX
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Get the latest trends, insights, and opportunities delivered straight to your inbox.
          No spam, just valuable content.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center space-x-2 text-white">
            <CheckCircle className="w-6 h-6" />
            <span className="text-lg">Thanks for subscribing!</span>
          </div>
        ) : status === 'error' ? (
          <div className="flex items-center justify-center space-x-2 text-red-300">
            <AlertCircle className="w-6 h-6" />
            <span className="text-lg">{errorMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </form>
        )}
      </div>
    </section>
  );
}
