"use client";

import React from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VisualizationControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlayToggle: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onStepSeek: (step: number) => void;
}

export function VisualizationControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlayToggle,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onStepSeek,
}: VisualizationControlsProps) {
  const isFinished = currentStep >= totalSteps;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-[#0d121d] shadow-sm">
      {/* Playback Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPlayToggle}
          disabled={isFinished && !isPlaying}
          className={`h-9 px-4 rounded-lg font-semibold text-xs flex items-center gap-2 transition-all ${
            isPlaying
              ? "bg-amber-600 hover:bg-amber-500 text-white"
              : "bg-[#2f81f7] hover:bg-[#2566c5] text-white shadow-sm"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isFinished ? "Finished" : "Play"}</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1 border border-zinc-800 rounded-lg p-0.5 bg-[#080c14]">
          <button
            onClick={onStepBackward}
            disabled={currentStep === 0 || isPlaying}
            className="h-8 px-2.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Step Backward"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onStepForward}
            disabled={isFinished || isPlaying}
            className="h-8 px-2.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onReset}
            className="h-8 px-2.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Restart Algorithm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Step Progress Timeline Slider */}
      <div className="flex-1 max-w-md flex items-center gap-3 px-2">
        <span className="text-xs font-mono font-semibold text-zinc-400 shrink-0">
          Step <span className="text-white font-bold">{currentStep}</span> / {totalSteps}
        </span>
        <div className="flex-1">
          <Slider
            value={[currentStep]}
            min={0}
            max={totalSteps || 1}
            step={1}
            onValueChange={(val) => onStepSeek(val[0])}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Right: Speed Slider */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-zinc-400">Speed:</span>
        <div className="w-24">
          <Slider
            value={[speed]}
            min={10}
            max={90}
            step={5}
            onValueChange={(val) => onSpeedChange(val[0])}
          />
        </div>
        <span className="text-xs font-mono text-zinc-400 w-8">{speed}%</span>
      </div>
    </div>
  );
}
