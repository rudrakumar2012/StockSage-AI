"use client";

export default function DisclaimerBanner() {
  return (
    <div className="border-t border-white/5 bg-[#0a0a0a] py-3 px-4">
      <p className="text-xs md:text-sm text-zinc-500 font-mono uppercase tracking-[0.1em] md:tracking-[0.2em] text-center max-w-6xl mx-auto leading-relaxed">
        <span className="text-amber-500/80">DISCLAIMER:</span> StockSage is an educational and research platform for learning stock‑market analysis. We do not provide investment advice, stock recommendations, or portfolio management services. Not SEBI registered. Past performance is not indicative of future results. Consult a qualified financial advisor before making any investment decisions. Data sourced from public APIs; accuracy not guaranteed.
        <a href="/disclaimer" className="underline ml-2 text-zinc-400 hover:text-zinc-300">Read full disclaimer</a>
      </p>
    </div>
  );
}