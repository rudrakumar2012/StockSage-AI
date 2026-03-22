export const runtime = 'nodejs';

import Link from "next/link";
import { ArrowRight, Activity, Globe, Cpu, Sparkles, Network, Lock, Zap, Terminal } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* 3D Ambient Glow Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full z-0 pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 blur-[150px] rounded-full z-0 pointer-events-none" />
      
      {/* HERO SECTION (pt-32 prevents Navbar overlap) */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-6 pb-24 pt-32 text-center">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md hover:bg-white/10 transition-colors shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-zinc-300">StockSage v2.4 Engine Live</span>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white mb-8 drop-shadow-2xl leading-tight">
          Smarter <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
            Investing.
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-zinc-400 font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
          Unlock institutional-grade market data, powered by advanced AI sentiment models, sub-millisecond execution, and predictive analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/dashboard" className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300">
            Start Trading Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="#platform" className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md">
            Explore Features
          </Link>
        </div>
      </section>

      {/* LIVE DATA TICKER */}
      <div className="relative z-10 border-y border-white/5 bg-white/5 backdrop-blur-md overflow-hidden py-4 flex">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 font-mono text-sm">
          {[
            { sym: "AAPL", price: "182.50", change: "+1.25%" },
            { sym: "NVDA", price: "875.20", change: "+2.40%" },
            { sym: "BTC", price: "64,200", change: "-0.50%" },
            { sym: "SPY", price: "512.40", change: "+0.85%" },
            { sym: "TSLA", price: "175.30", change: "-1.10%" },
            { sym: "MSFT", price: "420.55", change: "+0.30%" },
            { sym: "AMZN", price: "178.20", change: "+1.15%" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-white font-bold text-base">{item.sym}</span>
              <span className="text-zinc-400">${item.price}</span>
              <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CORE PLATFORM FEATURES */}
      <section id="platform" className="relative z-10 max-w-[1600px] mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Built for the Modern Market</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Everything you need to analyze, execute, and dominate, packaged in a beautifully intuitive interface.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Activity className="w-10 h-10 text-indigo-400 mb-6" />,
              title: "Real-Time Equities",
              desc: "Sub-millisecond latency on global equities, ensuring you never miss a critical market movement or price shift.",
              gradient: "from-indigo-500/20 to-transparent"
            },
            {
              icon: <Cpu className="w-10 h-10 text-fuchsia-400 mb-6" />,
              title: "AI Sentiment Analysis",
              desc: "Our neural networks digest thousands of news articles and social feeds per second to predict market shifts.",
              gradient: "from-fuchsia-500/20 to-transparent"
            },
            {
              icon: <Globe className="w-10 h-10 text-blue-400 mb-6" />,
              title: "Global Macro Data",
              desc: "Track global economic health, inflation metrics, and central bank policies in one unified dashboard.",
              gradient: "from-blue-500/20 to-transparent"
            }
          ].map((feature, i) => (
            <div key={i} className={`group relative overflow-hidden bg-white/5 border border-white/10 rounded-3xl p-10 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 backdrop-blur-xl`}>
              <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`} />
              <div className="relative z-10">
                {feature.icon}
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW SECTION: AI INTELLIGENCE */}
      <section id="analytics" className="relative z-10 border-t border-white/5 bg-[#050505] py-32">
        <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-500/10 text-fuchsia-400 rounded-full font-bold text-sm mb-6 border border-fuchsia-500/20">
              <Network className="w-4 h-4" /> Predictive Modeling
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
              See the future before it <span className="text-fuchsia-400">happens.</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
              StockSage doesn't just show you what the market did yesterday. It uses multi-layered machine learning algorithms to map options chains, dark pool prints, and retail sentiment to forecast where liquidity is moving next.
            </p>
            <ul className="space-y-4 mb-10">
              {['Options Flow Tracking', 'Dark Pool Visualization', 'Insider Trading Alerts'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-lg text-zinc-300 font-medium">
                  <Zap className="w-5 h-5 text-fuchsia-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-[500px] rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="w-64 h-64 bg-fuchsia-600/30 blur-[80px] rounded-full absolute group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 text-center">
              <Cpu className="w-24 h-24 text-white/50 mx-auto mb-4 animate-pulse" />
              <p className="text-zinc-500 font-mono tracking-widest text-sm uppercase">Neural Engine Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-[#030303] py-12">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-500" />
            <span className="text-lg font-black tracking-tighter text-white uppercase">StockSage</span>
          </div>
          <p className="text-zinc-600 text-sm font-medium">© 2026 StockSage AI Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm font-bold text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Status</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}