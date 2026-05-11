"use client";

import { Suspense } from 'react';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right';
import ArrowDownRight from 'lucide-react/dist/esm/icons/arrow-down-right';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Database from 'lucide-react/dist/esm/icons/database';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import TrendingDown from 'lucide-react/dist/esm/icons/trending-down';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';
import MarketSearch from "@/components/MarketSearch";
import SystemBootLoader from "@/components/SystemBootLoader";
import DashboardHeader from "@/components/DashboardHeader";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SignalAction = 'BUY' | 'SELL' | 'HOLD';

function getSignalAction(signal: string): SignalAction {
  if (signal === 'OVERSOLD_BOUNCE' || signal === 'MOMENTUM_SPIKE') return 'BUY';
  if (signal === 'MEAN_REVERSION' || signal === 'BEARISH_DUMP') return 'SELL';
  return 'HOLD';
}

function getSignalQuality(confidence: number) {
  if (confidence >= 70) return { label: 'Strong', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
  if (confidence >= 60) return { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
  if (confidence > 50) return { label: 'Weak', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
  return { label: 'Unvalidated', color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' };
}

function getFactors(stock: any): { label: string; value: string; passed: boolean }[] {
  const signal = stock.aiSignal;
  const rsi = stock.rsi || 0;
  const vol = stock.volumeSpike || 1;
  const sentScore = stock.sentimentScore || 0;
  const sentLabel = stock.sentimentLabel || 'NO_DATA';

  if (signal === 'OVERSOLD_BOUNCE') {
    return [
      { label: 'RSI', value: `${rsi.toFixed(1)} (< 35)`, passed: rsi < 35 },
      { label: 'Sentiment', value: sentLabel !== 'NO_DATA' ? `${sentLabel} (${sentScore > 0 ? '+' : ''}${sentScore.toFixed(2)})` : '—', passed: sentScore > 0.3 },
      { label: 'Volume', value: `${vol.toFixed(1)}x avg`, passed: vol > 1.0 },
    ];
  }
  if (signal === 'MOMENTUM_SPIKE') {
    return [
      { label: 'Volume', value: `${vol.toFixed(1)}x avg (> 1.5)`, passed: vol > 1.5 },
      { label: 'RSI', value: `${rsi.toFixed(1)} (55–70)`, passed: rsi > 55 && rsi < 70 },
      { label: 'Sentiment', value: sentLabel !== 'NO_DATA' ? `${sentLabel} (${sentScore > 0 ? '+' : ''}${sentScore.toFixed(2)})` : '—', passed: sentScore > 0.3 },
    ];
  }
  if (signal === 'MEAN_REVERSION') {
    return [
      { label: 'RSI', value: `${rsi.toFixed(1)} (> 70)`, passed: rsi > 70 },
      { label: 'Sentiment', value: sentLabel !== 'NO_DATA' ? `${sentLabel} (${sentScore > 0 ? '+' : ''}${sentScore.toFixed(2)})` : '—', passed: sentScore < -0.3 },
      { label: 'Volume', value: `${vol.toFixed(1)}x avg`, passed: vol > 1.0 },
    ];
  }
  if (signal === 'BEARISH_DUMP') {
    return [
      { label: 'Volume', value: `${vol.toFixed(1)}x avg (> 1.5)`, passed: vol > 1.5 },
      { label: 'RSI', value: `${rsi.toFixed(1)} (< 40)`, passed: rsi < 40 },
      { label: 'Sentiment', value: sentLabel !== 'NO_DATA' ? `${sentLabel} (${sentScore > 0 ? '+' : ''}${sentScore.toFixed(2)})` : '—', passed: sentScore < -0.3 },
    ];
  }
  return [];
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<any[]>([]);
  const [allIndexes, setAllIndexes] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [log, setLog] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState<string[]>(["All"]);
  const [buyCount, setBuyCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);

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
          setBuyCount(result.buyCount ?? 0);
          setSellCount(result.sellCount ?? 0);
          if (result.sectors && result.sectors.length > 0) {
            setSectors(["All", ...result.sectors.map((s: any) => s.sector).filter(Boolean)]);
          }
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
    const query = searchParams.get("query");
    if (query) params.set("query", query);

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  // Split stocks into signal vs watchlist, sort signals by confidence
  const signalStocks = data
    .filter(s => s.aiSignal && s.aiSignal !== 'NONE')
    .sort((a, b) => (b.aiConfidence || 0) - (a.aiConfidence || 0));
  const watchlistStocks = data.filter(s => !s.aiSignal || s.aiSignal === 'NONE');

  if (loading && data.length === 0 && !isReady) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Initialising Secure Terminal...</div>;
  }

  if (!isReady && !loading) {
    return <SystemBootLoader />;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 md:pt-48 pb-20 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      <DashboardHeader lastUpdated={log?.lastSuccess || undefined} />

      <div className="max-w-7xl mx-auto px-4 md:px-10">

        {/* TOP STATUS BAR */}
        <div className="mb-8 md:mb-12 flex items-center overflow-x-auto no-scrollbar pb-2 gap-3">
          <div className="flex items-center gap-3 bg-zinc-900/20 px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-white/5 backdrop-blur-md whitespace-nowrap">
            <Database className="w-3 h-3 text-emerald-500" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">
              Data Baseline: {log?.lastSuccess || 'Live Connection'}
            </span>
          </div>
          {(buyCount > 0 || sellCount > 0) && (
            <div className="flex items-center gap-3 whitespace-nowrap">
              {buyCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">{buyCount} BUY</span>
                </div>
              )}
              {sellCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-rose-400">{sellCount} SELL</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* INDEX CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 mb-10 md:mb-16">
          {allIndexes.map((idx) => (
            <div key={idx.id} className="bg-[#050505] border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl hover:border-indigo-500/30 transition-all group min-w-0">
              <p className="text-zinc-600 text-xs font-mono tracking-widest uppercase mb-1 md:mb-2 group-hover:text-zinc-400 transition-colors truncate">{idx.indexName}</p>
              <div className="flex flex-col min-w-0">
                <h2 className="text-lg md:text-xl font-medium tracking-tight text-white group-hover:text-indigo-400 transition-colors truncate">₹{idx.price.toLocaleString('en-IN')}</h2>
                <span className={`text-xs font-mono font-bold mt-0.5 md:mt-1 ${idx.changePercentage >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
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
            <div className="relative group min-w-0 sm:min-w-[160px]">
              <select
                value={currentSector}
                onChange={(e) => handleSectorChange(e.target.value)}
                disabled={isPending}
                className="w-full appearance-none bg-zinc-900/40 border border-white/10 rounded-xl px-5 py-3 md:py-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer hover:bg-zinc-800/40"
              >
                {sectors.map((s) => (
                  <option key={s} value={s} className="bg-black text-white">
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none group-focus-within:text-indigo-400 transition-colors" />
            </div>
          </div>
        </div>

        {/* ACTIVE SIGNALS SECTION */}
        {signalStocks.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg md:text-xl font-medium tracking-tight text-white">Active Signals</h2>
              <span className="text-xs font-mono text-zinc-600 tracking-widest uppercase">{signalStocks.length} {signalStocks.length === 1 ? 'stock' : 'stocks'} with signals</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {signalStocks.map((stock) => {
                const action = getSignalAction(stock.aiSignal);
                const quality = getSignalQuality(stock.aiConfidence || 0);
                const factors = getFactors(stock);
                const isBuy = action === 'BUY';

                return (
                  <div key={stock.id} className={`bg-[#050505] border p-6 md:p-8 rounded-2xl md:rounded-3xl transition-all duration-500 group relative overflow-hidden ${isBuy ? 'border-emerald-500/20 hover:border-emerald-500/40' : 'border-rose-500/20 hover:border-rose-500/40'}`}>

                    {/* Subtle glow */}
                    <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-[0.07] group-hover:opacity-[0.12] transition-opacity pointer-events-none ${isBuy ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                    {/* Action badge + change */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-black font-mono tracking-[0.2em] uppercase ${isBuy ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                        {isBuy ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {action}
                      </div>
                      <div className={`p-2 rounded-full ${stock.changePercentage >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                        {stock.changePercentage >= 0 ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-rose-500" />}
                      </div>
                    </div>

                    {/* Symbol + Price */}
                    <div className="relative z-10 mb-4">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase italic leading-none group-hover:text-indigo-400 transition-colors mb-1">{stock.symbol}</h3>
                      <div className="flex items-baseline gap-3 mt-2">
                        <p className="text-2xl md:text-3xl font-light tracking-tighter text-zinc-100">₹{stock.price.toLocaleString('en-IN')}</p>
                        <p className={`text-xs font-mono font-black ${stock.changePercentage >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {stock.changePercentage > 0 ? '+' : ''}{stock.changePercentage}%
                        </p>
                      </div>
                    </div>

                    {/* Quality tier */}
                    <div className="relative z-10 flex items-center gap-2 mb-4">
                      <span className={`text-sm font-bold font-mono ${quality.color}`}>{stock.aiConfidence}% win rate</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-widest ${quality.bg} ${quality.color} ${quality.border} border`}>
                        {quality.label === 'Strong' && <CheckCircle className="w-2.5 h-2.5" />}
                        {quality.label === 'Weak' && <AlertTriangle className="w-2.5 h-2.5" />}
                        {quality.label === 'Unvalidated' && <HelpCircle className="w-2.5 h-2.5" />}
                        {quality.label}
                      </span>
                      <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">{stock.aiSignal.replace('_', ' ')}</span>
                    </div>

                    {/* Factor breakdown */}
                    {factors.length > 0 && (
                      <div className="relative z-10 bg-white/[0.02] border border-white/5 rounded-lg p-3 space-y-1.5">
                        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.15em] mb-1">Why this signal</p>
                        {factors.map((f, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 font-mono">{f.label}</span>
                            <span className={f.passed ? 'text-emerald-400 font-mono' : 'text-zinc-600 font-mono line-through'}>{f.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sector + Sentiment */}
                    <div className="relative z-10 flex items-center gap-2 flex-wrap mt-4">
                      <span className="px-2 py-1 bg-white/5 text-xs text-zinc-500 font-mono uppercase tracking-widest rounded-full">{stock.sector}</span>
                      {stock.sentimentLabel === 'BULLISH' && (
                        <span className="px-2 py-1 text-xs font-bold font-mono tracking-widest rounded-full bg-emerald-500/10 text-emerald-500">BULLISH</span>
                      )}
                      {stock.sentimentLabel === 'BEARISH' && (
                        <span className="px-2 py-1 text-xs font-bold font-mono tracking-widest rounded-full bg-rose-500/10 text-rose-500">BEARISH</span>
                      )}
                      {stock.sentimentLabel === 'NEUTRAL' && (
                        <span className="px-2 py-1 text-xs font-mono tracking-widest rounded-full bg-white/5 text-zinc-500">NEUTRAL</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WATCHLIST (NO SIGNAL) SECTION */}
        {watchlistStocks.length > 0 && (
          <div>
            {signalStocks.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg md:text-xl font-medium tracking-tight text-zinc-400">Watchlist</h2>
                <span className="text-xs font-mono text-zinc-600 tracking-widest uppercase">No active signal</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {watchlistStocks.map((stock) => (
                <div key={stock.id} className="bg-[#050505] border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:bg-zinc-900/10 hover:border-indigo-500/30 transition-all duration-700 group relative overflow-hidden">

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tighter mb-2 uppercase italic leading-none group-hover:text-indigo-400 transition-colors">{stock.symbol}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 md:px-3 py-1 bg-white/5 text-xs text-zinc-500 font-mono uppercase tracking-widest rounded-full">{stock.sector}</span>
                        {stock.sentimentLabel === 'BULLISH' && (
                          <span className="px-2 py-1 text-xs font-bold font-mono tracking-widest rounded-full bg-emerald-500/10 text-emerald-500">BULLISH</span>
                        )}
                        {stock.sentimentLabel === 'BEARISH' && (
                          <span className="px-2 py-1 text-xs font-bold font-mono tracking-widest rounded-full bg-rose-500/10 text-rose-500">BEARISH</span>
                        )}
                        {stock.sentimentLabel === 'NEUTRAL' && (
                          <span className="px-2 py-1 text-xs font-mono tracking-widest rounded-full bg-white/5 text-zinc-500">NEUTRAL</span>
                        )}
                        {stock.sentimentLabel === 'NO_DATA' && (
                          <span className="px-2 py-1 text-xs font-mono tracking-widest rounded-full bg-white/5 text-zinc-700">No News</span>
                        )}
                      </div>
                    </div>
                    <div className={`p-2 md:p-3 rounded-full ${stock.changePercentage >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                      {stock.changePercentage >= 0 ? <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />}
                    </div>
                  </div>

                  <div className="flex justify-between items-end relative z-10">
                    <p className="text-2xl md:text-3xl font-light tracking-tighter text-zinc-100">₹{stock.price.toLocaleString('en-IN')}</p>
                    <p className={`text-xs font-mono font-black ${stock.changePercentage >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {stock.changePercentage > 0 ? '+' : ''}{stock.changePercentage}%
                    </p>
                  </div>

                  {/* Technical indicators row */}
                  {stock.rsi > 0 && (
                    <div className="flex items-center gap-3 mt-3 text-xs font-mono text-zinc-600 relative z-10">
                      <span>RSI <span className={stock.rsi < 35 ? 'text-emerald-400' : stock.rsi > 70 ? 'text-rose-400' : 'text-zinc-400'}>{stock.rsi.toFixed(1)}</span></span>
                      {stock.volumeSpike > 0 && stock.volumeSpike !== 1 && (
                        <span>Vol <span className={stock.volumeSpike > 1.5 ? 'text-amber-400' : 'text-zinc-400'}>{stock.volumeSpike.toFixed(1)}x</span></span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {data.length === 0 && !loading && (
          <div className="py-24 md:py-32 text-center text-zinc-600 font-mono text-xs uppercase tracking-[0.4em] border border-white/5 rounded-3xl md:rounded-[40px] bg-zinc-900/5">
            NO MATCHING TICKERS IN TERMINAL
          </div>
        )}

        {/* Loading skeletons */}
        {loading && data.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-[#050505] border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl animate-pulse">
                <div className="h-5 w-20 bg-zinc-800 rounded mb-4" />
                <div className="h-8 w-32 bg-zinc-800 rounded mb-4" />
                <div className="h-4 w-24 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        )}

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
              className="flex items-center gap-2 px-4 py-3 bg-zinc-900/40 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800/40 transition-all min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/40 border border-white/10 rounded-full text-xs font-mono min-h-[44px]">
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
              className="flex items-center gap-2 px-4 py-3 bg-zinc-900/40 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800/40 transition-all min-h-[44px]"
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

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Loading Terminal...</div>}>
      <DashboardContent />
    </Suspense>
  );
}