"use client";

import { Navigation } from "@/components/Navigation";
import { problems } from "@/lib/problems";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import axios from "axios";

type Language = "python" | "c" | "cpp" | "java";

const languageMap = {
  python: { id: 71, name: "Python" },
  c: { id: 50, name: "C" },
  cpp: { id: 54, name: "C++" },
  java: { id: 62, name: "Java" },
};

export default function ProblemPage() {
  const params = useParams();
  const { theme } = useTheme();
  const problem = problems.find((p) => p.id === params.id);

  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(problem?.starterCode.python || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<"idle" | "success" | "error">("idle");

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-xl text-muted-foreground">Problem not found</p>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    Hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang]);
    setOutput("");
    setExecutionStatus("idle");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("");
    setExecutionStatus("idle");

    try {
      const response = await axios.post("/api/execute", {
        code,
        language: languageMap[language].id,
        languageName: languageMap[language].name,
      });

      setOutput(response.data.output || response.data.error || "No output");
      setExecutionStatus(response.data.error ? "error" : "success");
    } catch (error: any) {
      setOutput(error.response?.data?.error || "Failed to execute code");
      setExecutionStatus("error");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Problem Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2 overflow-y-auto border-r border-border"
        >
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className={difficultyColors[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
                <Badge variant="secondary">{problem.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold">{problem.title}</h1>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="text-base whitespace-pre-wrap">{problem.description}</div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Examples</h2>
              {problem.examples.map((example, idx) => (
                <Card key={idx} className="p-4 mb-4">
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">Input:</span>
                      <code className="ml-2 text-sm bg-muted px-2 py-1 rounded">
                        {example.input}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold">Output:</span>
                      <code className="ml-2 text-sm bg-muted px-2 py-1 rounded">
                        {example.output}
                      </code>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-semibold">Explanation:</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {example.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Constraints</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {problem.constraints.map((constraint, idx) => (
                  <li key={idx}>{constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Code Editor */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2 flex flex-col"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Select value={language} onValueChange={(val) => handleLanguageChange(val as Language)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleRunCode} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Code
                </>
              )}
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <Editor
              height="60%"
              language={language === "cpp" ? "cpp" : language}
              theme={theme === "dark" ? "vs-dark" : "light"}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />

            <div className="h-[40%] border-t border-border bg-muted/30">
              <Tabs defaultValue="output" className="h-full flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b">
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="console">Console</TabsTrigger>
                </TabsList>
                <TabsContent value="output" className="flex-1 overflow-y-auto p-4 m-0">
                  {output ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {executionStatus === "success" && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {executionStatus === "error" && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-semibold">
                          {executionStatus === "success" ? "Execution Complete" : "Execution Error"}
                        </span>
                      </div>
                      <pre className="text-sm font-mono whitespace-pre-wrap bg-background/50 p-3 rounded border">
                        {output}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Run your code to see output here
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="console" className="flex-1 overflow-y-auto p-4 m-0">
                  <p className="text-sm text-muted-foreground">Console logs will appear here</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
