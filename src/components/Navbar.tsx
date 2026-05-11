"use client";

import Link from "next/link";
import Image from "next/image";
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (pathname === '/dashboard') {
    return null;
  }

  const navLinks = [
    { name: "Methodology", href: "/about" },
    { name: "Scanners", href: "/#scanners" },
    { name: "Infrastructure", href: "/#infrastructure" },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-5xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-[2rem] md:rounded-full px-4 md:px-8 py-3 md:py-4 flex justify-between items-center transition-all relative">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="relative w-8 h-8 md:w-10 md:h-10 shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform duration-300 rounded-full overflow-hidden">
            <Image
              src="/logo.png"
              alt="StockSage Logo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 32px, 40px"
              priority
            />
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

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-all duration-300">
              Launch Terminal
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 text-zinc-400 hover:text-white transition-colors rounded-full"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        <div className={`absolute top-[calc(100%+1rem)] left-0 right-0 p-6 bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl md:hidden transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl px-4 py-3 transition-colors min-h-[44px] flex items-center"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/5 my-2" />
            <Link href="/dashboard" className="w-full py-4 bg-white text-black rounded-2xl font-bold text-center min-h-[44px] flex items-center justify-center">
              Launch Terminal
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}