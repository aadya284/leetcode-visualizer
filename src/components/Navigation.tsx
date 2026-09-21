"use client";

import { Flame, Terminal, Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserProgress } from "@/lib/userProgress";

export function Navigation() {
  const pathname = usePathname();
  const { mounted, profile, solvedCount, totalProblems, currentStreak } = useUserProgress();

  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : "LE";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-[#080c14]">
      <div className="w-full max-w-[1700px] mx-auto flex h-14 items-center justify-between px-6">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#2f81f7] font-mono font-black text-sm tracking-tighter">
              &lt;/&gt;
            </span>
            <span className="font-bold text-sm tracking-tight text-white">
              LeetVisual
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#13233a] text-[#58a6ff] border border-blue-900/40">
              DSA
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-xs font-medium">
            <Link
              href="/"
              className={`flex items-center gap-1.5 py-4 transition-colors relative ${
                pathname === "/" || pathname.startsWith("/problems")
                  ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2f81f7]"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Problems</span>
            </Link>
            <Link
              href="/visualize"
              className={`flex items-center gap-1.5 py-4 transition-colors relative ${
                pathname.startsWith("/visualize")
                  ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2f81f7]"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Visualize</span>
            </Link>
            <Link
              href="/profile"
              className={`flex items-center gap-1.5 py-4 transition-colors relative ${
                pathname === "/profile"
                  ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2f81f7]"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <span>Profile</span>
            </Link>
          </nav>
        </div>

        {/* Right Feature Controls: Dynamic Streaks, Stats & Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* Dynamic Daily Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18150d] border border-amber-900/30 text-amber-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{currentStreak > 0 ? `${currentStreak}d Streak` : "0d Streak"}</span>
          </div>

          {/* Dynamic Solved Progress Counter */}
          <Link
            href="/profile"
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d1422] border border-border/80 text-xs font-medium text-gray-300 hover:text-white transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${solvedCount > 0 ? "bg-green-500" : "bg-gray-500"}`}></span>
            <span className="font-mono text-white font-bold">
              {mounted ? `${solvedCount} / ${totalProblems || 20}` : "0 / 20"}
            </span>{" "}
            Solved
          </Link>

          {/* Dynamic Profile Avatar Link */}
          <Link href="/profile" title={profile.name || "View Profile"}>
            <div className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm hover:opacity-90 transition-opacity">
              {mounted ? initials : "LE"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
