"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ProblemInputData } from "@/lib/visualizer/types";
import { generateVisualizationSteps } from "@/lib/visualizer/engine";
import { VisualizationControls } from "./primitives/VisualizationControls";
import { StatePanel } from "./primitives/StatePanel";
import { BinarySearchRenderer } from "./renderers/BinarySearchRenderer";
import { TwoPointersRenderer } from "./renderers/TwoPointersRenderer";
import { SlidingWindowRenderer } from "./renderers/SlidingWindowRenderer";
import { LinkedListRenderer } from "./renderers/LinkedListRenderer";
import { TreeRenderer } from "./renderers/TreeRenderer";
import { GraphGridRenderer } from "./renderers/GraphGridRenderer";
import { StackRenderer } from "./renderers/StackRenderer";
import { ArrayRenderer } from "./renderers/ArrayRenderer";

interface DynamicVisualizerProps {
  problem: ProblemInputData;
}

export function DynamicVisualizer({ problem }: DynamicVisualizerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);

  // Generate visualization data dynamically from the problem's examples/topics
  const { pattern, steps } = useMemo(() => {
    return generateVisualizationSteps(problem);
  }, [problem]);

  const totalSteps = steps.length - 1;
  const currentStep = steps[stepIndex] || steps[0];

  // Reset step when problem changes
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [problem.id]);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying && stepIndex < totalSteps) {
      const delay = Math.max(300, 1600 - speed * 14);
      const timer = setTimeout(() => {
        setStepIndex((prev) => Math.min(prev + 1, totalSteps));
      }, delay);
      return () => clearTimeout(timer);
    } else if (stepIndex >= totalSteps && isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying, stepIndex, speed, totalSteps]);

  const handlePlayToggle = () => {
    if (stepIndex >= totalSteps) {
      setStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (stepIndex < totalSteps) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  return (
    <div className="w-full space-y-4">
      {/* Playback & Step Timeline Controls */}
      <VisualizationControls
        currentStep={stepIndex}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        speed={speed}
        onPlayToggle={handlePlayToggle}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        onReset={handleReset}
        onSpeedChange={setSpeed}
        onStepSeek={setStepIndex}
      />

      {/* Main Visualizer Stage */}
      <div className="rounded-xl border border-zinc-800 bg-[#0d121d] p-6 min-h-[280px] flex items-center justify-center shadow-sm">
        {pattern === "binary-search" ? (
          <BinarySearchRenderer step={currentStep} />
        ) : pattern === "two-pointers" ? (
          <TwoPointersRenderer step={currentStep} />
        ) : pattern === "sliding-window" ? (
          <SlidingWindowRenderer step={currentStep} />
        ) : pattern === "linked-list" ? (
          <LinkedListRenderer step={currentStep} />
        ) : pattern === "tree" ? (
          <TreeRenderer step={currentStep} />
        ) : pattern === "graph" ? (
          <GraphGridRenderer step={currentStep} />
        ) : pattern === "stack" ? (
          <StackRenderer step={currentStep} />
        ) : (
          <ArrayRenderer step={currentStep} />
        )}
      </div>

      {/* Live State, Variables & Code Reasoning Panel */}
      <StatePanel step={currentStep} />
    </div>
  );
}
