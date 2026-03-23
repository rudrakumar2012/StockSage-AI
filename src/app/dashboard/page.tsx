export const revalidate = 300;

import { db, getMarketData } from "@/db";
import { syncLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight } from "lucide-react";
import MarketSearch from "@/components/MarketSearch";
import RefreshTimer from "@/components/RefreshTimer";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const sector = params.sector || "All";
  const query = params.query || "";

  const { data, allIndexes, totalPages } = await getMarketData({
    page, limit: 16, sort: "desc", sector, query
  });

  const [log] = await db.select().from(syncLogs).where(eq(syncLogs.id, 1));
  const sectors = ["All", "Energy", "Technology", "Financial Services", "Consumer", "Infrastructure", "Healthcare", "Automobile", "Metals"];

  return (
    <div className="min-h-screen bg-black text-white pt-48 pb-20 selection:bg-indigo-500/30 font-sans">
      <div className="max-w-[1440px] mx-auto px-10">
        
        {/* STATUS BAR */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-zinc-900/20 px-5 py-2.5 rounded-full border border-white/5">
            <div className={`w-2 h-2 rounded-full ${log?.status === "SYNCING" ? "bg-amber-500 animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_#10b981]"}`} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              {log?.status === "SYNCING" ? "Syncing..." : `Live Sync: ${log?.lastSuccess}`}
            </span>
          </div>
          <RefreshTimer />
        </div>

        {/* HEADER & FILTERS */}
        <div className="flex flex-col xl:flex-row justify-between items-end gap-12 mb-16 pb-12 border-b border-white/5">
          <h1 className="text-8xl font-medium tracking-tighter italic">NSE Core.</h1>
          <div className="flex flex-col items-end gap-6 w-full xl:w-auto">
            <MarketSearch />
            <nav className="flex flex-wrap items-center justify-end gap-1 bg-zinc-900/30 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
              {sectors.map((s) => (
                <Link 
                  key={s} 
                  href={`?sector=${s}&query=${query}`} 
                  scroll={false} // SCROLL FIX
                  className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${sector === s ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
                >
                  {s}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* STOCK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((stock) => (
            <div key={stock.id} className="bg-[#050505] border border-white/5 p-8 rounded-3xl hover:bg-zinc-900/20 hover:border-indigo-500/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-14">
                <div>
                  <h3 className="text-3xl font-bold tracking-tighter mb-2 uppercase italic leading-none">{stock.symbol}</h3>
                  <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">{stock.sector}</span>
                </div>
                <div className={`p-3 rounded-full ${stock.changePercentage >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                  {stock.changePercentage >= 0 ? <ArrowUpRight className="w-5 h-5 text-emerald-500" /> : <ArrowDownRight className="w-5 h-5 text-rose-500" />}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-4xl font-light tracking-tighter">₹{stock.price.toLocaleString('en-IN')}</p>
                <p className={`text-xs font-mono font-black ${stock.changePercentage >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stock.changePercentage > 0 ? '+' : ''}{stock.changePercentage}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-24 flex justify-between items-center border-t border-white/5 pt-12">
          <span className="text-[10px] font-mono text-zinc-700 tracking-[0.4em] uppercase">Page {page} / {totalPages}</span>
          <div className="flex items-center gap-4">
            <Link 
               href={`?page=${Math.max(1, page - 1)}&sector=${sector}&query=${query}`} 
               scroll={false} // SCROLL FIX
               className={`p-6 border border-white/10 rounded-full ${page <= 1 ? 'opacity-10 pointer-events-none' : 'hover:bg-white hover:text-black'}`}
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <Link 
               href={`?page=${Math.min(totalPages, page + 1)}&sector=${sector}&query=${query}`} 
               scroll={false} // SCROLL FIX
               className={`p-6 border border-white/10 rounded-full ${page >= totalPages ? 'opacity-10 pointer-events-none' : 'hover:bg-white hover:text-black'}`}
            >
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}