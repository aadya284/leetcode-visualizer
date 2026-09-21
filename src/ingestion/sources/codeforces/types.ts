export interface CFProblem {
  contestId?: number;
  problemsetName?: string;
  index: string;
  name: string;
  type: "PROGRAMMING" | "QUESTION";
  points?: number;
  rating?: number;
  tags: string[];
}

export interface CFProblemStatistics {
  contestId?: number;
  index: string;
  solvedCount: number;
}

export interface CFProblemsetResponse {
  status: "OK" | "FAILED";
  comment?: string;
  result?: {
    problems: CFProblem[];
    problemStatistics: CFProblemStatistics[];
  };
}
