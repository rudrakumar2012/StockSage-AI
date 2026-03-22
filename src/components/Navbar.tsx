import Link from 'next/link';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            STOCKSAGE<span className="text-indigo-500">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Market Pulse</Link>
          <Link href="/analytics" className="hover:text-white transition-colors">AI Insights</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Launch Terminal
          </Link>
        </div>
      </div>
    </nav>
  );
}