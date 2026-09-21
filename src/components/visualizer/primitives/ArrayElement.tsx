"use client";

import React from "react";

interface ArrayElementProps {
  val: number | string;
  idx: number;
  pointerLabel?: string;
  pointerColor?: string;
  state?: "current" | "comparing" | "found" | "eliminated" | "window" | "visited" | "default";
  barHeight?: number;
  maxBarHeight?: number;
}

export function ArrayElement({
  val,
  idx,
  pointerLabel,
  pointerColor = "#2f81f7",
  state = "default",
  barHeight,
  maxBarHeight = 10,
}: ArrayElementProps) {
  let bgClass = "bg-[#0d121d] text-white border-zinc-750";

  if (state === "found") {
    bgClass = "bg-[#0f2d1a] text-[#3fb950] border-[#3fb950] shadow-[0_0_12px_rgba(63,185,80,0.2)]";
  } else if (state === "comparing" || state === "current") {
    bgClass = "bg-[#13233a] text-[#58a6ff] border-[#2f81f7] shadow-[0_0_12px_rgba(47,129,247,0.2)]";
  } else if (state === "window") {
    bgClass = "bg-[#161f30] text-blue-200 border-blue-600/60";
  } else if (state === "eliminated") {
    bgClass = "bg-zinc-900/40 text-zinc-600 border-zinc-800 line-through opacity-40";
  }

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0 select-none transition-all duration-200">
      {/* Top Pointer Indicator */}
      <div className="h-5 flex items-center justify-center">
        {pointerLabel ? (
          <span
            style={{ backgroundColor: pointerColor }}
            className="text-[10px] font-bold font-mono text-white px-1.5 py-0.2 rounded shadow-sm animate-bounce"
          >
            {pointerLabel}
          </span>
        ) : (
          <span className="text-[10px] text-transparent">•</span>
        )}
      </div>

      {/* Optional Bar (for Container with Most Water / Height problems) */}
      {barHeight !== undefined && (
        <div className="w-9 h-20 flex items-end justify-center">
          <div
            style={{ height: `${Math.max(10, (barHeight / (maxBarHeight || 10)) * 80)}px` }}
            className={`w-7 rounded-t transition-all duration-300 ${
              state === "found"
                ? "bg-[#3fb950]"
                : state === "comparing" || state === "current"
                ? "bg-[#2f81f7]"
                : "bg-zinc-700"
            }`}
          />
        </div>
      )}

      {/* Array Element Box */}
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg border flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all duration-200 ${bgClass}`}
      >
        {val}
      </div>

      {/* Bottom Index */}
      <span className="text-[10px] font-mono text-zinc-500">[{idx}]</span>
    </div>
  );
}
