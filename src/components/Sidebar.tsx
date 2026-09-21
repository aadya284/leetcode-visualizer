"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Play, User } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Problems",
      href: "/",
      icon: LayoutGrid,
      isActive: pathname === "/",
    },
    {
      name: "Visualizer",
      href: "/visualize",
      icon: Play,
      isActive: pathname.startsWith("/visualize"),
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      isActive: pathname === "/profile",
    },
  ];

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-[#080c14] flex flex-col justify-between h-screen sticky top-0 px-4 py-5 z-40">
      {/* Brand Logo */}
      <div className="space-y-6">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <div className="text-primary font-mono font-black text-xl tracking-tighter">
            {"</>"}
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            LeetVisual
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  item.isActive
                    ? "bg-[#121d30] text-primary"
                    : "text-muted-foreground hover:text-white hover:bg-secondary/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Tagline */}
      <div className="pt-4 border-t border-border/80 px-2 space-y-1">
        <p className="text-[11px] text-muted-foreground/80 leading-snug">
          Visualize.
        </p>
        <p className="text-[11px] text-muted-foreground/80 leading-snug">
          Understand.
        </p>
        <p className="text-[11px] text-muted-foreground/80 leading-snug">
          Solve Faster.
        </p>
      </div>
    </aside>
  );
}
