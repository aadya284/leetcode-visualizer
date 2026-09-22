export type AlgorithmPattern =
  | "binary-search"
  | "two-pointers"
  | "sliding-window"
  | "linked-list"
  | "tree"
  | "graph"
  | "stack"
  | "dp"
  | "hash-table"
  | "sorting"
  | "general-array";

export interface AlgorithmStep {
  step: number;
  totalSteps?: number;
  description: string;
  explanation: string;
  codeLine?: number;
  codeSnippet?: string;
  variables?: Record<string, string | number | boolean | null | undefined>;
  complexity?: {
    time: string;
    space: string;
  };

  // Array / Two-Pointers / Binary Search Payload
  arrayState?: {
    values: (number | string)[];
    pointers?: Record<string, { index: number; label: string; color?: string }>;
    highlights?: Record<number, "current" | "comparing" | "found" | "eliminated" | "window" | "visited" | "default">;
    eliminatedRanges?: [number, number][];
    bars?: number[];
  };

  // Hash Table Payload
  hashTableState?: {
    entries: { key: string | number; val: string | number; state?: "lookup" | "insert" | "match" | "idle" }[];
    currentKey?: string | number;
    complement?: string | number;
    target?: number;
  };

  // Sliding Window Payload
  slidingWindowState?: {
    sequence: string[];
    left: number;
    right: number;
    windowStr: string;
    seenTable?: Record<string, number>;
    maxLen?: number;
    action?: "expand" | "shrink" | "match" | "idle";
  };

  // Linked List Payload
  linkedListState?: {
    lists: {
      name: string;
      nodes: { id: string; val: number | string; nextId?: string | null }[];
      pointers?: Record<string, string>; // pointerName -> nodeId (e.g. curr -> "node-1")
    }[];
    pointers?: Record<string, string>;
    dummyHead?: { val: string | number; nextId: string };
    carry?: number;
  };

  // Tree Payload
  treeState?: {
    nodes: {
      id: string;
      val: number | string;
      leftId?: string | null;
      rightId?: string | null;
      x?: number;
      y?: number;
      state?: "current" | "visited" | "swapping" | "valid" | "invalid" | "default";
      range?: { min?: number | null; max?: number | null };
    }[];
    rootId: string;
    currentNodeId?: string;
    message?: string;
  };

  // Graph / Grid Payload
  graphState?: {
    grid?: {
      rows: number;
      cols: number;
      cells: {
        row: number;
        col: number;
        val: string | number;
        state: "water" | "land" | "visiting" | "visited" | "island";
      }[][];
    };
    islandCount?: number;
    currentCell?: [number, number];
    queueOrStack?: [number, number][];
  };

  // Stack Payload
  stackState?: {
    stack: { val: string; id: string; state?: "pushed" | "popping" | "matching" | "idle" }[];
    inputSequence: string[];
    currentIndex: number;
    action: "push" | "pop" | "match" | "mismatch" | "idle";
    topPointer?: number;
    matchPairs?: Record<string, string>;
  };

  // Dynamic Programming Payload
  dpState?: {
    dpArray?: { index: number; val: number | string; formula?: string; state?: "current" | "computed" | "base" | "default" }[];
    currentSubproblem?: string;
    optimalValue?: number | string;
    memoTable?: { rowLabel: string; colLabel: string; val: number | string; isCurrent?: boolean }[];
  };
}

export interface ProblemInputData {
  id: string;
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard" | "Unknown";
  category?: string;
  topics?: string[];
  description?: string;
  examples?: { input: string; output: string; explanation?: string }[];
  visualizationType?: string;
}
