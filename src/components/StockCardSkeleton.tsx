"use client";

export default function StockCardSkeleton() {
  return (
    <div className="bg-[#050505] border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden animate-pulse">
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />

      {/* Header with AI signal placeholder */}
      <div className="flex justify-between items-start mb-10 md:mb-14 relative z-10">
        <div className="flex-1">
          <div className="mb-3 h-5 w-24 bg-white/5 rounded" />
          <h3 className="text-2xl md:text-3xl font-bold tracking-tighter mb-2 uppercase">
            <div className="h-8 w-16 bg-white/5 rounded" />
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2 md:px-3 py-1 bg-white/5 text-[8px] text-zinc-700 rounded-full">
              <div className="h-3 w-12 bg-white/5 rounded" />
            </span>
            <span className="px-2 md:px-3 py-1 text-[8px] font-black rounded-full bg-white/5 text-zinc-700 blur-[2px]">
              <div className="h-3 w-16 bg-white/5 rounded" />
            </span>
          </div>
        </div>
        <div className={`p-2 md:p-3 rounded-full bg-white/5`}>
          <div className="w-4 md:w-5 h-4 md:h-5 bg-white/5 rounded" />
        </div>
      </div>

      {/* Price section */}
      <div className="flex justify-between items-end relative z-10">
        <div className="flex-1">
          <div className="h-8 w-32 bg-white/5 rounded" />
        </div>
        <div className="h-4 w-12 bg-white/5 rounded" />
      </div>
    </div>
  );
}
