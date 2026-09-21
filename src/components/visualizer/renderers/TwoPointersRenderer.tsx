"use client";

import React from "react";
import { AlgorithmStep } from "@/lib/visualizer/types";
import { ArrayElement } from "../primitives/ArrayElement";

interface TwoPointersRendererProps {
  step: AlgorithmStep;
}

export function TwoPointersRenderer({ step }: TwoPointersRendererProps) {
  const arrayState = step.arrayState;
  if (!arrayState || !arrayState.values) return null;

  const values = arrayState.values;
  const pointers = arrayState.pointers || {};
  const highlights = arrayState.highlights || {};
  const bars = arrayState.bars;
  const maxBar = bars ? Math.max(...bars, 1) : 10;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4">
      {/* Visual Bars / Array Elements */}
      <div className="flex items-end gap-2 flex-wrap justify-center p-4 rounded-xl bg-[#080c14] border border-zinc-800/80 shadow-inner">
        {values.map((val, idx) => {
          let pointerLabel: string | undefined;
          let pointerColor: string | undefined;

          for (const [_, p] of Object.entries(pointers)) {
            if (p.index === idx) {
              pointerLabel = p.label;
              pointerColor = p.color;
              break;
            }
          }

          const elemState = highlights[idx] || "default";

          return (
            <ArrayElement
              key={idx}
              val={val}
              idx={idx}
              pointerLabel={pointerLabel}
              pointerColor={pointerColor}
              state={elemState}
              barHeight={bars ? Number(bars[idx]) : undefined}
              maxBarHeight={maxBar}
            />
          );
        })}
      </div>
    </div>
  );
}
