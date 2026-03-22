export const runtime = 'edge';

import { getDb } from "@/db";
import { stocks, indexes } from "@/db/schema";
import { ArrowUpRight, ArrowDownRight, Zap, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const db = getDb();
  const stockData = await db.select().from(stocks) ?? [];
  const indexData = await db.select().from(indexes) ?? [];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <h1 className="text-5xl font-bold tracking-tighter italic text-zinc-100">Terminal</h1>
          
          <div className="flex gap-3">
            {indexData.map((idx) => {
              const change = Number(idx.changePercentage ?? 0);
              return (
                <div key={idx.id} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md min-w-[140px]">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 italic">{idx.indexName}</p>
                  <div className="flex items-baseline gap-2 font-mono">
                    <p className="text-xl font-medium tracking-tight">${Number(idx.price ?? 0).toLocaleString()}</p>
                    <span className={`text-[10px] font-bold ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stockData.map((stock) => {
            const change = Number(stock.changePercentage ?? 0);
            const isPos = change >= 0;
            return (
              <div key={stock.id} className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-900/20 border border-white/5 p-8 transition-all hover:bg-zinc-900/40 hover:border-indigo-500/30">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-600/5 blur-[80px] group-hover:bg-indigo-600/10 transition-all" />
                
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-3xl font-bold tracking-tighter">{stock.symbol}</h3>
                      <Zap className="w-4 h-4 text-indigo-400" />
                    </div>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{stock.sector ?? "General"}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                </div>

                <div className="space-y-5 font-mono">
                  <div className="flex items-baseline justify-between border-b border-white/5 pb-5">
                    <span className="text-[11px] text-zinc-500 font-bold uppercase font-sans">Last Trade</span>
                    <p className="text-4xl font-light italic">${Number(stock.price ?? 0).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-bold uppercase font-sans">24H Impact</span>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${isPos ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                      {isPos ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                      {Math.abs(change).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}