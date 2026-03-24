import Link from "next/link";
import { Terminal } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020202] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="p-3 bg-linear-to-br from-indigo-500 to-fuchsia-500 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.5)]">
            <Terminal className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight italic">
          Authenticate Session
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Or <Link href="/" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">return to the public terminal</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0a0a0a] py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
          
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-400 uppercase tracking-widest">
                Terminal ID (Email)
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-xl bg-black text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm font-mono"
                  placeholder="operator@stocksage.ai"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-zinc-400 uppercase tracking-widest">
                Access Protocol (Password)
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-xl bg-black text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-black border-white/10 rounded text-indigo-500 focus:ring-indigo-500 focus:ring-offset-black"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
                  Maintain Link
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Protocol?
                </a>
              </div>
            </div>

            <div>
              <Link href="/dashboard" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold uppercase tracking-widest text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all">
                Initialize
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}