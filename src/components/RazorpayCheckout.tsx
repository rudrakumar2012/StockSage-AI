"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toast } from "sonner";

export default function RazorpayCheckout() {
  const { user, updateUser, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    if (!user) {
      toast.error("Please sign in to upgrade");
      router.push('/login');
      return;
    }

    setLoading(true);
    
    const upgradePromise = fetch('/api/auth/upgrade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        updateUser(data.user);
        router.push('/dashboard');
        return data.user;
      }
      const err = await response.json();
      throw new Error(err.error || "Upgrade failed");
    });

    toast.promise(upgradePromise, {
      loading: 'Initializing Pro Access...',
      success: 'Upgrade Successful. Welcome to Terminal Pro.',
      error: (err) => `Upgrade Failed: ${err.message}`,
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleSubscription}
        disabled={loading}
        className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-white text-black hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Processing..." : "Initialize Pro Access"}
      </button>
      <p className="text-[9px] text-zinc-500 font-mono text-center uppercase tracking-[0.1em]">
        Demo upgrade • No real payment
      </p>
    </div>
  );
}
