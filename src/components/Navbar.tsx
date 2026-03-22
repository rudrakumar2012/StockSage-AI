"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Menu } from "lucide-react";

export default function Navbar() {
  const { scrollY } = useScroll();
  
  // Transform background and padding
  const backgroundColor = useTransform(scrollY, [0, 50], ["rgba(5, 5, 5, 0)", "rgba(9, 9, 11, 0.8)"]);
  const navPadding = useTransform(scrollY, [0, 50], ["24px", "12px"]);
  
  // FIX: Instead of backdropBlur in style, we'll use an opacity-based transform for the border
  const borderOpacity = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]);

  return (
    <motion.nav 
      style={{ 
        backgroundColor, 
        paddingBlock: navPadding,
        borderBottomColor: borderOpacity 
      }}
      className="fixed top-0 inset-x-0 z-[100] border-b backdrop-blur-md transition-shadow"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="text-sm font-black tracking-[0.3em] text-white uppercase italic">StockSage</span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/dashboard">Terminal</NavLink>
          <NavLink href="/about">Intelligence</NavLink>
          <NavLink href="/pricing">Licensing</NavLink>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Access System
          </Link>
          <button className="md:hidden text-white"><Menu size={20} /></button>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-indigo-400 transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all group-hover:w-full" />
    </Link>
  );
}