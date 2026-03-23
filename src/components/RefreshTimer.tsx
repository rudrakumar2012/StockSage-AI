"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Timer } from "lucide-react";

export default function RefreshTimer() {
  const [seconds, setSeconds] = useState(300); // 5 minutes
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          // Trigger a refresh of the server data without a full page reload
          router.refresh(); 
          return 300; // Reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  // Format seconds into MM:SS
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const displayTime = `${mins}:${secs < 10 ? `0${secs}` : secs}`;

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 bg-zinc-900/40 border border-white/5 rounded-full backdrop-blur-md">
      <Timer className="w-3 h-3 text-indigo-500" />
      <div className="flex flex-col">
        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-1">
          Next Auto-Update
        </span>
        <span className="text-xs font-mono font-bold text-white leading-none">
          {displayTime}
        </span>
      </div>
    </div>
  );
}