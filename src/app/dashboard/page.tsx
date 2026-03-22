export const runtime = 'edge';

import { getDb } from "@/db";
import { stocks, indexes } from "@/db/schema";
import { ArrowUpRight, ArrowDownRight, Zap, TrendingUp, Globe } from "lucide-react";

export default async function DashboardPage() {
  const db = getDb();
  
  // Fetch data with fallbacks
  const stockData = await db.select().from(stocks) ?? [];
  const indexData = await db.select().from(indexes) ?? [];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 p-6 lg:p-12 lg:pt-40 relative overflow-hidden">
      {/* Background Ambient Glow to match Homepage */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">Live System Feed</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter italic text-white leading-none">
              TERMINAL
            </h1>
          </div>
          
          {/* Market Indices (Fixed Overlap) */}
          <div className="flex flex-wrap gap-4">
            {indexData.map((idx) => {
              const change = Number(idx.changePercentage ?? 0);
              const isPos = change >= 0;

              return (
                <div 
                  key={idx.id} 
                  className="bg-zinc-900/30 border border-white/5 p-5 rounded-[2rem] backdrop-blur-xl min-w-[160px] hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold italic">{idx.indexName}</p>
                    <Globe size={10} className="text-zinc-600" />
                  </div>
                  <div className="flex items-baseline gap-2 font-mono">
                    <p className="text-2xl font-medium tracking-tighter">
                      ${Number(idx.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <span className={`text-[10px] font-black ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stockData.length === 0 ? (
            <div className="col-span-full py-40 border border-dashed border-white/5 rounded-[3rem] text-center bg-zinc-900/10">
              <p className="text-zinc-600 font-mono text-sm tracking-widest">NO ASSETS DETECTED IN D1_INSTANCE</p>
            </div>
          ) : (
            stockData.map((stock) => {
              const change = Number(stock.changePercentage ?? 0);
              const isPos = change >= 0;
              
              return (
                <div 
                  key={stock.id} 
                  className="group relative overflow-hidden rounded-[3rem] bg-zinc-900/20 border border-white/5 p-10 transition-all duration-500 hover:bg-zinc-900/40 hover:border-indigo-500/30"
                >
                  {/* Internal Glow Effect */}
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/5 blur-[100px] group-hover:bg-indigo-600/10 transition-all" />
                  
                  <div className="flex justify-between items-start mb-16">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-4xl font-bold tracking-tighter text-white">{stock.symbol}</h3>
                        <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                          <Zap className="w-4 h-4 text-indigo-400" />
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">{stock.sector ?? "General Market"}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:border-indigo-500/20 transition-colors">
                      <TrendingUp className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
                    </div>
                  </div>

                  <div className="space-y-6 font-mono">
                    <div className="flex items-baseline justify-between border-b border-white/5 pb-6">
                      <span className="text-[11px] text-zinc-500 font-bold uppercase font-sans tracking-widest">Current Value</span>
                      <p className="text-5xl font-light italic tracking-tighter text-zinc-100">
                        ${Number(stock.price ?? 0).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-zinc-500 font-bold uppercase font-sans tracking-widest">24H Delta</span>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black tracking-tighter shadow-xl transition-all ${
                        isPos 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {isPos ? <ArrowUpRight size={14} strokeWidth={3}/> : <ArrowDownRight size={14} strokeWidth={3}/>}
                        {Math.abs(change).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}