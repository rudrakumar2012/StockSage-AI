"use client";
import { motion } from "framer-motion";
import { Check, Shield, Zap, Globe } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-40 px-6 pb-20">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-6 uppercase">
            System <span className="text-indigo-500">Access</span>
          </h1>
          <p className="text-zinc-500 text-lg">
            Choose your data resolution and AI processing tier.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Tier 1: Retail */}
        <PricingCard 
          tier="Retail Pulse"
          price="Free"
          description="Basic monitoring for casual traders."
          features={["Delayed Market Data", "3 AI Signals / Day", "Basic Sector Heatmaps"]}
          buttonText="Start Free"
        />

        {/* Tier 2: Institutional (Highlighted) */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition" />
          <PricingCard 
            tier="Terminal Pro"
            price="$199"
            description="High-frequency intelligence for professionals."
            features={["Sub-10ms Real-time Data", "Unlimited AI Signals", "Institutional Flow Tracking", "Priority Edge Execution"]}
            buttonText="Initialize Pro"
            highlighted={true}
          />
        </div>
      </div>
    </div>
  );
}

function PricingCard({ tier, price, description, features, buttonText, highlighted = false }: any) {
  return (
    <div className={`h-full p-10 rounded-[2.8rem] border ${highlighted ? 'bg-[#080808] border-white/10' : 'bg-zinc-900/10 border-white/5'} flex flex-col`}>
      <h3 className="text-indigo-400 font-mono tracking-[0.3em] uppercase mb-2 text-xs">{tier}</h3>
      <div className="text-5xl font-bold text-white mb-4">
        {price}<span className="text-lg text-zinc-600 font-medium">{price !== "Free" && "/mo"}</span>
      </div>
      <p className="text-zinc-500 text-sm mb-8">{description}</p>
      
      <div className="space-y-4 mb-12 flex-grow">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3 text-zinc-400 text-sm font-medium">
            <Check size={14} className="text-emerald-500" /> {f}
          </div>
        ))}
      </div>

      <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${highlighted ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
        {buttonText}
      </button>
    </div>
  );
}