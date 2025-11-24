"use client";

import { Navigation } from "@/components/Navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Lightbulb, Code2 } from "lucide-react";
import { problems } from "@/lib/problems";

type ProblemId = "1" | "2" | "3" | "4" | "5" | "6";

interface VisualizationState {
  description: string;
  explanation: string;
  algorithmStep: string;
  elements: any[];
  complexity?: string;
}

export default function VisualizePage() {
  const [problemId, setProblemId] = useState<ProblemId>("1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [step, setStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const [vizState, setVizState] = useState<VisualizationState>({ 
    description: "", 
    explanation: "",
    algorithmStep: "",
    elements: [] 
  });

  const problem = problems.find(p => p.id === problemId);

  // Initialize visualization when problem changes
  useEffect(() => {
    initializeVisualization();
    setIsPlaying(false);
    setStep(0);
  }, [problemId]);

  // Update visualization on step change
  useEffect(() => {
    updateVisualization();
  }, [step, problemId]);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && step < maxSteps) {
      const delay = 1000 - speed * 9;
      const timer = setTimeout(() => {
        setStep(prev => Math.min(prev + 1, maxSteps));
      }, delay);
      return () => clearTimeout(timer);
    } else if (step >= maxSteps && isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying, step, speed, maxSteps]);

  const initializeVisualization = () => {
    switch (problemId) {
      case "1": // Two Sum
        setMaxSteps(15);
        break;
      case "2": // Add Two Numbers
        setMaxSteps(8);
        break;
      case "3": // Longest Substring
        setMaxSteps(12);
        break;
      case "4": // Binary Search
        setMaxSteps(6);
        break;
      case "5": // Merge Two Sorted Lists
        setMaxSteps(10);
        break;
      case "6": // Valid Parentheses
        setMaxSteps(8);
        break;
    }
  };

  const updateVisualization = () => {
    switch (problemId) {
      case "1":
        visualizeTwoSum();
        break;
      case "2":
        visualizeAddTwoNumbers();
        break;
      case "3":
        visualizeLongestSubstring();
        break;
      case "4":
        visualizeBinarySearch();
        break;
      case "5":
        visualizeMergeLists();
        break;
      case "6":
        visualizeValidParentheses();
        break;
    }
  };

  const visualizeTwoSum = () => {
    const nums = [2, 7, 11, 15];
    const target = 9;
    const elements = nums.map((val, idx) => ({
      value: val,
      index: idx,
      state: "default" as const,
    }));

    let desc = "Two Sum: Find two numbers that add up to target = 9";
    let explanation = "";
    let algorithmStep = "";

    if (step === 0) {
      desc = "Starting with array [2, 7, 11, 15], target = 9";
      explanation = "We need to find two indices i and j such that nums[i] + nums[j] = target. We'll use a brute force approach with nested loops.";
      algorithmStep = "for i in range(len(nums)):\n    for j in range(i+1, len(nums)):";
    } else if (step <= 6) {
      const i = Math.floor((step - 1) / 2);
      const j = i + 1 + ((step - 1) % 2);
      if (j < nums.length) {
        elements[i].state = "checking";
        elements[j].state = "checking";
        desc = `Checking: nums[${i}] + nums[${j}] = ${nums[i]} + ${nums[j]} = ${nums[i] + nums[j]}`;
        explanation = `We're comparing element at index ${i} (value: ${nums[i]}) with element at index ${j} (value: ${nums[j]}). Checking if their sum equals the target value of ${target}.`;
        algorithmStep = `if nums[${i}] + nums[${j}] == ${target}:\n    return [${i}, ${j}]`;
        
        if (nums[i] + nums[j] === target) {
          elements[i].state = "found";
          elements[j].state = "found";
          desc = `✓ Found! nums[${i}] + nums[${j}] = ${nums[i]} + ${nums[j]} = ${target}`;
          explanation = `Success! The sum of ${nums[i]} and ${nums[j]} equals our target of ${target}. These are the two numbers we were looking for.`;
          algorithmStep = `return [${i}, ${j}]  # Found the answer!`;
        } else {
          explanation += ` The sum is ${nums[i] + nums[j]}, which doesn't match the target, so we continue searching.`;
        }
      }
    } else {
      elements[0].state = "found";
      elements[1].state = "found";
      desc = "✓ Solution: [0, 1] because 2 + 7 = 9";
      explanation = "Algorithm complete! We found that indices 0 and 1 contain values that sum to the target. This solution has O(n²) time complexity.";
      algorithmStep = "return [0, 1]";
    }

    setVizState({ description: desc, explanation, algorithmStep, elements, complexity: "Time: O(n²), Space: O(1)" });
  };

  const visualizeAddTwoNumbers = () => {
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

    if (step === 0) {
      desc = "Two linked lists: [2→4→3] + [5→6→4]";
      explanation = "The linked lists represent numbers in reverse order. [2→4→3] represents 342, and [5→6→4] represents 465. We need to add them digit by digit.";
      algorithmStep = "carry = 0\nresult = []";
    } else if (step <= 3) {
      const idx = step - 1;
      const val1 = l1[idx] || 0;
      const val2 = l2[idx] || 0;
      const prevCarry = idx > 0 ? Math.floor(((l1[idx-1] || 0) + (l2[idx-1] || 0) + (idx > 1 ? 1 : 0)) / 10) : 0;
      const sum = val1 + val2 + (idx === 0 ? 0 : prevCarry);
      
      desc = `Step ${step}: Adding ${val1} + ${val2} + carry(${idx === 0 ? 0 : prevCarry}) = ${result[idx]}`;
      explanation = `At position ${idx}, we add the digits ${val1} and ${val2}` + (idx > 0 ? ` plus carry ${prevCarry}` : '') + `. The sum is ${sum}. We store ${sum % 10} in the result and carry forward ${Math.floor(sum / 10)}.`;
      algorithmStep = `sum = l1[${idx}] + l2[${idx}]` + (idx > 0 ? ` + carry` : '') + `\nresult.append(sum % 10)\ncarry = sum // 10`;
    } else {
      desc = "Result: [7→0→8] representing 807";
      explanation = "Addition complete! The resulting linked list [7→0→8] represents 807, which is indeed 342 + 465. We processed each digit with carry propagation.";
      algorithmStep = "return result  # [7→0→8]";
    }

    setVizState({ 
      description: desc, 
      explanation,
      algorithmStep,
      elements: [
        { list: l1, label: "L1", type: "list" },
        { list: l2, label: "L2", type: "list" },
        { list: result, label: "Result", type: "result", step: currentStep }
      ],
      complexity: "Time: O(max(m,n)), Space: O(max(m,n))"
    });
  };

  const visualizeLongestSubstring = () => {
    const s = "abcabcbb";
    const chars = s.split("");
    const elements = chars.map((char, idx) => ({
      char,
      index: idx,
      state: "default" as const,
    }));

    let desc = 'Longest Substring: Find longest substring without repeating characters';
    let explanation = "";
    let algorithmStep = "";
    
    if (step === 0) {
      desc = 'String: "abcabcbb" - Find longest substring without repeating chars';
      explanation = "We'll use a sliding window approach to find the longest substring with all unique characters. We expand the window by moving the right pointer.";
      algorithmStep = "left = 0\nright = 0\nmax_length = 0\nchar_set = set()";
    } else if (step <= 3) {
      for (let i = 0; i < step; i++) {
        elements[i].state = "window";
      }
      desc = `Window [0, ${step-1}]: "${s.substring(0, step)}" - Length: ${step}`;
      explanation = `Current window contains "${s.substring(0, step)}". All characters are unique so far. We continue expanding the window to find longer substrings.`;
      algorithmStep = `while right < len(s):\n    if s[right] not in char_set:\n        char_set.add(s[right])\n        right += 1\n        max_length = max(max_length, right - left)`;
    } else if (step <= 6) {
      elements[0].state = "found";
      elements[1].state = "found";
      elements[2].state = "found";
      desc = 'Longest found: "abc" with length 3';
      explanation = 'The longest substring without repeating characters is "abc" with a length of 3. When we encounter a duplicate, we would shrink the window from the left.';
      algorithmStep = "max_length = 3  # Found longest";
    } else {
      elements[0].state = "found";
      elements[1].state = "found";
      elements[2].state = "found";
      desc = '✓ Answer: 3 (substring "abc")';
      explanation = 'Algorithm complete! Using the sliding window technique, we found that the longest substring without repeating characters has length 3.';
      algorithmStep = "return max_length  # 3";
    }

    setVizState({ description: desc, explanation, algorithmStep, elements, complexity: "Time: O(n), Space: O(min(m,n))" });
  };

  const visualizeBinarySearch = () => {
    const nums = [-1, 0, 3, 5, 9, 12];
    const target = 9;
    const elements = nums.map((val, idx) => ({
      value: val,
      index: idx,
      state: "default" as const,
    }));

    let left = 0;
    let right = nums.length - 1;
    let desc = `Binary Search: Find target = ${target}`;
    let explanation = "";
    let algorithmStep = "";

    if (step === 0) {
      desc = `Array: [${nums.join(", ")}], Target: ${target}`;
      explanation = "Binary search works on sorted arrays by repeatedly dividing the search space in half. We compare the middle element with the target.";
      algorithmStep = "left = 0\nright = len(nums) - 1";
    } else {
      for (let i = 0; i < step && left <= right; i++) {
        const mid = Math.floor((left + right) / 2);
        
        if (i === step - 1) {
          elements[mid].state = "checking";
          elements[left].state = "range";
          elements[right].state = "range";
          
          if (nums[mid] === target) {
            elements[mid].state = "found";
            desc = `✓ Found ${target} at index ${mid}!`;
            explanation = `The middle element ${nums[mid]} equals our target ${target}. Search complete!`;
            algorithmStep = `if nums[${mid}] == ${target}:\n    return ${mid}`;
          } else if (nums[mid] < target) {
            desc = `Mid ${nums[mid]} < ${target}, search right half`;
            explanation = `The middle element ${nums[mid]} is less than target ${target}, so the target must be in the right half. We update left = mid + 1.`;
            algorithmStep = `if nums[${mid}] < ${target}:\n    left = ${mid} + 1`;
            left = mid + 1;
          } else {
            desc = `Mid ${nums[mid]} > ${target}, search left half`;
            explanation = `The middle element ${nums[mid]} is greater than target ${target}, so the target must be in the left half. We update right = mid - 1.`;
            algorithmStep = `if nums[${mid}] > ${target}:\n    right = ${mid} - 1`;
            right = mid - 1;
          }
        } else {
          if (nums[mid] < target) {
            left = mid + 1;
          } else if (nums[mid] > target) {
            right = mid - 1;
          }
        }
      }
    }

    setVizState({ description: desc, explanation, algorithmStep, elements, complexity: "Time: O(log n), Space: O(1)" });
  };

  const visualizeMergeLists = () => {
    const list1 = [1, 2, 4];
    const list2 = [1, 3, 4];
    const merged: number[] = [];
    
    let i = 0, j = 0;
    for (let s = 0; s < step && (i < list1.length || j < list2.length); s++) {
      if (i >= list1.length) {
        merged.push(list2[j++]);
      } else if (j >= list2.length) {
        merged.push(list1[i++]);
      } else if (list1[i] <= list2[j]) {
        merged.push(list1[i++]);
      } else {
        merged.push(list2[j++]);
      }
    }

    let desc = "Merge Two Sorted Lists";
    let explanation = "";
    let algorithmStep = "";

    if (step === 0) {
      desc = "Lists: [1→2→4] and [1→3→4]";
      explanation = "We have two sorted linked lists. We'll merge them into one sorted list by comparing elements from both lists and choosing the smaller one.";
      algorithmStep = "p1 = list1\np2 = list2\nresult = []";
    } else if (step <= 6) {
      const lastAdded = merged[merged.length - 1];
      desc = `Merging: [${merged.join("→")}]`;
      explanation = `Comparing elements at current positions. We take the smaller element (${lastAdded}) and add it to the result. This maintains sorted order.`;
      algorithmStep = `if p1.val <= p2.val:\n    result.append(p1.val)\n    p1 = p1.next\nelse:\n    result.append(p2.val)\n    p2 = p2.next`;
    } else {
      desc = "✓ Merged: [1→1→2→3→4→4]";
      explanation = "Merge complete! Both lists are now combined into a single sorted linked list containing all elements in ascending order.";
      algorithmStep = "return result  # [1→1→2→3→4→4]";
    }

    setVizState({ 
      description: desc, 
      explanation,
      algorithmStep,
      elements: [
        { list: list1, label: "List1", type: "list", pointer: i },
        { list: list2, label: "List2", type: "list", pointer: j },
        { list: merged, label: "Merged", type: "result" }
      ],
      complexity: "Time: O(m+n), Space: O(1)"
    });
  };

  const visualizeValidParentheses = () => {
    const s = "()[]{}";
    const chars = s.split("");
    const stack: string[] = [];
    
    for (let i = 0; i < Math.min(step, chars.length); i++) {
      const char = chars[i];
      if (char === '(' || char === '[' || char === '{') {
        stack.push(char);
      } else {
        stack.pop();
      }
    }

    let desc = "Valid Parentheses: Check if brackets are balanced";
    let explanation = "";
    let algorithmStep = "";

    if (step === 0) {
      desc = 'String: "()[]{}" - Validate bracket matching';
      explanation = "We use a stack data structure to track opening brackets. When we encounter a closing bracket, we check if it matches the most recent opening bracket.";
      algorithmStep = "stack = []\nfor char in s:";
    } else if (step <= chars.length) {
      const currentChar = chars[step-1];
      const isOpening = ['(', '[', '{'].includes(currentChar);
      desc = `Processing: '${currentChar}' | Stack: [${stack.join(", ")}]`;
      
      if (isOpening) {
        explanation = `Encountered opening bracket '${currentChar}'. We push it onto the stack to match with its corresponding closing bracket later.`;
        algorithmStep = `if char in '([{':\n    stack.append(char)`;
      } else {
        explanation = `Encountered closing bracket '${currentChar}'. We pop from the stack to check if it matches the corresponding opening bracket.`;
        algorithmStep = `else:\n    if not stack or not matches(stack[-1], char):\n        return False\n    stack.pop()`;
      }
    } else {
      desc = "✓ Valid! All brackets matched correctly";
      explanation = "The stack is empty, meaning all opening brackets found their matching closing brackets in the correct order. The string is valid!";
      algorithmStep = "return len(stack) == 0  # True";
    }

    setVizState({ 
      description: desc, 
      explanation,
      algorithmStep,
      elements: [
        { chars, currentIndex: Math.min(step, chars.length) },
        { stack, type: "stack" }
      ],
      complexity: "Time: O(n), Space: O(n)"
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  const handleStepForward = () => {
    if (step < maxSteps) {
      setStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            LeetCode Problem Visualizer
          </h1>
          <p className="text-lg text-muted-foreground">
            Watch solutions come to life with step-by-step visualizations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Problem</label>
                <Select value={problemId} onValueChange={(val) => setProblemId(val as ProblemId)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {problems.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {problem && (
                <div className="pt-2 pb-4 border-b">
                  <div className="text-xs text-muted-foreground mb-1">Difficulty</div>
                  <div className={`text-sm font-medium ${
                    problem.difficulty === 'Easy' ? 'text-green-600 dark:text-green-400' :
                    problem.difficulty === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {problem.difficulty}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Speed: {speed}%
                </label>
                <Slider
                  value={[speed]}
                  onValueChange={(val) => setSpeed(val[0])}
                  min={1}
                  max={100}
                  step={1}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-full"
                  variant={isPlaying ? "secondary" : "default"}
                  disabled={step >= maxSteps}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Play
                    </>
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button onClick={handleStepBackward} variant="outline" className="flex-1" disabled={step === 0}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleStepForward} variant="outline" className="flex-1" disabled={step >= maxSteps}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <Button onClick={handleReset} variant="outline" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground mb-1">Progress</div>
                <div className="text-sm font-medium mb-2">
                  Step {step} / {maxSteps}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / maxSteps) * 100}%` }}
                  />
                </div>
              </div>

              {vizState.complexity && (
                <div className="pt-4 border-t">
                  <div className="text-xs text-muted-foreground mb-2">Complexity</div>
                  <div className="text-xs font-mono bg-muted p-2 rounded">
                    {vizState.complexity}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            <Card className="p-8">
              <div className="min-h-[400px] flex items-center justify-center">
                <VisualizationRenderer problemId={problemId} vizState={vizState} />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">What's Happening?</h3>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`desc-${step}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-muted-foreground mb-3 font-medium">
                      {vizState.description}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {vizState.explanation}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Algorithm Step</h3>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`code-${step}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto">
                      <code>{vizState.algorithmStep}</code>
                    </pre>
                  </motion.div>
                </AnimatePresence>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function VisualizationRenderer({ problemId, vizState }: { problemId: ProblemId; vizState: VisualizationState }) {
  if (problemId === "1") {
    // Two Sum visualization
    return (
      <div className="w-full flex flex-col items-center gap-8">
        <div className="flex gap-3 items-end">
          {vizState.elements.map((item, idx) => {
            const colors = {
              default: "bg-primary/60 border-primary",
              checking: "bg-blue-500 border-blue-600",
              found: "bg-green-500 border-green-600",
            };
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-20 h-20 ${colors[item.state]} border-2 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ${item.state !== 'default' ? 'scale-110 shadow-lg' : ''}`}
                >
                  {item.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  [{item.index}]
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (problemId === "2" || problemId === "5") {
    // Linked List visualization
    return (
      <div className="w-full flex flex-col gap-8">
        {vizState.elements.map((listData: any, listIdx) => (
          <div key={listIdx} className="flex flex-col gap-3">
            <div className="text-sm font-medium text-muted-foreground">{listData.label}</div>
            <div className="flex items-center gap-2">
              {listData.list.map((val: number, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-14 h-14 ${listData.type === 'result' ? 'bg-green-500' : 'bg-primary'} rounded-lg flex items-center justify-center text-white font-semibold border-2 ${listData.pointer === idx ? 'ring-4 ring-blue-400' : ''}`}>
                    {val}
                  </div>
                  {idx < listData.list.length - 1 && (
                    <div className="text-muted-foreground">→</div>
                  )}
                </div>
              ))}
              {listData.list.length === 0 && (
                <div className="text-muted-foreground italic">empty</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (problemId === "3") {
    // Longest Substring visualization
    return (
      <div className="w-full flex justify-center">
        <div className="flex gap-2">
          {vizState.elements.map((item, idx) => {
            const colors = {
              default: "bg-muted text-foreground",
              window: "bg-blue-500 text-white",
              found: "bg-green-500 text-white",
            };
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 ${colors[item.state]} rounded-lg flex items-center justify-center font-mono font-bold text-lg transition-all duration-300`}>
                  {item.char}
                </div>
                <div className="text-xs text-muted-foreground">{item.index}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (problemId === "4") {
    // Binary Search visualization
    return (
      <div className="w-full flex justify-center">
        <div className="flex gap-3">
          {vizState.elements.map((item, idx) => {
            const colors = {
              default: "bg-muted border-border",
              range: "bg-blue-500/20 border-blue-500",
              checking: "bg-purple-500 border-purple-600 scale-110 shadow-lg",
              found: "bg-green-500 border-green-600 scale-110 shadow-lg",
            };
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 ${colors[item.state]} border-2 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${item.state === 'checking' || item.state === 'found' ? 'text-white' : ''}`}>
                  {item.value}
                </div>
                <div className="text-xs text-muted-foreground">[{item.index}]</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (problemId === "6") {
    // Valid Parentheses visualization
    const [charsData, stackData] = vizState.elements;
    return (
      <div className="w-full flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm font-medium text-muted-foreground">Input String</div>
          <div className="flex gap-2">
            {charsData?.chars?.map((char: string, idx: number) => (
              <div 
                key={idx} 
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-lg ${
                  idx < charsData.currentIndex 
                    ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400' 
                    : 'bg-muted border-border'
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-sm font-medium text-muted-foreground">Stack</div>
          <div className="flex flex-col-reverse gap-2 min-h-[100px] justify-end">
            {stackData?.stack?.length > 0 ? (
              stackData.stack.map((item: string, idx: number) => (
                <div 
                  key={idx}
                  className="w-16 h-12 bg-primary rounded-lg border-2 border-primary flex items-center justify-center font-mono font-bold text-lg text-white"
                >
                  {item}
                </div>
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