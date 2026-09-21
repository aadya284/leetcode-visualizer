"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Problem } from "@/lib/problems";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

interface ProblemCardProps {
  problem: Problem;
  index: number;
  isSolved?: boolean;
}

export const difficultyColors: Record<string, string> = {
  Easy: "text-[#3fb950] bg-[#0f2d1a] border border-[#3fb950]/30",
  Medium: "text-[#d29922] bg-[#332408] border border-[#d29922]/30",
  Hard: "text-[#f85149] bg-[#381116] border border-[#f85149]/30",
};

export function ProblemCard({ problem, isSolved = false }: ProblemCardProps) {
  const diffClass = difficultyColors[problem.difficulty] || difficultyColors.Easy;

  const acceptanceRates: Record<string, string> = {
    "1": "52.4%",
    "2": "42.1%",
    "3": "34.8%",
    "4": "57.2%",
    "5": "64.9%",
    "6": "41.6%",
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between hover:border-foreground/30 transition-colors">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground font-semibold">
              #{problem.id}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${diffClass}`}>
              {problem.difficulty}
            </span>
          </div>

          <span className="text-[11px] font-mono text-muted-foreground">
            Acc: {acceptanceRates[problem.id] || "50.0%"}
          </span>
        </div>

        <Link href={`/problems/${problem.id}`}>
          <h3 className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
            {problem.title}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
          {problem.description.replace(/\n+/g, " ")}
        </p>

        <div className="flex items-center justify-between gap-2 mt-3 pt-2">
          <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
            {problem.category}
          </span>
          {isSolved ? (
            <span className="text-[11px] text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Solved
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              <Circle className="w-3 h-3 text-muted-foreground/50" />
              Unsolved
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-border flex justify-end">
        <Link href={`/problems/${problem.id}`}>
          <Button size="sm" variant="outline" className="h-7 text-xs px-2.5">
            Solve & Visualize
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
