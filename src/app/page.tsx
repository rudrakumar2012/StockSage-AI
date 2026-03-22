"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Zap, Shield, Layers, Terminal, Activity, Command, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-zinc-400 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* 1. THE LIVE DATA TAPE (SCROLLING TICKER) - Z-INDEX 40 */}
      <div className="fixed top-[72px] inset-x-0 z-40 py-2.5 bg-indigo-600/5 border-y border-white/5 backdrop-blur-md overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 whitespace-nowrap px-4"
        >
          <TickerItem symbol="AAPL" price="214.32" change="+1.2%" isPos={true} />
          <TickerItem symbol="TSLA" price="178.10" change="-0.8%" isPos={false} />
          <TickerItem symbol="NVDA" price="892.45" change="+3.4%" isPos={true} />
          <TickerItem symbol="BTC" price="68,432" change="+0.5%" isPos={true} />
          <TickerItem symbol="ETH" price="3,412" change="-1.4%" isPos={false} />
          {/* Duplicates for seamless loop */}
          <TickerItem symbol="AAPL" price="214.32" change="+1.2%" isPos={true} />
          <TickerItem symbol="TSLA" price="178.10" change="-0.8%" isPos={false} />
        </motion.div>
      </div>

      <main className="relative z-10">
        
        {/* HERO SECTION - PADDED TO PREVENT CRASHING */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center pt-32">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative max-w-5xl">
            
            {/* FLOATING LATENCY CHIP - POSITIONED SAFELY */}
            <motion.div 
              animate={{ y: [0, -12, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -left-12 hidden xl:block z-10"
            >
              <div className="p-4 bg-zinc-900/90 border border-white/10 rounded-2xl backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center gap-3 mb-1.5">
                  <Activity className="text-emerald-500" size={12} />
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Edge_Latency</span>
                </div>
                <p className="text-lg font-mono text-white tracking-tighter italic">0.002ms</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl mb-12"
            >
              <span className="text-[10px] font-black tracking-[0.5em] text-indigo-400 uppercase">System Initialized</span>
            </motion.div>

            <h1 className="text-7xl md:text-[140px] font-black tracking-tighter text-white mb-10 italic leading-[0.8] uppercase">
              STOCKSAGE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800 not-italic tracking-normal">Intelligence</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-zinc-500 mb-14 font-medium leading-relaxed italic">
              "We don't trade markets. We trade the <span className="text-zinc-200">asymmetry of information</span>."
            </p>

            <Link href="/dashboard" className="group relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
              <button className="relative px-12 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-transform active:scale-95">
                Open Terminal <Terminal size={18} strokeWidth={3} />
              </button>
            </Link>
          </motion.div>
        </section>

        {/* BENTO ARCHITECTURE */}
        <section className="max-w-7xl mx-auto px-6 py-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 group relative p-12 rounded-[4rem] bg-zinc-900/30 border border-white/5 overflow-hidden hover:bg-zinc-900/50 transition-all">
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[350px]">
                <Layers className="text-indigo-400 mb-8" size={40} />
                <div>
                  <h3 className="text-5xl font-bold text-white mb-6 italic tracking-tighter leading-tight">Neural Layer <br /> Processing</h3>
                  <p className="text-zinc-500 leading-relaxed text-lg max-w-md italic font-medium">
                    Detecting institutional liquidity gaps using high-density transformer models.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 p-12 rounded-[4rem] bg-zinc-900/30 border border-white/5 flex flex-col justify-end gap-12 group hover:border-emerald-500/30 transition-all">
               <Zap className="text-emerald-500 group-hover:scale-110 transition-transform" size={56} strokeWidth={1} />
               <h3 className="text-2xl font-bold text-white italic uppercase tracking-tighter">Sub-10ms <br /> Resolution</h3>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[1.5em] text-zinc-900">StockSage — Terminal v2.0</p>
      </footer>
    </div>
  );
}

function TickerItem({ symbol, price, change, isPos }: any) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px]">
      <span className="text-zinc-600 font-black tracking-widest italic">{symbol}</span>
      <span className="text-white font-bold">${price}</span>
      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${isPos ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
        {change}
      </span>
    </div>
  );
}