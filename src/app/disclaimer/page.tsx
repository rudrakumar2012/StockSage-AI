"use client";
export const runtime = 'edge';

import { motion } from "framer-motion";
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 md:pt-40 px-4 md:px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-full mb-8">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-7xl font-medium tracking-tight text-white mb-6">
            Legal <br className="md:hidden" /><span className="text-amber-500 italic font-light">Disclaimer.</span>
          </h1>
          <p className="text-zinc-500 text-base md:text-lg font-light">
            Important information about your use of StockSage.
          </p>
        </motion.div>

        <div className="space-y-8 md:space-y-12">
          <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl md:rounded-[2.5rem] p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">1. Educational Purpose Only</h2>
            <p className="text-zinc-400 mb-4">
              StockSage is an educational and research platform designed for learning stock‑market analysis techniques.
              The platform provides data visualization, analytical tools, and AI‑generated signals for educational purposes only.
            </p>
            <p className="text-zinc-400">
              We do <strong className="text-amber-500">NOT</strong> provide investment advice, stock recommendations, portfolio management services, or any form of financial advisory.
            </p>
          </section>

          <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl md:rounded-[2.5rem] p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">2. Not SEBI Registered</h2>
            <p className="text-zinc-400 mb-4">
              StockSage is <strong className="text-amber-500">NOT</strong> registered with the Securities and Exchange Board of India (SEBI) as:
            </p>
            <ul className="text-zinc-400 space-y-3 list-disc pl-6 mb-4">
              <li>Research Analyst (SEBI RA)</li>
              <li>Investment Adviser (SEBI IA)</li>
              <li>Stock Broker</li>
              <li>Portfolio Manager</li>
            </ul>
            <p className="text-zinc-400">
              Nothing on this platform should be construed as a solicitation, recommendation, or offer to buy or sell any securities.
            </p>
          </section>

          <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl md:rounded-[2.5rem] p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">3. No Investment Advice</h2>
            <p className="text-zinc-400 mb-4">
              All content, data, signals, and analysis provided by StockSage are for informational and educational purposes only.
              You are solely responsible for your investment decisions.
            </p>
            <p className="text-zinc-400">
              We strongly recommend consulting a qualified financial advisor, registered with SEBI, before making any investment decisions.
            </p>
          </section>

          <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl md:rounded-[2.5rem] p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">4. Market Risk Disclosure</h2>
            <p className="text-zinc-400 mb-4">
              Investments in securities markets are subject to market risks. Past performance is not indicative of future results.
              There is no assurance or guarantee that any investment will achieve its objectives or that any AI‑generated signal will be profitable.
            </p>
            <p className="text-zinc-400">
              You may lose some or all of your capital. Please read all related documents carefully before investing.
            </p>
          </section>

          <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl md:rounded-[2.5rem] p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">5. Data Accuracy & Limitations</h2>
            <p className="text-zinc-400 mb-4">
              Market data is sourced from public APIs (including yfinance) and may be delayed, inaccurate, or incomplete.
              AI sentiment analysis is based on publicly available news headlines and social media sentiment, which may not reflect all relevant information.
            </p>
            <p className="text-zinc-400">
              We do not guarantee the accuracy, completeness, or timeliness of any data or analysis on this platform.
            </p>
          </section>

          <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl md:rounded-[2.5rem] p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">6. Personal Responsibility</h2>
            <p className="text-zinc-400 mb-4">
              By using StockSage, you acknowledge that:
            </p>
            <ul className="text-zinc-400 space-y-3 list-disc pl-6 mb-4">
              <li>You are solely responsible for your investment decisions and their outcomes</li>
              <li>You understand the risks involved in securities trading</li>
              <li>You will not rely solely on StockSage for making investment decisions</li>
              <li>You have read and understood this disclaimer</li>
            </ul>
          </section>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-zinc-500 text-sm md:text-base font-mono uppercase tracking-[0.2em]">
              Last updated: April 2026
            </p>
            <p className="text-zinc-600 text-xs md:text-sm mt-4">
              If you have any questions about this disclaimer, contact: legal@stocksage.ai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}