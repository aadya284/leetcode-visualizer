"use client";

import { Navigation } from "@/components/Navigation";
import { ProblemCard } from "@/components/ProblemCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { problems } from "@/lib/problems";
import { Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");

  const categories = Array.from(new Set(problems.map((p) => p.category)));

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficulty === "all" || problem.difficulty === difficulty;
    const matchesCategory = category === "all" || problem.category === category;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Master Algorithms Visually
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Solve LeetCode problems with integrated code editor and visualize algorithms step-by-step
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
          suppressHydrationWarning
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              suppressHydrationWarning
            />
          </div>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem, index) => (
            <ProblemCard key={problem.id} problem={problem} index={index} />
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-muted-foreground">No problems found matching your criteria</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}