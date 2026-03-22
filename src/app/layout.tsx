import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
      <body className="bg-[#030303] text-white antialiased">
        <Navbar />
        {/* We do NOT put padding here, we put it on the pages so we can control the hero sections */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}