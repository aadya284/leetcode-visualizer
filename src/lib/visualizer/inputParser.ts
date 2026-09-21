import { ProblemInputData } from "./types";

export interface ParsedInput {
  nums?: number[];
  target?: number;
  s?: string;
  p?: string;
  head?: number[];
  l1?: number[];
  l2?: number[];
  root?: (number | null)[];
  grid?: string[][];
  intervals?: [number, number][];
  height?: number[];
  coins?: number[];
  amount?: number;
  n?: number;
  strs?: string[];
  raw?: string;
}

/**
 * Safely extracts arrays, strings, numbers, grids, and targets from problem examples or descriptions.
 */
export function parseProblemInput(problem: ProblemInputData): ParsedInput {
  const result: ParsedInput = {};

  const exampleStr = problem.examples?.[0]?.input || "";
  result.raw = exampleStr;

  // 1. Try regex parsing from example string
  if (exampleStr) {
    // Array parsing: nums = [...], height = [...], prices = [...]
    const arrayMatch = exampleStr.match(/(?:nums|height|prices|arr|elements|coins)\s*=\s*(\[[^\]]*\])/i);
    if (arrayMatch) {
      try {
        const parsed = JSON.parse(arrayMatch[1]);
        if (Array.isArray(parsed)) {
          if (arrayMatch[0].toLowerCase().includes("height")) {
            result.height = parsed.map(Number);
          } else if (arrayMatch[0].toLowerCase().includes("coins")) {
            result.coins = parsed.map(Number);
          } else {
            result.nums = parsed.map(Number);
          }
        }
      } catch {}
    }

    // Target or amount or k parsing
    const targetMatch = exampleStr.match(/(?:target|amount|k|val)\s*=\s*(-?\d+)/i);
    if (targetMatch) {
      const val = parseInt(targetMatch[1], 10);
      if (!isNaN(val)) {
        if (exampleStr.includes("amount")) {
          result.amount = val;
        } else {
          result.target = val;
        }
      }
    }

    // Number n
    const nMatch = exampleStr.match(/\bn\s*=\s*(\d+)/i);
    if (nMatch) {
      const val = parseInt(nMatch[1], 10);
      if (!isNaN(val)) result.n = val;
    }

    // String parsing: s = "...", p = "..."
    const sMatch = exampleStr.match(/\bs\s*=\s*["']([^"']*)["']/i);
    if (sMatch) {
      result.s = sMatch[1];
    } else {
      // Any quoted string
      const generalQuote = exampleStr.match(/["']([a-zA-Z0-9()\[\]{}]*)["']/);
      if (generalQuote) result.s = generalQuote[1];
    }

    const pMatch = exampleStr.match(/\bp\s*=\s*["']([^"']*)["']/i);
    if (pMatch) result.p = pMatch[1];

    // String array: strs = ["eat", "tea", ...]
    const strsMatch = exampleStr.match(/(?:strs|words)\s*=\s*(\[[^\]]*\])/i);
    if (strsMatch) {
      try {
        const parsed = JSON.parse(strsMatch[1]);
        if (Array.isArray(parsed)) result.strs = parsed.map(String);
      } catch {}
    }

    // Linked lists: l1 = [...], l2 = [...], head = [...]
    const l1Match = exampleStr.match(/l1\s*=\s*(\[[^\]]*\])/i);
    const l2Match = exampleStr.match(/l2\s*=\s*(\[[^\]]*\])/i);
    const headMatch = exampleStr.match(/head\s*=\s*(\[[^\]]*\])/i);

    if (l1Match) {
      try { result.l1 = JSON.parse(l1Match[1]).map(Number); } catch {}
    }
    if (l2Match) {
      try { result.l2 = JSON.parse(l2Match[1]).map(Number); } catch {}
    }
    if (headMatch) {
      try { result.head = JSON.parse(headMatch[1]).map(Number); } catch {}
    }

    // Tree: root = [4,2,7,1,3,6,9]
    const rootMatch = exampleStr.match(/root\s*=\s*(\[[^\]]*\])/i);
    if (rootMatch) {
      try {
        const clean = rootMatch[1].replace(/null/g, "null");
        result.root = JSON.parse(clean);
      } catch {}
    }

    // 2D Grid / Matrix / Intervals
    const gridMatch = exampleStr.match(/(?:grid|matrix|board|intervals)\s*=\s*(\[\[[\s\S]*?\]\])/i);
    if (gridMatch) {
      try {
        const parsed = JSON.parse(gridMatch[1]);
        if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
          if (gridMatch[0].toLowerCase().includes("intervals")) {
            result.intervals = parsed as [number, number][];
          } else {
            result.grid = parsed.map((row: any[]) => row.map(String));
          }
        }
      } catch {}
    }
  }

  // 2. Sensible fallback defaults if parsing yields missing fields
  const title = (problem.title || "").toLowerCase();
  const category = (problem.category || problem.topics?.[0] || "").toLowerCase();

  if (!result.nums && (category.includes("array") || category.includes("search") || category.includes("sorting") || title.includes("sum"))) {
    result.nums = [2, 7, 11, 15, 20];
    if (result.target === undefined) result.target = 9;
  }

  if (!result.s && (category.includes("string") || category.includes("stack") || category.includes("sliding window"))) {
    if (title.includes("parenthes") || title.includes("valid")) {
      result.s = "()[]{}";
    } else {
      result.s = "abcabcbb";
    }
  }

  if (!result.head && !result.l1 && category.includes("linked list")) {
    if (title.includes("add two numbers") || title.includes("merge")) {
      result.l1 = [2, 4, 3];
      result.l2 = [5, 6, 4];
    } else {
      result.head = [1, 2, 3, 4, 5];
    }
  }

  if (!result.root && category.includes("tree")) {
    result.root = [4, 2, 7, 1, 3, 6, 9];
  }

  if (!result.grid && (category.includes("graph") || title.includes("island"))) {
    result.grid = [
      ["1", "1", "0", "0"],
      ["1", "1", "0", "0"],
      ["0", "0", "1", "0"],
      ["0", "0", "0", "1"]
    ];
  }

  return result;
}
