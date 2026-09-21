"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserProgress } from "@/lib/userProgress";

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { profile } = useUserProgress();

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : "LE";

  return (
    <header className="h-16 border-b border-border/80 bg-background/50 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Search Input Bar */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search problems by title, ID or keyword..."
          value={searchQuery ?? ""}
          onChange={(e) => setSearchQuery?.(e.target.value)}
          className="pl-10 h-10 bg-[#0d121d] border-border/90 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-primary rounded-lg"
        />
      </div>

      {/* Right Actions: Avatar */}
      <div className="flex items-center gap-3">
        {/* User Profile Avatar */}
        <Link href="/profile" title="View Profile">
          <div className="w-9 h-9 rounded-full bg-[#2f81f7] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm hover:opacity-90 transition-opacity">
            {mounted ? initials : "LE"}
          </div>
        </Link>
      </div>
    </header>
  );
}
