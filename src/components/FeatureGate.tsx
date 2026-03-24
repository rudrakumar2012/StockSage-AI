"use client";

import { useAuth } from "@/context/AuthContext";
import { Lock } from "lucide-react";
import Link from "next/link";

interface FeatureGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

import { toast } from "sonner";

export default function FeatureGate({ children, fallback }: FeatureGateProps) {
  const { user, token, updateUser } = useAuth();
  
  const isPro = user?.subscriptionTier === 'PRO';

  const handleQuickUpgrade = async () => {
    if (!token) {
      toast.error("Please sign in to upgrade");
      return;
    }

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
        return data.user;
      }
      const err = await response.json();
      throw new Error(err.error || "Upgrade failed");
    });

    toast.promise(upgradePromise, {
      loading: 'Unlocking Pro Feature...',
      success: 'Feature Unlocked. Institutional access granted.',
      error: (err) => `Unlock Failed: ${err.message}`,
    });
  };

  if (isPro) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative group cursor-not-allowed">
      <div className="blur-sm grayscale opacity-40 pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-3xl border border-white/5 transition-all group-hover:bg-black/60">
        <div className="p-3 bg-zinc-900 rounded-full mb-3 border border-white/10 shadow-2xl">
          <Lock className="w-5 h-5 text-indigo-400" />
        </div>
        <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-1">Pro Feature</p>
        <button 
          onClick={handleQuickUpgrade}
          className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/50 cursor-pointer"
        >
          Upgrade to Unlock
        </button>
      </div>
    </div>
  );
}
