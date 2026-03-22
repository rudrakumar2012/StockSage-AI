"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Zap, Globe, Shield, BarChart3, ChevronRight, PieChart } from "lucide-react";
import { useRef } from "react";

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Hero Parallax: Shrinks and fades as you scroll down
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.85]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-zinc-400 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* 3D PERSPECTIVE GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="relative z-10">
        
        {/* HERO SECTION: 3D DEPTH */}
        <section className="relative h-screen flex flex-col items-center justify-center px-6 text-center">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-xl mb-12 shadow-[0_0_20px_rgba(79,70,229,0.1)]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.4em] text-indigo-400 uppercase">Institutional Protocol v2.0</span>
            </motion.div>

            <h1 className="text-7xl md:text-[120px] font-bold tracking-tighter text-white mb-10 italic leading-[0.85]">
              STOCKSAGE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-700 not-italic uppercase font-black tracking-normal">Intelligence</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 mb-14 font-medium leading-relaxed">
              Where high-frequency data meets deep-layer neural processing. 
              <span className="text-zinc-300"> Predict the tape, don't just follow it.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href="/dashboard" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
                <button className="relative px-12 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-transform active:scale-95">
                  Launch Terminal <ArrowRight size={18} strokeWidth={3} />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* 3D MOUSE INDICATOR */}
          <motion.div 
            animate={{ y: [0, 12, 0] }} 
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border border-white/10 flex justify-center p-1.5">
              <div className="w-1 h-2 bg-indigo-500 rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* BENTO SPECS SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Large Feature Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="md:col-span-8 group relative p-12 rounded-[3rem] bg-zinc-900/20 border border-white/5 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <PieChart size={200} strokeWidth={1} />
              </div>
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-indigo-500/20">
                  <Cpu className="text-indigo-400" size={24} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 italic tracking-tight">Neural Market Mapping</h3>
                <p className="text-zinc-500 leading-relaxed text-lg">
                  Our proprietary Sage-engine identifies institutional liquidity gaps before they manifest in price action.
                </p>
              </div>
            </motion.div>

            {/* Small High-Speed Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="md:col-span-4 p-12 rounded-[3rem] bg-zinc-900/20 border border-white/5 flex flex-col justify-end group hover:border-emerald-500/20 transition-all"
            >
              <Zap className="text-emerald-500 mb-8 animate-pulse" size={40} />
              <h3 className="text-xl font-bold text-white mb-2">Edge Velocity</h3>
              <p className="text-zinc-500 text-sm">Powered by D1 for sub-10ms data resolution.</p>
            </motion.div>

          </div>
        </section>

        {/* THE "EMPTY SPACE" FIX: 3D FLOATING UI PREVIEW */}
        <section className="py-40 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative rounded-[4rem] bg-gradient-to-b from-zinc-900/40 to-transparent border border-white/5 p-12 lg:p-24 overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div>
                  <h2 className="text-5xl font-bold text-white mb-8 tracking-tighter italic leading-tight">
                    Beyond <br /> Data Points.
                  </h2>
                  <p className="text-xl text-zinc-500 leading-relaxed mb-10 italic">
                    "Most traders look at the past. We look at the physics of the order book."
                  </p>
                  <div className="space-y-6">
                    <CheckItem text="Real-time Sector Heatmaps" />
                    <CheckItem text="AI-Generated Sentiment Gauges" />
                    <CheckItem text="Institutional Flow Tracking" />
                  </div>
                </div>

                {/* THE 3D DECK (Replacing missing images) */}
                <div className="relative h-[400px] [perspective:1000px]">
                   <motion.div 
                     animate={{ rotateY: [0, 5, 0], rotateX: [0, -5, 0] }}
                     transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                     className="absolute inset-0 bg-zinc-900/50 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl p-8"
                   >
                     <div className="flex justify-between items-center mb-10">
                        <BarChart3 className="text-indigo-500" />
                        <div className="text-[10px] font-mono text-zinc-600 tracking-[0.3em]">LIVE STREAMING</div>
                     </div>
                     <div className="space-y-4">
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} whileInView={{ width: "70%" }} className="h-full bg-indigo-500" />
                        </div>
                        <div className="h-2 w-1/2 bg-zinc-800 rounded-full" />
                        <div className="pt-10 grid grid-cols-2 gap-4">
                           <div className="h-20 rounded-2xl bg-white/5 border border-white/5" />
                           <div className="h-20 rounded-2xl bg-white/5 border border-white/5" />
                        </div>
                     </div>
                   </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-800">StockSage Terminal v2 — Built on Cloudflare Edge</p>
      </footer>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      {text}
    </div>
  );
}