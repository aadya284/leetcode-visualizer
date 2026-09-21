"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { difficultyColors } from "@/components/ProblemCard";
import { useUserProgress } from "@/lib/userProgress";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Flame, 
  CheckCircle2, 
  Calendar, 
  Github, 
  Edit3, 
  ArrowRight, 
  Check
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const {
    mounted,
    profile,
    updateProfile,
    solvedCount,
    totalProblems,
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
    submissions,
  } = useUserProgress();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editGithub, setEditGithub] = useState("");

  const handleStartEdit = () => {
    setEditName(profile.name || "Learner");
    setEditBio(profile.bio || "Solving algorithms and understanding data structures visually.");
    setEditUsername(profile.username || "coder");
    setEditGithub(profile.github || "https://github.com");
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: editName,
      bio: editBio,
      username: editUsername,
      github: editGithub,
    });
    setIsEditing(false);
  };

  // Generate 52 weeks (1 full year) of heatmap activity squares computed dynamically from real submissions
  const { heatmapWeeks, monthLabels, activeDaysCount } = useMemo(() => {
    const submissionDateCounts: Record<string, number> = {};
    submissions.forEach((s) => {
      try {
        const d = new Date(s.timestamp).toISOString().split("T")[0];
        submissionDateCounts[d] = (submissionDateCounts[d] || 0) + 1;
      } catch {}
    });

    const activeDays = Object.keys(submissionDateCounts).length;
    const weeks = [];
    const now = new Date();
    const months: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;

    for (let w = 51; w >= 0; w--) {
      const days = [];
      const colDate = new Date(now.getTime() - w * 7 * 86400000);
      const curMonth = colDate.getMonth();
      if (curMonth !== lastMonth) {
        months.push({
          label: colDate.toLocaleString("en-US", { month: "short" }),
          colIndex: 51 - w,
        });
        lastMonth = curMonth;
      }

      for (let d = 0; d < 7; d++) {
        const dateObj = new Date(now.getTime() - (w * 7 + (6 - d)) * 86400000);
        const dateStr = dateObj.toISOString().split("T")[0];
        const count = submissionDateCounts[dateStr] || 0;

        days.push({
          date: dateStr,
          count: count,
        });
      }
      weeks.push(days);
    }
    return { heatmapWeeks: weeks, monthLabels: months, activeDaysCount: activeDays };
  }, [submissions]);

  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : "LE";

  const easyPercent = easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0;
  const mediumPercent = mediumTotal > 0 ? Math.round((mediumSolved / mediumTotal) * 100) : 0;
  const hardPercent = hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0;
  const completionRate = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  // Donut SVG calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const totalCount = totalProblems || 1;
  const easyDash = (easySolved / totalCount) * circumference;
  const medDash = (mediumSolved / totalCount) * circumference;
  const hardDash = (hardSolved / totalCount) * circumference;

  return (
    <div className="min-h-screen bg-[#080c14] text-foreground flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-8 space-y-5 max-w-6xl w-full mx-auto pb-16">
          {/* Top Profile Banner Card */}
          <div className="relative rounded-2xl border border-[#162032] bg-[#0d121d] p-7 overflow-hidden">
            {/* Ambient Blue Lighting in Top-Right */}
            <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-gradient-to-bl from-blue-600/15 via-blue-900/10 to-transparent pointer-events-none blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
              {/* Left User Profile Info */}
              <div className="flex items-start gap-5">
                {/* Blue Avatar Circle */}
                <div className="w-20 h-20 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-2xl tracking-wide shrink-0 shadow-md">
                  {mounted ? initials : "LE"}
                </div>

                <div className="space-y-1.5">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {mounted ? profile.name || "Learner" : "Learner"}
                  </h1>
                  <p className="text-xs text-[#64748b] font-mono">
                    @{mounted ? profile.username || "coder" : "coder"}
                  </p>

                  {isEditing ? (
                    <div className="pt-2 space-y-2 max-w-md">
                      <div>
                        <label className="text-[11px] text-[#64748b]">Display Name</label>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 text-xs mt-1 bg-[#141d2e] border-[#223049] text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#64748b]">Username</label>
                        <Input
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="h-8 text-xs mt-1 bg-[#141d2e] border-[#223049] text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#64748b]">Bio</label>
                        <Input
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          className="h-8 text-xs mt-1 bg-[#141d2e] border-[#223049] text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#64748b]">GitHub URL</label>
                        <Input
                          value={editGithub}
                          onChange={(e) => setEditGithub(e.target.value)}
                          className="h-8 text-xs mt-1 bg-[#141d2e] border-[#223049] text-white"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" onClick={handleSaveProfile} className="h-7 px-3 text-xs bg-primary hover:bg-primary/90">
                          <Check className="w-3 h-3 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-7 px-3 text-xs text-[#64748b]">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#94a3b8] leading-relaxed max-w-lg pt-1">
                      {mounted ? profile.bio || "Solving algorithms and understanding data structures visually." : "Solving algorithms and understanding data structures visually."}
                    </p>
                  )}

                  {/* Joined date & GitHub link */}
                  <div className="flex flex-wrap items-center gap-5 pt-3 text-xs text-[#64748b]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
                      <span>Joined {mounted ? profile.joinedDate || "Sep 2026" : "Sep 2026"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-[#64748b]" />
                      <a
                        href={profile.github || "https://github.com"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#64748b] hover:text-white transition-colors"
                      >
                        GitHub Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Edit Profile Button & Quote */}
              <div className="flex flex-col items-end justify-between self-stretch md:min-h-[120px]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isEditing ? () => setIsEditing(false) : handleStartEdit}
                  className="h-8 px-3 rounded-lg border-[#223049] bg-transparent text-xs text-[#cbd5e1] hover:bg-[#162032] hover:text-white transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1.5 text-[#94a3b8]" />
                  {isEditing ? "Close" : "Edit Profile"}
                </Button>

                <div className="text-right pt-4 md:pt-0">
                  <p className="text-xs text-[#94a3b8] italic">
                    &ldquo;A little progress each day adds up to big results.&rdquo;
                  </p>
                  <div className="w-7 h-0.5 bg-[#2f81f7] ml-auto mt-2 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Solved */}
            <div className="rounded-xl border border-[#162032] bg-[#0d121d] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono leading-tight">
                  {mounted ? totalProblems : 6}
                </div>
                <div className="text-xs text-[#64748b] mt-0.5">Total Solved</div>
              </div>
            </div>

            {/* Day Streak */}
            <div className="rounded-xl border border-[#162032] bg-[#0d121d] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono leading-tight">
                  {mounted ? currentStreak : 0}
                </div>
                <div className="text-xs text-[#64748b] mt-0.5">Day Streak</div>
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="rounded-xl border border-[#162032] bg-[#0d121d] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono leading-tight">
                  {mounted ? acceptanceRate : "0%"}
                </div>
                <div className="text-xs text-[#64748b] mt-0.5">Acceptance Rate</div>
              </div>
            </div>

            {/* Total Submissions */}
            <div className="rounded-xl border border-[#162032] bg-[#0d121d] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono leading-tight">
                  {mounted ? totalSubmissions : 0}
                </div>
                <div className="text-xs text-[#64748b] mt-0.5">Total Submissions</div>
              </div>
            </div>
          </div>

          {/* Row 2: Topic Progress (Left) & Solved Problems Donut (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Topic Progress Card */}
            <div className="rounded-xl border border-[#162032] bg-[#0d121d] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <h2 className="text-sm font-bold text-white">Topic Progress</h2>
                  </div>
                  <Link
                    href="/"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Subheading row */}
                <div className="flex items-center justify-between text-[11px] text-[#64748b] pb-2 font-medium">
                  <span className="w-1/3">Topic</span>
                  <span className="w-1/3 text-center">Solved</span>
                  <span className="w-1/3 text-right">Progress</span>
                </div>

                {/* Topic Rows */}
                <div className="space-y-4 pt-1">
                  {skillProgress.map((skill) => (
                    <div key={skill.topic} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#cbd5e1] font-medium w-1/3">{skill.topic}</span>
                        <span className="font-mono text-[#94a3b8] text-center w-1/3">
                          {skill.solved} / {skill.total}
                        </span>
                        <span className="font-mono text-[#94a3b8] text-right w-1/3">
                          {skill.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-[#141d2e] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2f81f7] h-full rounded-full transition-all duration-500"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Solved Problems Donut Chart & Streak Footer */}
            <div className="rounded-xl border border-[#162032] bg-[#0d121d] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <h2 className="text-sm font-bold text-white">Solved Problems</h2>
                </div>

                {/* Middle: Donut & Difficulty Legend */}
                <div className="flex items-center justify-around py-4">
                  {/* SVG Donut Ring */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#141d2e"
                        strokeWidth="9"
                      />
                      {/* Easy segment */}
                      {easySolved > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke="#22c55e"
                          strokeWidth="9"
                          strokeDasharray={`${easyDash} ${circumference}`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                        />
                      )}
                      {/* Medium segment */}
                      {mediumSolved > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="9"
                          strokeDasharray={`${medDash} ${circumference}`}
                          strokeDashoffset={-easyDash}
                          strokeLinecap="round"
                        />
                      )}
                      {/* Hard segment */}
                      {hardSolved > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke="#ef4444"
                          strokeWidth="9"
                          strokeDasharray={`${hardDash} ${circumference}`}
                          strokeDashoffset={-(easyDash + medDash)}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>

                    {/* Inside donut center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold text-white font-mono leading-tight">
                        {mounted ? totalProblems : 6}
                      </span>
                      <span className="text-[10px] text-[#64748b]">Total Solved</span>
                    </div>
                  </div>

                  {/* Legend on the right */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-[#cbd5e1]">Easy</span>
                      </div>
                      <span className="font-mono text-[#94a3b8]">
                        {mounted ? `${easySolved} (${easyPercent}%)` : "0 (0%)"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-[#cbd5e1]">Medium</span>
                      </div>
                      <span className="font-mono text-[#94a3b8]">
                        {mounted ? `${mediumSolved} (${mediumPercent}%)` : "0 (0%)"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="text-[#cbd5e1]">Hard</span>
                      </div>
                      <span className="font-mono text-[#94a3b8]">
                        {mounted ? `${hardSolved} (${hardPercent}%)` : "0 (0%)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom 3 Summary Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#162032] text-center">
                <div>
                  <div className="text-[11px] text-[#64748b]">Longest Streak</div>
                  <div className="text-sm font-bold font-mono text-white mt-1">
                    {mounted ? `${longestStreak} Days` : "0 Days"}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#64748b]">Current Streak</div>
                  <div className="text-sm font-bold font-mono text-white mt-1">
                    {mounted ? `${currentStreak} Days` : "0 Days"}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#64748b]">Completion Rate</div>
                  <div className="text-sm font-bold font-mono text-white mt-1">
                    {mounted ? `${completionRate}%` : "0%"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Submission Activity (Past Year) */}
          <div className="rounded-xl border border-[#162032] bg-[#0d121d] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white">Submission Activity (Past Year)</h2>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#141d2e]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#1d4ed8]/40" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#2563eb]/70" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#2f81f7]" />
                <span>More</span>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row items-center justify-between gap-6 pt-1">
              {/* Left Heatmap Grid - 52 Weeks (Full Year) */}
              <div className="overflow-x-auto max-w-full pb-1 flex-1">
                <div className="w-fit">
                  {/* Dynamic 12 Month labels */}
                  <div className="flex text-[10px] text-[#64748b] pl-7 mb-1.5 relative h-4">
                    {heatmapWeeks.map((week, idx) => {
                      const isFirstWeekOfMonth =
                        idx === 0 ||
                        new Date(heatmapWeeks[idx - 1][0].date).getMonth() !==
                          new Date(week[0].date).getMonth();
                      return (
                        <div key={idx} className="w-[11px] mr-[3px] text-[10px] relative">
                          {isFirstWeekOfMonth && (
                            <span className="absolute left-0 top-0 whitespace-nowrap">
                              {new Date(week[0].date).toLocaleString("en-US", { month: "short" })}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Days of week + Heatmap Matrix */}
                  <div className="flex items-center gap-2">
                    {/* Weekday labels */}
                    <div className="flex flex-col justify-between text-[10px] text-[#64748b] h-[95px] py-0.5 shrink-0 w-5">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                    </div>

                    {/* 52 Matrix Columns */}
                    <div className="flex gap-[3px]">
                      {heatmapWeeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-[3px]">
                          {week.map((day, dIdx) => {
                            let bgClass = "bg-[#141d2e]";
                            if (day.count === 1) bgClass = "bg-[#1d4ed8]/50";
                            else if (day.count === 2) bgClass = "bg-[#2563eb]/80";
                            else if (day.count >= 3) bgClass = "bg-[#2f81f7]";

                            return (
                              <div
                                key={dIdx}
                                className={`w-[11px] h-[11px] rounded-[2px] ${bgClass} transition-colors hover:ring-1 hover:ring-blue-400`}
                                title={`${day.date}: ${day.count} submissions`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Activity Metrics */}
              <div className="w-full lg:w-60 shrink-0 lg:border-l lg:border-[#162032] lg:pl-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-[#94a3b8]">
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    <span>Total Submissions</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">
                    {mounted ? totalSubmissions : 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-[#94a3b8]">
                    <UserCheck className="w-4 h-4 text-blue-400" />
                    <span>Shows Solved</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">
                    {mounted ? solvedCount : 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-[#94a3b8]">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Active Days</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">
                    {mounted ? activeDaysCount : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Recent Submissions */}
          <div className="rounded-xl border border-[#162032] bg-[#0d121d] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white">Recent Submissions</h2>
              </div>
              <Link
                href="/"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {submissions.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                <FileText className="w-10 h-10 text-[#64748b]/50 stroke-[1.5]" />
                <h3 className="text-sm font-bold text-[#e2e8f0]">No submissions yet</h3>
                <p className="text-xs text-[#64748b] max-w-sm">
                  Open a problem and click &ldquo;Run Code&rdquo; to test solutions and record your progress!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#162032] text-[#64748b] font-medium">
                    <tr>
                      <th className="py-3 px-3">Problem</th>
                      <th className="py-3 px-3 w-28">Status</th>
                      <th className="py-3 px-3 w-24">Language</th>
                      <th className="py-3 px-3 w-24">Runtime</th>
                      <th className="py-3 px-3 w-24">Memory</th>
                      <th className="py-3 px-3 w-28">Date</th>
                      <th className="py-3 px-3 w-20 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#162032]">
                    {submissions.slice(0, 10).map((sub) => {
                      const diffClass = difficultyColors[sub.difficulty] || difficultyColors.Easy;
                      const isAccepted = sub.status === "Accepted";

                      return (
                        <tr key={sub.id} className="hover:bg-[#141d2e]/40 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${diffClass}`}>
                                {sub.difficulty}
                              </span>
                              <Link
                                href={`/problems/${sub.problemId}`}
                                className="font-medium text-white hover:text-blue-400 transition-colors"
                              >
                                #{sub.problemId}. {sub.problemTitle}
                              </Link>
                            </div>
                          </td>
                          <td className={`py-3 px-3 font-semibold ${isAccepted ? "text-green-400" : "text-red-400"}`}>
                            <div className="flex items-center gap-1.5">
                              {isAccepted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                              <span>{sub.status}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[#94a3b8]">
                            {sub.language}
                          </td>
                          <td className="py-3 px-3 font-mono text-white font-medium">
                            {sub.runtime}
                          </td>
                          <td className="py-3 px-3 font-mono text-[#94a3b8]">
                            {sub.memory}
                          </td>
                          <td className="py-3 px-3 text-[#64748b]">
                            {new Date(sub.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Link href={`/problems/${sub.problemId}`}>
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-blue-400 hover:text-white hover:bg-[#162032]">
                                Solve
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

