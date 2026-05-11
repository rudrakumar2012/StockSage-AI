"use client";

import Link from "next/link";
import Radar from 'lucide-react/dist/esm/icons/radar';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  lastUpdated?: string;
}

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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Methodology", href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="p-1.5 bg-linear-to-br from-indigo-500 to-fuchsia-500 rounded-full cursor-pointer">
            <Radar className="w-3 md:w-3.5 h-3 md:h-3.5 text-white" />
          </div>
          <span className="text-base md:text-lg font-bold tracking-tight text-white cursor-pointer">
            Stock<span className="text-indigo-400">Sage</span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs font-mono text-indigo-400 uppercase tracking-widest">Terminal</span>
          </span>
        </Link>

        {lastUpdated && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-emerald-400/70 uppercase tracking-widest">
              Updated {getRelativeTime(lastUpdated)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/5 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

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
          </div>
        </div>
      )}
    </header>
  );
}