"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Zap, Globe, Shield, BarChart3, ChevronRight, Activity, Command, Layers, Terminal } from "lucide-react";
import { useRef } from "react";

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-zinc-400 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* 1. THE LIVE DATA TAPE (SCROLLING TICKER) */}
      <div className="fixed top-20 inset-x-0 z-50 py-2 bg-indigo-600/5 border-y border-white/5 backdrop-blur-md overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap px-4"
        >
          <TickerItem symbol="AAPL" price="214.32" change="+1.2%" isPos={true} />
          <TickerItem symbol="TSLA" price="178.10" change="-0.8%" isPos={false} />
          <TickerItem symbol="NVDA" price="892.45" change="+3.4%" isPos={true} />
          <TickerItem symbol="BTC" price="68,432" change="+0.5%" isPos={true} />
          <TickerItem symbol="ETH" price="3,412" change="-1.4%" isPos={false} />
          {/* Duplicates for the loop */}
          <TickerItem symbol="AAPL" price="214.32" change="+1.2%" isPos={true} />
          <TickerItem symbol="TSLA" price="178.10" change="-0.8%" isPos={false} />
        </motion.div>
      </div>

      <main className="relative z-10">
        
        {/* HERO: INSTITUTIONAL ENTRANCE */}
        <section className="relative h-screen flex flex-col items-center justify-center px-6 text-center">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative">
            
            {/* FLOATING DATA CHIPS (The "Not Basic" Factor) */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -left-20 hidden lg:block"
            >
              <div className="p-4 bg-zinc-900/80 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="text-emerald-500" size={14} />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Latency</span>
                </div>
                <p className="text-xl font-mono text-white tracking-tighter">0.002ms</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl mb-12"
            >
              <span className="text-[10px] font-black tracking-[0.5em] text-indigo-400 uppercase">System Initialized</span>
            </motion.div>

            <h1 className="text-7xl md:text-[150px] font-black tracking-tighter text-white mb-10 italic leading-[0.8]">
              STOCKSAGE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800 not-italic uppercase font-black tracking-normal">Intelligence</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-zinc-500 mb-14 font-medium leading-relaxed italic">
              "We don't trade markets. We trade the <span className="text-zinc-200">asymmetry of information</span>."
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href="/dashboard" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
                <button className="relative px-12 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-transform active:scale-95">
                  Launch Terminal <Terminal size={18} strokeWidth={3} />
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* BENTO ARCHITECTURE (The "System" Look) */}
        <section className="max-w-7xl mx-auto px-6 py-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento 1: AI Logic */}
            <div className="md:col-span-8 group relative p-12 rounded-[4rem] bg-zinc-900/30 border border-white/5 overflow-hidden hover:bg-zinc-900/50 transition-all">
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[350px]">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Layers className="text-indigo-400" size={32} />
                </div>
                <div>
                  <h3 className="text-5xl font-bold text-white mb-6 italic tracking-tighter leading-tight">Neural Layer <br /> Processing</h3>
                  <p className="text-zinc-500 leading-relaxed text-lg max-w-md italic">
                    Identify whale accumulation patterns and liquidity gaps before they manifest in the public order book.
                  </p>
                </div>
              </div>
              <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all" />
            </div>

            {/* Bento 2: The "Speed" Card */}
            <div className="md:col-span-4 p-12 rounded-[4rem] bg-zinc-900/30 border border-white/5 flex flex-col justify-end gap-12 group hover:border-emerald-500/30 transition-all">
               <Zap className="text-emerald-500 group-hover:scale-125 transition-transform duration-500" size={56} strokeWidth={1} />
               <div>
                  <h3 className="text-2xl font-bold text-white mb-2 italic uppercase tracking-tighter">Sub-10ms</h3>
                  <p className="text-zinc-500 text-sm font-medium">Edge ingestion via Cloudflare D1 across 300+ global nodes.</p>
               </div>
            </div>

            {/* Bento 3: Secure Flow */}
            <div className="md:col-span-12 p-16 rounded-[4rem] bg-gradient-to-r from-zinc-900/40 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="max-w-xl">
                  <h3 className="text-3xl font-bold text-white italic mb-4 tracking-tight">Institutional Privacy Protocol</h3>
                  <p className="text-zinc-500">Your analysis is your edge. We utilize zero-knowledge proofs to ensure your terminal activity remains private.</p>
               </div>
               <Shield size={64} className="text-zinc-800" />
            </div>

          </div>
        </section>

        {/* MISSION STATEMENT */}
        <section className="py-60 px-6 text-center bg-gradient-to-b from-transparent to-indigo-950/10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter mb-12 leading-none">THE SAGE <br /> PROTOCOL.</h2>
            <p className="text-2xl text-zinc-500 leading-relaxed italic mb-10">
              StockSage-AI is built for the <span className="text-white underline decoration-indigo-500">top 1%</span> who realize that markets are no longer driven by news, but by algorithms.
            </p>
          </motion.div>
        </section>

      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[1.5em] text-zinc-800">StockSage — Terminal v2.0</p>
      </footer>
    </div>
  );
}

function TickerItem({ symbol, price, change, isPos }: any) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px]">
      <span className="text-zinc-600 font-black tracking-widest">{symbol}</span>
      <span className="text-white font-bold">${price}</span>
      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${isPos ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
        {change}
      </span>
    </div>
  );
}