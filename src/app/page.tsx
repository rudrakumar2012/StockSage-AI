export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import Link from "next/link";
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import Activity from 'lucide-react/dist/esm/icons/activity';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import Shield from 'lucide-react/dist/esm/icons/shield';
import Zap from 'lucide-react/dist/esm/icons/zap';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import Network from 'lucide-react/dist/esm/icons/network';
import Lock from 'lucide-react/dist/esm/icons/lock';
import { getMarketData } from "@/db";

export default async function HomePage() {
  const { data: stocks, allIndexes } = await getMarketData({ 
    page: 1, 
    limit: 10, 
    sort: "desc", 
    sector: "All" 
  });

  // Prepare AI predictive data for the "Execution Visual"
  const executionData = stocks.filter(s => s.aiSignal && s.aiSignal !== 'NONE').slice(0, 4).map((stock, i) => {
    const times = ["11:41:02.104", "11:41:01.882", "11:40:59.001", "11:40:57.210"];
    return {
      time: times[i] || "11:40:00.000",
      action: (stock.aiSignal || 'NONE').replace('_', ' '),
      confidence: `${stock.aiConfidence}%`,
      asset: stock.symbol,
      price: `₹${stock.price.toLocaleString('en-IN')}`
    };
  });

  // Fallback to sentiment if no signals are found yet
  if (executionData.length === 0) {
    stocks.slice(0, 4).forEach((stock, i) => {
      const times = ["11:41:02.104", "11:41:01.882", "11:40:59.001", "11:40:57.210"];
      executionData.push({
        time: times[i] || "11:40:00.000",
        action: stock.sentimentLabel || "NEUTRAL",
        confidence: "N/A",
        asset: stock.symbol,
        price: `₹${stock.price.toLocaleString('en-IN')}`
      });
    });
  }

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Structural Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center opacity-20">
        <div className="w-px h-full bg-white/10" />
        <div className="w-px h-full bg-white/10 absolute left-1/4" />
        <div className="w-px h-full bg-white/10 absolute right-1/4" />
      </div>

      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-150 h-150 bg-fuchsia-600/5 blur-[150px] rounded-full pointer-events-none z-0" />
      
      {/* 1. KINETIC HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-16 md:pb-20 lg:pt-52 lg:pb-32 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typography & Action */}
          <div className="relative">
            <div className="absolute -top-10 left-0 w-full h-px bg-linear-to-r from-indigo-500 to-transparent animate-reveal-line" />
            
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-slow"></span>
              <span className="text-[10px] md:text-[11px] font-medium tracking-widest text-zinc-400 uppercase">NSE/BSE V2.4 Connected</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-6 leading-[1.05] animate-fade-up [animation-delay:100ms]">
              Quantified <br />
              <span className="text-zinc-500 italic font-light">Edge.</span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-zinc-400 mb-10 max-w-lg leading-relaxed font-light animate-fade-up [animation-delay:200ms]">
              The first institutional-grade terminal for Indian retail. Real-time NSE data, AI-driven NIFTY sentiment, and secure LibSQL architecture.
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
                <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Alpha Scanner Radar</span>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                   <span className="text-[10px] font-mono text-indigo-500">PREDICTIVE CORE ACTIVE</span>
                </div>
              </div>
              <div className="space-y-4 font-mono text-sm">
                {executionData.length > 0 ? executionData.map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-zinc-400 hover:text-white transition-colors cursor-default">
                    <span className="text-zinc-600 w-24">{row.time}</span>
                    <span className={`w-32 font-bold text-xs ${
                      row.action.includes('BOUNCE') || row.action.includes('MOMENTUM') || row.action === 'BULLISH' ? 'text-emerald-500' : 
                      row.action.includes('DUMP') || row.action.includes('REVERSION') || row.action === 'BEARISH' ? 'text-rose-500' : 
                      'text-zinc-500'
                    }`}>{row.action}</span>
                    <span className="text-indigo-400 font-medium w-16 text-right text-xs">{row.confidence}</span>
                    <span className="text-white font-medium w-24 text-right">{row.asset}</span>
                  </div>
                )) : (
                  <div className="text-zinc-500 italic text-center py-4 text-xs">Awaiting predictive data...</div>
                )}
              </div>
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

      {/* 3. ARCHITECTURE GRID ( NSE Context) */}
      <section id="infrastructure" className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 border-b border-white/5">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4 italic">Core Infrastructure</h2>
          <p className="text-[10px] md:text-sm font-medium text-zinc-500 tracking-[0.2em] uppercase">Built for 1.4 Billion Requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {[
            { icon: <Zap className="w-5 h-5" />, title: "Live Market Pipeline", desc: "Reliable EOD and intraday data fetching across 115+ top NSE and BSE endpoints." },
            { icon: <Cpu className="w-5 h-5" />, title: "VADER NLP Sentiment", desc: "AI engine processing financial news headlines for contextual bullish/bearish polarity." },
            { icon: <Lock className="w-5 h-5" />, title: "LibSQL Architecture", desc: "Local-first, ultra-fast database managed by Drizzle ORM for maximum execution speed." },
            { icon: <Network className="w-5 h-5" />, title: "Predictive Scanners", desc: "Algorithmic correlation of 14-day RSI, volume spikes, and real-time news sentiment." }
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

      {/* 4. QUANTITATIVE MODELS ( NSE Focus) */}
      <section id="scanners" className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 flex flex-col justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">Alpha Scanners</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed font-light italic">Algorithmic setups cross-referencing RSI, Volume, and NLP Sentiment to find high-probability trades across Dalal Street.</p>
            </div>
            <Link href="/dashboard" className="group inline-flex items-center gap-2 text-white font-medium text-sm w-fit border-b border-white/20 pb-1 hover:border-white transition-colors">
              Launch Scanners <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {[
              { name: "Oversold Bounce", type: "RSI < 35 + BULLISH NEWS", risk: "MED", return: "REVERSAL" },
              { name: "Momentum Spike", type: "VOL > 1.5x + BULLISH NEWS", risk: "HIGH", return: "BREAKOUT" },
              { name: "Mean Reversion", type: "RSI > 70 + BEARISH NEWS", risk: "MED", return: "PULLBACK" },
              { name: "Bearish Dump", type: "VOL > 1.3x + BEARISH NEWS", risk: "HIGH", return: "BREAKDOWN" }
            ].map((model, i) => (
              <div key={i} className="bg-[#050505] p-6 md:p-8 flex flex-col justify-between group hover:bg-[#0a0a0a] transition-all duration-500 min-h-50">
                <div className="flex justify-between items-start mb-8 md:mb-12">
                  <div>
                    <span className="text-[9px] md:text-[10px] font-mono font-medium text-zinc-600 uppercase tracking-widest block mb-2">{model.type}</span>
                    <h4 className="text-xl md:text-2xl font-medium text-white group-hover:text-indigo-400 transition-colors">{model.name}</h4>
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-mono px-2 md:px-3 py-1 rounded-full border ${model.risk === 'HIGH' ? 'border-rose-900/30 text-rose-500' : 'border-white/10 text-white'}`}>
                    {model.risk} RISK
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] md:text-xs text-zinc-600 font-medium tracking-wide">AI SIGNAL</span>
                  <span className={`text-lg md:text-xl font-light ${model.return === 'BREAKDOWN' || model.return === 'PULLBACK' ? 'text-rose-500' : 'text-emerald-500'}`}>{model.return}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="relative z-10 bg-[#020202] pt-16 md:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16">
           {[
            { label: "Execution Engine", value: "LibSQL" },
            { label: "Active Tickers", value: "115+" },
            { label: "NLP Analysis", value: "VADER" },
            { label: "Scanners", value: "4 Models" }
          ].map((stat, i) => (
            <div key={i} className="border-t border-white/10 pt-6">
              <p className="text-2xl md:text-4xl font-light text-white tracking-tight mb-2">{stat.value}</p>
              <p className="text-[10px] md:text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
          <span className="text-lg md:text-xl font-medium tracking-tight text-white italic">StockSage.</span>
          <p className="text-zinc-600 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-mono text-center md:text-right">STOCKSAGE TRADING SOLUTIONS INDIA PVT LTD. INVESTMENTS IN SECURITIES MARKET ARE SUBJECT TO MARKET RISKS.</p>
        </div>
      </footer>

    </div>
  );
}