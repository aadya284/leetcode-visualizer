"use client";

import React from "react";
import { AlgorithmStep } from "@/lib/visualizer/types";

interface StackRendererProps {
  step: AlgorithmStep;
}

export function StackRenderer({ step }: StackRendererProps) {
  const stackState = step.stackState;
  if (!stackState) return null;

  const { stack = [], inputSequence = [], currentIndex = 0 } = stackState;

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-around gap-6 py-4">
      {/* Input Sequence Stream */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400">Input Sequence:</span>
        <div className="flex gap-1.5 p-3 rounded-xl bg-[#080c14] border border-zinc-800">
          {inputSequence.map((char, idx) => {
            const isProcessed = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={idx}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 ${
                  isCurrent
                    ? "bg-[#13233a] border-[#2f81f7] text-[#58a6ff] shadow-[0_0_8px_rgba(47,129,247,0.3)]"
                    : isProcessed
                    ? "bg-[#0d121d] border-zinc-800 text-zinc-600 line-through"
                    : "bg-[#0d121d] border-zinc-700 text-white"
                }`}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stack Tube Container */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400">Stack (LIFO):</span>
        <div className="w-24 h-40 border-b-4 border-x-2 border-zinc-600 rounded-b-xl p-2 flex flex-col-reverse gap-1.5 bg-[#080c14] shadow-inner overflow-hidden">
          {stack.length === 0 ? (
            <span className="text-[11px] text-zinc-600 italic text-center m-auto">
              Empty
            </span>
          ) : (
            stack.map((item, idx) => (
              <div
                key={item.id || idx}
                className="w-full h-7 rounded bg-[#2f81f7] text-white font-mono font-bold text-xs flex items-center justify-center shadow-sm animate-in fade-in"
              >
                {item.val}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
