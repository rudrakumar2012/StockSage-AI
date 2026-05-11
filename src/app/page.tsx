export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import Link from "next/link";
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import Shield from 'lucide-react/dist/esm/icons/shield';
import Zap from 'lucide-react/dist/esm/icons/zap';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import Network from 'lucide-react/dist/esm/icons/network';
import Database from 'lucide-react/dist/esm/icons/database';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import TrendingDown from 'lucide-react/dist/esm/icons/trending-down';
import { db } from "@/db";
import { indexes, stocks } from "@/db/schema";
import { desc, not, eq, sql } from "drizzle-orm";

function signalAction(signal: string) {
  if (signal === 'OVERSOLD_BOUNCE' || signal === 'MOMENTUM_SPIKE') return 'BUY';
  if (signal === 'MEAN_REVERSION' || signal === 'BEARISH_DUMP') return 'SELL';
  return 'HOLD';
}

function signalQuality(confidence: number) {
  if (confidence >= 70) return 'Strong';
  if (confidence >= 60) return 'Moderate';
  if (confidence > 50) return 'Weak';
  return 'Unvalidated';
}

export default async function HomePage() {
  // Fetch real signal data from DB for the Alpha Scanner Radar
  let activeSignals: any[] = [];
  try {
    activeSignals = await db.select({
      symbol: stocks.symbol,
      aiSignal: stocks.aiSignal,
      aiConfidence: stocks.aiConfidence,
      price: stocks.price,
    })
    .from(stocks)
    .where(not(eq(stocks.aiSignal, "NONE")))
    .orderBy(desc(stocks.aiConfidence))
    .limit(4);
  } catch {
    // Table might not exist yet or no data
  }

  // Fetch real index data from database
  let allIndexes: any[] = [];
  try {
    allIndexes = await db.select().from(indexes);
  } catch {
    // Table might not exist yet
  }

  const now = new Date();

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 overflow-hidden relative selection:bg-indigo-500/30">

      {/* Structural Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center opacity-20">
        <div className="w-px h-full bg-white/10" />
        <div className="w-px h-full bg-white/10 absolute left-1/4" />
        <div className="w-px h-full bg-white/10 absolute right-1/4" />
      </div>

      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] md:w-[800px] md:h-[600px] bg-indigo-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-fuchsia-600/5 blur-[100px] md:blur-[150px] rounded-full pointer-events-none z-0" />

      {/* 1. KINETIC HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-28 md:pt-40 pb-16 md:pb-20 lg:pt-52 lg:pb-32 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column: Typography & Action */}
          <div className="relative">
            <div className="absolute -top-10 left-0 w-full h-px bg-linear-to-r from-indigo-500 to-transparent animate-reveal-line" />

            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-slow"></span>
              <span className="text-xs md:text-sm font-medium tracking-widest text-zinc-400 uppercase">NSE/BSE Data Connected</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-6 leading-[1.05] animate-fade-up [animation-delay:100ms]">
              Quantified <br />
              <span className="text-zinc-500 italic font-light">Edge.</span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-zinc-400 mb-10 max-w-lg leading-relaxed font-light animate-fade-up [animation-delay:200ms]">
              Backtested signals for Indian equities. FinBERT NLP sentiment, multi-factor scanners, and honest win rates.
            </p>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 animate-fade-up [animation-delay:300ms]">
              <Link href="/dashboard" className="group relative px-6 md:px-8 py-3.5 md:py-4 bg-white text-black text-xs md:text-sm font-bold overflow-hidden flex items-center gap-2 transition-transform hover:scale-[1.02]">
                <span className="relative z-10 uppercase tracking-widest whitespace-nowrap">Launch Terminal</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-indigo-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            </div>
          </div>

          {/* Right Column: AI Sentiment Visual */}
          <div className="hidden lg:block relative group animate-fade-up [animation-delay:400ms]">
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-transparent blur-3xl rounded-full" />
            <div className="relative p-8 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 transition-colors duration-500 group-hover:border-indigo-500/30">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
                <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Alpha Scanner Radar</span>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                   <span className="text-xs font-mono text-indigo-500">LIVE</span>
                </div>
              </div>
              <div className="space-y-4 font-mono text-sm">
                {activeSignals.length > 0 ? activeSignals.map((row, i) => {
                  const action = signalAction(row.aiSignal);
                  const quality = signalQuality(row.aiConfidence ?? 0);
                  const isBuy = action === 'BUY';
                  return (
                    <div key={i} className="flex justify-between items-center text-zinc-400 hover:text-white transition-colors cursor-default">
                      <span className={`inline-flex items-center gap-1.5 w-24 font-bold text-xs ${isBuy ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isBuy ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {action}
                      </span>
                      <span className="text-white font-medium w-24">{row.symbol}</span>
                      <span className="text-zinc-500 w-20 text-right text-xs">{row.aiConfidence}% · {quality}</span>
                    </div>
                  );
                }) : (
                  <div className="text-zinc-500 italic text-center py-4 text-xs">Awaiting next data sync...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Scanner Preview */}
        <div className="lg:hidden mt-8 relative group">
          <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-transparent blur-3xl rounded-full" />
          <div className="relative p-6 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
              <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Alpha Scanner</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-mono text-indigo-500">LIVE</span>
              </div>
            </div>
            <div className="space-y-3 font-mono text-sm">
              {activeSignals.length > 0 ? activeSignals.slice(0, 3).map((row, i) => {
                const action = signalAction(row.aiSignal);
                const quality = signalQuality(row.aiConfidence ?? 0);
                const isBuy = action === 'BUY';
                return (
                  <div key={i} className="flex justify-between items-center text-zinc-400">
                    <span className="text-white font-medium">{row.symbol}</span>
                    <span className={`font-bold text-xs ${isBuy ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {action}
                    </span>
                    <span className="text-zinc-500 text-xs">{row.aiConfidence}% · {quality}</span>
                  </div>
                );
              }) : (
                <div className="text-zinc-500 italic text-center py-4 text-xs">Awaiting next data sync...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE NSE TICKER */}
      <div className="relative z-10 border-b border-white/5 bg-[#050505] py-4 flex overflow-hidden">
        <div className="animate-ticker whitespace-nowrap flex items-center gap-16 font-mono text-xs md:text-sm tracking-widest font-medium w-max">
          {(allIndexes.length > 0 ? [...allIndexes, ...allIndexes] : []).map((item, i) => (
            <div key={i} className="flex items-center gap-4 cursor-default">
              <span className="text-white transition-colors hover:text-indigo-400">{item.indexName}</span>
              <span className="text-zinc-600">₹{item.price.toLocaleString('en-IN')}</span>
              <span className={item.changePercentage >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                {item.changePercentage >= 0 ? '+' : ''}{item.changePercentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ARCHITECTURE GRID */}
      <section id="infrastructure" className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 border-b border-white/5">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4 italic">Core Infrastructure</h2>
          <p className="text-xs md:text-sm font-medium text-zinc-500 tracking-[0.2em] uppercase">FinBERT NLP · Multi-Factor Scanners · Backtested Confidence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {[
            { icon: <Zap className="w-5 h-5" />, title: "Market Data Pipeline", desc: "End-of-day data for 100 NSE equities and 3 major indices, synced via yfinance." },
            { icon: <Cpu className="w-5 h-5" />, title: "FinBERT Financial NLP", desc: "Domain-specific sentiment analysis fine-tuned on financial news — not a general-purpose lexicon." },
            { icon: <Database className="w-5 h-5" />, title: "Neon PostgreSQL", desc: "Serverless PostgreSQL via Drizzle ORM. Real-time edge queries with Neon HTTP client." },
            { icon: <BarChart3 className="w-5 h-5" />, title: "Backtested Scanners", desc: "Multi-factor signals (RSI + Volume + Sentiment) with confidence calibrated to historical win rates." }
          ].map((feature, i) => (
            <div key={i} className="bg-[#050505] p-8 md:p-10 group hover:bg-[#0a0a0a] transition-colors duration-500 cursor-default relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="mb-6 md:mb-8 text-zinc-600 group-hover:text-indigo-400 transition-colors duration-300">{feature.icon}</div>
              <h3 className="text-lg md:text-xl font-medium text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-zinc-500 text-xs md:text-sm leading-relaxed font-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. QUANTITATIVE MODELS */}
      <section id="scanners" className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-4 flex flex-col justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">Alpha Scanners</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed font-light italic">Each signal requires 3+ concurring factors. Confidence reflects historical win rate, not prediction accuracy. Educational use only.</p>
            </div>
            <Link href="/dashboard" className="group inline-flex items-center gap-2 text-white font-medium text-sm w-fit border-b border-white/20 pb-1 hover:border-white transition-colors">
              Launch Scanners <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {[
              { name: "Oversold Bounce", type: "RSI < 35 + BULLISH + VOLUME", risk: "MED", action: "BUY" },
              { name: "Momentum Spike", type: "VOL > 1.5x + RSI 55-70 + BULLISH", risk: "HIGH", action: "BUY" },
              { name: "Mean Reversion", type: "RSI > 70 + BEARISH + VOLUME", risk: "MED", action: "SELL" },
              { name: "Bearish Dump", type: "VOL > 1.5x + RSI < 40 + BEARISH", risk: "HIGH", action: "SELL" }
            ].map((model, i) => (
              <div key={i} className="bg-[#050505] p-6 md:p-8 flex flex-col justify-between group hover:bg-[#0a0a0a] transition-all duration-500 min-h-50">
                <div className="flex justify-between items-start mb-8 md:mb-12">
                  <div>
                    <span className="text-xs font-mono font-medium text-zinc-600 uppercase tracking-widest block mb-2">{model.type}</span>
                    <h4 className="text-xl md:text-2xl font-medium text-white group-hover:text-indigo-400 transition-colors">{model.name}</h4>
                  </div>
                  <span className={`text-xs font-mono px-2 md:px-3 py-1 rounded-full border ${model.risk === 'HIGH' ? 'border-rose-900/30 text-rose-500' : 'border-white/10 text-white'}`}>
                    {model.risk} RISK
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-zinc-600 font-medium tracking-wide">ACTION</span>
                  <span className={`text-lg md:text-xl font-light ${model.action === 'SELL' ? 'text-rose-500' : 'text-emerald-500'}`}>{model.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="relative z-10 bg-[#020202] pt-16 md:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16">
           {[
            { label: "Database", value: "Neon PostgreSQL" },
            { label: "Active Tickers", value: "100+" },
            { label: "NLP Engine", value: "FinBERT" },
            { label: "Scanners", value: "4 Models" }
          ].map((stat, i) => (
            <div key={i} className="border-t border-white/10 pt-6">
              <p className="text-2xl md:text-4xl font-light text-white tracking-tight mb-2">{stat.value}</p>
              <p className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
          <span className="text-lg md:text-xl font-medium tracking-tight text-white italic">StockSage.</span>
          <p className="text-zinc-600 text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-mono text-center md:text-right">NOT SEBI REGISTERED. EDUCATIONAL TOOL ONLY. NOT INVESTMENT ADVICE.</p>
        </div>
      </footer>

    </div>
  );
}