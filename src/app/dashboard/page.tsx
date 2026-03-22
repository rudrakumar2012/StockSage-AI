export const runtime = 'nodejs'; 

import { getDb } from "@/db";
import { stocks, indexes } from "@/db/schema";
import { ArrowUpRight, ArrowDownRight, Zap, TrendingUp, Globe } from "lucide-react";

export default async function DashboardPage() {
  const db = getDb();
  
  // Direct fetch from your local file
  const stockData = await db.select().from(stocks) || [];
  const indexData = await db.select().from(indexes) || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 p-6 lg:p-12 lg:pt-40 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
          <div>
            <h1 className="text-6xl font-black tracking-tighter italic text-white leading-none">TERMINAL</h1>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {indexData.map((idx) => (
              <div key={idx.id} className="bg-zinc-900/30 border border-white/5 p-5 rounded-[2rem] min-w-40">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">{idx.indexName}</p>
                <div className="flex items-baseline gap-2 font-mono">
                  <p className="text-2xl font-medium">${Number(idx.price || 0).toFixed(2)}</p>
                  <span className={`text-[10px] ${Number(idx.changePercentage) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Number(idx.changePercentage || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stockData.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-zinc-500 font-mono italic">NO DATA IN LOCAL_DB. RUN DRIZZLE-KIT PUSH.</p>
            </div>
          ) : (
            stockData.map((stock) => (
              <div key={stock.id} className="group rounded-[3rem] bg-zinc-900/20 border border-white/5 p-10 hover:border-indigo-500/30 transition-all">
                <div className="flex justify-between items-start mb-10">
                  <h3 className="text-4xl font-bold tracking-tighter">{stock.symbol}</h3>
                  <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="space-y-4 font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-xs text-zinc-500 uppercase">Price</span>
                    <p className="text-4xl font-light">${Number(stock.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 uppercase">Change</span>
                    <div className={`px-3 py-1 rounded-full text-xs ${Number(stock.changePercentage) >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {Number(stock.changePercentage || 0).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}