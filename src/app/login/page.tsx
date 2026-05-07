"use client";
export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/auth/login', { // Assuming the login API is at /api/auth/login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      // Assuming the login API returns { user: ..., token: ... }
      if (data.token && data.user) {
        login(data.user, data.token);
        router.push('/dashboard'); // Redirect to dashboard on successful login
      } else {
        setError('Login failed: Unexpected response from server.');
      }

    } catch (err) {
      console.error('Login submission error:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020202] py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      <div className="w-full max-w-md space-y-8 bg-[#0a0a0a] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
        
        <div>
          <h2 className="mt-6 text-center text-3xl md:text-4xl font-bold tracking-tight text-white italic">
            Terminal <span className="text-indigo-500 not-italic font-light">Login.</span>
          </h2>
          <p className="mt-2 text-center text-xs md:text-sm text-zinc-500 font-light">
            Enter your institutional credentials or{' '}
            <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30">
              register a new node
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-4 py-3 md:py-4 bg-zinc-900/50 border border-white/10 placeholder-zinc-600 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-mono tracking-tight"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-4 py-3 md:py-4 bg-zinc-900/50 border border-white/10 placeholder-zinc-600 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-mono tracking-tight"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-xs">
              <a href="#" className="font-medium text-zinc-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">
                Forgot access?
              </a>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-xl text-center text-xs font-mono uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-[0.1em] mb-4">
              By logging in, you acknowledge you have read and understood our{' '}
              <a href="/disclaimer" className="underline text-zinc-400 hover:text-zinc-300">Disclaimer</a>.
            </p>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 md:py-4 px-4 bg-white text-black text-xs md:text-sm font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-50 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl"
            >
              Initialize Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}