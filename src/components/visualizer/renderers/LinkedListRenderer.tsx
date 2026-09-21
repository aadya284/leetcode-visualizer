"use client";

import React from "react";
import { AlgorithmStep } from "@/lib/visualizer/types";

interface LinkedListRendererProps {
  step: AlgorithmStep;
}

export function LinkedListRenderer({ step }: LinkedListRendererProps) {
  const linkedListState = step.linkedListState;
  if (!linkedListState || !linkedListState.lists) return null;

  const { lists, carry } = linkedListState;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4">
      {/* Linked Lists Display */}
      <div className="w-full space-y-4">
        {lists.map((list, listIdx) => (
          <div key={listIdx} className="space-y-1.5 p-3 rounded-xl bg-[#080c14] border border-zinc-800/80">
            <span className="text-xs font-semibold text-zinc-400 font-mono">{list.name}:</span>
            <div className="flex items-center gap-2 flex-wrap min-h-[48px]">
              {list.nodes.length === 0 ? (
                <span className="text-xs text-zinc-500 italic">Empty list</span>
              ) : (
                list.nodes.map((node, nodeIdx) => {
                  let pointerBadge: string | undefined;
                  if (list.pointers) {
                    for (const [pName, pNodeId] of Object.entries(list.pointers)) {
                      if (pNodeId === node.id) {
                        pointerBadge = pName;
                        break;
                      }
                    }
                  }

                  return (
                    <div key={node.id} className="flex items-center gap-1.5">
                      {/* Node Box */}
                      <div className="flex flex-col items-center gap-1">
                        {pointerBadge && (
                          <span className="text-[10px] font-mono font-bold px-1.5 rounded bg-[#2f81f7] text-white">
                            {pointerBadge}
                          </span>
                        )}
                        <div className="w-10 h-10 rounded-lg border border-blue-900/60 bg-[#131b29] flex items-center justify-center font-mono font-bold text-sm text-white shadow-sm">
                          {node.val}
                        </div>
                      </div>

                      {/* Arrow Pointer */}
                      {node.nextId !== null ? (
                        <span className="text-zinc-500 text-base font-bold">→</span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-600 px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                          NULL
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Carry indicator if present */}
      {carry !== undefined && (
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0d121d] border border-zinc-800 text-xs font-mono">
          <span className="text-zinc-400">Current Carry:</span>
          <span className={`font-bold ${carry > 0 ? "text-amber-400" : "text-zinc-400"}`}>{carry}</span>
        </div>
      )}
    </div>
  );
}
