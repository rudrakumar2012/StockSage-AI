import Link from "next/link";
import { Terminal, ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030303]/60 backdrop-blur-xl shadow-2xl shadow-black/50">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-lg group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase">
            Stock<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Sage</span>
          </span>
        </Link>

        {/* EXPANDED NAVIGATION */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-zinc-300">
          <Link href="#platform" className="hover:text-white flex items-center gap-1 transition-colors">
            Platform <ChevronDown className="w-4 h-4 text-zinc-500" />
          </Link>
          <Link href="#analytics" className="hover:text-white transition-colors">AI Analytics</Link>
          <Link href="#infrastructure" className="hover:text-white transition-colors">Infrastructure</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/company" className="hover:text-white transition-colors">Company</Link>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-sm font-bold text-zinc-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/dashboard" className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
            Launch Terminal
          </Link>
        </div>

      </div>
    </nav>
  );
}