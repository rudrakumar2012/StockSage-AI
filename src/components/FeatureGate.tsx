"use client";

import { useAuth } from "@/context/AuthContext";
import { Lock } from "lucide-react";
import Link from "next/link";

interface FeatureGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function FeatureGate({ children, fallback }: FeatureGateProps) {
  const { user } = useAuth();
  
  const isPro = user?.subscriptionTier === 'PRO';

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
        <Link 
          href="/pricing" 
          className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/50"
        >
          Upgrade to Unlock
        </Link>
      </div>
    </div>
  );
}
