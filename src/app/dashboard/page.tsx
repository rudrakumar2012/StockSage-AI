export const runtime = 'nodejs'; 

import { getDb } from "@/db";
import { stocks, indexes } from "@/db/schema";
import { TrendingUp, TrendingDown, LayoutDashboard, Zap, Search, Bell, Settings } from "lucide-react";

export default async function DashboardPage() {
  const db = getDb();
  
  const stockData = await db.select().from(stocks) || [];
  const indexData = await db.select().from(indexes) || [];

  // Helper function to format numbers to Indian Rupee standard (e.g., 1,00,000.00)
  const formatINR = (value: number | string | null) => {
    return Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans relative selection:bg-indigo-500/30">
      
      {/* Ambient Background Effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-900/20 via-[#030303] to-[#030303] pointer-events-none" />
      <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full z-0 pointer-events-none" />
      <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* MAIN CONTENT WRAPPER */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* SUB-NAVIGATION TOOLBAR */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-8 mb-12 gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-xl shadow-lg">
          <nav className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
            <button className="px-5 py-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl text-sm font-bold border border-indigo-500/20 transition-all">Overview</button>
            <button className="px-5 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl text-sm font-semibold transition-all">Portfolio</button>
            <button className="px-5 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl text-sm font-semibold transition-all">AI Screener</button>
            <button className="px-5 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl text-sm font-semibold transition-all">News Feed</button>
          </nav>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative group w-full lg:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search NSE stocks..." 
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
            <button className="p-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group shrink-0">
              <Bell className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
            </button>
            <button className="p-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group shrink-0">
              <Settings className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
            </button>
          </div>
        </div>

        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Live NSE Sync Active
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Market Overview</h1>
          </div>

          {/* MARKET INDEX PILLS (e.g., NIFTY 50, SENSEX) */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {indexData.map((idx) => {
              const isPositive = Number(idx.changePercentage) >= 0;
              return (
                <div key={idx.id} className="flex-1 sm:flex-none flex items-center justify-between gap-6 bg-[#0a0a0a] border border-white/10 px-5 py-3.5 rounded-2xl hover:border-white/20 transition-colors shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{idx.indexName}</span>
                    <span className="text-lg font-bold text-white">₹{formatINR(idx.price)}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1.5 rounded-xl ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(Number(idx.changePercentage || 0)).toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        {/* DATA GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stockData.length === 0 ? (
            <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/5">
                <Zap className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No assets tracked yet</h3>
              <p className="text-zinc-500 font-medium">Run your seed script to populate the dashboard with NSE data.</p>
            </div>
          ) : (
            stockData.map((stock) => {
              const isPositive = Number(stock.changePercentage) >= 0;
              return (
                <div key={stock.id} className="group flex flex-col justify-between bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-[0_10px_40px_rgba(79,70,229,0.1)] transition-all duration-300 cursor-pointer min-h-[180px]">
                  
                  {/* Top Row: Ticker & Icon */}
                  <div className="flex justify-between items-start w-full mb-6">
                    <div>
                      <h3 className="text-2xl font-extrabold text-white tracking-tight">{stock.symbol}</h3>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">{stock.sector || 'Equities'}</p>
                    </div>
                    
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${isPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                      {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                  </div>
                  
                  {/* Bottom Row: Price & Change */}
                  <div className="mt-auto">
                    <p className="text-4xl font-light tracking-tight text-white mb-3">
                      ₹{formatINR(stock.price)}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}{Number(stock.changePercentage || 0).toFixed(2)}%
                      </div>
                      <span className="text-xs text-zinc-600 font-semibold uppercase tracking-wider">Today</span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
}