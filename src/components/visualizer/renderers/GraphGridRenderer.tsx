"use client";

import React from "react";
import { AlgorithmStep } from "@/lib/visualizer/types";

interface GraphGridRendererProps {
  step: AlgorithmStep;
}

export function GraphGridRenderer({ step }: GraphGridRendererProps) {
  const graphState = step.graphState;
  if (!graphState || !graphState.grid) return null;

  const { grid, islandCount = 0 } = graphState;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-3">
      {/* Island Counter Badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#13233a] border border-blue-900/40 text-xs font-mono">
        <span className="text-zinc-400">Total Islands Discovered:</span>
        <span className="text-[#58a6ff] font-bold text-sm">{islandCount}</span>
      </div>

      {/* 2D Grid Cells */}
      <div className="p-4 rounded-xl bg-[#080c14] border border-zinc-800/80 shadow-inner flex flex-col gap-1.5">
        {grid.cells.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1.5 justify-center">
            {row.map((cell, cIdx) => {
              let bg = "bg-[#0d121d] text-zinc-600 border-zinc-800"; // water

              if (cell.state === "island") {
                bg = "bg-[#0f2d1a] text-[#3fb950] border-[#3fb950] shadow-[0_0_8px_rgba(63,185,80,0.3)] font-bold";
              } else if (cell.state === "visited") {
                bg = "bg-[#13233a] text-[#58a6ff] border-blue-800/80";
              } else if (cell.state === "land") {
                bg = "bg-zinc-800 text-zinc-200 border-zinc-700";
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center font-mono text-xs transition-all duration-200 ${bg}`}
                  title={`Cell (${rIdx}, ${cIdx}) - ${cell.state}`}
                >
                  {cell.val}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
