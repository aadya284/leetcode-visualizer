"use client";

import React from "react";
import { AlgorithmStep } from "@/lib/visualizer/types";

interface TreeRendererProps {
  step: AlgorithmStep;
}

export function TreeRenderer({ step }: TreeRendererProps) {
  const treeState = step.treeState;
  if (!treeState || !treeState.nodes) return null;

  const { nodes, currentNodeId } = treeState;
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-2">
      <div className="w-full max-w-lg h-60 bg-[#080c14] border border-zinc-800/80 rounded-xl p-2 relative flex items-center justify-center overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 220">
          {/* Edges */}
          {nodes.map((node) => {
            const leftChild = node.leftId ? nodeMap.get(node.leftId) : null;
            const rightChild = node.rightId ? nodeMap.get(node.rightId) : null;
            const x1 = node.x ?? 200;
            const y1 = node.y ?? 40;

            return (
              <g key={`edges-${node.id}`}>
                {leftChild && (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={leftChild.x ?? 100}
                    y2={leftChild.y ?? 100}
                    stroke="#27272a"
                    strokeWidth="2"
                  />
                )}
                {rightChild && (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={rightChild.x ?? 300}
                    y2={rightChild.y ?? 100}
                    stroke="#27272a"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isCurrent = node.id === currentNodeId || node.state === "current";
            const isVisited = node.state === "visited";
            const x = node.x ?? 200;
            const y = node.y ?? 40;

            let fill = "#0d121d";
            let stroke = "#3f3f46";
            let textColor = "#f4f4f5";

            if (isCurrent) {
              fill = "#13233a";
              stroke = "#2f81f7";
              textColor = "#58a6ff";
            } else if (isVisited) {
              fill = "#0f2d1a";
              stroke = "#3fb950";
              textColor = "#3fb950";
            }

            return (
              <g key={`node-${node.id}`} className="transition-all duration-300">
                <circle
                  cx={x}
                  cy={y}
                  r="18"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isCurrent ? "3" : "1.5"}
                  className="shadow-sm"
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
