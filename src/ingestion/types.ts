export type VisualizationType =
  | "array"
  | "binary-search"
  | "sliding-window"
  | "two-pointer"
  | "linked-list"
  | "stack"
  | "queue"
  | "tree"
  | "graph"
  | "sorting"
  | "recursion"
  | "dynamic-programming"
  | "unknown";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Unknown";

export interface RawProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface RawProblem {
  platform: string;
  platformProblemId: string;
  title: string;
  description?: string;
  difficultyRaw?: string | number;
  topicsRaw?: string[];
  sourceUrl: string;
  acceptanceRate?: number;
  constraints?: string[];
  examples?: RawProblemExample[];
  extraMetadata?: Record<string, unknown>;
}

export interface NormalizedProblem {
  platform: string;
  platformProblemId: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  topics: string[];
  constraints: string[];
  examples: RawProblemExample[];
  acceptanceRate: number;
  sourceUrl: string;
  visualizationType: VisualizationType;
}

export interface ProblemSource {
  name: string;
  fetchProblems(limit?: number): Promise<RawProblem[]>;
}

export interface IngestionResult {
  source: string;
  fetched: number;
  valid: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: number;
  errorMessages: string[];
}
