export interface LeetCodeQuestion {
  questionId: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  content?: string;
  topicTags?: Array<{ name: string; slug: string }>;
  acRate?: number;
}
