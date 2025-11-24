"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import { Problem } from "@/lib/problems";

interface ProblemCardProps {
  problem: Problem;
  index: number;
}

export function ProblemCard({ problem, index }: ProblemCardProps) {
  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    Hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/problems/${problem.id}`}>
        <Card className="p-6 cursor-pointer hover:border-primary/50 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {problem.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {problem.description.split("\n")[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={difficultyColors[problem.difficulty]}
            >
              {problem.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {problem.category}
            </Badge>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
