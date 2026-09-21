"use client";

import React from "react";
import { AlgorithmStep } from "@/lib/visualizer/types";

interface SlidingWindowRendererProps {
  step: AlgorithmStep;
}

export function SlidingWindowRenderer({ step }: SlidingWindowRendererProps) {
  const slidingState = step.slidingWindowState;
  if (!slidingState || !slidingState.sequence) return null;

  const { sequence, left, right, windowStr, seenTable = {}, maxLen = 0 } = slidingState;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4">
      {/* Sequence with Sliding Window Highlight */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center p-4 rounded-xl bg-[#080c14] border border-zinc-800/80 shadow-inner">
        {sequence.map((char, idx) => {
          const inWindow = idx >= left && idx <= right;
          const isLeft = idx === left;
          const isRight = idx === right;

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              {/* Pointer Indicator */}
              <div className="h-4 flex items-center justify-center text-[10px] font-mono font-bold">
                {isLeft && isRight ? (
                  <span className="bg-purple-600 text-white px-1 rounded">L,R</span>
                ) : isLeft ? (
                  <span className="bg-[#3fb950] text-white px-1 rounded">L</span>
                ) : isRight ? (
                  <span className="bg-[#2f81f7] text-white px-1 rounded">R</span>
                ) : (
                  <span className="text-transparent">•</span>
                )}
              </div>

              {/* Character Box */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 ${
                  inWindow
                    ? "bg-[#13233a] border-[#2f81f7] text-[#58a6ff] shadow-[0_0_8px_rgba(47,129,247,0.25)]"
                    : "bg-[#0d121d] border-zinc-800 text-zinc-400"
                }`}
              >
                {char}
              </div>

              {/* Index */}
              <span className="text-[10px] font-mono text-zinc-500">[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Window Status Summary & Seen Characters Map */}
      <div className="w-full max-w-lg grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-[#0d121d] border border-zinc-800 space-y-1">
          <span className="text-zinc-400 font-semibold">Active Window:</span>
          <div className="font-mono font-bold text-white text-sm">
            "{windowStr}" <span className="text-xs text-[#58a6ff]">({right - left + 1} chars)</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Max Length: <span className="text-white font-bold">{maxLen}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0d121d] border border-zinc-800 space-y-1">
          <span className="text-zinc-400 font-semibold">Seen Characters Map:</span>
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            {Object.entries(seenTable).length === 0 ? (
              <span className="text-zinc-500 italic text-xs">Empty</span>
            ) : (
              Object.entries(seenTable).map(([c, pos]) => (
                <span
                  key={c}
                  className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 font-mono text-[10px] text-zinc-300"
                >
                  '{c}': {pos}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
