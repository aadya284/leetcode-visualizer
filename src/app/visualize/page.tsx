"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { difficultyColors } from "@/components/ProblemCard";
import { problems as staticProblems } from "@/lib/problems";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { DynamicVisualizer } from "@/components/visualizer/DynamicVisualizer";
import { ProblemInputData } from "@/lib/visualizer/types";

function VisualizeContent() {
  const searchParams = useSearchParams();
  const initialProblemParam = searchParams.get("problem") || "1";

  const [selectedProblemId, setSelectedProblemId] = useState<string>(initialProblemParam);
  const [dbProblems, setDbProblems] = useState<ProblemInputData[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [problemSearch, setProblemSearch] = useState("");

  useEffect(() => {
    if (initialProblemParam) {
      setSelectedProblemId(initialProblemParam);
    }
  }, [initialProblemParam]);

  // Fetch all 300+ problems from database
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingList(true);

    fetch("/api/problems?limit=300")
      .then((res) => res.json())
      .then((json) => {
        if (!isCancelled && json.data && json.data.length > 0) {
          const mapped: ProblemInputData[] = json.data.map((p: any) => ({
            id: p.platformProblemId || p.id,
            title: p.title,
            difficulty: p.difficulty,
            category: p.topics?.[0] || "Algorithm",
            topics: p.topics || [],
            description: p.description,
            examples: p.examples,
            visualizationType: p.visualizationType,
          }));
          setDbProblems(mapped);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setIsLoadingList(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Combined problems list (DB + Static fallbacks)
  const allProblems: ProblemInputData[] = useMemo(() => {
    if (dbProblems.length > 0) return dbProblems;
    return staticProblems.map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category,
      topics: [p.category],
      description: p.description,
      examples: p.examples,
    }));
  }, [dbProblems]);

  // Filter problems for the selector list
  const filteredProblems = useMemo(() => {
    if (!problemSearch) return allProblems;
    const query = problemSearch.toLowerCase();
    return allProblems.filter((p) => {
      return (
        p.title.toLowerCase().includes(query) ||
        p.id.includes(query) ||
        (p.topics || []).some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [allProblems, problemSearch]);

  // Currently selected problem object
  const currentProblem: ProblemInputData = useMemo(() => {
    const cleanId = selectedProblemId.toLowerCase();
    const found = allProblems.find((p) => p.id === selectedProblemId || p.id.toLowerCase() === cleanId || p.title.toLowerCase().includes(cleanId));
    return found || allProblems[0] || {
      id: "1",
      title: "Two Sum",
      difficulty: "Easy",
      category: "Array",
      topics: ["Array", "Hash Table"],
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }],
    };
  }, [allProblems, selectedProblemId]);

  const diffClass = currentProblem.difficulty
    ? difficultyColors[currentProblem.difficulty as keyof typeof difficultyColors] || difficultyColors.Easy
    : difficultyColors.Easy;

  return (
    <div className="min-h-screen bg-[#080c14] text-foreground flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-8 space-y-6 max-w-6xl w-full mx-auto">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Algorithm Visualizer</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#13233a] border border-blue-900/40 text-[#58a6ff]">
                  {allProblems.length} Problems Supported
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Deterministic step-by-step algorithm state execution across LeetCode problemsets
              </p>
            </div>

            <Link href={`/problems/${currentProblem.id}`}>
              <Button size="sm" variant="outline" className="h-8 text-xs text-[#2f81f7] border-[#2f81f7]/40 hover:bg-[#2f81f7]/10">
                Solve in Code Editor
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Problem Selector Column */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-[#0d121d] p-4 space-y-3 shadow-sm">
                <span className="text-xs font-semibold text-zinc-300 block">Select Problem:</span>

                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search 300+ problems..."
                    value={problemSearch}
                    onChange={(e) => setProblemSearch(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#131b29] border border-zinc-750 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#2f81f7]"
                  />
                </div>

                {/* Problem Scrollable List */}
                <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                  {isLoadingList ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-zinc-400">
                      <Loader2 className="w-4 h-4 animate-spin text-[#2f81f7]" />
                      <span className="text-[11px]">Loading problems...</span>
                    </div>
                  ) : filteredProblems.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-500">
                      No problems found.
                    </div>
                  ) : (
                    filteredProblems.map((p) => {
                      const isSelected = p.id === currentProblem.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedProblemId(p.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between gap-1.5 ${
                            isSelected
                              ? "bg-[#13233a] border border-[#2f81f7] text-[#58a6ff] font-semibold"
                              : "text-zinc-300 hover:bg-[#131b29] hover:text-white"
                          }`}
                        >
                          <span className="truncate">
                            #{p.id}. {p.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1 py-0.2 rounded shrink-0 ${
                              p.difficulty === "Easy"
                                ? "text-[#3fb950] bg-green-950/60"
                                : p.difficulty === "Medium"
                                ? "text-[#d29922] bg-amber-950/60"
                                : "text-[#f85149] bg-red-950/60"
                            }`}
                          >
                            {p.difficulty?.charAt(0) || "M"}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Active Problem Meta Card */}
                <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Difficulty:</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${diffClass}`}>
                      {currentProblem.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Category:</span>
                    <span className="font-mono text-zinc-300">{currentProblem.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Visualizer Area */}
            <div className="lg:col-span-3">
              <DynamicVisualizer problem={currentProblem} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function VisualizePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#2f81f7]" />
      </div>
    }>
      <VisualizeContent />
    </Suspense>
  );
}