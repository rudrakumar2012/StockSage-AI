"use client";

import Link from "next/link";
import Radar from 'lucide-react/dist/esm/icons/radar';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname

export default function Navbar() {
  const { isAuthenticated, logout, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login'); // Redirect to login after logout
  };

  // Prevent rendering until auth state is determined to avoid UI flicker
  // OR hide Navbar on dashboard
  if (isLoading || pathname === '/dashboard') {
    return null; 
  }

  return (
    // Floating Pill Design: top-6, rounded-full, heavy shadow
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-5xl border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-full px-4 md:px-6 py-2.5 md:py-3 flex justify-between items-center transition-all hover:border-white/20 hover:bg-[#0a0a0a]/80">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="p-1.5 md:p-2 bg-linear-to-br from-indigo-500 to-fuchsia-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform duration-300">
            <Radar className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
          </div>
          <span className="text-lg md:text-xl font-display font-bold tracking-tight text-white">
            Stock<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-400">Sage</span>
          </span>
        </Link>

        {/* EXPANDED NAVIGATION */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 text-[10px] lg:text-sm font-medium text-zinc-400">
          <Link href="/about" className="hover:text-white transition-colors">
            Methodology
          </Link>
          <Link href="/#scanners" className="hover:text-white transition-colors">Scanners</Link>
          <Link href="/#infrastructure" className="hover:text-white transition-colors">Infrastructure</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 md:gap-4">
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="hidden sm:block text-xs md:text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/login" className="px-4 md:px-5 py-2 md:py-2.5 bg-white text-black rounded-full font-bold text-[10px] md:text-sm hover:scale-105 animate-glow transition-all duration-300 whitespace-nowrap">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hidden sm:block text-xs md:text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="px-4 md:px-5 py-2 md:py-2.5 bg-gray-700 text-white rounded-full font-bold text-[10px] md:text-sm hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}