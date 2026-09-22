"use client";

import { useState, useEffect } from "react";
import { problems, Problem } from "./problems";

export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  github: string;
  joinedDate: string;
}

export interface SubmissionRecord {
  id: string;
  problemId: string;
  problemTitle: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  status: "Accepted" | "Wrong Answer" | "Runtime Error";
  language: string;
  runtime: string;
  memory: string;
  timestamp: string;
  code?: string;
  runtimeMs?: number;
  passedCases?: number;
  totalCases?: number;
  error?: string;
}

export interface SkillProgress {
  topic: string;
  solved: number;
  total: number;
  percentage: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progressText: string;
}

const PROFILE_KEY = "leetvisual_user_profile";
const SOLVED_KEY = "leetvisual_solved_problems";
const SUBMISSIONS_KEY = "leetvisual_submissions";

const DEFAULT_PROFILE: UserProfile = {
  name: "Learner",
  username: "coder",
  bio: "Solving algorithms and understanding data structures visually.",
  github: "https://github.com",
  joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
};

// Safe localStorage helpers
export function getStoredProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: Partial<UserProfile>): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const current = getStoredProfile();
  const updated = { ...current, ...profile };
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("leetvisual_progress_updated"));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function getSolvedProblemIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SOLVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getSubmissions(): SubmissionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordProblemSubmission(
  problemId: string,
  language: string,
  status: string,
  runtime = "38 ms",
  memory = "16.4 MB",
  details?: {
    code?: string;
    runtimeMs?: number;
    passedCases?: number;
    totalCases?: number;
    problemTitle?: string;
    difficulty?: string;
    error?: string;
  }
): void {
  if (typeof window === "undefined") return;

  const targetProblem = problems.find((p) => p.id === problemId);
  const title = details?.problemTitle || targetProblem?.title || `Problem #${problemId}`;
  const diff = (details?.difficulty || targetProblem?.difficulty || "Medium") as "Easy" | "Medium" | "Hard";
  const cat = targetProblem?.category || "Algorithm";

  const newSubmission: SubmissionRecord = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    problemId,
    problemTitle: title,
    difficulty: diff,
    category: cat,
    status: (status as any) || "Accepted",
    language,
    runtime,
    memory,
    timestamp: new Date().toISOString(),
    code: details?.code,
    runtimeMs: details?.runtimeMs,
    passedCases: details?.passedCases,
    totalCases: details?.totalCases,
    error: details?.error,
  };

  try {
    // 1. Append submission to local history cache
    const existing = getSubmissions();
    const updatedSubmissions = [newSubmission, ...existing].slice(0, 50);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));

    // 2. If accepted, mark problem as solved
    if (status === "Accepted") {
      const solved = new Set(getSolvedProblemIds());
      solved.add(problemId);
      localStorage.setItem(SOLVED_KEY, JSON.stringify(Array.from(solved)));
    }

    // 3. Persist to PostgreSQL backend via API
    fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problemId,
        problemTitle: title,
        difficulty: diff,
        language,
        code: details?.code || "",
        status,
        runtime,
        runtimeMs: details?.runtimeMs,
        memory,
        passedCases: details?.passedCases,
        totalCases: details?.totalCases,
        error: details?.error,
      }),
    }).catch((err) => {
      console.warn("Could not sync submission to backend:", err);
    });

    // Trigger update event across all components
    window.dispatchEvent(new Event("leetvisual_progress_updated"));
  } catch (e) {
    console.error(e);
  }
}

// Calculate streak from submission timestamps
export function calculateStreak(submissions: SubmissionRecord[]): { currentStreak: number; longestStreak: number } {
  if (submissions.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Collect unique date strings (YYYY-MM-DD)
  const uniqueDates = Array.from(
    new Set(
      submissions
        .filter((s) => s.status === "Accepted")
        .map((s) => new Date(s.timestamp).toISOString().split("T")[0])
    )
  ).sort().reverse();

  if (uniqueDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let currentStreak = 0;
  let hasActivityTodayOrYesterday = uniqueDates[0] === todayStr || uniqueDates[0] === yesterday;

  if (hasActivityTodayOrYesterday) {
    let checkDate = new Date(uniqueDates[0]);
    for (const dateStr of uniqueDates) {
      const d = new Date(dateStr);
      const diffDays = Math.round((checkDate.getTime() - d.getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 1) {
        currentStreak++;
        checkDate = d;
      } else {
        break;
      }
    }
  }

  // If initial user hasn't solved yet, provide 1 day start if active today
  return {
    currentStreak: Math.max(currentStreak, uniqueDates.includes(todayStr) ? 1 : 0),
    longestStreak: Math.max(currentStreak, uniqueDates.length),
  };
}

// React Hook to access live dynamic progress anywhere in the app
export function useUserProgress() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadData = () => {
    setProfile(getStoredProfile());
    setSolvedIds(getSolvedProblemIds());
    setSubmissions(getSubmissions());
  };

  useEffect(() => {
    setMounted(true);
    loadData();

    // Fetch from backend API to ensure fresh submissions data across sessions & reloads
    fetch("/api/submissions?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: SubmissionRecord[] = json.data.map((item: any) => ({
            id: item.id,
            problemId: item.problemId,
            problemTitle: item.problemTitle || `Problem #${item.problemId}`,
            difficulty: item.difficulty || "Medium",
            category: "Algorithm",
            status: item.status,
            language: item.language,
            runtime: item.runtime || `${item.runtimeMs || 35} ms`,
            memory: item.memory || "16.2 MB",
            timestamp: item.createdAt || new Date().toISOString(),
            code: item.code,
            runtimeMs: item.runtimeMs,
            passedCases: item.passedCases,
            totalCases: item.totalCases,
            error: item.error,
          }));
          setSubmissions(mapped);

          // Sync solved problems to localStorage
          const solvedFromBackend = mapped
            .filter((s) => s.status === "Accepted")
            .map((s) => s.problemId);
          if (solvedFromBackend.length > 0) {
            const currentSolved = getSolvedProblemIds();
            const combinedSolved = Array.from(
              new Set([...currentSolved, ...solvedFromBackend])
            );
            setSolvedIds(combinedSolved);
            localStorage.setItem(SOLVED_KEY, JSON.stringify(combinedSolved));
          }
        }
      })
      .catch(() => {});

    const handleUpdate = () => loadData();
    window.addEventListener("leetvisual_progress_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("leetvisual_progress_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Dynamically computed stats based on real problems list & solved IDs
  const totalProblems = problems.length;
  const solvedCount = solvedIds.length;

  const easyTotal = problems.filter((p) => p.difficulty === "Easy").length;
  const easySolved = problems.filter((p) => p.difficulty === "Easy" && solvedIds.includes(p.id)).length;

  const mediumTotal = problems.filter((p) => p.difficulty === "Medium").length;
  const mediumSolved = problems.filter((p) => p.difficulty === "Medium" && solvedIds.includes(p.id)).length;

  const hardTotal = problems.filter((p) => p.difficulty === "Hard").length;
  const hardSolved = problems.filter((p) => p.difficulty === "Hard" && solvedIds.includes(p.id)).length;

  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter((s) => s.status === "Accepted").length;
  const acceptanceRate =
    totalSubmissions > 0 ? `${Math.round((acceptedSubmissions / totalSubmissions) * 100)}%` : "0%";

  const { currentStreak, longestStreak } = calculateStreak(submissions);

  // Dynamic Skill Mastery per Category
  const categories = Array.from(new Set(problems.map((p) => p.category)));
  const skillProgress: SkillProgress[] = categories.map((cat) => {
    const catProblems = problems.filter((p) => p.category === cat);
    const catSolved = catProblems.filter((p) => solvedIds.includes(p.id)).length;
    return {
      topic: cat,
      solved: catSolved,
      total: catProblems.length,
      percentage: Math.round((catSolved / catProblems.length) * 100),
    };
  });

  // Dynamic Achievements calculation
  const uniqueLanguages = new Set(submissions.map((s) => s.language));
  const achievements: Achievement[] = [
    {
      id: "ach-1",
      title: "First Step",
      description: "Solve your first problem and step through its visualizer",
      icon: "🎯",
      unlocked: solvedCount >= 1,
      progressText: solvedCount >= 1 ? "Unlocked" : "0 / 1 Solved",
    },
    {
      id: "ach-2",
      title: "Active Streak",
      description: "Maintain a daily problem-solving streak",
      icon: "🔥",
      unlocked: currentStreak >= 1,
      progressText: `${currentStreak} day streak`,
    },
    {
      id: "ach-3",
      title: "Polyglot Developer",
      description: "Submit solutions in at least 2 different programming languages",
      icon: "⚡",
      unlocked: uniqueLanguages.size >= 2,
      progressText: `${uniqueLanguages.size} / 2 Languages Used`,
    },
    {
      id: "ach-4",
      title: "Master of Arrays & Lists",
      description: "Solve all Array and Linked List problems",
      icon: "🏆",
      unlocked:
        problems.filter((p) => (p.category === "Array" || p.category === "Linked List") && !solvedIds.includes(p.id))
          .length === 0,
      progressText: `${solvedIds.length} / ${totalProblems} Solved`,
    },
  ];

  return {
    mounted,
    profile,
    updateProfile: saveStoredProfile,
    solvedIds,
    solvedProblems: solvedIds,
    isProblemSolved: (id: string) => solvedIds.includes(id),
    submissions,
    recordSubmission: recordProblemSubmission,
    totalProblems,
    solvedCount,
    easySolved,
    easyTotal,
    mediumSolved,
    mediumTotal,
    hardSolved,
    hardTotal,
    totalSubmissions,
    acceptanceRate,
    currentStreak,
    longestStreak,
    skillProgress,
    achievements,
  };
}
