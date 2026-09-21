"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { problems as fallbackProblems } from "@/lib/problems";
import { useUserProgress } from "@/lib/userProgress";
import { 
  Play, 
  Bookmark, 
  BarChart2, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  X,
  Shuffle,
  ChevronDown,
  Circle,
  Check
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface IngestedProblem {
  id: string;
  platform: string;
  platformProblemId: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Unknown";
  topics: string[];
  acceptanceRate: number;
  sourceUrl: string;
  visualizationType: string;
}

const LEETCODE_TOPICS = [
  "all",
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Tree",
  "Breadth-First Search",
  "Two Pointers",
  "Matrix",
  "Stack",
  "Linked List",
  "Graph",
  "Sliding Window",
  "Bit Manipulation",
  "Backtracking",
  "Heap (Priority Queue)"
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [topicSearchText, setTopicSearchText] = useState("");

  // Pagination & API state
  const [apiProblems, setApiProblems] = useState<IngestedProblem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDbData, setHasDbData] = useState(false);

  const { mounted, solvedCount, totalProblems, solvedProblems } = useUserProgress();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("leetvisual_bookmarks");
      if (saved) setBookmarkedIds(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("leetvisual_bookmarks", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const visualizationDescriptions: Record<string, string> = {
    "1": "Array traversal, hash map",
    "2": "Linked list addition",
    "3": "Sliding window",
    "4": "Binary search steps",
    "5": "Two pointer merge",
    "6": "Stack operations",
  };

  // Fetch problems from /api/problems
  useEffect(() => {
    let isCancelled = false;
    const fetchApiProblems = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (difficulty !== "all") params.set("difficulty", difficulty);
        if (selectedTopic !== "all") params.set("topic", selectedTopic);
        if (selectedPlatform !== "all") params.set("platform", selectedPlatform);
        params.set("page", page.toString());
        params.set("limit", "15");

        const res = await fetch(`/api/problems?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (!isCancelled && json.data && json.data.length > 0) {
            setApiProblems(json.data);
            setTotalPages(json.pagination.totalPages || 1);
            setTotalCount(json.pagination.total || json.data.length);
            setHasDbData(true);
          } else if (!isCancelled && json.data && json.data.length === 0 && (searchQuery || difficulty !== "all" || selectedTopic !== "all" || selectedPlatform !== "all")) {
            setApiProblems([]);
            setTotalPages(1);
            setTotalCount(0);
            setHasDbData(true);
          }
        }
      } catch {
        // Fallback to static problems
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchApiProblems();
    return () => {
      isCancelled = true;
    };
  }, [searchQuery, difficulty, selectedTopic, selectedPlatform, page]);

  // Fallback filtering if DB is empty
  const filteredFallback = useMemo(() => {
    return fallbackProblems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.id.includes(searchQuery);
      const matchesDifficulty = difficulty === "all" || problem.difficulty === difficulty;
      const matchesCategory = selectedTopic === "all" || problem.category === selectedTopic;
      const matchesPlatform = selectedPlatform === "all" || selectedPlatform === "LeetCode";
      return matchesSearch && matchesDifficulty && matchesCategory && matchesPlatform;
    });
  }, [searchQuery, difficulty, selectedTopic, selectedPlatform]);

  const rawDisplayProblems = hasDbData
    ? apiProblems
    : filteredFallback.map((p) => ({
        id: p.id,
        platform: "LeetCode",
        platformProblemId: p.id,
        title: p.title,
        slug: p.id,
        description: p.description,
        difficulty: p.difficulty,
        topics: [p.category],
        acceptanceRate: 54.2,
        sourceUrl: `https://leetcode.com/problems/${p.id}`,
        visualizationType: p.category.toLowerCase(),
      }));

  // Client-side status filtering
  const displayProblems = useMemo(() => {
    if (status === "all") return rawDisplayProblems;
    return rawDisplayProblems.filter((problem) => {
      const isSolved = solvedProblems?.includes(problem.id) || solvedProblems?.includes(problem.slug);
      const isBookmarked = bookmarkedIds.includes(problem.id);
      if (status === "solved") return isSolved;
      if (status === "todo") return !isSolved;
      if (status === "bookmarked") return isBookmarked;
      return true;
    });
  }, [rawDisplayProblems, status, solvedProblems, bookmarkedIds]);

  const effectiveTotal = hasDbData ? totalCount : totalProblems;
  const progressPercent = effectiveTotal > 0 ? Math.round((solvedCount / effectiveTotal) * 100) : 0;

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) + 
    (difficulty !== "all" ? 1 : 0) + 
    (status !== "all" ? 1 : 0) + 
    (selectedTopic !== "all" ? 1 : 0) + 
    (selectedPlatform !== "all" ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery("");
    setDifficulty("all");
    setStatus("all");
    setSelectedTopic("all");
    setSelectedPlatform("all");
    setPage(1);
  };

  const handlePickRandom = () => {
    if (displayProblems.length > 0) {
      const randomIndex = Math.floor(Math.random() * displayProblems.length);
      const randomProblem = displayProblems[randomIndex];
      router.push(`/problems/${randomProblem.slug || randomProblem.id}`);
    }
  };

  const filteredTopics = useMemo(() => {
    if (!topicSearchText) return LEETCODE_TOPICS;
    return LEETCODE_TOPICS.filter((t) =>
      t.toLowerCase().includes(topicSearchText.toLowerCase())
    );
  }, [topicSearchText]);

  return (
    <div className="min-h-screen bg-[#080c14] text-foreground flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header with Search Bar */}
        <Header searchQuery={searchQuery} setSearchQuery={(q) => { setSearchQuery(q); setPage(1); }} />

        <main className="flex-1 p-8 space-y-6 max-w-6xl w-full mx-auto">
          {/* Hero Section & Stats Card */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Hero Text */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                PRACTICE SMARTER
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Visualize. Understand.{" "}
                <span className="text-[#2f81f7]">Solve.</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                Explore DSA problems across platforms with interactive visualizations to build intuition and solve faster.
              </p>
            </div>

            {/* Right Stats Widget Card */}
            <div className="rounded-xl border border-border bg-[#0d121d] p-4 flex items-center divide-x divide-border shadow-sm shrink-0">
              {/* Total Problems */}
              <div className="px-5 text-center flex flex-col items-center gap-1">
                <BookOpen className="w-4 h-4 text-[#2f81f7]" />
                <span className="text-xl font-bold font-mono text-white">
                  {effectiveTotal}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Total Problems
                </span>
              </div>

              {/* Solved */}
              <div className="px-5 text-center flex flex-col items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#2f81f7]" />
                <span className="text-xl font-bold font-mono text-white">
                  {mounted ? solvedCount : 0}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Solved
                </span>
              </div>

              {/* Progress */}
              <div className="px-5 text-center flex flex-col items-center gap-1">
                <BarChart2 className="w-4 h-4 text-[#2f81f7]" />
                <span className="text-xl font-bold font-mono text-white">
                  {mounted ? `${progressPercent}%` : "0%"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Progress
                </span>
              </div>
            </div>
          </div>


          {/* LeetCode Filter Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0d121d] border border-border rounded-xl p-3 shadow-sm">
            {/* Left Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category / Tags Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                  selectedTopic !== "all"
                    ? "bg-[#13233a] border-[#2f81f7] text-[#58a6ff]"
                    : "bg-transparent border-border text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-[#131b29]"
                }`}>
                  <span>{selectedTopic === "all" ? "Category" : selectedTopic}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0d121d] border-border text-xs w-52 max-h-64 overflow-y-auto">
                  <DropdownMenuLabel className="text-[11px] text-zinc-400 font-semibold px-2 py-1">
                    Select Topic
                  </DropdownMenuLabel>
                  <div className="p-1.5">
                    <input
                      type="text"
                      placeholder="Filter topics..."
                      value={topicSearchText}
                      onChange={(e) => setTopicSearchText(e.target.value)}
                      className="w-full bg-[#131b29] border border-border rounded px-2 py-1 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#2f81f7]"
                    />
                  </div>
                  <DropdownMenuSeparator className="bg-border" />
                  {filteredTopics.map((t) => (
                    <DropdownMenuItem
                      key={t}
                      onClick={() => {
                        setSelectedTopic(t);
                        setPage(1);
                      }}
                      className={`flex items-center justify-between text-xs cursor-pointer py-1.5 ${
                        selectedTopic === t ? "text-[#58a6ff] font-semibold bg-[#13233a]" : "text-zinc-300"
                      }`}
                    >
                      <span>{t === "all" ? "All Topics" : t}</span>
                      {selectedTopic === t && <Check className="w-3.5 h-3.5 text-[#58a6ff]" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                  status !== "all"
                    ? "bg-[#13233a] border-[#2f81f7] text-[#58a6ff]"
                    : "bg-transparent border-border text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-[#131b29]"
                }`}>
                  <span>
                    {status === "all"
                      ? "Status"
                      : status === "solved"
                      ? "Solved"
                      : status === "todo"
                      ? "Todo"
                      : "Bookmarked"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0d121d] border-border text-xs w-44">
                  <DropdownMenuItem
                    onClick={() => { setStatus("all"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5"
                  >
                    <span className="text-zinc-300">All Status</span>
                    {status === "all" && <Check className="w-3.5 h-3.5 text-[#58a6ff]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => { setStatus("todo"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5"
                  >
                    <span className="text-zinc-300">Todo</span>
                    {status === "todo" && <Check className="w-3.5 h-3.5 text-[#58a6ff]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => { setStatus("solved"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5 text-[#3fb950]"
                  >
                    <span>Solved</span>
                    {status === "solved" && <Check className="w-3.5 h-3.5 text-[#3fb950]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => { setStatus("bookmarked"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5 text-amber-400"
                  >
                    <span>Bookmarked</span>
                    {status === "bookmarked" && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Difficulty Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                  difficulty !== "all"
                    ? "bg-[#13233a] border-[#2f81f7] text-[#58a6ff]"
                    : "bg-transparent border-border text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-[#131b29]"
                }`}>
                  <span>{difficulty === "all" ? "Difficulty" : difficulty}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0d121d] border-border text-xs w-44">
                  <DropdownMenuItem
                    onClick={() => { setDifficulty("all"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5"
                  >
                    <span className="text-zinc-300">All Difficulties</span>
                    {difficulty === "all" && <Check className="w-3.5 h-3.5 text-[#58a6ff]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => { setDifficulty("Easy"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5 text-[#3fb950]"
                  >
                    <span>Easy</span>
                    {difficulty === "Easy" && <Check className="w-3.5 h-3.5 text-[#3fb950]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => { setDifficulty("Medium"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5 text-[#d29922]"
                  >
                    <span>Medium</span>
                    {difficulty === "Medium" && <Check className="w-3.5 h-3.5 text-[#d29922]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => { setDifficulty("Hard"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5 text-[#f85149]"
                  >
                    <span>Hard</span>
                    {difficulty === "Hard" && <Check className="w-3.5 h-3.5 text-[#f85149]" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Platform Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                  selectedPlatform !== "all"
                    ? "bg-[#13233a] border-[#2f81f7] text-[#58a6ff]"
                    : "bg-transparent border-border text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-[#131b29]"
                }`}>
                  <span>{selectedPlatform === "all" ? "Platform" : selectedPlatform}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0d121d] border-border text-xs w-44">
                  <DropdownMenuItem
                    onClick={() => { setSelectedPlatform("all"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5"
                  >
                    <span className="text-zinc-300">All Platforms</span>
                    {selectedPlatform === "all" && <Check className="w-3.5 h-3.5 text-[#58a6ff]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => { setSelectedPlatform("LeetCode"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5 text-[#58a6ff]"
                  >
                    <span>LeetCode</span>
                    {selectedPlatform === "LeetCode" && <Check className="w-3.5 h-3.5 text-[#58a6ff]" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => { setSelectedPlatform("Codeforces"); setPage(1); }}
                    className="flex items-center justify-between text-xs cursor-pointer py-1.5 text-purple-400"
                  >
                    <span>Codeforces</span>
                    {selectedPlatform === "Codeforces" && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset Filter Button */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="h-8 px-2.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white bg-[#131b29] border border-border hover:bg-[#1a2538] flex items-center gap-1 transition-colors"
                  title="Reset all filters"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Right: Pick One / Random Question Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePickRandom}
                disabled={displayProblems.length === 0}
                className="h-8 px-3 rounded-md text-xs font-semibold bg-[#13233a] hover:bg-[#1a2f4e] text-[#58a6ff] border border-blue-900/40 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Pick a random problem"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Pick One</span>
              </button>
            </div>
          </div>

          {/* Problem Table */}
          <div className="rounded-xl border border-border bg-[#0d121d] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/80 text-muted-foreground font-medium bg-[#080c14]/40">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">Status</th>
                    <th className="py-3.5 px-4 w-20">Platform</th>
                    <th className="py-3.5 px-6">Title</th>
                    <th className="py-3.5 px-4 w-28 text-center">Acceptance</th>
                    <th className="py-3.5 px-6 w-32 text-center">Difficulty</th>
                    <th className="py-3.5 px-6">Topic</th>
                    <th className="py-3.5 px-6 w-44 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#2f81f7]" />
                          <span>Loading problems...</span>
                        </div>
                      </td>
                    </tr>
                  ) : displayProblems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        {selectedPlatform === "Codeforces" ? (
                          <div className="py-10 flex flex-col items-center justify-center gap-2 text-center">
                            <p className="text-sm font-semibold text-white">
                              Visualization for Codeforces coming soon
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Stay tuned for contest problemset visualizations.
                            </p>
                            <button
                              onClick={() => { setSelectedPlatform("all"); setPage(1); }}
                              className="mt-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#131b29] border border-border text-white hover:bg-[#1a2538] transition-colors"
                            >
                              Back to LeetCode Problems
                            </button>
                          </div>
                        ) : (
                          <div className="py-6 flex flex-col items-center justify-center gap-2">
                            <p className="text-sm font-medium text-white">No problems found</p>
                            <p className="text-xs text-muted-foreground">Try adjusting your filters or search keywords.</p>
                            <button
                              onClick={clearAllFilters}
                              className="mt-2 px-3 py-1 rounded-md text-xs font-medium bg-[#131b29] text-white border border-border hover:bg-[#1a2538] transition-colors"
                            >
                              Clear all filters
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    displayProblems.map((problem) => {
                      const isSolved = solvedProblems?.includes(problem.id) || solvedProblems?.includes(problem.slug);
                      const isBookmarked = bookmarkedIds.includes(problem.id);

                      // Pill style
                      const diffStyle =
                        problem.difficulty === "Easy"
                          ? "bg-[#0f2d1a] text-[#3fb950]"
                          : problem.difficulty === "Medium"
                          ? "bg-[#332408] text-[#d29922]"
                          : "bg-[#381116] text-[#f85149]";

                      const mainTopic = problem.topics?.[0] || "Algorithm";

                      return (
                        <tr
                          key={problem.id}
                          className="hover:bg-muted/40 transition-colors group"
                        >
                          {/* Status Checkmark */}
                          <td className="py-4 px-4 text-center">
                            {isSolved ? (
                              <CheckCircle2 className="w-4 h-4 text-[#3fb950] mx-auto" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-zinc-700 mx-auto group-hover:text-zinc-500 transition-colors" />
                            )}
                          </td>

                          {/* Platform Badge & Problem ID */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                problem.platform === "Codeforces"
                                  ? "bg-purple-950/80 text-purple-300 border border-purple-800/40"
                                  : "bg-blue-950/80 text-blue-300 border border-blue-800/40"
                              }`}>
                                {problem.platform === "Codeforces" ? "CF" : "LC"}
                              </span>
                              <span className="font-mono text-muted-foreground text-[11px]">
                                #{problem.platformProblemId || problem.id}
                              </span>
                            </div>
                          </td>

                          {/* Title */}
                          <td className="py-4 px-6 font-semibold text-white">
                            <Link
                              href={`/problems/${problem.slug || problem.id}`}
                              className="hover:text-[#2f81f7] transition-colors"
                            >
                              {problem.title}
                            </Link>
                          </td>

                          {/* Acceptance Rate */}
                          <td className="py-4 px-4 text-center font-mono text-muted-foreground text-xs">
                            {problem.acceptanceRate ? `${problem.acceptanceRate.toFixed(1)}%` : "53.2%"}
                          </td>

                          {/* Difficulty */}
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md capitalize ${diffStyle}`}
                            >
                              {problem.difficulty}
                            </span>
                          </td>

                          {/* Topic Description */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs">
                              <BarChart2 className="w-3.5 h-3.5 text-[#2f81f7] shrink-0" />
                              <span className="capitalize">
                                {mainTopic}
                              </span>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {problem.sourceUrl && (
                                <a
                                  href={problem.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-[#131b29] transition-colors"
                                  title={`Open on ${problem.platform}`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}

                              <Link href={`/visualize?problem=${problem.platformProblemId || problem.id}`}>
                                <button className="h-8 px-3 rounded-lg text-xs font-semibold bg-transparent hover:bg-[#2f81f7]/10 text-[#2f81f7] border border-[#2f81f7]/50 flex items-center gap-1.5 transition-colors">
                                  <Play className="w-3 h-3 fill-[#2f81f7]" />
                                  <span>Visualize</span>
                                </button>
                              </Link>

                              <button
                                onClick={(e) => toggleBookmark(problem.id, e)}
                                className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-[#131b29] transition-colors"
                                title={isBookmarked ? "Remove bookmark" : "Bookmark problem"}
                              >
                                <Bookmark
                                  className={`w-4 h-4 ${
                                    isBookmarked
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {hasDbData && totalPages > 1 && (
              <div className="p-4 border-t border-border flex items-center justify-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage(1)}
                    className="h-8 px-2 rounded-lg border border-border bg-[#131b29] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1a2538] flex items-center gap-1 transition-colors"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-8 px-2.5 rounded-lg border border-border bg-[#131b29] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1a2538] flex items-center gap-1 transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Numbered Page Buttons with Ellipsis */}
                  <div className="flex items-center gap-1 px-1">
                    {(() => {
                      const items: (number | string)[] = [];
                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) items.push(i);
                      } else if (page <= 4) {
                        items.push(1, 2, 3, 4, 5, "...", totalPages);
                      } else if (page >= totalPages - 3) {
                        items.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                      } else {
                        items.push(1, "...", page - 1, page, page + 1, "...", totalPages);
                      }

                      return items.map((item, idx) => {
                        if (item === "...") {
                          return (
                            <span key={`dots-${idx}`} className="px-1 text-muted-foreground font-mono">
                              ...
                            </span>
                          );
                        }
                        const pageNum = Number(item);
                        const isActive = pageNum === page;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            disabled={isLoading}
                            className={`w-8 h-8 rounded-lg font-mono text-xs font-semibold transition-colors ${
                              isActive
                                ? "bg-[#2f81f7] text-white shadow-sm"
                                : "bg-[#131b29] border border-border text-gray-300 hover:text-white hover:bg-[#1a2538]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  <button
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 px-2.5 rounded-lg border border-border bg-[#131b29] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1a2538] flex items-center gap-1 transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage(totalPages)}
                    className="h-8 px-2 rounded-lg border border-border bg-[#131b29] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1a2538] flex items-center gap-1 transition-colors"
                    title={`Last Page (Page ${totalPages})`}
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Minimal footer banner */}
          <div className="py-6 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2f81f7]/80"></span>
            <span>More problems coming soon</span>
          </div>
        </main>
      </div>
    </div>
  );
}