import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import your new Navbar

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StockSage AI",
  description: "Advanced Market Intelligence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-[#050505] antialiased`}>
        <Navbar /> {/* This puts the navbar on every page */}
        <main>{children}</main>
      </body>
    </html>
  );
}