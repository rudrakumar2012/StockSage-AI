"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Search from 'lucide-react/dist/esm/icons/search';
import { useTransition } from "react";

export default function MarketSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("query", term.toUpperCase());
    else params.delete("query");
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false }); // SCROLL FIX
    });
  };

  return (
    <div className="relative w-full max-w-md group">
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isPending ? 'text-indigo-500 animate-pulse' : 'text-zinc-600 group-focus-within:text-white'}`} />
      <input
        type="text"
        placeholder="FILTER BY TICKER..."
        defaultValue={searchParams.get("query") || ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full bg-zinc-900/40 border border-white/5 rounded-xl py-4 pl-12 text-[10px] font-mono tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all"
      />
    </div>
  );
}