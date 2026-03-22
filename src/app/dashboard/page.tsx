export const runtime = 'nodejs'; 

import { getDb } from "@/db";
import { stocks, indexes } from "@/db/schema";
import { TrendingUp, TrendingDown, LayoutDashboard, Zap, Search, Bell, Settings } from "lucide-react";

export default async function DashboardPage() {
  const db = getDb();
  
  const stockData = await db.select().from(stocks) || [];
  const indexData = await db.select().from(indexes) || [];

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans p-4 lg:p-8 pt-32 relative overflow-hidden">
      
      {/* Soft Ambient Dashboard Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* TERMINAL APP SUB-NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/10 pb-6 gap-6">
          <div className="flex items-center gap-8 text-sm font-bold text-zinc-500">
            <span className="text-white border-b-2 border-indigo-500 pb-1 cursor-pointer">Overview</span>
            <span className="hover:text-white transition-colors cursor-pointer">Portfolio</span>
            <span className="hover:text-white transition-colors cursor-pointer">AI Screener</span>
            <span className="hover:text-white transition-colors cursor-pointer">News Feed</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search ticker..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all w-64"
              />
            </div>
            <button className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"><Bell className="w-4 h-4 text-zinc-400" /></button>
            <button className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"><Settings className="w-4 h-4 text-zinc-400" /></button>
          </div>
        </div>

        {/* BEAUTIFUL HEADER */}
        <header className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="w-8 h-8 text-indigo-400" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Market Overview</h1>
            </div>
            <p className="text-lg text-zinc-400 font-medium ml-11">Live data synchronization active.</p>
          </div>

          {/* VIBRANT INDEX PILLS */}
          <div className="flex flex-wrap gap-4">
            {indexData.map((idx) => (
              <div key={idx.id} className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl shadow-lg backdrop-blur-md hover:bg-white/10 transition-colors">
                <span className="text-sm font-bold text-zinc-300">{idx.indexName}</span>
                <span className="text-lg font-medium text-white">${Number(idx.price || 0).toFixed(2)}</span>
                <span className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${Number(idx.changePercentage) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {Number(idx.changePercentage) >= 0 ? '▲' : '▼'} {Math.abs(Number(idx.changePercentage || 0)).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </header>

        {/* 3D GLASSMORPHIC DATA GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {stockData.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
              <Zap className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-xl text-zinc-400 font-medium">No assets tracked yet. Run your seed script.</p>
            </div>
          ) : (
            stockData.map((stock) => (
              <div key={stock.id} className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(79,70,229,0.15)] transition-all duration-300 backdrop-blur-xl overflow-hidden cursor-pointer">
                
                {/* Internal Hover Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 blur-[50px] rounded-full group-hover:bg-indigo-400/30 transition-colors duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-3xl font-extrabold text-white mb-1">{stock.symbol}</h3>
                      <p className="text-sm text-zinc-400 font-medium">{stock.sector || 'Equities'}</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                      {Number(stock.changePercentage) >= 0 ? (
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-rose-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="text-5xl font-light tracking-tight text-white mb-4">
                      ${Number(stock.price || 0).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold ${Number(stock.changePercentage) >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {Number(stock.changePercentage) >= 0 ? '+' : ''}{Number(stock.changePercentage || 0).toFixed(2)}%
                      </div>
                      <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Today</span>
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