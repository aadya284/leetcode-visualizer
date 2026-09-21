import { AlgorithmPattern, ProblemInputData } from "./types";

/**
 * Automatically determines the algorithm family/pattern for any problem
 * based on its topics, title, category, and description.
 */
export function detectPattern(problem: ProblemInputData): AlgorithmPattern {
  const topics = (problem.topics || []).map((t) => t.toLowerCase());
  const title = (problem.title || "").toLowerCase();
  const category = (problem.category || "").toLowerCase();
  const visType = (problem.visualizationType || "").toLowerCase();

  // 1. Explicit visualizationType match
  if (visType.includes("binary-search") || visType === "binary_search") return "binary-search";
  if (visType.includes("two-pointer") || visType === "two_pointers") return "two-pointers";
  if (visType.includes("sliding-window") || visType === "sliding_window") return "sliding-window";
  if (visType.includes("linked-list") || visType === "linked_list") return "linked-list";
  if (visType.includes("tree")) return "tree";
  if (visType.includes("graph")) return "graph";
  if (visType.includes("stack")) return "stack";
  if (visType.includes("dp") || visType.includes("dynamic-programming")) return "dp";

  // 2. Pattern detection from topics and title
  if (
    topics.includes("binary search") ||
    title.includes("binary search") ||
    title.includes("search in rotated") ||
    title.includes("search a 2d matrix") ||
    title.includes("find minimum in rotated")
  ) {
    return "binary-search";
  }

  if (
    topics.includes("sliding window") ||
    title.includes("longest substring") ||
    title.includes("minimum window") ||
    title.includes("sliding window") ||
    title.includes("permutation in string")
  ) {
    return "sliding-window";
  }

  if (
    topics.includes("tree") ||
    topics.includes("binary tree") ||
    topics.includes("binary search tree") ||
    category.includes("tree") ||
    title.includes("tree") ||
    title.includes("bst")
  ) {
    return "tree";
  }

  if (
    topics.includes("linked list") ||
    category.includes("linked list") ||
    title.includes("linked list") ||
    title.includes("add two numbers") ||
    title.includes("reverse list") ||
    title.includes("merge two sorted lists") ||
    title.includes("reorder list") ||
    title.includes("middle of the linked list")
  ) {
    return "linked-list";
  }

  if (
    topics.includes("stack") ||
    topics.includes("monotonic stack") ||
    category.includes("stack") ||
    title.includes("parenthes") ||
    title.includes("stack") ||
    title.includes("daily temperatures") ||
    title.includes("evaluate reverse polish")
  ) {
    return "stack";
  }

  if (
    topics.includes("two pointers") ||
    title.includes("container with most water") ||
    title.includes("3sum") ||
    title.includes("4sum") ||
    title.includes("trapping rain water") ||
    title.includes("two sum ii") ||
    title.includes("valid palindrome") ||
    title.includes("sort colors")
  ) {
    return "two-pointers";
  }

  if (
    topics.includes("graph") ||
    topics.includes("breadth-first search") ||
    category.includes("graph") ||
    title.includes("island") ||
    title.includes("clone graph") ||
    title.includes("course schedule") ||
    title.includes("pacific atlantic") ||
    title.includes("surrounded regions") ||
    title.includes("rotting oranges")
  ) {
    return "graph";
  }

  if (
    topics.includes("dynamic programming") ||
    category.includes("dynamic programming") ||
    title.includes("climbing stairs") ||
    title.includes("coin change") ||
    title.includes("maximum subarray") ||
    title.includes("house robber") ||
    title.includes("longest increasing subsequence") ||
    title.includes("unique paths") ||
    title.includes("word break") ||
    title.includes("jump game")
  ) {
    return "dp";
  }

  if (
    topics.includes("hash table") ||
    title.includes("two sum") ||
    title.includes("group anagrams") ||
    title.includes("contains duplicate") ||
    title.includes("valid anagram") ||
    title.includes("majority element") ||
    title.includes("isomorphic")
  ) {
    return "hash-table";
  }

  if (
    topics.includes("sorting") ||
    title.includes("merge intervals") ||
    title.includes("insert interval") ||
    title.includes("non-overlapping")
  ) {
    return "sorting";
  }

  return "general-array";
}
