"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DatabaseZap from 'lucide-react/dist/esm/icons/database-zap';

export default function SystemBootLoader() {
  const router = useRouter();
  const [dots, setDots] = useState("");

  // Animated ellipsis
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Poll the server to check if DB is ready
  useEffect(() => {
    const checkInterval = setInterval(() => {
      router.refresh(); // Triggers a server-side re-render check
    }, 2000);
    return () => clearInterval(checkInterval);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono selection:bg-indigo-500/30">
      <div className="flex flex-col items-center max-w-md w-full p-10 border border-white/10 rounded-3xl bg-[#050505] shadow-[0_0_50px_rgba(99,102,241,0.05)] relative overflow-hidden">
        
        {/* Scanning Line Animation */}
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50 shadow-[0_0_20px_#6366f1] animate-[scan_2s_ease-in-out_infinite]" />

        <div className="p-4 bg-indigo-500/10 rounded-full mb-8 relative">
          <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-ping" />
          <DatabaseZap className="w-8 h-8 text-indigo-400" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2 tracking-widest uppercase text-center">
          Initializing Terminal
        </h2>
        
        <div className="w-full space-y-3 mt-6">
          <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest">
            <span>Status</span>
            <span className="text-amber-500 animate-pulse">Building DB{dots}</span>
          </div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-1/2 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
          <p className="text-center text-[9px] text-zinc-600 uppercase tracking-[0.2em] mt-4">
            Fetching fresh YFinance data. Please hold.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          50% { transform: translateY(300px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}