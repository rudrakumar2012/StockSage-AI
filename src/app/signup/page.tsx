"use client";
export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// useAuth is not directly used here for signup, as it doesn't immediately log the user in.
// However, if signup immediately logs the user in, useAuth would be needed.
// For now, we'll focus on the signup API call and redirect.

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/auth/signup', { // Assuming the signup API is at /api/auth/signup
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        return;
      }

      setSuccessMessage('Account created successfully! You will be redirected to login.');
      // Optionally redirect to login or dashboard after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      console.error('Signup submission error:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020202] py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      <div className="w-full max-w-md space-y-8 bg-[#0a0a0a] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-3xl" />
        
        <div>
          <h2 className="mt-6 text-center text-3xl md:text-4xl font-bold tracking-tight text-white italic">
            Node <span className="text-fuchsia-500 not-italic font-light">Registration.</span>
          </h2>
          <p className="mt-2 text-center text-xs md:text-sm text-zinc-500 font-light">
            Register a new instance or{' '}
            <Link href="/login" className="font-medium text-fuchsia-400 hover:text-fuchsia-300 underline underline-offset-4 decoration-fuchsia-500/30">
              access existing node
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="full-name" className="sr-only">Full Name</label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                required
                className="relative block w-full px-4 py-3 md:py-4 bg-zinc-900/50 border border-white/10 placeholder-zinc-600 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all text-sm font-mono tracking-tight"
                placeholder="FULL NAME"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-4 py-3 md:py-4 bg-zinc-900/50 border border-white/10 placeholder-zinc-600 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all text-sm font-mono tracking-tight"
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
                autoComplete="new-password"
                required
                className="relative block w-full px-4 py-3 md:py-4 bg-zinc-900/50 border border-white/10 placeholder-zinc-600 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all text-sm font-mono tracking-tight"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-xl text-center text-[10px] md:text-xs font-mono uppercase tracking-widest">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-xl text-center text-[10px] md:text-xs font-mono uppercase tracking-widest">
              {successMessage}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 md:py-4 px-4 bg-white text-black text-xs md:text-sm font-black uppercase tracking-[0.2em] rounded-xl hover:bg-fuchsia-50 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl"
            >
              Deploy Instance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}