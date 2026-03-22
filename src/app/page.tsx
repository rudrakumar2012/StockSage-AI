export const runtime = 'nodejs';

import Link from "next/link";
import { ArrowRight, Activity, Cpu, Shield, Zap, BarChart3, Network, Lock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Structural Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center opacity-20">
        <div className="w-px h-full bg-white/10" />
        <div className="w-px h-full bg-white/10 absolute left-1/4" />
        <div className="w-px h-full bg-white/10 absolute right-1/4" />
      </div>

      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/5 blur-[150px] rounded-full pointer-events-none z-0" />
      
      {/* 1. KINETIC HERO SECTION */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-6 pt-40 pb-20 lg:pt-52 lg:pb-32 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Typography & Action */}
          <div className="relative">
            {/* Reveal Line */}
            <div className="absolute -top-10 left-0 w-full h-px bg-gradient-to-r from-indigo-500 to-transparent animate-reveal-line" />
            
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-slow"></span>
              <span className="text-[11px] font-medium tracking-widest text-zinc-400 uppercase">System v2.4 Active</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-6 leading-[1.05] animate-fade-up [animation-delay:100ms]">
              Institutional <br />
              <span className="text-zinc-500">Precision.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-lg leading-relaxed font-light animate-fade-up [animation-delay:200ms]">
              Latency-optimized market data, algorithmic sentiment analysis, and secure portfolio architecture built for the modern quantitative edge.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 animate-fade-up [animation-delay:300ms]">
              <Link href="/dashboard" className="group relative px-8 py-4 bg-white text-black text-sm font-semibold overflow-hidden flex items-center gap-2 transition-transform hover:scale-[1.02]">
                <span className="relative z-10">Launch Terminal</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-indigo-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            </div>
          </div>
          
          {/* Right Column: Interactive Data Visual */}
          <div className="hidden lg:block relative group animate-fade-up [animation-delay:400ms]">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent blur-3xl rounded-full" />
            <div className="relative p-8 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 transition-colors duration-500 group-hover:border-indigo-500/30">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
                <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Live Execution</span>
                <div className="flex gap-1">
                  <span className="w-1 h-3 bg-emerald-500 rounded-sm animate-pulse-slow" />
                  <span className="w-1 h-4 bg-emerald-500 rounded-sm animate-pulse-slow [animation-delay:150ms]" />
                  <span className="w-1 h-2 bg-emerald-500 rounded-sm animate-pulse-slow [animation-delay:300ms]" />
                </div>
              </div>
              <div className="space-y-4 font-mono text-[13px]">
                {[
                  { time: "09:41:02.104", action: "BUY", asset: "AAPL", size: "10,000", price: "$182.50" },
                  { time: "09:41:01.882", action: "SELL", asset: "NVDA", size: "2,500", price: "$875.20" },
                  { time: "09:40:59.001", action: "BUY", asset: "TSLA", size: "15,000", price: "$175.30" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-zinc-400 hover:text-white transition-colors cursor-default">
                    <span className="text-zinc-600">{row.time}</span>
                    <span className={row.action === 'BUY' ? 'text-emerald-500' : 'text-zinc-500'}>{row.action}</span>
                    <span className="text-white font-medium">{row.asset}</span>
                    <span>{row.size}</span>
                    <span>{row.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE TICKER (Pure CSS Bulletproof Method) */}
      <div className="relative z-10 border-b border-white/5 bg-[#050505] py-4 flex overflow-hidden ticker-container">
        <div className="animate-ticker whitespace-nowrap flex items-center gap-16 font-mono text-sm tracking-widest font-medium w-max">
          {[
            { sym: "S&P 500", price: "5120.40", change: "+0.85%" },
            { sym: "NASDAQ", price: "16240.50", change: "+1.12%" },
            { sym: "BTC/USD", price: "64200", change: "-0.50%" },
            { sym: "ETH/USD", price: "3450", change: "+1.20%" },
            { sym: "US 10Y", price: "4.21%", change: "+0.02" },
            { sym: "AAPL", price: "182.50", change: "+1.25%" },
            { sym: "NVDA", price: "875.20", change: "+2.40%" },
            // Exact Duplicate Block for Seamless Looping
            { sym: "S&P 500", price: "5120.40", change: "+0.85%" },
            { sym: "NASDAQ", price: "16240.50", change: "+1.12%" },
            { sym: "BTC/USD", price: "64200", change: "-0.50%" },
            { sym: "ETH/USD", price: "3450", change: "+1.20%" },
            { sym: "US 10Y", price: "4.21%", change: "+0.02" },
            { sym: "AAPL", price: "182.50", change: "+1.25%" },
            { sym: "NVDA", price: "875.20", change: "+2.40%" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 cursor-default">
              <span className="text-white transition-colors hover:text-indigo-400">{item.sym}</span>
              <span className="text-zinc-600">{item.price}</span>
              <span className={item.change.startsWith('+') ? 'text-emerald-500' : 'text-zinc-500'}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ARCHITECTURE GRID */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-6 py-32 border-b border-white/5">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">Core Architecture</h2>
          <p className="text-sm font-medium text-zinc-500 tracking-wide">High-Frequency Data Infrastructure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {[
            { icon: <Zap className="w-5 h-5" />, title: "Low Latency Grid", desc: "Direct market access pipelines optimized for sub-millisecond retrieval." },
            { icon: <Cpu className="w-5 h-5" />, title: "Neural Sentiment", desc: "NLP engines scanning 50,000+ financial articles daily to gauge emotion." },
            { icon: <Lock className="w-5 h-5" />, title: "Encrypted Vault", desc: "Military-grade encryption for all user portfolios and custom strategies." },
            { icon: <Network className="w-5 h-5" />, title: "Dark Pool Tracking", desc: "Visibility into off-exchange block trades to follow institutional money." }
          ].map((feature, i) => (
            <div key={i} className="bg-[#050505] p-10 group hover:bg-[#0a0a0a] transition-colors duration-500 cursor-default relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="mb-8 text-zinc-600 group-hover:text-indigo-400 transition-colors duration-300">{feature.icon}</div>
              <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. QUANTITATIVE MODELS */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-6 py-32 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">Alpha Strategies</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed font-light">Deploy pre-configured quantitative models based on decades of backtested data. From mean reversion to momentum scalping, our edge is your advantage.</p>
            </div>
            <Link href="/pricing" className="group inline-flex items-center gap-2 text-white font-medium text-sm w-fit border-b border-white/20 pb-1 hover:border-white transition-colors">
              Explore All Models <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {[
              { name: "Mean Reversion", type: "EQUITIES", risk: "LOW", return: "+14.2%" },
              { name: "Volatility Breakout", type: "OPTIONS", risk: "HIGH", return: "+42.8%" },
              { name: "Macro Trend", type: "FOREX", risk: "MED", return: "+21.5%" },
              { name: "Stat Arbitrage", type: "CRYPTO", risk: "HIGH", return: "+55.1%" }
            ].map((model, i) => (
              <div key={i} className="bg-[#050505] p-8 flex flex-col justify-between group hover:bg-[#0a0a0a] transition-all duration-500">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <span className="text-[10px] font-mono font-medium text-zinc-600 uppercase tracking-widest block mb-2">{model.type}</span>
                    <h4 className="text-2xl font-medium text-white group-hover:text-indigo-400 transition-colors">{model.name}</h4>
                  </div>
                  <span className={`text-[10px] font-mono px-3 py-1 rounded-full border ${model.risk === 'HIGH' ? 'border-zinc-800 text-zinc-400' : 'border-white/10 text-white'}`}>
                    {model.risk}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-zinc-600 font-medium tracking-wide">YTD RETURN</span>
                  <span className="text-2xl font-light text-white">{model.return}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="relative z-10 bg-[#020202] pt-24 pb-8">
        <div className="max-w-[1600px] mx-auto px-6 mb-24 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
           {[
            { label: "Execution Speed", value: "< 2ms" },
            { label: "Active Nodes", value: "1,024" },
            { label: "Data Uptime", value: "99.99%" },
            { label: "Assets Tracked", value: "15.2k" }
          ].map((stat, i) => (
            <div key={i} className="border-t border-white/10 pt-6">
              <p className="text-4xl font-light text-white tracking-tight mb-2">{stat.value}</p>
              <p className="text-xs font-medium text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
          <span className="text-xl font-medium tracking-tight text-white">StockSage.</span>
          <p className="text-zinc-600 text-[11px] uppercase tracking-widest font-mono">© 2026 STOCKSAGE LTD. REGULATORY DISCLOSURES APPLY.</p>
        </div>
      </footer>

    </div>
  );
}