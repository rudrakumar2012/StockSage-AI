"use client";
export const runtime = 'edge';

import { motion } from "framer-motion";
import Check from 'lucide-react/dist/esm/icons/check';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import RazorpayCheckout from "@/components/RazorpayCheckout";

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleFreeStart = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 md:pt-40 px-4 md:px-6 pb-20">
      <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-7xl font-medium tracking-tight text-white mb-6">
            System <br className="md:hidden" /><span className="text-indigo-500 italic font-light">Access.</span>
          </h1>
          <p className="text-zinc-500 text-base md:text-lg font-light">
            Choose your data resolution and AI processing tier.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Tier 1: Retail */}
        <PricingCard 
          tier="Retail Pulse"
          price="Free"
          description="Basic monitoring for casual traders."
          features={["EOD Market Data", "115+ NSE Tickers", "Basic UI Access"]}
        >
          <button 
            onClick={handleFreeStart}
            className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-zinc-800 text-white hover:bg-zinc-700"
          >
            Start Free
          </button>
        </PricingCard>

        {/* Tier 2: Institutional (Highlighted) */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-cyan-500 rounded-3xl md:rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition" />
          <PricingCard 
            tier="Terminal Pro"
            price="₹199"
            description="High-frequency intelligence for professionals."
            features={["Live AI Sentiment Tape", "Predictive Alpha Scanners", "VADER NLP Analysis", "LibSQL Sub-10ms Queries"]}
            highlighted={true}
          >
            <RazorpayCheckout />
          </PricingCard>
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  tier,
  price,
  description,
  features,
  children,
  highlighted = false
}: any) {
  return (
    <div className={`h-full p-8 md:p-10 rounded-3xl md:rounded-[2.8rem] border ${highlighted ? 'bg-[#080808] border-white/10' : 'bg-zinc-900/10 border-white/5'} flex flex-col`}>
      <h3 className="text-indigo-400 font-mono tracking-[0.3em] uppercase mb-2 text-xs">{tier}</h3>
      <div className="text-4xl md:text-5xl font-bold text-white mb-4">
        {price}<span className="text-base md:text-lg text-zinc-600 font-medium">{price !== "Free" && "/mo"}</span>
      </div>
      <p className="text-zinc-500 text-sm mb-8 leading-relaxed">{description}</p>
      
      <div className="space-y-4 mb-10 md:mb-12 grow">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3 text-zinc-400 text-xs md:text-sm font-medium">
            <Check size={14} className="text-emerald-500" /> {f}
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}
