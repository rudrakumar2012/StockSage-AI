"use client";

import Link from "next/link";
import Radar from 'lucide-react/dist/esm/icons/radar';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import { useAuth } from '@/context/AuthContext'; 
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (isLoading || pathname === '/dashboard') {
    return null; 
  }

  const navLinks = [
    { name: "Methodology", href: "/about" },
    { name: "Scanners", href: "/#scanners" },
    { name: "Infrastructure", href: "/#infrastructure" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-5xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-[2rem] md:rounded-full px-4 md:px-8 py-3 md:py-4 flex justify-between items-center transition-all relative">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="p-1.5 md:p-2 bg-linear-to-br from-indigo-500 to-fuchsia-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform duration-300">
            <Radar className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg md:text-xl font-display font-bold tracking-tight text-white">
            Stock<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-400">Sage</span>
          </span>
        </Link>

        {/* PC NAVIGATION - CENTERED */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-white transition-colors whitespace-nowrap">
              {link.name}
            </Link>
          ))}
        </div>

        {/* ACTION BUTTONS & MOBILE TOGGLE */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0">
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/login" className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-all duration-300">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="px-6 py-2.5 bg-zinc-800 text-white rounded-full font-bold text-sm hover:bg-zinc-700 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {isMenuOpen && (
          <div className="absolute top-[calc(100%+1rem)] left-0 right-0 p-6 bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-2" />
              {!isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <Link href="/login" className="text-lg font-medium text-zinc-400">
                    Sign In
                  </Link>
                  <Link href="/signup" className="w-full py-4 bg-white text-black rounded-2xl font-bold text-center">
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/dashboard" className="text-lg font-medium text-indigo-400">
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full py-4 bg-zinc-800 text-white rounded-2xl font-bold text-center"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
