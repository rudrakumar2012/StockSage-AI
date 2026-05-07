"use client";

import Link from "next/link";
import Radar from 'lucide-react/dist/esm/icons/radar';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from "react";

import { toast } from "sonner";

interface DashboardHeaderProps {
  lastUpdated?: string; // ISO timestamp from sync log
}

// Simple relative time formatter (no dependencies)
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function DashboardHeader({ lastUpdated }: DashboardHeaderProps) {
  const { user, logout, updateUser, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Methodology", href: "/about" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="p-1.5 bg-linear-to-br from-indigo-500 to-fuchsia-500 rounded-full cursor-pointer">
            <Radar className="w-3 md:w-3.5 h-3 md:h-3.5 text-white" />
          </div>
          <span className="text-base md:text-lg font-bold tracking-tight text-white cursor-pointer">
            Stock<span className="text-indigo-400">Sage</span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs font-mono text-indigo-400 uppercase tracking-widest">Terminal</span>
          </span>
        </Link>

        {/* Last Updated Indicator */}
        {lastUpdated && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-emerald-400/70 uppercase tracking-widest">
              Updated {getRelativeTime(lastUpdated)}
            </span>
          </div>
        )}

        {/* User Section */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile: Show user name, Desktop: Show name + email */}
          <div className="flex flex-col items-end">
            <span className="text-xs md:text-sm font-bold text-white uppercase tracking-tight">{user?.fullName}</span>
            <span className="hidden sm:block text-xs font-medium text-zinc-500">{user?.email}</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 bg-zinc-900/50 border border-white/5 rounded-full">
              {isPro ? (
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Pro</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-zinc-500" />
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Free</span>
                </div>
              )}
            </div>

            {/* Mobile: Compact tier badge */}
            <div className="sm:hidden flex items-center gap-1 px-2 py-1 bg-zinc-900/50 border border-white/5 rounded-full">
              {isPro ? (
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
              ) : (
                <Zap className="w-3 h-3 text-zinc-500" />
              )}
              <span className="text-xs font-bold uppercase tracking-widest">{isPro ? 'PRO' : 'FREE'}</span>
            </div>

            {!isPro && (
              <button
                onClick={handleUpgrade}
                className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-all group cursor-pointer shadow-lg shadow-indigo-500/20"
              >
                <Zap className="w-3 h-3 text-white animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap">Upgrade</span>
              </button>
            )}
          </div>

          <div className="h-6 md:h-8 w-px bg-white/10 hidden md:block" />

          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 md:py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-full transition-all group cursor-pointer min-h-[44px]"
          >
            <LogOut className="w-3 md:w-3.5 h-3 md:h-3.5 text-zinc-400 group-hover:text-rose-400 transition-colors" />
            <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">Sign Out</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/5 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl px-4 pb-4 pt-2">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors min-h-[44px] flex items-center"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/5 my-2" />
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-xs text-zinc-500">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors min-h-[44px] flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
