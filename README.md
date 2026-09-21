# 🎯 LeetVisual

A sleek, modern web application for visualizing and solving DSA problems with an integrated Monaco code editor and interactive algorithm state visualizers.

---

## ✨ Key Features

### 🏠 Problemset & Practice
- **Rich Problemset**: Browse curated and ingested LeetCode problems with acceptance rates, topics, and difficulties.
- **LeetCode-Style Filtering**: Search by keyword/ID, filter by Category/Topic, Status (Todo/Solved/Bookmarked), Difficulty (Easy/Medium/Hard), and Platform (LeetCode/Codeforces).
- **Pick One (`🔀`)**: Jump instantly to a random problem.
- **Fast Direct Pagination**: Direct jump numbered pagination with limits (20/50/100 per page).

### 💻 Code Editor & Execution
- **Split Workspace**: Problem statement, formatted examples, constraints on left; Monaco Editor on right.
- **Multi-Language**: Python3, C++, Java, and C with official language branding.
- **Judge0 Execution**: Run testcases and submit solutions with execution diagnostics and streak tracking.

### 🎨 Universal Algorithm Visualizer
- **Deterministic Step-by-Step State**: Every step reflects real algorithmic invariants and state transitions.
- **All 300+ Problems Supported**: Automatically parses problem examples and runs the appropriate algorithm engine:
  - **Binary Search**: Active search bounds `[L, R]`, `Mid` element, grayed-out eliminated zones.
  - **Two Pointers**: Converging pointers, container area calculations, 3Sum triplet matching.
  - **Sliding Window**: Window boundary highlights, seen-character hash table, and max length tracking.
  - **Linked Lists**: Connected SVG nodes, carry registers, and pointer badges (`head`, `curr`, `prev`, `next`, `dummy`).
  - **Binary Trees**: Interactive SVG tree coordinates, node traversal states, and subtree swaps.
  - **Graphs / 2D Grids**: Matrix grid traversal with water/land cells, BFS/DFS exploration, and island counters.
  - **Stack**: LIFO stack tube with push/pop transitions and matching bracket validation.
  - **Dynamic Programming & Hash Maps**: Real-time hash table complement lookups and DP memo arrays.
- **Playback Controls**: Play, pause, step forward/backward, restart, progress scrubber, and speed controls (10% to 90%).
- **Live State & Code Reasoning**: Variable inspector badges, complexity analysis, and executing code line snippets.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS, tw-animate-css
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **Code Execution**: Judge0 CE API (with graceful local fallback)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/leetcode_visualizer"
NEXT_PUBLIC_RAPIDAPI_KEY="your_optional_rapidapi_key"
```

### 3. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Ingestion (Optional)
```bash
# Ingest LeetCode problems
npm run ingest -- leetcode --limit=300
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.