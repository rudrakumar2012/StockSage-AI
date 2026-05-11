"use client";
export const runtime = 'edge';

import { motion } from "framer-motion";
import Database from 'lucide-react/dist/esm/icons/database';
import Network from 'lucide-react/dist/esm/icons/network';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 md:pt-40 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-medium tracking-tight text-white mb-6"
        >
          Institutional <br className="md:hidden" /><span className="text-indigo-500 italic font-light">Methodology.</span>
        </motion.h1>
        <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-light">
          StockSage uses FinBERT financial NLP and multi-factor technical analysis to generate trade signals for Indian equities. All signals are backtested — confidence percentages reflect historical win rates, not predictions.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20 md:mb-40">
        <AboutCard icon={<Database size={24}/>} title="Data Ingestion" desc="End-of-day data for 100 NSE equities and 3 major indices, stored in Neon PostgreSQL via Drizzle ORM." />
        <AboutCard icon={<Network size={24}/>} title="Signal Engine" desc="FinBERT NLP combined with RSI and volume analysis to generate multi-factor signals. Confidence values are backtested historical win rates — educational indicators, not investment advice." />
      </div>

      <div className="max-w-4xl mx-auto text-center mb-20 md:mb-32">
        <div className="p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-zinc-900/20 border border-white/5">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 italic">Signal Methodology</h3>
          <div className="space-y-4 text-left text-sm md:text-base text-zinc-400 leading-relaxed">
            <p>Each signal requires <span className="text-white font-medium">3+ concurring factors</span> before firing — no signal triggers on a single indicator alone.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">BUY — Oversold Bounce</p>
                <p className="text-zinc-500 text-xs">RSI &lt; 35 + Bullish Sentiment + Normal Volume</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">BUY — Momentum Spike</p>
                <p className="text-zinc-500 text-xs">Volume &gt; 1.5x + RSI 55-70 + Bullish Sentiment</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-rose-400 font-mono text-xs uppercase tracking-widest mb-1">SELL — Mean Reversion</p>
                <p className="text-zinc-500 text-xs">RSI &gt; 70 + Bearish Sentiment + Normal Volume</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-rose-400 font-mono text-xs uppercase tracking-widest mb-1">SELL — Bearish Dump</p>
                <p className="text-zinc-500 text-xs">Volume &gt; 1.5x + RSI &lt; 40 + Bearish Sentiment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center pb-16">
        <p className="text-zinc-600 text-xs uppercase tracking-[0.2em] font-mono">
          StockSage is not SEBI registered. All signals are educational indicators, not investment advice.
        </p>
      </div>
    </div>
  );
}

function AboutCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-zinc-900/20 border border-white/5">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400 border border-indigo-500/20">{icon}</div>
      <h3 className="text-xl md:text-2xl font-bold text-white mb-4 italic">{title}</h3>
      <p className="text-zinc-500 text-sm md:text-base leading-relaxed">{desc}</p>
    </div>
  );
}