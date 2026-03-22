import Link from "next/link";
import { ArrowRight, ChevronRight, Cpu, Zap, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background Orbs - The "Premium" Depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full animate-bounce [animation-duration:10s]" />

      <section className="relative z-10 pt-32 lg:pt-48 pb-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          {/* Badge with Glass Effect */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10 transition-all hover:bg-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
              Engineered for Cloudflare D1
            </span>
          </div>

          <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter text-white mb-8 italic">
            Market Intelligence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
              Redefined.
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-zinc-400 text-lg mb-12 leading-relaxed">
            High-fidelity stock analysis and AI-driven insights delivered at the edge.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard" className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <button className="relative px-8 py-4 bg-white text-black rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                Enter Terminal <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="#features" className="px-8 py-4 bg-zinc-900/50 text-white rounded-2xl font-bold border border-white/10 backdrop-blur-sm hover:bg-zinc-800 transition-all">
              View Specs
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section with Premium Cards */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Cpu className="text-indigo-400" />} 
            title="AI Predictions" 
            desc="Models trained on historical data to identify Institutional flows." 
          />
          <FeatureCard 
            icon={<Zap className="text-emerald-400" />} 
            title="Edge Execution" 
            desc="Global low-latency updates powered by Cloudflare D1." 
          />
          <FeatureCard 
            icon={<Globe className="text-blue-400" />} 
            title="Sector Alpha" 
            desc="Deep-dive analysis across all major global indices." 
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group p-8 rounded-[2.5rem] bg-zinc-900/20 border border-white/5 hover:border-indigo-500/30 transition-all relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}