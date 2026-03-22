import Link from "next/link";
import { Terminal, ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    // Floating Pill Design: top-6, rounded-full, heavy shadow
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-[1200px] border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-full px-6 py-3 flex justify-between items-center transition-all hover:border-white/20 hover:bg-[#0a0a0a]/80">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform duration-300">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-white">
            Stock<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Sage</span>
          </span>
        </Link>

        {/* EXPANDED NAVIGATION */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#platform" className="hover:text-white flex items-center gap-1 transition-colors">
            Platform <ChevronDown className="w-4 h-4 text-zinc-500" />
          </Link>
          <Link href="#analytics" className="hover:text-white transition-colors">AI Analytics</Link>
          <Link href="#infrastructure" className="hover:text-white transition-colors">Infrastructure</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/dashboard" className="px-5 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:scale-105 animate-glow transition-all duration-300">
            Launch Terminal
          </Link>
        </div>

      </nav>
    </div>
  );
}