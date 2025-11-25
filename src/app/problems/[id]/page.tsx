"use client";

import { Navigation } from "@/components/Navigation";
import { problems } from "@/lib/problems";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { theme } = useTheme();
  const problem = problems.find((p) => p.id === params.id);

  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(problem?.starterCode.python || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<"idle" | "success" | "error">("idle");
  
  // Visualization state
  const [vizStep, setVizStep] = useState(0);
  const [vizMaxSteps, setVizMaxSteps] = useState(0);
  const [isVizPlaying, setIsVizPlaying] = useState(false);
  const [vizState, setVizState] = useState<any>({ 
    description: "", 
    explanation: "", 
    algorithmStep: "", 
    elements: [], 
    complexity: "" 
  });
  const [vizParams, setVizParams] = useState({ nums: [2, 7, 11, 15], target: 9 });

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

  // Initialize visualization when problem changes
  useEffect(() => {
    // Initialize max steps based on problem type
    if (problem?.id === "1") {
      setVizMaxSteps(15);
    } else if (problem?.id === "2") {
      setVizMaxSteps(5);
    } else if (problem?.id === "3") {
      setVizMaxSteps(10);
    } else if (problem?.id === "4") {
      setVizMaxSteps(6);
    } else if (problem?.id === "5") {
      setVizMaxSteps(10);
    } else if (problem?.id === "6") {
      setVizMaxSteps(8);
    } else {
      setVizMaxSteps(0);
    }
    setVizStep(0);
    setIsVizPlaying(false);
  }, [problem?.id]);

  // Update visualization on step change
  useEffect(() => {
    if (vizMaxSteps > 0) {
      updateVisualization();
    }
  }, [vizStep, vizMaxSteps]);

  // Auto-play visualization
  useEffect(() => {
    if (isVizPlaying && vizStep < vizMaxSteps) {
      const delay = 2500; // Increased from 1000ms to 2500ms for slower animation
      const timer = setTimeout(() => {
        setVizStep(prev => Math.min(prev + 1, vizMaxSteps));
      }, delay);
      return () => clearTimeout(timer);
    } else if (vizStep >= vizMaxSteps && isVizPlaying) {
      setIsVizPlaying(false);
    }
  }, [isVizPlaying, vizStep, vizMaxSteps]);

  const updateVisualization = () => {
    if (problem?.id === "1" && vizMaxSteps > 0) {
      updateTwoSumVizualization(vizParams.nums, vizParams.target, vizStep);
    } else if (problem?.id === "2" && vizMaxSteps > 0) {
      updateAddTwoNumbersViz(vizStep);
    } else if (problem?.id === "3" && vizMaxSteps > 0) {
      updateLongestSubstringViz(vizStep);
    } else if (problem?.id === "4" && vizMaxSteps > 0) {
      updateBinarySearchViz(vizStep);
    } else if (problem?.id === "5" && vizMaxSteps > 0) {
      updateMergeTwoListsViz(vizStep);
    } else if (problem?.id === "6" && vizMaxSteps > 0) {
      updateValidParenthesesViz(vizStep);
    }
  };

  const handleVizReset = () => {
    setIsVizPlaying(false);
    setVizStep(0);
  };

  const handleVizStepForward = () => {
    if (vizStep < vizMaxSteps) {
      setVizStep(prev => prev + 1);
    }
  };

  const handleVizStepBackward = () => {
    setVizStep(prev => Math.max(0, prev - 1));
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
        problemId: problem?.id,
      });

      setOutput(response.data.output || response.data.error || "No output");
      setExecutionStatus(response.data.error ? "error" : "success");
    } catch (error: any) {
      setOutput(error.response?.data?.error || "Failed to execute code");
      setExecutionStatus("error");
    } finally {
      setIsRunning(false);
      // Always generate visualization, even if there are errors
      generateVisualizationFromCode(code, language);
    }
  };

  const generateVisualizationFromCode = (userCode: string, lang: Language) => {
    // Parse the user's code and generate visualization steps based on problem
    if (problem?.id === "1") {
      generateTwoSumVisualization(userCode, lang);
    } else if (problem?.id === "2") {
      generateAddTwoNumbersVisualization(userCode, lang);
    } else if (problem?.id === "3") {
      generateLongestSubstringVisualization(userCode, lang);
    } else if (problem?.id === "4") {
      generateBinarySearchVisualization(userCode, lang);
    } else if (problem?.id === "5") {
      generateMergeTwoListsVisualization(userCode, lang);
    } else if (problem?.id === "6") {
      generateValidParenthesesVisualization(userCode, lang);
    } else {
      // Other problems don't have visualization yet
      setVizMaxSteps(0);
      setVizState({ 
        description: "Visualization coming soon", 
        explanation: "Visualization for this problem is not yet implemented", 
        algorithmStep: "", 
        elements: [], 
        complexity: "" 
      });
    }
  };

  const generateTwoSumVisualization = (userCode: string, lang: Language) => {
    // Extract array and target from code or use defaults from problem examples
    let nums = [2, 7, 11, 15];
    let target = 9;

    // Try to parse array and target from code
    const arrayMatch = userCode.match(/(?:nums|array)\s*=\s*\[([\d,\s]+)\]/i);
    const targetMatch = userCode.match(/(?:target)\s*=\s*(\d+)/i);

    if (arrayMatch) {
      try {
        nums = arrayMatch[1].split(",").map((n) => parseInt(n.trim()));
      } catch (e) {
        // Use defaults
      }
    }

    if (targetMatch) {
      try {
        target = parseInt(targetMatch[1]);
      } catch (e) {
        // Use defaults
      }
    }

    // Store params for later use
    setVizParams({ nums, target });

    // Set max steps: 1 for start + len(nums) for processing each + 1 for final result
    setVizMaxSteps(nums.length + 2);
    
    // Create initial state
    updateTwoSumVizualization(nums, target, 0);
  };

  const updateTwoSumVizualization = (nums: number[], target: number, step: number) => {
    const elements = nums.map((val, idx) => ({
      value: val,
      index: idx,
      state: "default" as const,
    }));

    // Find the match first
    let matchI = -1;
    let matchJ = -1;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] + nums[j] === target) {
          matchI = i;
          matchJ = j;
          break;
        }
      }
      if (matchI !== -1) break;
    }

    let desc = `Two Sum: Finding pair in [${nums.join(", ")}] that sums to ${target}`;
    let explanation = "";
    let algorithmStep = "";

    if (step === 0) {
      desc = "🎯 Algorithm Start";
      explanation = `We have an array: [${nums.join(", ")}]\n\nGoal: Find two numbers that add up to ${target}\n\nStrategy: We'll use a hash map to store numbers we've seen. For each number, we check if its complement (target - number) exists in the map.`;
      algorithmStep = `# Two Sum Algorithm\nmap = {}  # Store value -> index\n\nfor i in range(len(nums)):\n    complement = target - nums[i]\n    \n    if complement in map:\n        return [map[complement], i]\n    \n    map[nums[i]] = i`;
    } else if (step >= 1 && step < nums.length + 1) {
      const i = step - 1;
      elements[i].state = "checking";
      const complement = target - nums[i];
      
      desc = `Step ${step}: Processing nums[${i}] = ${nums[i]}`;
      explanation = `Current element: ${nums[i]}\nLooking for: ${target} - ${nums[i]} = ${complement}\n\n❓ Is ${complement} in our map?\n\nIf we find ${complement}, it means we've already seen a number that adds with ${nums[i]} to make ${target}!`;
      algorithmStep = `# Step ${step}\ni = ${i}\nnums[${i}] = ${nums[i]}\ncomplement = ${target} - ${nums[i]} = ${complement}\n\n# Check if complement exists in map\nif ${complement} in map:\n    return [found_index, ${i}]\n\n# Add current number to map\nmap[${nums[i]}] = ${i}`;

      // Check if we found a match at this step
      if (matchI !== -1 && (i === matchI || i === matchJ)) {
        if (i === matchJ && nums[matchI] === complement) {
          // Found the match!
          elements[matchI].state = "found";
          elements[matchJ].state = "found";
          desc = `✅ FOUND! nums[${matchI}] + nums[${matchJ}] = ${nums[matchI]} + ${nums[matchJ]} = ${target}`;
          explanation = `Success! 🎉\n\nWe found our pair:\n• Index ${matchI}: value ${nums[matchI]}\n• Index ${matchJ}: value ${nums[matchJ]}\n\nSum: ${nums[matchI]} + ${nums[matchJ]} = ${target}\n\nAnswer: [${matchI}, ${matchJ}]`;
          algorithmStep = `# MATCH FOUND! ✅\ncomplement_index = map[${complement}] = ${matchI}\ncurrent_index = ${matchJ}\n\nreturn [${matchI}, ${matchJ}]`;
        }
      }

      if (elements[i].state === "checking") {
        desc = `Step ${step}: Processing nums[${i}] = ${nums[i]}`;
        explanation = `Current element: ${nums[i]}\nLooking for: ${complement}\n\n❌ ${complement} not found in map yet\nAdding ${nums[i]} to our map for future reference\n\nMap now tracks: {${Array.from({length: i + 1}, (_, k) => `${nums[k]}: ${k}`).join(", ")}}`;
      }
    } else {
      // Final step - show the result
      if (matchI !== -1) {
        elements[matchI].state = "found";
        elements[matchJ].state = "found";
        desc = `✅ Solution Found!`;
        explanation = `The algorithm found the pair:\n\n• Index ${matchI}: value ${nums[matchI]} 🟩\n• Index ${matchJ}: value ${nums[matchJ]} 🟩\n\nSum: ${nums[matchI]} + ${nums[matchJ]} = ${target}\n\nResult: [${matchI}, ${matchJ}]\n\nTime Complexity: O(n)\nSpace Complexity: O(n)`;
        algorithmStep = `# Solution Found!\n# Answer: [${matchI}, ${matchJ}]\n# These two numbers sum to ${target}\n\nreturn [${matchI}, ${matchJ}]`;
      } else {
        desc = "❌ No solution found";
        explanation = `The algorithm checked all elements but couldn't find two numbers that sum to ${target}.\n\nNo valid pair exists in this array.`;
        algorithmStep = `# No solution found\nreturn []`;
      }
    }

    setVizState({ description: desc, explanation, algorithmStep, elements, complexity: "Time: O(n), Space: O(n)" });
  };

  const updateAddTwoNumbersViz = (step: number) => {
    const l1 = [2, 4, 3];
    const l2 = [5, 6, 4];
    const result: number[] = [];
    let carry = 0;

    const currentStep = Math.min(step, 3);
    
    for (let i = 0; i < currentStep; i++) {
      const sum = (l1[i] || 0) + (l2[i] || 0) + carry;
      result.push(sum % 10);
      carry = Math.floor(sum / 10);
    }

    let desc = "Add Two Numbers: 342 + 465 = 807";
    let explanation = "";
    let algorithmStep = "";
    let currentPointer = -1;

    if (step === 0) {
      desc = "🔗 Linked List Addition Start";
      explanation = "The linked lists represent numbers in reverse order.\nList 1: [2→4→3] represents 342\nList 2: [5→6→4] represents 465\n\nWe add them digit by digit with carry propagation.";
      algorithmStep = "carry = 0\nresult = []";
      currentPointer = -1;
    } else if (step <= 3) {
      currentPointer = step - 1;
      const idx = step - 1;
      const val1 = l1[idx] || 0;
      const val2 = l2[idx] || 0;
      const prevCarry = idx > 0 ? Math.floor(((l1[idx-1] || 0) + (l2[idx-1] || 0) + (idx > 1 ? 1 : 0)) / 10) : 0;
      const sum = val1 + val2 + (idx === 0 ? 0 : prevCarry);
      
      desc = `Step ${step}: Position ${idx} → ${val1} + ${val2}` + (idx > 0 ? ` + carry(${prevCarry})` : '') + ` = ${sum}`;
      explanation = `At node ${idx}:\n• L1 value: ${val1}\n• L2 value: ${val2}` + (idx > 0 ? `\n• Carry from previous: ${prevCarry}` : '') + `\n• Total: ${sum}\n• Store: ${sum % 10}, Carry: ${Math.floor(sum / 10)}`;
      algorithmStep = `sum = l1[${idx}] + l2[${idx}]` + (idx > 0 ? ` + carry` : '') + `\ndigit = sum % 10  // ${sum % 10}\ncarry = sum // 10  // ${Math.floor(sum / 10)}`;
    } else {
      desc = "✅ Addition Complete";
      explanation = `Result linked list: [${result.join('→')}]\nThis represents: 807\n\nVerification:\n• 342 + 465 = 807 ✓\n\nTime: O(max(m,n))\nSpace: O(max(m,n))`;
      algorithmStep = `return result_head\n# Result: [${result.join('→')}]`;
      currentPointer = -1;
    }

    setVizState({ 
      description: desc, 
      explanation,
      algorithmStep,
      elements: [
        { list: l1, label: "L1 (342 rev)", pointer: currentPointer },
        { list: l2, label: "L2 (465 rev)", pointer: currentPointer },
        { list: result, label: "Result", type: "result", step: currentStep }
      ],
      complexity: "Time: O(max(m,n)), Space: O(max(m,n))"
    });
  };

  const generateAddTwoNumbersVisualization = (userCode: string, lang: Language) => {
    const list1 = [2, 4, 3];
    const list2 = [5, 6, 4];
    setVizMaxSteps(Math.max(list1.length, list2.length) + 3);
    setVizParams({ nums: list1, target: 0 });
    
    // Set default visualization
    setVizState({
      description: "Add Two Numbers (Linked List)",
      explanation: "Two numbers are represented as linked lists in reverse order. We need to add them digit by digit, handling carries.",
      algorithmStep: `# Pseudocode
current = dummy = ListNode(0)
carry = 0

while l1 or l2 or carry:
    val1 = l1.val if l1 else 0
    val2 = l2.val if l2 else 0
    
    total = val1 + val2 + carry
    carry = total // 10
    
    current.next = ListNode(total % 10)
    current = current.next
    l1 = l1.next if l1 else None
    l2 = l2.next if l2 else None

return dummy.next`,
      elements: [
        { list: list1, label: "List 1 (342)" },
        { list: list2, label: "List 2 (465)" }
      ],
      complexity: "Time: O(max(m,n)), Space: O(max(m,n))"
    });
  };

  const generateMergeTwoListsVisualization = (userCode: string, lang: Language) => {
    // Default merge lists visualization
    const list1 = [1, 2, 4];
    const list2 = [1, 3, 4];
    setVizMaxSteps(Math.max(list1.length, list2.length) + 3);
    setVizParams({ nums: list1, target: 0 });
  };

  const generateValidParenthesesVisualization = (userCode: string, lang: Language) => {
    const s = "()[]{}";
    setVizMaxSteps(s.length + 2);
    setVizParams({ nums: [0], target: 0 });
  };

  const generateBinarySearchVisualization = (userCode: string, lang: Language) => {
    const nums = [-1, 0, 3, 5, 9, 12];
    setVizMaxSteps(6);
    setVizParams({ nums, target: 9 });
  };

  const generateLongestSubstringVisualization = (userCode: string, lang: Language) => {
    const s = "abcabcbb";
    setVizMaxSteps(s.length + 2);
    setVizParams({ nums: [0], target: 0 });
  };

  const updateMergeTwoListsViz = (step: number) => {
    const list1 = [1, 2, 4];
    const list2 = [1, 3, 4];
    let desc = "Merge Two Sorted Lists";
    let explanation = "";
    let algorithmStep = "";

    if (step === 0) {
      desc = "🔀 Starting merge process";
      explanation = "We have two sorted linked lists:\nList 1: [1, 2, 4]\nList 2: [1, 3, 4]\n\nWe need to merge them into one sorted list by comparing elements from both lists and adding the smaller one to the result.";
      algorithmStep = "two_pointers = (ptr1=0, ptr2=0)\nresult = []";
    } else if (step <= Math.max(list1.length, list2.length) + 1) {
      const idx = step - 1;
      const val1 = list1[idx] !== undefined ? list1[idx] : null;
      const val2 = list2[idx] !== undefined ? list2[idx] : null;
      
      if (val1 !== null && val2 !== null) {
        const smaller = val1 <= val2 ? val1 : val2;
        desc = `Comparing ${val1} vs ${val2}`;
        explanation = `Compare elements from both lists. ${val1} ${val1 <= val2 ? '≤' : '>'} ${val2}, so we take ${smaller} from ${val1 <= val2 ? 'List 1' : 'List 2'}`;
        algorithmStep = `if l1.val <= l2.val:\n    node.next = l1\n    l1 = l1.next\nelse:\n    node.next = l2\n    l2 = l2.next`;
      } else if (val1 !== null) {
        desc = `Appending remaining from List 1: ${val1}`;
        explanation = "List 2 is exhausted. Append all remaining nodes from List 1.";
        algorithmStep = `node.next = l1  # Append rest of l1`;
      } else if (val2 !== null) {
        desc = `Appending remaining from List 2: ${val2}`;
        explanation = "List 1 is exhausted. Append all remaining nodes from List 2.";
        algorithmStep = `node.next = l2  # Append rest of l2`;
      }
    } else {
      desc = "✅ Merge Complete";
      explanation = "Result: [1, 1, 2, 3, 4, 4]\nBoth lists have been merged successfully in sorted order!\n\nTime: O(m + n), Space: O(1)";
      algorithmStep = `return dummy.next  # Return head of merged list`;
    }

    setVizState({
      description: desc,
      explanation,
      algorithmStep,
      elements: [{ list: list1, label: "List 1" }, { list: list2, label: "List 2" }],
      complexity: "Time: O(m + n), Space: O(1)"
    });
  };

  const updateValidParenthesesViz = (step: number) => {
    const s = "()[]{}";
    const chars = s.split("");
    let desc = "Valid Parentheses Check";
    let explanation = "";
    let algorithmStep = "";
    let stack: string[] = [];

    if (step === 0) {
      desc = "🔍 Starting validation";
      explanation = `String: "${s}"\n\nWe need to check if parentheses are valid by using a stack.\nRules:\n1. Open brackets push onto stack\n2. Close brackets match top of stack\n3. Stack must be empty at end`;
      algorithmStep = "stack = []\nfor char in s:\n    if isOpening(char):\n        stack.push(char)";
    } else if (step <= chars.length) {
      const idx = step - 1;
      const char = chars[idx];
      const isOpen = ['(', '[', '{'].includes(char);
      
      for (let i = 0; i <= idx; i++) {
        if (['(', '[', '{'].includes(chars[i])) {
          if (stack.length === 0 || ![')', ']', '}'].includes(chars[i])) {
            stack.push(chars[i]);
          }
        } else if (stack.length > 0) {
          stack.pop();
        }
      }

      desc = `Processing: "${char}"`;
      explanation = isOpen 
        ? `"${char}" is an opening bracket. Push to stack.\nStack: [${stack.join(', ')}]`
        : `"${char}" is a closing bracket. Pop from stack and verify match.\nStack: [${stack.join(', ')}]`;
      algorithmStep = isOpen 
        ? `stack.push("${char}")`
        : `if stack.pop() != matching_open("${char}"):\n    return False`;
    } else {
      desc = "✅ Valid Parentheses";
      explanation = `All brackets matched correctly!\nStack is empty - all parentheses are valid.\n\nResult: TRUE\n\nTime: O(n), Space: O(n)`;
      algorithmStep = `return len(stack) == 0  # True`;
    }

    setVizState({
      description: desc,
      explanation,
      algorithmStep,
      elements: [{ chars, stack, currentIndex: step - 1 }],
      complexity: "Time: O(n), Space: O(n)"
    });
  };

  const updateBinarySearchViz = (step: number) => {
    const nums = [-1, 0, 3, 5, 9, 12];
    const target = 9;
    let left = 0;
    let right = nums.length - 1;
    let mid = -1;

    let desc = "Binary Search";
    let explanation = "";
    let algorithmStep = "";

    if (step === 0) {
      desc = "🎯 Starting binary search";
      explanation = `Array: [${nums.join(', ')}]\nTarget: ${target}\n\nWe use binary search to efficiently find the target by eliminating half the search space in each step.`;
      algorithmStep = `left = 0\nright = len(nums) - 1`;
    } else if (step <= 4) {
      for (let i = 0; i < step; i++) {
        mid = Math.floor((left + right) / 2);
        if (nums[mid] < target) {
          left = mid + 1;
        } else if (nums[mid] > target) {
          right = mid - 1;
        } else {
          break;
        }
      }

      mid = Math.floor((left + right) / 2);
      desc = `Step ${step}: Checking middle element`;
      explanation = `Left: ${left}, Right: ${right}, Mid: ${mid}\nValue at mid: ${nums[mid]}\n${nums[mid] === target ? `Found ${target}!` : nums[mid] < target ? `${nums[mid]} < ${target}, search right half` : `${nums[mid]} > ${target}, search left half`}`;
      algorithmStep = `mid = (left + right) // 2\nif nums[${mid}] == ${target}:\n    return ${mid}`;
    } else {
      desc = "✅ Target Found";
      explanation = `Target ${target} found at index 4!\n\nTime Complexity: O(log n)\nSpace Complexity: O(1)`;
      algorithmStep = `return ${nums.indexOf(target)}  # Index 4`;
    }

    const elements = nums.map((val, idx) => ({
      value: val,
      index: idx,
      state: idx < left || idx > right ? "checked" : step === 0 ? "default" : idx === mid ? "current" : "default"
    }));

    setVizState({
      description: desc,
      explanation,
      algorithmStep,
      elements,
      complexity: "Time: O(log n), Space: O(1)"
    });
  };

  const updateLongestSubstringViz = (step: number) => {
    const s = "abcabcbb";
    const chars = s.split("");
    let desc = "Longest Substring Without Repeating";
    let explanation = "";
    let algorithmStep = "";

    if (step === 0) {
      desc = "🔍 Sliding Window Start";
      explanation = `String: "${s}"\n\nFind the longest substring with all unique characters using a sliding window approach.\nWe maintain a window of unique characters and expand/shrink as needed.`;
      algorithmStep = "left = 0\nchar_set = set()\nmax_length = 0";
    } else if (step <= chars.length) {
      const idx = step - 1;
      let left = 0;
      let maxLen = 0;
      let currentStart = 0;
      const seen: Record<string, number> = {};

      for (let i = 0; i <= idx; i++) {
        if (chars[i] in seen) {
          left = Math.max(left, seen[chars[i]] + 1);
        }
        seen[chars[i]] = i;
        const len = i - left + 1;
        if (len > maxLen) {
          maxLen = len;
          currentStart = left;
        }
      }

      desc = `Char "${chars[idx]}": Window ["${s.substring(left, idx + 1)}"]`;
      explanation = `Current character: "${chars[idx]}" at index ${idx}\nWindow length: ${idx - left + 1}\nMax length so far: ${maxLen}\nSubstring: "${s.substring(currentStart, currentStart + maxLen)}"`;
      algorithmStep = `if char in seen:\n    left = max(left, seen[char] + 1)\nseen[char] = i\nmax_length = max(max_length, i - left + 1)`;
    } else {
      desc = "✅ Complete";
      explanation = `Longest substring without repeating: "abc" with length 3\n\nTime: O(n), Space: O(min(m, n))`;
      algorithmStep = `return max_length  # 3`;
    }

    setVizState({
      description: desc,
      explanation,
      algorithmStep,
      elements: [{ chars, currentIndex: step - 1 }],
      complexity: "Time: O(n), Space: O(min(m,n))"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Problem Description with Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2 border-r border-border flex flex-col"
        >
          <div className="border-b border-border p-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          <Tabs defaultValue="description" className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
            </TabsList>
            
            {/* Description Tab */}
            <TabsContent value="description" className="flex-1 overflow-y-auto p-6 m-0">
              <div className="space-y-6">
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
            </TabsContent>

            {/* Visualization Tab */}
            <TabsContent value="visualization" className="flex-1 overflow-y-auto p-6 m-0">
              <div className="space-y-4">
                {vizMaxSteps === 0 ? (
                  <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <div className="text-6xl">🎬</div>
                    <p className="text-muted-foreground text-center">
                      Run your code first to see the visualization of your algorithm's execution
                    </p>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Once you click "Run Code", the visualization will show how your solution works step by step on the example inputs.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold">Algorithm Visualization</h2>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setIsVizPlaying(!isVizPlaying)} 
                          variant="outline"
                          size="sm"
                          disabled={vizStep >= vizMaxSteps}
                        >
                          {isVizPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button 
                          onClick={handleVizStepBackward} 
                          variant="outline"
                          size="sm"
                          disabled={vizStep === 0}
                        >
                          ←
                        </Button>
                        <Button 
                          onClick={handleVizStepForward} 
                          variant="outline"
                          size="sm"
                          disabled={vizStep >= vizMaxSteps}
                        >
                          →
                        </Button>
                        <Button 
                          onClick={handleVizReset} 
                          variant="outline"
                          size="sm"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Step {vizStep} / {vizMaxSteps}
                    </div>

                    <Card className="p-6 bg-linear-to-br from-primary/5 to-primary/10 min-h-[300px] flex items-center justify-center">
                      <VisualizationRenderer problemId={problem?.id || "1"} vizState={vizState} />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                          <span className="text-lg">💡</span>
                          <span>What's Happening?</span>
                        </h3>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`desc-${vizStep}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs text-muted-foreground space-y-2"
                          >
                            <p className="font-bold text-foreground text-sm">{vizState.description}</p>
                            <p className="leading-relaxed whitespace-pre-line">{vizState.explanation}</p>
                          </motion.div>
                        </AnimatePresence>
                      </Card>

                      <Card className="p-4">
                        <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                          <span className="text-lg">📝</span>
                          <span>Algorithm Code</span>
                        </h3>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`code-${vizStep}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto max-h-48 overflow-y-auto leading-relaxed">
                              <code>{vizState.algorithmStep}</code>
                            </pre>
                          </motion.div>
                        </AnimatePresence>
                      </Card>
                    </div>

                    {output && (
                      <Card className="p-4">
                        <h3 className="font-semibold mb-2 text-sm">Your Code's Output:</h3>
                        <pre className="text-xs font-mono whitespace-pre-wrap bg-muted p-3 rounded max-h-40 overflow-y-auto">
                          {output}
                        </pre>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
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

function VisualizationRenderer({ problemId, vizState }: { problemId: string; vizState: any }) {
  if (!vizState || !vizState.elements) {
    return (
      <div className="w-full flex items-center justify-center h-full">
        <p className="text-muted-foreground">Run your code to see visualization</p>
      </div>
    );
  }

  if (problemId === "1") {
    // Two Sum visualization
    if (!Array.isArray(vizState.elements) || vizState.elements.length === 0) {
      return (
        <div className="w-full flex items-center justify-center h-full">
          <p className="text-muted-foreground">Run your code to see visualization</p>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center gap-8">
        <div className="flex gap-4 items-end flex-wrap justify-center">
          {vizState.elements.map((item: any, idx: number) => {
            const colors: Record<string, string> = {
              default: "bg-primary/60 border-primary",
              checking: "bg-blue-500 border-blue-600",
              found: "bg-green-500 border-green-600",
            };
            const stateColor = colors[item?.state] || colors.default;
            
            return (
              <motion.div 
                key={idx} 
                className="flex flex-col items-center gap-2"
                animate={{ scale: item?.state !== 'default' ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className={`w-20 h-20 ${stateColor} border-2 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-all duration-300`}
                >
                  {item?.value || "?"}
                </div>
                <div className="text-sm text-muted-foreground">
                  [{item?.index || idx}]
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (problemId === "2" || problemId === "5") {
    // Linked List visualization (Add Two Numbers and Merge Two Sorted Lists)
    return (
      <div className="w-full flex flex-col gap-8">
        {vizState.elements?.map((listData: any, listIdx: number) => (
          <div key={listIdx} className="flex flex-col gap-3">
            <div className="text-sm font-medium text-muted-foreground">{listData.label}</div>
            <div className="flex items-center gap-2 flex-wrap">
              {listData.list?.map((val: number, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <motion.div 
                    className={`w-14 h-14 rounded-lg flex items-center justify-center text-white font-semibold border-2 transition-all duration-300 ${
                      listData.type === 'result' ? 'bg-green-500 border-green-600' : 'bg-primary border-primary'
                    } ${listData.pointer === idx ? 'ring-4 ring-blue-400 scale-110' : ''}`}
                    animate={{ scale: listData.pointer === idx ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {val}
                  </motion.div>
                  {idx < listData.list.length - 1 && (
                    <div className="text-muted-foreground text-lg font-bold">→</div>
                  )}
                </div>
              ))}
              {listData.list?.length === 0 && (
                <div className="text-muted-foreground italic text-sm">empty</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (problemId === "3") {
    // Longest Substring visualization
    if (!vizState.elements[0]?.chars) {
      return null;
    }
    
    return (
      <div className="w-full flex justify-center">
        <div className="flex gap-2 flex-wrap justify-center">
          {vizState.elements[0].chars.map((char: string, idx: number) => {
            const colors: Record<string, string> = {
              default: "bg-muted text-foreground",
              window: "bg-blue-500 text-white",
              found: "bg-green-500 text-white",
            };
            const charState = idx <= vizState.elements[0].currentIndex ? "window" : "default";
            return (
              <motion.div 
                key={idx} 
                className="flex flex-col items-center gap-2"
                animate={{ scale: charState !== 'default' ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-12 h-12 ${colors[charState]} rounded-lg flex items-center justify-center font-mono font-bold text-lg transition-all duration-300`}>
                  {char}
                </div>
                <div className="text-xs text-muted-foreground">{idx}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (problemId === "4") {
    // Binary Search visualization
    if (!Array.isArray(vizState.elements)) {
      return null;
    }

    return (
      <div className="w-full flex justify-center">
        <div className="flex gap-3 flex-wrap justify-center">
          {vizState.elements.map((item: any, idx: number) => {
            const colors: Record<string, string> = {
              default: "bg-muted border-border",
              range: "bg-blue-500/20 border-blue-500",
              checking: "bg-purple-500 border-purple-600 scale-110 shadow-lg",
              found: "bg-green-500 border-green-600 scale-110 shadow-lg",
              checked: "bg-gray-500/20 border-gray-500",
            };
            const stateColor = colors[item?.state] || colors.default;
            
            return (
              <motion.div 
                key={idx} 
                className="flex flex-col items-center gap-2"
                animate={{ scale: (item?.state === 'checking' || item?.state === 'found') ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-16 h-16 ${stateColor} border-2 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${(item?.state === 'checking' || item?.state === 'found') ? 'text-white' : ''}`}>
                  {item?.value}
                </div>
                <div className="text-xs text-muted-foreground">[{item?.index}]</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (problemId === "6") {
    // Valid Parentheses visualization
    if (!vizState.elements[0]?.chars || !vizState.elements[0]?.stack) {
      return null;
    }

    const charsData = vizState.elements[0];
    const stackData = vizState.elements[0];

    return (
      <div className="w-full flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm font-medium text-muted-foreground">Input String</div>
          <div className="flex gap-2 flex-wrap justify-center">
            {charsData.chars?.map((char: string, idx: number) => (
              <motion.div 
                key={idx} 
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-lg ${
                  idx < (charsData.currentIndex || 0)
                    ? 'bg-green-500/20 border-green-500 text-green-600' 
                    : idx === (charsData.currentIndex || 0)
                    ? 'bg-blue-500/20 border-blue-500 text-blue-600'
                    : 'bg-muted border-border'
                }`}
                animate={{ scale: idx === (charsData.currentIndex || 0) ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-sm font-medium text-muted-foreground">Stack</div>
          <div className="flex flex-col-reverse gap-2 min-h-[100px] justify-end">
            {stackData.stack?.length > 0 ? (
              stackData.stack.map((item: string, idx: number) => (
                <motion.div 
                  key={idx}
                  className="w-16 h-12 bg-primary rounded-lg border-2 border-primary flex items-center justify-center font-mono font-bold text-lg text-white"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {item}
                </motion.div>
              ))
            ) : (
              <div className="text-muted-foreground italic text-sm">Empty</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
