"use client";
export const runtime = 'edge';

import { db, getMarketData } from "@/db";
import { syncLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right';
import ArrowDownRight from 'lucide-react/dist/esm/icons/arrow-down-right';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Database from 'lucide-react/dist/esm/icons/database';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Activity from 'lucide-react/dist/esm/icons/activity';
import MarketSearch from "@/components/MarketSearch";
import SystemBootLoader from "@/components/SystemBootLoader";
import DashboardHeader from "@/components/DashboardHeader";
import FeatureGate from "@/components/FeatureGate";
import StockCardSkeleton from "@/components/StockCardSkeleton";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<any[]>([]);
  const [allIndexes, setAllIndexes] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [log, setLog] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redirect to signup if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signup?redirect=/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  // Use searchParams.get() directly in dependencies to ensure effect runs on change
  const currentSector = searchParams.get("sector") || "All";
  const currentQuery = searchParams.get("query") || "";
  const currentPage = searchParams.get("page") || "1";

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/market?sector=${currentSector}&query=${currentQuery}&page=${currentPage}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        
        if (isMounted) {
          setData(result.data || []);
          setAllIndexes(result.allIndexes || []);
          setTotalPages(result.totalPages || 1);
          setLog(result.log);
          setIsReady(result.isReady);
        }
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [currentSector, currentQuery, currentPage]);

  const handleSectorChange = (sector: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sector", sector);
    params.set("page", "1");
    // Preserve existing query
    const query = searchParams.get("query");
    if (query) params.set("query", query);
    
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  if (authLoading || (loading && data.length === 0 && !isReady)) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Initialising Secure Terminal...</div>;
  }

  if (!isReady && !loading) {
    return <SystemBootLoader />;
  }

  const sectorsList = ["All", "Energy", "Technology", "Financial Services", "Consumer", "Infrastructure", "Healthcare", "Automobile", "Metals"];

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-48 pb-20 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      <DashboardHeader lastUpdated={log?.lastSuccess || undefined} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        
        {/* TOP STATUS BAR */}
        <div className="mb-8 md:mb-12 flex items-center overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center gap-3 bg-zinc-900/20 px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-white/5 backdrop-blur-md whitespace-nowrap">
            <Database className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Data Baseline: {log?.lastSuccess || 'Live Connection'}
            </span>
          </div>
        </div>

        {/* INDEX CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 mb-10 md:mb-16">
          {allIndexes.map((idx) => (
            <div key={idx.id} className="bg-[#050505] border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl hover:border-indigo-500/30 transition-all group">
              <p className="text-zinc-600 text-[8px] md:text-[9px] font-mono tracking-widest uppercase mb-1 md:mb-2 group-hover:text-zinc-400 transition-colors truncate">{idx.indexName}</p>
              <div className="flex flex-col">
                <h2 className="text-lg md:text-xl font-medium tracking-tight text-white group-hover:text-indigo-400 transition-colors">₹{idx.price.toLocaleString('en-IN')}</h2>
                <span className={`text-[9px] md:text-[10px] font-mono font-bold mt-0.5 md:mt-1 ${idx.changePercentage >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {idx.changePercentage >= 0 ? '+' : ''}{idx.changePercentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* HEADER & SEARCH */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 md:gap-12 mb-12 md:mb-16 pb-8 md:pb-12 border-b border-white/5">
          <div className="w-full xl:w-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter italic leading-none mb-4 xl:mb-0">Predictive Core.</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 w-full xl:w-auto">
            <div className="flex-1 sm:w-80">
              <MarketSearch />
            </div>
            <div className="relative group min-w-[160px]">
              <select 
                value={currentSector}
                onChange={(e) => handleSectorChange(e.target.value)}
                disabled={isPending}
                className="w-full appearance-none bg-zinc-900/40 border border-white/10 rounded-xl px-5 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer hover:bg-zinc-800/40"
              >
                {sectorsList.map((s) => (
                  <option key={s} value={s} className="bg-black text-white">
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none group-focus-within:text-indigo-400 transition-colors" />
            </div>
          </div>
        </div>

        {/* MAIN STOCK GRID WITH FEATURE GATING */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {loading && data.length === 0 ? (
            // Skeleton loaders for initial load
            Array.from({ length: 12 }).map((_, i) => <StockCardSkeleton key={i} />)
          ) : data.length > 0 ? (
            data.map((stock) => (
              <div key={stock.id} className="bg-[#050505] border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:bg-zinc-900/10 hover:border-indigo-500/30 transition-all duration-700 group relative overflow-hidden">

                <div className="flex justify-between items-start mb-10 md:mb-14 relative z-10">
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

                    <h3 className="text-2xl md:text-3xl font-bold tracking-tighter mb-2 uppercase italic leading-none group-hover:text-indigo-400 transition-colors">{stock.symbol}</h3>

                    <div className="flex items-center gap-2">
                      <span className="px-2 md:px-3 py-1 bg-white/5 text-[8px] md:text-[9px] text-zinc-500 font-mono uppercase tracking-widest rounded-full">{stock.sector}</span>

                      {/* Gated Sentiment Label */}
                      <FeatureGate fallback={<span className="px-3 py-1 text-[8px] font-black font-mono tracking-widest rounded-full bg-white/5 text-zinc-700 blur-[2px]">AI: LOCKED</span>}>
                        <span className={`px-2 md:px-3 py-1 text-[8px] font-black font-mono tracking-widest rounded-full ${
                          stock.sentimentLabel === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-500' :
                          stock.sentimentLabel === 'BEARISH' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-white/5 text-zinc-500'
                        }`}>
                          AI: {stock.sentimentLabel}
                        </span>
                      </FeatureGate>
                    </div>
                  </div>
                  <div className={`p-2 md:p-3 rounded-full ${stock.changePercentage >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                    {stock.changePercentage >= 0 ? <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-3xl md:text-4xl font-light tracking-tighter text-zinc-100">₹{stock.price.toLocaleString('en-IN')}</p>
                  <p className={`text-[10px] md:text-xs font-mono font-black ${stock.changePercentage >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stock.changePercentage > 0 ? '+' : ''}{stock.changePercentage}%
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 md:py-32 text-center text-zinc-600 font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] border border-white/5 rounded-3xl md:rounded-[40px] bg-zinc-900/5">
              NO MATCHING TICKERS IN TERMINAL
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12 md:mt-16">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", String(Number(currentPage) - 1));
                startTransition(() => {
                  router.push(`?${params.toString()}`, { scroll: false });
                });
              }}
              disabled={Number(currentPage) <= 1 || isPending}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800/40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 border border-white/10 rounded-full text-[10px] font-mono">
              <span className="text-zinc-500">Page</span>
              <span className="text-white font-bold">{currentPage}</span>
              <span className="text-zinc-500">of</span>
              <span className="text-white font-bold">{totalPages}</span>
            </div>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", String(Number(currentPage) + 1));
                startTransition(() => {
                  router.push(`?${params.toString()}`, { scroll: false });
                });
              }}
              disabled={Number(currentPage) >= totalPages || isPending}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800/40 transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
