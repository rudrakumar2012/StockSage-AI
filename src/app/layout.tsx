import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import DisclaimerBanner from "@/components/DisclaimerBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StockSage | Institutional AI Terminal",
  description: "Backtested signals for Indian equities. FinBERT NLP, multi-factor scanners, honest win rates.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#050505] text-white antialiased selection:bg-indigo-500/30`}>
        <Navbar />
        <main>
          {children}
        </main>
        <DisclaimerBanner />
        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            className: "bg-[#0a0a0a] border border-white/10 text-white font-sans",
          }}
        />
      </body>
    </html>
  );
}