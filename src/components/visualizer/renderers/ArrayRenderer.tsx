"use client";

import React from "react";
import { AlgorithmStep } from "@/lib/visualizer/types";
import { ArrayElement } from "../primitives/ArrayElement";

interface ArrayRendererProps {
  step: AlgorithmStep;
}

export function ArrayRenderer({ step }: ArrayRendererProps) {
  const arrayState = step.arrayState;
  const hashTableState = step.hashTableState;
  const dpState = step.dpState;

  const values = arrayState?.values || [];
  const pointers = arrayState?.pointers || {};
  const highlights = arrayState?.highlights || {};

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4">
      {/* Array Elements */}
      {values.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap justify-center p-4 rounded-xl bg-[#080c14] border border-zinc-800/80 shadow-inner">
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
              />
            );
          })}
        </div>
      )}

      {/* Hash Table State Card if present */}
      {hashTableState && (
        <div className="w-full max-w-md p-3 rounded-xl bg-[#080c14] border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300">Hash Map Entries &#123; value: index &#125;:</span>
            {hashTableState.target !== undefined && (
              <span className="font-mono text-[#58a6ff]">Target = {hashTableState.target}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap min-h-[32px]">
            {hashTableState.entries.length === 0 ? (
              <span className="text-zinc-500 italic text-xs">Map is empty &#123;&#125;</span>
            ) : (
              hashTableState.entries.map((entry, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-1 rounded-md border font-mono text-xs flex items-center gap-1 ${
                    entry.state === "match"
                      ? "bg-[#0f2d1a] border-[#3fb950] text-[#3fb950] font-bold"
                      : entry.state === "insert"
                      ? "bg-[#13233a] border-[#2f81f7] text-[#58a6ff]"
                      : "bg-[#0d121d] border-zinc-700 text-zinc-300"
                  }`}
                >
                  <span>{entry.key}:</span>
                  <span className="font-bold">{entry.val}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* DP Array State Card if present */}
      {dpState?.dpArray && (
        <div className="w-full max-w-lg p-3 rounded-xl bg-[#080c14] border border-zinc-800 space-y-2">
          <span className="text-xs font-semibold text-zinc-300">DP Memoization Array:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {dpState.dpArray.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold text-xs ${
                    item.state === "current"
                      ? "bg-[#13233a] border-[#2f81f7] text-[#58a6ff]"
                      : item.state === "base"
                      ? "bg-purple-950/80 border-purple-800 text-purple-300"
                      : "bg-[#0d121d] border-zinc-700 text-white"
                  }`}
                >
                  {item.val}
                </div>
                <span className="text-[10px] font-mono text-zinc-500">dp[{item.index}]</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
