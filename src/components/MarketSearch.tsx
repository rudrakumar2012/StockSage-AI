"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Search from 'lucide-react/dist/esm/icons/search';
import X from 'lucide-react/dist/esm/icons/x';
import { useTransition, useState, useEffect, useCallback } from "react";

const DEBOUNCE_DELAY = 300; // ms

export default function MarketSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(searchParams.get("query") || "");
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  // Debounce input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Perform search when debounced value changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set("query", debouncedValue.toUpperCase());
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    // Preserve current sector if exists
    const sector = searchParams.get("sector");
    if (sector) params.set("sector", sector);

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }, [debouncedValue, searchParams, router, startTransition]);

  const handleClear = () => {
    setInputValue("");
  };

  const hasValue = inputValue.length > 0;

  return (
    <div className="relative w-full max-w-md group">
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${isPending ? 'text-indigo-500 animate-pulse' : 'text-zinc-600 group-focus-within:text-white'}`} />

      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white transition-colors z-10"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <input
        type="text"
        placeholder="FILTER BY TICKER..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full bg-zinc-900/40 border border-white/5 rounded-xl py-3 md:py-4 pl-12 pr-10 text-[10px] font-mono tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all"
      />
    </div>
  );
}