export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { db, getMarketData } from "@/db";
import { syncLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, Database, Zap, Activity } from "lucide-react";
import MarketSearch from "@/components/MarketSearch";
import SystemBootLoader from "@/components/SystemBootLoader";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const sector = params.sector || "All";
  const query = params.query || "";

  let isReady = false;
  let data: any[] = [];
  let allIndexes: any[] = [];
  let totalPages = 1;
  let log = null;

  try {
    const result = await getMarketData({ page, limit: 16, sort: "desc", sector, query });
    data = result.data;
    allIndexes = result.allIndexes;
    totalPages = result.totalPages;

    const logs = await db.select().from(syncLogs).where(eq(syncLogs.id, 1));
    if (logs.length > 0) {
      log = logs[0];
      isReady = log.status === "READY"; 
    }
  } catch (error) {
    isReady = false;
  }

  // 1. SYSTEM BOOT LOADER (Triggers when DB is dropped or SYNCING)
  if (!isReady) {
    return <SystemBootLoader />;
  }

  // 2. MAIN DASHBOARD
  const sectorsList = ["All", "Energy", "Technology", "Financial Services", "Consumer", "Infrastructure", "Healthcare", "Automobile", "Metals"];

  return (
    <div className="min-h-screen bg-black text-white pt-48 pb-20 selection:bg-indigo-500/30 font-sans">
      <div className="max-w-360 mx-auto px-10">
        
        {/* TOP STATUS BAR */}
        <div className="mb-12 flex items-center">
          <div className="flex items-center gap-3 bg-zinc-900/20 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-md">
            <Database className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Data Baseline: {log?.lastSuccess}
            </span>
          </div>
        </div>

        {/* INDEX CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {allIndexes.map((idx) => (
            <div key={idx.id} className="bg-[#050505] border border-white/5 p-10 rounded-3xl hover:border-white/10 transition-all shadow-2xl">
              <p className="text-zinc-600 text-[10px] font-mono tracking-[0.5em] uppercase mb-4">{idx.indexName}</p>
              <div className="flex items-end justify-between">
                <h2 className="text-5xl font-light tracking-tighter italic">₹{idx.price.toLocaleString('en-IN')}</h2>
                <span className={`text-sm font-mono font-bold ${idx.changePercentage >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
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
                <Link 
                  key={s} 
                  href={`?sector=${s}&query=${query}`} 
                  scroll={false} 
                  className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${sector === s ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"}`}
                >
                  {s}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* MAIN STOCK GRID WITH RADAR ANIMATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.length > 0 ? data.map((stock) => (
            <div key={stock.id} className="bg-[#050505] border border-white/5 p-8 rounded-3xl hover:bg-zinc-900/10 hover:border-indigo-500/30 transition-all duration-700 group relative overflow-hidden">
              {stock.aiSignal && stock.aiSignal !== 'NONE' && (
                <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              )}
              <div className="flex justify-between items-start mb-14 relative z-10">
                <div>
                  {stock.aiSignal && stock.aiSignal !== 'NONE' && (
                    <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-bold font-mono text-indigo-400 tracking-widest uppercase">
                      <Zap className="w-3 h-3" />
                      {stock.aiSignal.replace('_', ' ')} • {stock.aiConfidence}%
                    </div>
                  )}
                  <h3 className="text-3xl font-bold tracking-tighter mb-2 uppercase italic leading-none group-hover:text-indigo-400 transition-colors">{stock.symbol}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/5 text-[9px] text-zinc-500 font-mono uppercase tracking-widest rounded-full">{stock.sector}</span>
                    <span className={`px-3 py-1 text-[8px] font-black font-mono tracking-widest rounded-full ${
                      stock.sentimentLabel === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-500' : 
                      stock.sentimentLabel === 'BEARISH' ? 'bg-rose-500/10 text-rose-500' : 
                      'bg-white/5 text-zinc-500'
                    }`}>
                      AI: {stock.sentimentLabel}
                    </span>
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
            
            /* RADAR EMPTY STATE ANIMATION */
            <div className="col-span-full py-32 flex flex-col items-center justify-center border border-white/5 bg-[#050505] rounded-[40px] relative overflow-hidden shadow-2xl">
              <div className="relative flex items-center justify-center mb-10 mt-4">
                <div className="absolute w-32 h-32 border border-indigo-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <div className="absolute w-16 h-16 border border-indigo-500/40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1]" />
              </div>
              <div className="flex flex-col items-center gap-3 z-10">
                <p className="text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-[0.4em] animate-pulse">
                  {query ? `No Match For "${query}"` : "Awaiting Terminal Data"}
                </p>
                <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                  {query ? "Adjust your search filters" : "Python Engine is securing EOD prices..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="mt-24 flex justify-between items-center border-t border-white/5 pt-12">
          <span className="text-[10px] font-mono text-zinc-700 tracking-[0.4em] uppercase">Page {page} / {totalPages}</span>
          <div className="flex items-center gap-6">
            <Link 
              href={`?page=${Math.max(1, page - 1)}&sector=${sector}&query=${query}`} 
              scroll={false} 
              className={`p-6 border border-white/10 rounded-full transition-all ${page <= 1 ? 'opacity-10 pointer-events-none' : 'hover:bg-white hover:text-black'}`}
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <Link 
              href={`?page=${Math.min(totalPages, page + 1)}&sector=${sector}&query=${query}`} 
              scroll={false} 
              className={`p-6 border border-white/10 rounded-full transition-all ${page >= totalPages ? 'opacity-10 pointer-events-none' : 'hover:bg-white hover:text-black'}`}
            >
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}