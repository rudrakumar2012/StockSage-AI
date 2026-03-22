"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Database, Network } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-40 px-6">
      <div className="max-w-4xl mx-auto text-center mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-white mb-8 italic tracking-tighter"
        >
          Institutional <br /> <span className="text-indigo-500">Methodology</span>
        </motion.h1>
        <p className="text-zinc-500 text-lg leading-relaxed">
          StockSage-AI doesn't predict "luck." We track the physics of capital flow using edge-based neural processing.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-40">
        <AboutCard icon={<Database size={24}/>} title="Data Ingestion" desc="Processing 1.2M events per minute from global exchanges through Cloudflare D1." />
        <AboutCard icon={<Network size={24}/>} title="Neural Layer" desc="Multi-layered transformer models identifying high-density liquidity zones." />
      </div>
    </div>
  );
}

function AboutCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-zinc-900/20 border border-white/5">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400 border border-indigo-500/20">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-4 italic">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}