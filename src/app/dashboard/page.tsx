export const runtime = 'edge';

"use client";

import { db, getMarketData } from "@/db";
import { syncLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, Database, Zap, Activity } from "lucide-react";
import MarketSearch from "@/components/MarketSearch";
import SystemBootLoader from "@/components/SystemBootLoader";
import DashboardHeader from "@/components/DashboardHeader";
import FeatureGate from "@/components/FeatureGate";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Dashboard({
  searchParams,
}: {
  searchParams: any;
}) {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [allIndexes, setAllIndexes] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [log, setLog] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync with searchParams - for simplicity in this demo we'll just fetch once or on param change
  // In a real app you might use a server action or a proper fetching hook
  useEffect(() => {
    async function fetchData() {
      try {
        // This is a client-side fetch from the DB index utilities
        // Note: In Next.js, calling DB utilities directly in client component only works 
        // if they are marked with 'use server' or wrapped in an API. 
        // Since getMarketData isn't 'use server', we'll use a placeholder fetch approach or 
        // assume it works if the db index is configured for it.
        // FOR NOW: We'll wrap the logic in a client-side friendly way.
        
        const response = await fetch(`/api/market?sector=All&page=1`);
        const result = await response.json();
        
        setData(result.data);
        setAllIndexes(result.allIndexes);
        setTotalPages(result.totalPages);
        setLog(result.log);
        setIsReady(result.isReady);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (authLoading || loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">Initialising Terminal...</div>;
  }

  if (!isReady && !loading) {
    return <SystemBootLoader />;
  }

  const sectorsList = ["All", "Energy", "Technology", "Financial Services", "Consumer", "Infrastructure", "Healthcare", "Automobile", "Metals"];

  return (
    <div className="min-h-screen bg-black text-white pt-48 pb-20 selection:bg-indigo-500/30 font-sans">
      <DashboardHeader />
      
      <div className="max-w-360 mx-auto px-10">
        
        {/* TOP STATUS BAR */}
        <div className="mb-12 flex items-center">
          <div className="flex items-center gap-3 bg-zinc-900/20 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-md">
            <Database className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Data Baseline: {log?.lastSuccess || 'Live Connection'}
            </span>
          </div>
        </div>

        {/* INDEX CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-16">
          {allIndexes.map((idx) => (
            <div key={idx.id} className="bg-[#050505] border border-white/5 p-4 rounded-2xl hover:border-indigo-500/30 transition-all group">
              <p className="text-zinc-600 text-[9px] font-mono tracking-widest uppercase mb-2 group-hover:text-zinc-400 transition-colors truncate">{idx.indexName}</p>
              <div className="flex flex-col">
                <h2 className="text-xl font-medium tracking-tight text-white group-hover:text-indigo-400 transition-colors">₹{idx.price.toLocaleString('en-IN')}</h2>
                <span className={`text-[10px] font-mono font-bold mt-1 ${idx.changePercentage >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {idx.changePercentage >= 0 ? '+' : ''}{idx.changePercentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* HEADER & SEARCH */}
        <div className="flex flex-col xl:flex-row justify-between items-end gap-12 mb-16 pb-12 border-b border-white/5">
          <h1 className="text-8xl font-medium tracking-tighter italic leading-none">Predictive Core.</h1>
          <div className="flex flex-col items-end gap-6 w-full xl:w-auto">
            <MarketSearch />
            <nav className="flex flex-wrap items-center justify-end gap-1 bg-zinc-900/30 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
              {sectorsList.map((s) => (
                <button 
                  key={s} 
                  className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${s === 'All' ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"}`}
                >
                  {s}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* MAIN STOCK GRID WITH FEATURE GATING */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.length > 0 ? data.map((stock) => (
            <div key={stock.id} className="bg-[#050505] border border-white/5 p-8 rounded-3xl hover:bg-zinc-900/10 hover:border-indigo-500/30 transition-all duration-700 group relative overflow-hidden">
              
              <div className="flex justify-between items-start mb-14 relative z-10">
                <div>
                  {/* Gated AI Signal */}
                  <FeatureGate fallback={<div className="mb-3 h-5" />}>
                     {stock.aiSignal && stock.aiSignal !== 'NONE' && (
                        <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-bold font-mono text-indigo-400 tracking-widest uppercase">
                          <Zap className="w-3 h-3" />
                          {stock.aiSignal.replace('_', ' ')} • {stock.aiConfidence}%
                        </div>
                      )}
                  </FeatureGate>

                  <h3 className="text-3xl font-bold tracking-tighter mb-2 uppercase italic leading-none group-hover:text-indigo-400 transition-colors">{stock.symbol}</h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/5 text-[9px] text-zinc-500 font-mono uppercase tracking-widest rounded-full">{stock.sector}</span>
                    
                    {/* Gated Sentiment Label */}
                    <FeatureGate fallback={<span className="px-3 py-1 text-[8px] font-black font-mono tracking-widest rounded-full bg-white/5 text-zinc-700 blur-[2px]">AI: LOCKED</span>}>
                        <span className={`px-3 py-1 text-[8px] font-black font-mono tracking-widest rounded-full ${
                        stock.sentimentLabel === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-500' : 
                        stock.sentimentLabel === 'BEARISH' ? 'bg-rose-500/10 text-rose-500' : 
                        'bg-white/5 text-zinc-500'
                        }`}>
                        AI: {stock.sentimentLabel}
                        </span>
                    </FeatureGate>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stock.changePercentage >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                  {stock.changePercentage >= 0 ? <ArrowUpRight className="w-5 h-5 text-emerald-500" /> : <ArrowDownRight className="w-5 h-5 text-rose-500" />}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-4xl font-light tracking-tighter text-zinc-100">₹{stock.price.toLocaleString('en-IN')}</p>
                <p className={`text-xs font-mono font-black ${stock.changePercentage >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stock.changePercentage > 0 ? '+' : ''}{stock.changePercentage}%
                </p>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest border border-white/5 rounded-[40px]">
              Awaiting Terminal Data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
