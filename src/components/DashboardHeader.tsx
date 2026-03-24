"use client";

import Link from "next/link";
import Radar from 'lucide-react/dist/esm/icons/radar';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Zap from 'lucide-react/dist/esm/icons/zap';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import { toast } from "sonner";

export default function DashboardHeader() {
  const { user, logout, updateUser, token } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleUpgrade = async () => {
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
      loading: 'Initializing Pro Access...',
      success: (data: any) => 'Terminal Pro Activated. Welcome aboard!',
      error: (err) => `Access Refused: ${err.message}`,
    });
  };

  const isPro = user?.subscriptionTier === 'PRO';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/50 backdrop-blur-xl px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
      {/* Logo Section */}
      <Link href="/" className="flex items-center gap-2 md:gap-3 group">
        <div className="p-1.5 bg-linear-to-br from-indigo-500 to-fuchsia-500 rounded-full cursor-pointer">
          <Radar className="w-3 md:w-3.5 h-3 md:h-3.5 text-white" />
        </div>
        <span className="text-base md:text-lg font-bold tracking-tight text-white cursor-pointer">
          Stock<span className="text-indigo-400">Sage</span>
          <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-mono text-indigo-400 uppercase tracking-widest">Terminal</span>
        </span>
      </Link>

      {/* User Section */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 bg-zinc-900/50 border border-white/5 rounded-full">
            {isPro ? (
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Pro</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-zinc-500" />
                <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Free</span>
              </div>
            )}
          </div>

          {!isPro && (
            <button 
              onClick={handleUpgrade}
              className="flex items-center gap-2 px-3 md:px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-all group cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              <Zap className="w-3 h-3 text-white animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">Upgrade</span>
            </button>
          )}
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-tight">{user?.fullName}</span>
          <span className="text-[9px] md:text-[10px] font-medium text-zinc-500">{user?.email}</span>
        </div>
        
        <div className="h-6 md:h-8 w-px bg-white/10 hidden md:block" />

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-full transition-all group cursor-pointer"
        >
          <LogOut className="w-3 md:w-3.5 h-3 md:h-3.5 text-zinc-400 group-hover:text-rose-400 transition-colors" />
          <span className="hidden sm:inline text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
