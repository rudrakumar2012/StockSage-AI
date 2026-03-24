import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

// Pure, clean, institutional typography
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StockSage | Institutional AI Terminal",
  description: "Next-Generation Quantitative Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#050505] text-white antialiased selection:bg-indigo-500/30`}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <Navbar />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
