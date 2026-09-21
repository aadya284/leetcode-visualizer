"use client";

import React from "react";
import { AlgorithmStep } from "@/lib/visualizer/types";
import { ArrayElement } from "../primitives/ArrayElement";

interface BinarySearchRendererProps {
  step: AlgorithmStep;
}

export function BinarySearchRenderer({ step }: BinarySearchRendererProps) {
  const arrayState = step.arrayState;
  if (!arrayState || !arrayState.values) return null;

  const values = arrayState.values;
  const pointers = arrayState.pointers || {};
  const highlights = arrayState.highlights || {};
  const eliminated = arrayState.eliminatedRanges || [];

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4">
      {/* Legend Bar */}
      <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#3fb950]" />
          <span>Left Pointer (L)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#2f81f7]" />
          <span>Mid Element (M)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#f85149]" />
          <span>Right Pointer (R)</span>
        </div>
      </div>

      {/* Array Elements with Boundaries */}
      <div className="flex items-center gap-2 flex-wrap justify-center p-4 rounded-xl bg-[#080c14] border border-zinc-800/80 shadow-inner">
        {values.map((val, idx) => {
          let pointerLabel: string | undefined;
          let pointerColor: string | undefined;

          // Check pointers
          for (const [_, p] of Object.entries(pointers)) {
            if (p.index === idx) {
              pointerLabel = p.label;
              pointerColor = p.color;
              break;
            }
          }

          // Check if eliminated
          let isEliminated = false;
          for (const range of eliminated) {
            if (idx >= range[0] && idx <= range[1]) {
              isEliminated = true;
              break;
            }
          }

          const elemState = isEliminated ? "eliminated" : (highlights[idx] || "default");

          return (
            <ArrayElement
              key={idx}
              val={val}
              idx={idx}
              pointerLabel={pointerLabel}
              pointerColor={pointerColor}
              state={elemState}
            />
          );
        })}
      </div>
    </div>
  );
}
