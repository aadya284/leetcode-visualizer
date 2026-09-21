"use client";

import React from "react";
import { AlgorithmStep } from "@/lib/visualizer/types";
import { Terminal, Info } from "lucide-react";

interface StatePanelProps {
  step: AlgorithmStep;
}

export function StatePanel({ step }: StatePanelProps) {
  const variables = step.variables || {};
  const varEntries = Object.entries(variables).filter(([_, v]) => v !== undefined);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      {/* Left: Algorithmic Step Description & State Reasoning */}
      <div className="rounded-xl border border-zinc-800 bg-[#0d121d] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#2f81f7]" />
            Algorithm State & Reasoning
          </span>
          {step.complexity && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700">
                Time: {step.complexity.time}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700">
                Space: {step.complexity.space}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="font-semibold text-white text-xs leading-snug">
            {step.description}
          </p>
          <p className="text-zinc-400 text-xs leading-relaxed">
            {step.explanation}
          </p>
        </div>

        {/* Live Variables Chips */}
        {varEntries.length > 0 && (
          <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-zinc-500 mr-1">
              Live Vars:
            </span>
            {varEntries.map(([key, val]) => (
              <div
                key={key}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#131b29] border border-blue-900/30 text-[11px] font-mono"
              >
                <span className="text-zinc-400">{key}:</span>
                <span className="text-[#58a6ff] font-bold">{String(val)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Active Code Snippet Line Highlight */}
      <div className="rounded-xl border border-zinc-800 bg-[#0d121d] p-4 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#2f81f7]" />
            Executing Code Line
          </span>
          {step.codeLine && (
            <span className="text-[10px] font-mono font-bold text-blue-400">
              Line {step.codeLine}
            </span>
          )}
        </div>

        <div className="rounded-lg bg-[#080c14] border border-zinc-800/90 p-3 overflow-x-auto">
          <pre className="font-mono text-xs text-zinc-300 leading-relaxed">
            <code>{step.codeSnippet || "# Executing algorithm step..."}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
