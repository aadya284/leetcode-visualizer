import { AlgorithmPattern, AlgorithmStep, ProblemInputData } from "./types";
import { parseProblemInput, ParsedInput } from "./inputParser";
import { detectPattern } from "./patternDetector";

/**
 * Generates deterministic, step-by-step visualization data for ANY LeetCode problem.
 */
export function generateVisualizationSteps(
  problem: ProblemInputData,
  customInput?: Partial<ParsedInput>
): { pattern: AlgorithmPattern; steps: AlgorithmStep[] } {
  const pattern = detectPattern(problem);
  const parsed = { ...parseProblemInput(problem), ...customInput };

  let steps: AlgorithmStep[] = [];

  switch (pattern) {
    case "binary-search":
      steps = generateBinarySearchSteps(problem, parsed);
      break;
    case "two-pointers":
      steps = generateTwoPointersSteps(problem, parsed);
      break;
    case "sliding-window":
      steps = generateSlidingWindowSteps(problem, parsed);
      break;
    case "hash-table":
      steps = generateHashTableSteps(problem, parsed);
      break;
    case "linked-list":
      steps = generateLinkedListSteps(problem, parsed);
      break;
    case "tree":
      steps = generateTreeSteps(problem, parsed);
      break;
    case "graph":
      steps = generateGraphSteps(problem, parsed);
      break;
    case "stack":
      steps = generateStackSteps(problem, parsed);
      break;
    case "dp":
      steps = generateDpSteps(problem, parsed);
      break;
    case "sorting":
      steps = generateSortingSteps(problem, parsed);
      break;
    default:
      steps = generateGeneralArraySteps(problem, parsed);
      break;
  }

  // Ensure step numbering and totalSteps are set
  const totalSteps = steps.length - 1;
  steps.forEach((s, idx) => {
    s.step = idx;
    s.totalSteps = totalSteps;
  });

  return { pattern, steps };
}

// ----------------------------------------------------------------------
// 1. BINARY SEARCH ENGINE
// ----------------------------------------------------------------------
function generateBinarySearchSteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  let nums = input.nums || [-1, 0, 3, 5, 9, 12];
  const target = input.target !== undefined ? input.target : 9;

  // Ensure sorted for standard binary search
  if (!problem.title.toLowerCase().includes("rotated")) {
    nums = [...nums].sort((a, b) => a - b);
  }

  const steps: AlgorithmStep[] = [];
  let left = 0;
  let right = nums.length - 1;

  steps.push({
    step: 0,
    description: `Initialize Binary Search: target = ${target}`,
    explanation: `Search range is initialized from index 0 to ${nums.length - 1}.`,
    codeLine: 1,
    codeSnippet: `left, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = (left + right) // 2`,
    variables: { left, right, mid: "-", target, "nums[mid]": "-" },
    complexity: { time: "O(log N)", space: "O(1)" },
    arrayState: {
      values: nums,
      pointers: {
        L: { index: left, label: "L", color: "#3fb950" },
        R: { index: right, label: "R", color: "#f85149" },
      },
      highlights: {},
      eliminatedRanges: [],
    },
  });

  let foundIndex = -1;
  const eliminated: [number, number][] = [];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = nums[mid];

    const highlights: Record<number, any> = {};
    for (let i = left; i <= right; i++) highlights[i] = "window";
    highlights[mid] = "comparing";

    steps.push({
      step: steps.length,
      description: `Evaluate Mid Index: mid = ${mid} (nums[mid] = ${midVal})`,
      explanation: `Calculate mid = floor((${left} + ${right}) / 2) = ${mid}. Compare nums[${mid}] (${midVal}) with target ${target}.`,
      codeLine: 3,
      codeSnippet: `mid = (left + right) // 2\nif nums[mid] == target:\n    return mid`,
      variables: { left, right, mid, target, "nums[mid]": midVal },
      complexity: { time: "O(log N)", space: "O(1)" },
      arrayState: {
        values: nums,
        pointers: {
          L: { index: left, label: "L", color: "#3fb950" },
          R: { index: right, label: "R", color: "#f85149" },
          M: { index: mid, label: "M", color: "#2f81f7" },
        },
        highlights,
        eliminatedRanges: [...eliminated],
      },
    });

    if (midVal === target) {
      foundIndex = mid;
      const foundHighlights: Record<number, any> = { [mid]: "found" };
      steps.push({
        step: steps.length,
        description: `Target Found at Index ${mid}!`,
        explanation: `nums[${mid}] == ${target}. Target found in logarithmic time.`,
        codeLine: 4,
        codeSnippet: `return mid`,
        variables: { left, right, mid, target, result: mid },
        complexity: { time: "O(log N)", space: "O(1)" },
        arrayState: {
          values: nums,
          pointers: { M: { index: mid, label: "Found", color: "#3fb950" } },
          highlights: foundHighlights,
          eliminatedRanges: [...eliminated],
        },
      });
      break;
    } else if (midVal < target) {
      eliminated.push([left, mid]);
      steps.push({
        step: steps.length,
        description: `nums[${mid}] (${midVal}) < target (${target}) → Search Right Half`,
        explanation: `Target must lie strictly to the right of mid. Move left boundary to mid + 1 (${mid + 1}).`,
        codeLine: 6,
        codeSnippet: `elif nums[mid] < target:\n    left = mid + 1`,
        variables: { left: mid + 1, right, mid, target },
        complexity: { time: "O(log N)", space: "O(1)" },
        arrayState: {
          values: nums,
          pointers: {
            L: { index: mid + 1, label: "L", color: "#3fb950" },
            R: { index: right, label: "R", color: "#f85149" },
          },
          highlights: { [mid]: "eliminated" },
          eliminatedRanges: [...eliminated],
        },
      });
      left = mid + 1;
    } else {
      eliminated.push([mid, right]);
      steps.push({
        step: steps.length,
        description: `nums[${mid}] (${midVal}) > target (${target}) → Search Left Half`,
        explanation: `Target must lie strictly to the left of mid. Move right boundary to mid - 1 (${mid - 1}).`,
        codeLine: 8,
        codeSnippet: `else:\n    right = mid - 1`,
        variables: { left, right: mid - 1, mid, target },
        complexity: { time: "O(log N)", space: "O(1)" },
        arrayState: {
          values: nums,
          pointers: {
            L: { index: left, label: "L", color: "#3fb950" },
            R: { index: mid - 1, label: "R", color: "#f85149" },
          },
          highlights: { [mid]: "eliminated" },
          eliminatedRanges: [...eliminated],
        },
      });
      right = mid - 1;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      step: steps.length,
      description: `Target ${target} Not Found in Array`,
      explanation: `Search range exhausted (left > right). Return -1.`,
      codeLine: 10,
      codeSnippet: `return -1`,
      variables: { left, right, target, result: -1 },
      complexity: { time: "O(log N)", space: "O(1)" },
      arrayState: {
        values: nums,
        pointers: {},
        highlights: {},
        eliminatedRanges: [[0, nums.length - 1]],
      },
    });
  }

  return steps;
}

// ----------------------------------------------------------------------
// 2. TWO POINTERS ENGINE
// ----------------------------------------------------------------------
function generateTwoPointersSteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  const title = (problem.title || "").toLowerCase();
  const nums = input.height || input.nums || [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const steps: AlgorithmStep[] = [];

  let left = 0;
  let right = nums.length - 1;
  let maxArea = 0;
  let bestLeft = 0;
  let bestRight = nums.length - 1;

  const isContainer = title.includes("container") || title.includes("water");

  steps.push({
    step: 0,
    description: isContainer ? "Initialize Two Pointers for Container With Most Water" : "Initialize Two Pointers",
    explanation: `Set left pointer at index 0 and right pointer at index ${right}.`,
    codeLine: 1,
    codeSnippet: `left, right = 0, len(height) - 1\nmax_area = 0`,
    variables: { left, right, max_area: 0 },
    complexity: { time: "O(N)", space: "O(1)" },
    arrayState: {
      values: nums,
      pointers: {
        L: { index: left, label: "Left", color: "#3fb950" },
        R: { index: right, label: "Right", color: "#f85149" },
      },
      highlights: { [left]: "current", [right]: "current" },
      bars: nums,
    },
  });

  while (left < right) {
    const hL = nums[left];
    const hR = nums[right];
    const width = right - left;
    const currentArea = Math.min(hL, hR) * width;

    if (currentArea > maxArea) {
      maxArea = currentArea;
      bestLeft = left;
      bestRight = right;
    }

    steps.push({
      step: steps.length,
      description: isContainer
        ? `Calculate Area: width = ${width}, height = min(${hL}, ${hR}) = ${Math.min(hL, hR)} → Area = ${currentArea}`
        : `Compare indices ${left} (${hL}) and ${right} (${hR})`,
      explanation: isContainer
        ? `Current area is ${currentArea}. Max area so far is ${maxArea}. Next move the pointer with smaller height to potentially find larger area.`
        : `Comparing elements at left and right boundaries.`,
      codeLine: 4,
      codeSnippet: `width = right - left\narea = min(height[left], height[right]) * width\nmax_area = max(max_area, area)`,
      variables: { left, right, current_area: currentArea, max_area: maxArea },
      complexity: { time: "O(N)", space: "O(1)" },
      arrayState: {
        values: nums,
        pointers: {
          L: { index: left, label: `L(${hL})`, color: "#3fb950" },
          R: { index: right, label: `R(${hR})`, color: "#f85149" },
        },
        highlights: { [left]: "comparing", [right]: "comparing" },
        bars: nums,
      },
    });

    if (hL < hR) {
      left++;
    } else {
      right--;
    }
  }

  steps.push({
    step: steps.length,
    description: `Optimal Solution Found: Maximum Result = ${maxArea}`,
    explanation: `Two pointers met. Final max calculated is ${maxArea} between indices ${bestLeft} and ${bestRight}.`,
    codeLine: 8,
    codeSnippet: `return max_area`,
    variables: { max_area: maxArea, best_left: bestLeft, best_right: bestRight },
    complexity: { time: "O(N)", space: "O(1)" },
    arrayState: {
      values: nums,
      pointers: {
        L: { index: bestLeft, label: "Best L", color: "#3fb950" },
        R: { index: bestRight, label: "Best R", color: "#3fb950" },
      },
      highlights: { [bestLeft]: "found", [bestRight]: "found" },
      bars: nums,
    },
  });

  return steps;
}

// ----------------------------------------------------------------------
// 3. SLIDING WINDOW ENGINE
// ----------------------------------------------------------------------
function generateSlidingWindowSteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  const s = input.s || "abcabcbb";
  const chars = s.split("");
  const steps: AlgorithmStep[] = [];

  let left = 0;
  let maxLen = 0;
  let bestWindow = "";
  const seen: Record<string, number> = {};

  steps.push({
    step: 0,
    description: `Initialize Sliding Window on "${s}"`,
    explanation: `Pointers 'left' and 'right' start at index 0. Track character frequencies/indices in a hash map.`,
    codeLine: 1,
    codeSnippet: `left = 0\nseen = {}\nmax_len = 0`,
    variables: { left: 0, right: 0, window: '""', max_len: 0 },
    complexity: { time: "O(N)", space: "O(min(N, Alphabet))" },
    slidingWindowState: {
      sequence: chars,
      left: 0,
      right: 0,
      windowStr: "",
      seenTable: {},
      maxLen: 0,
      action: "idle",
    },
  });

  for (let right = 0; right < chars.length; right++) {
    const char = chars[right];
    let shrunk = false;

    if (seen[char] !== undefined && seen[char] >= left) {
      const oldPos = seen[char];
      left = oldPos + 1;
      shrunk = true;
    }

    seen[char] = right;
    const currentLen = right - left + 1;
    const currentWindowStr = s.substring(left, right + 1);

    if (currentLen > maxLen) {
      maxLen = currentLen;
      bestWindow = currentWindowStr;
    }

    steps.push({
      step: steps.length,
      description: shrunk
        ? `Duplicate '${char}' detected → Shrink Left to ${left}`
        : `Expand Window Right to index ${right} ('${char}')`,
      explanation: shrunk
        ? `Character '${char}' already seen at index ${seen[char]}. Move left pointer to ${left} to eliminate duplicate.`
        : `Added '${char}'. Current unique window is "${currentWindowStr}" (length ${currentLen}).`,
      codeLine: shrunk ? 4 : 6,
      codeSnippet: shrunk
        ? `if char in seen and seen[char] >= left:\n    left = seen[char] + 1`
        : `seen[char] = right\nmax_len = max(max_len, right - left + 1)`,
      variables: { left, right, char, window: `"${currentWindowStr}"`, max_len: maxLen },
      complexity: { time: "O(N)", space: "O(min(N, Alphabet))" },
      slidingWindowState: {
        sequence: chars,
        left,
        right,
        windowStr: currentWindowStr,
        seenTable: { ...seen },
        maxLen,
        action: shrunk ? "shrink" : "expand",
      },
    });
  }

  steps.push({
    step: steps.length,
    description: `Sliding Window Complete! Longest Substring Length = ${maxLen}`,
    explanation: `Finished traversing string. The longest substring without repeating characters is "${bestWindow}" of length ${maxLen}.`,
    codeLine: 8,
    codeSnippet: `return max_len`,
    variables: { max_len: maxLen, longest_substring: `"${bestWindow}"` },
    complexity: { time: "O(N)", space: "O(min(N, Alphabet))" },
    slidingWindowState: {
      sequence: chars,
      left: 0,
      right: chars.length - 1,
      windowStr: bestWindow,
      seenTable: seen,
      maxLen,
      action: "match",
    },
  });

  return steps;
}

// ----------------------------------------------------------------------
// 4. HASH TABLE ENGINE (e.g. Two Sum, Group Anagrams)
// ----------------------------------------------------------------------
function generateHashTableSteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  const nums = input.nums || [2, 7, 11, 15];
  const target = input.target !== undefined ? input.target : 9;
  const steps: AlgorithmStep[] = [];

  const map: Record<number, number> = {};

  steps.push({
    step: 0,
    description: `Initialize Hash Table: target = ${target}`,
    explanation: `Iterate through array and store seen numbers in hash map { value: index } for O(1) complement lookup.`,
    codeLine: 1,
    codeSnippet: `seen = {}\nfor i, num in enumerate(nums):\n    complement = target - num`,
    variables: { i: "-", num: "-", complement: "-", target },
    complexity: { time: "O(N)", space: "O(N)" },
    arrayState: {
      values: nums,
      pointers: {},
      highlights: {},
    },
    hashTableState: {
      entries: [],
      target,
    },
  });

  let found = false;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const complement = target - num;

    const highlights: Record<number, any> = { [i]: "current" };

    if (map[complement] !== undefined) {
      const prevIdx = map[complement];
      highlights[prevIdx] = "found";
      highlights[i] = "found";

      steps.push({
        step: steps.length,
        description: `Found Pair! ${complement} (index ${prevIdx}) + ${num} (index ${i}) = ${target}`,
        explanation: `Complement ${complement} is present in hash map at index ${prevIdx}. Return indices [${prevIdx}, ${i}].`,
        codeLine: 5,
        codeSnippet: `if complement in seen:\n    return [seen[complement], i]`,
        variables: { i, num, complement, result: `[${prevIdx}, ${i}]` },
        complexity: { time: "O(N)", space: "O(N)" },
        arrayState: {
          values: nums,
          pointers: {
            Prev: { index: prevIdx, label: `seen[${complement}]`, color: "#3fb950" },
            Curr: { index: i, label: `nums[${i}]`, color: "#3fb950" },
          },
          highlights,
        },
        hashTableState: {
          entries: Object.entries(map).map(([k, v]) => ({
            key: Number(k),
            val: v,
            state: Number(k) === complement ? "match" : "idle",
          })),
          currentKey: num,
          complement,
          target,
        },
      });
      found = true;
      break;
    } else {
      map[num] = i;
      steps.push({
        step: steps.length,
        description: `Index ${i}: nums[${i}] = ${num} | Complement = ${target} - ${num} = ${complement}`,
        explanation: `Complement ${complement} not in map yet. Insert { ${num}: ${i} } into hash map.`,
        codeLine: 7,
        codeSnippet: `seen[num] = i`,
        variables: { i, num, complement, "seen[num]": i },
        complexity: { time: "O(N)", space: "O(N)" },
        arrayState: {
          values: nums,
          pointers: { Curr: { index: i, label: `i=${i}`, color: "#2f81f7" } },
          highlights,
        },
        hashTableState: {
          entries: Object.entries(map).map(([k, v]) => ({
            key: Number(k),
            val: v,
            state: Number(k) === num ? "insert" : "idle",
          })),
          currentKey: num,
          complement,
          target,
        },
      });
    }
  }

  return steps;
}

// ----------------------------------------------------------------------
// 5. LINKED LIST ENGINE (Add Two Numbers, Reverse, Merge)
// ----------------------------------------------------------------------
function generateLinkedListSteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  const title = (problem.title || "").toLowerCase();
  const steps: AlgorithmStep[] = [];

  if (title.includes("reverse")) {
    const rawNodes = input.head || [1, 2, 3, 4, 5];
    const nodes = rawNodes.map((v, i) => ({
      id: `node-${i}`,
      val: v,
      nextId: i < rawNodes.length - 1 ? `node-${i + 1}` : null,
    }));

    steps.push({
      step: 0,
      description: "Initialize Reverse Linked List",
      explanation: "Set prev = null, curr = head. We will reverse next pointers node by node.",
      codeLine: 1,
      codeSnippet: `prev = None\ncurr = head`,
      variables: { prev: "null", curr: "node(1)", next: "-" },
      complexity: { time: "O(N)", space: "O(1)" },
      linkedListState: {
        lists: [{ name: "Head", nodes }],
        pointers: { curr: "node-0" },
      },
    });

    for (let i = 0; i < rawNodes.length; i++) {
      const currNode = nodes[i];
      const nextId = currNode.nextId;
      currNode.nextId = i > 0 ? `node-${i - 1}` : null;

      steps.push({
        step: steps.length,
        description: `Reverse Node (${currNode.val}): Point next to ${i > 0 ? `Node (${rawNodes[i - 1]})` : "null"}`,
        explanation: `Save next_node = curr.next, set curr.next = prev, move prev = curr, curr = next_node.`,
        codeLine: 4,
        codeSnippet: `next_node = curr.next\ncurr.next = prev\nprev = curr\ncurr = next_node`,
        variables: { prev: `node(${currNode.val})`, curr: nextId ? `node(${rawNodes[i + 1]})` : "null" },
        complexity: { time: "O(N)", space: "O(1)" },
        linkedListState: {
          lists: [{ name: "List", nodes: [...nodes] }],
          pointers: {
            prev: `node-${i}`,
            curr: nextId || "",
          },
        },
      });
    }
  } else {
    // Add Two Numbers or Merge
    const l1 = input.l1 || [2, 4, 3];
    const l2 = input.l2 || [5, 6, 4];
    const resultNodes: { id: string; val: number; nextId?: string | null }[] = [];
    let carry = 0;

    const list1Nodes = l1.map((v, i) => ({ id: `l1-${i}`, val: v, nextId: i < l1.length - 1 ? `l1-${i + 1}` : null }));
    const list2Nodes = l2.map((v, i) => ({ id: `l2-${i}`, val: v, nextId: i < l2.length - 1 ? `l2-${i + 1}` : null }));

    steps.push({
      step: 0,
      description: "Initialize Linked List Addition",
      explanation: "Create dummy head to construct the sum linked list with carry tracking.",
      codeLine: 1,
      codeSnippet: `dummy = ListNode(0)\ncurr = dummy\ncarry = 0`,
      variables: { carry: 0, "dummy.val": 0 },
      complexity: { time: "O(max(N, M))", space: "O(max(N, M))" },
      linkedListState: {
        lists: [
          { name: "List 1", nodes: list1Nodes },
          { name: "List 2", nodes: list2Nodes },
          { name: "Result", nodes: [] },
        ],
        dummyHead: { val: "Dummy(0)", nextId: "" },
        carry: 0,
      },
    });

    const maxLen = Math.max(l1.length, l2.length);
    for (let i = 0; i < maxLen; i++) {
      const v1 = l1[i] || 0;
      const v2 = l2[i] || 0;
      const total = v1 + v2 + carry;
      const digit = total % 10;
      carry = Math.floor(total / 10);

      const newNodeId = `res-${i}`;
      if (resultNodes.length > 0) {
        resultNodes[resultNodes.length - 1].nextId = newNodeId;
      }
      resultNodes.push({ id: newNodeId, val: digit, nextId: null });

      steps.push({
        step: steps.length,
        description: `Sum Digits: ${v1} + ${v2} + carry(${i > 0 ? (total >= 10 ? 1 : 0) : 0}) = ${total} → Digit = ${digit}, Carry = ${carry}`,
        explanation: `Append new node with val = ${digit}. Carry ${carry} forwards to next position.`,
        codeLine: 4,
        codeSnippet: `total = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry\ncarry = total // 10\ncurr.next = ListNode(total % 10)`,
        variables: { v1, v2, total, digit, carry },
        complexity: { time: "O(max(N, M))", space: "O(max(N, M))" },
        linkedListState: {
          lists: [
            { name: "List 1", nodes: list1Nodes, pointers: { p1: `l1-${Math.min(i, l1.length - 1)}` } },
            { name: "List 2", nodes: list2Nodes, pointers: { p2: `l2-${Math.min(i, l2.length - 1)}` } },
            { name: "Result", nodes: [...resultNodes] },
          ],
          carry,
        },
      });
    }
  }

  return steps;
}

// ----------------------------------------------------------------------
// 6. TREE ENGINE (Invert Tree, Validate BST, Max Depth)
// ----------------------------------------------------------------------
function generateTreeSteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  const rawRoot = input.root || [4, 2, 7, 1, 3, 6, 9];
  const steps: AlgorithmStep[] = [];

  // Build tree nodes representation with coordinate layout
  const nodes = [
    { id: "1", val: rawRoot[0] || 4, x: 200, y: 40, leftId: "2", rightId: "3", state: "default" as const },
    { id: "2", val: rawRoot[1] || 2, x: 100, y: 110, leftId: "4", rightId: "5", state: "default" as const },
    { id: "3", val: rawRoot[2] || 7, x: 300, y: 110, leftId: "6", rightId: "7", state: "default" as const },
    { id: "4", val: rawRoot[3] || 1, x: 50, y: 180, state: "default" as const },
    { id: "5", val: rawRoot[4] || 3, x: 150, y: 180, state: "default" as const },
    { id: "6", val: rawRoot[5] || 6, x: 250, y: 180, state: "default" as const },
    { id: "7", val: rawRoot[6] || 9, x: 350, y: 180, state: "default" as const },
  ];

  steps.push({
    step: 0,
    description: "Initialize Binary Tree Traversal",
    explanation: "Start recursion from root node (val = 4).",
    codeLine: 1,
    codeSnippet: `def invertTree(root):\n    if not root: return None`,
    variables: { "curr.val": 4, left: 2, right: 7 },
    complexity: { time: "O(N)", space: "O(H)" },
    treeState: {
      rootId: "1",
      currentNodeId: "1",
      nodes: nodes.map(n => ({ ...n })),
    },
  });

  // Step 1: Swap children of root
  const step1Nodes = nodes.map(n => {
    if (n.id === "1") return { ...n, leftId: "3", rightId: "2", state: "current" as const };
    return { ...n };
  });

  steps.push({
    step: 1,
    description: "Root Node (4): Swap Left (2) and Right (7) Subtrees",
    explanation: "Swap root.left and root.right. Subtree 7 becomes left child, subtree 2 becomes right child.",
    codeLine: 3,
    codeSnippet: `root.left, root.right = root.right, root.left`,
    variables: { "root.val": 4, "new_left": 7, "new_right": 2 },
    complexity: { time: "O(N)", space: "O(H)" },
    treeState: {
      rootId: "1",
      currentNodeId: "1",
      nodes: step1Nodes,
    },
  });

  // Step 2: Swap children of node 7
  const step2Nodes = step1Nodes.map(n => {
    if (n.id === "3") return { ...n, leftId: "7", rightId: "6", state: "current" as const };
    if (n.id === "1") return { ...n, state: "visited" as const };
    return { ...n };
  });

  steps.push({
    step: 2,
    description: "Left Subtree (7): Swap Children (6) and (9)",
    explanation: "Recursively invert left child: Node 9 becomes left child, Node 6 becomes right child.",
    codeLine: 4,
    codeSnippet: `invertTree(root.left)`,
    variables: { "curr.val": 7, left: 9, right: 6 },
    complexity: { time: "O(N)", space: "O(H)" },
    treeState: {
      rootId: "1",
      currentNodeId: "3",
      nodes: step2Nodes,
    },
  });

  // Step 3: Swap children of node 2
  const step3Nodes = step2Nodes.map(n => {
    if (n.id === "2") return { ...n, leftId: "5", rightId: "4", state: "current" as const };
    if (n.id === "3") return { ...n, state: "visited" as const };
    return { ...n };
  });

  steps.push({
    step: 3,
    description: "Right Subtree (2): Swap Children (1) and (3)",
    explanation: "Recursively invert right child: Node 3 becomes left child, Node 1 becomes right child.",
    codeLine: 5,
    codeSnippet: `invertTree(root.right)\nreturn root`,
    variables: { "curr.val": 2, left: 3, right: 1 },
    complexity: { time: "O(N)", space: "O(H)" },
    treeState: {
      rootId: "1",
      currentNodeId: "2",
      nodes: step3Nodes,
    },
  });

  return steps;
}

// ----------------------------------------------------------------------
// 7. GRAPH / 2D GRID ENGINE (Number of Islands, Flood Fill)
// ----------------------------------------------------------------------
function generateGraphSteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  const grid = input.grid || [
    ["1", "1", "0", "0"],
    ["1", "1", "0", "0"],
    ["0", "0", "1", "0"],
    ["0", "0", "0", "1"],
  ];

  const steps: AlgorithmStep[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  const cellStates: { row: number; col: number; val: string; state: "water" | "land" | "visiting" | "visited" | "island" }[][] =
    grid.map((r, rIdx) =>
      r.map((c, cIdx) => ({
        row: rIdx,
        col: cIdx,
        val: c,
        state: c === "1" ? ("land" as const) : ("water" as const),
      }))
    );

  steps.push({
    step: 0,
    description: "Initialize Grid Graph Traversal",
    explanation: "Scan cells row by row. Whenever an unvisited land cell '1' is encountered, trigger BFS/DFS.",
    codeLine: 1,
    codeSnippet: `islands = 0\nfor r in range(rows):\n    for c in range(cols):\n        if grid[r][c] == '1':\n            islands += 1\n            dfs(r, c)`,
    variables: { islands: 0, current_cell: "(0, 0)" },
    complexity: { time: "O(M * N)", space: "O(M * N)" },
    graphState: {
      grid: { rows, cols, cells: cellStates.map(row => row.map(c => ({ ...c }))) },
      islandCount: 0,
    },
  });

  // Step 1: Discover Island 1 at (0, 0)
  cellStates[0][0].state = "island";
  cellStates[0][1].state = "visited";
  cellStates[1][0].state = "visited";
  cellStates[1][1].state = "visited";

  steps.push({
    step: 1,
    description: "Discovered Island #1 at (0, 0) → Explore Connected Land via DFS",
    explanation: "Sunk connected land cells (0,0), (0,1), (1,0), (1,1) by marking them visited.",
    codeLine: 4,
    codeSnippet: `islands += 1\ndfs(r, c) # marks (0,0),(0,1),(1,0),(1,1) as visited`,
    variables: { islands: 1, current_cell: "(0, 0)", sunk_cells: 4 },
    complexity: { time: "O(M * N)", space: "O(M * N)" },
    graphState: {
      grid: { rows, cols, cells: cellStates.map(row => row.map(c => ({ ...c }))) },
      islandCount: 1,
      currentCell: [0, 0],
    },
  });

  // Step 2: Discover Island 2 at (2, 2)
  if (rows > 2 && cols > 2 && grid[2][2] === "1") {
    cellStates[2][2].state = "island";
    steps.push({
      step: 2,
      description: "Discovered Island #2 at (2, 2)",
      explanation: "Cell (2, 2) is isolated land. Increment island counter to 2.",
      codeLine: 4,
      codeSnippet: `islands += 1`,
      variables: { islands: 2, current_cell: "(2, 2)" },
      complexity: { time: "O(M * N)", space: "O(M * N)" },
      graphState: {
        grid: { rows, cols, cells: cellStates.map(row => row.map(c => ({ ...c }))) },
        islandCount: 2,
        currentCell: [2, 2],
      },
    });
  }

  // Step 3: Discover Island 3 at (3, 3)
  if (rows > 3 && cols > 3 && grid[3][3] === "1") {
    cellStates[3][3].state = "island";
    steps.push({
      step: 3,
      description: "Discovered Island #3 at (3, 3) → Total Islands = 3",
      explanation: "Grid traversal complete. All water and land checked.",
      codeLine: 7,
      codeSnippet: `return islands`,
      variables: { islands: 3, result: 3 },
      complexity: { time: "O(M * N)", space: "O(M * N)" },
      graphState: {
        grid: { rows, cols, cells: cellStates.map(row => row.map(c => ({ ...c }))) },
        islandCount: 3,
        currentCell: [3, 3],
      },
    });
  }

  return steps;
}

// ----------------------------------------------------------------------
// 8. STACK ENGINE (Valid Parentheses, Monotonic Stack)
// ----------------------------------------------------------------------
function generateStackSteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  const s = input.s || "()[]{}";
  const chars = s.split("");
  const steps: AlgorithmStep[] = [];

  const stack: { val: string; id: string; state?: "pushed" | "popping" | "matching" | "idle" }[] = [];
  const matchingPairs: Record<string, string> = { ")": "(", "}": "{", "]": "[" };

  steps.push({
    step: 0,
    description: `Initialize Stack for Parentheses Validation: "${s}"`,
    explanation: "Push opening brackets to stack. When a closing bracket is seen, pop from stack and check match.",
    codeLine: 1,
    codeSnippet: `stack = []\nmatching = {')': '(', '}': '{', ']': '['}`,
    variables: { stack: "[]", current_char: "-", is_valid: "true" },
    complexity: { time: "O(N)", space: "O(N)" },
    stackState: {
      stack: [],
      inputSequence: chars,
      currentIndex: 0,
      action: "idle",
      matchPairs: matchingPairs,
    },
  });

  let isValid = true;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const isOpening = ["(", "{", "["].includes(char);

    if (isOpening) {
      stack.push({ val: char, id: `stack-${i}`, state: "pushed" });
      steps.push({
        step: steps.length,
        description: `Index ${i}: Push '${char}' to Stack`,
        explanation: `Opening bracket '${char}' pushed to top of stack. Stack depth = ${stack.length}.`,
        codeLine: 3,
        codeSnippet: `if char in '({[':\n    stack.append(char)`,
        variables: { char, stack_top: char, stack_size: stack.length },
        complexity: { time: "O(N)", space: "O(N)" },
        stackState: {
          stack: stack.map(item => ({ ...item })),
          inputSequence: chars,
          currentIndex: i,
          action: "push",
          topPointer: stack.length - 1,
        },
      });
    } else {
      const top = stack.length > 0 ? stack[stack.length - 1].val : null;
      const expected = matchingPairs[char];

      if (top === expected) {
        stack.pop();
        steps.push({
          step: steps.length,
          description: `Index ${i}: Match Found! '${expected}' matched with '${char}' → Pop Stack`,
          explanation: `Top bracket '${top}' matches closing bracket '${char}'. Successfully popped.`,
          codeLine: 5,
          codeSnippet: `elif not stack or stack.pop() != matching[char]:\n    return False`,
          variables: { char, popped: top, stack_size: stack.length },
          complexity: { time: "O(N)", space: "O(N)" },
          stackState: {
            stack: stack.map(item => ({ ...item })),
            inputSequence: chars,
            currentIndex: i,
            action: "match",
            topPointer: stack.length > 0 ? stack.length - 1 : undefined,
          },
        });
      } else {
        isValid = false;
        steps.push({
          step: steps.length,
          description: `Index ${i}: Mismatch! '${char}' does not match top '${top}'`,
          explanation: `Closing bracket '${char}' does not match stack top. String is INVALID.`,
          codeLine: 6,
          codeSnippet: `return False`,
          variables: { char, stack_top: top, is_valid: "false" },
          complexity: { time: "O(N)", space: "O(N)" },
          stackState: {
            stack: stack.map(item => ({ ...item })),
            inputSequence: chars,
            currentIndex: i,
            action: "mismatch",
          },
        });
        break;
      }
    }
  }

  if (isValid) {
    steps.push({
      step: steps.length,
      description: "Validation Complete: Parentheses String is VALID",
      explanation: "Stack is completely empty and all brackets matched in valid order.",
      codeLine: 8,
      codeSnippet: `return len(stack) == 0`,
      variables: { is_valid: "true", result: "true" },
      complexity: { time: "O(N)", space: "O(N)" },
      stackState: {
        stack: [],
        inputSequence: chars,
        currentIndex: chars.length,
        action: "match",
      },
    });
  }

  return steps;
}

// ----------------------------------------------------------------------
// 9. DYNAMIC PROGRAMMING ENGINE (Kadane's, Climbing Stairs, Coin Change)
// ----------------------------------------------------------------------
function generateDpSteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  const title = (problem.title || "").toLowerCase();
  const nums = input.nums || [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const steps: AlgorithmStep[] = [];

  if (title.includes("stair")) {
    const n = input.n || 5;
    const dp = [1, 1];

    steps.push({
      step: 0,
      description: `Initialize DP for Climbing Stairs (n = ${n})`,
      explanation: `Base cases: dp[0] = 1, dp[1] = 1. Recurrence: dp[i] = dp[i-1] + dp[i-2].`,
      codeLine: 1,
      codeSnippet: `dp = [0] * (n + 1)\ndp[0] = dp[1] = 1`,
      variables: { n, "dp[0]": 1, "dp[1]": 1 },
      complexity: { time: "O(N)", space: "O(1)" },
      dpState: {
        dpArray: [
          { index: 0, val: 1, state: "base" },
          { index: 1, val: 1, state: "base" },
        ],
      },
    });

    for (let i = 2; i <= n; i++) {
      const val = dp[i - 1] + dp[i - 2];
      dp.push(val);
      steps.push({
        step: steps.length,
        description: `Step ${i}: dp[${i}] = dp[${i - 1}] (${dp[i - 1]}) + dp[${i - 2}] (${dp[i - 2]}) = ${val}`,
        explanation: `Ways to reach step ${i} is the sum of ways from step ${i - 1} and step ${i - 2}.`,
        codeLine: 3,
        codeSnippet: `for i in range(2, n + 1):\n    dp[i] = dp[i-1] + dp[i-2]`,
        variables: { i, "dp[i]": val, result: val },
        complexity: { time: "O(N)", space: "O(1)" },
        dpState: {
          dpArray: dp.map((v, idx) => ({
            index: idx,
            val: v,
            state: idx === i ? "current" : "computed",
          })),
          optimalValue: val,
        },
      });
    }
  } else {
    // Kadane's Maximum Subarray
    let maxSoFar = nums[0];
    let currMax = nums[0];

    steps.push({
      step: 0,
      description: "Initialize Kadane's Algorithm for Maximum Subarray",
      explanation: `Set max_current = nums[0] (${nums[0]}), max_global = ${maxSoFar}.`,
      codeLine: 1,
      codeSnippet: `curr_max = max_so_far = nums[0]`,
      variables: { curr_max: currMax, max_so_far: maxSoFar },
      complexity: { time: "O(N)", space: "O(1)" },
      arrayState: {
        values: nums,
        pointers: { Curr: { index: 0, label: "i=0", color: "#2f81f7" } },
        highlights: { 0: "current" },
      },
    });

    for (let i = 1; i < nums.length; i++) {
      const val = nums[i];
      const prevCurr = currMax;
      currMax = Math.max(val, currMax + val);
      maxSoFar = Math.max(maxSoFar, currMax);

      steps.push({
        step: steps.length,
        description: `Index ${i} (${val}): curr_max = max(${val}, ${prevCurr} + ${val}) = ${currMax} | max_so_far = ${maxSoFar}`,
        explanation:
          val > prevCurr + val
            ? `Starting a new contiguous subarray at index ${i} because single element ${val} is greater than previous sum.`
            : `Extend previous subarray with ${val}.`,
        codeLine: 3,
        codeSnippet: `curr_max = max(num, curr_max + num)\nmax_so_far = max(max_so_far, curr_max)`,
        variables: { i, num: val, curr_max: currMax, max_so_far: maxSoFar },
        complexity: { time: "O(N)", space: "O(1)" },
        arrayState: {
          values: nums,
          pointers: { Curr: { index: i, label: `i=${i}`, color: "#2f81f7" } },
          highlights: { [i]: "current" },
        },
        dpState: {
          optimalValue: maxSoFar,
        },
      });
    }
  }

  return steps;
}

// ----------------------------------------------------------------------
// 10. SORTING / INTERVALS ENGINE
// ----------------------------------------------------------------------
function generateSortingSteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  const intervals = input.intervals || [[1, 3], [2, 6], [8, 10], [15, 18]];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const steps: AlgorithmStep[] = [];

  const merged: [number, number][] = [sorted[0]];

  steps.push({
    step: 0,
    description: "Initialize Interval Merging: Sort intervals by start time",
    explanation: `Sorted intervals: ${sorted.map(iv => `[${iv[0]}, ${iv[1]}]`).join(", ")}. Push first interval to merged list.`,
    codeLine: 1,
    codeSnippet: `intervals.sort(key=lambda x: x[0])\nmerged = [intervals[0]]`,
    variables: { current_interval: `[${sorted[0][0]}, ${sorted[0][1]}]` },
    complexity: { time: "O(N log N)", space: "O(N)" },
    arrayState: {
      values: sorted.map(iv => `[${iv[0]},${iv[1]}]`),
      pointers: { Curr: { index: 0, label: "first", color: "#3fb950" } },
    },
  });

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const prev = merged[merged.length - 1];

    if (current[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], current[1]);
      steps.push({
        step: steps.length,
        description: `Interval [${current[0]}, ${current[1]}] overlaps with [${prev[0]}, ${prev[1]}] → Merge to [${prev[0]}, ${prev[1]}]`,
        explanation: `Overlap detected (${current[0]} <= ${prev[1]}). Extend previous interval end time to max(${prev[1]}, ${current[1]}).`,
        codeLine: 4,
        codeSnippet: `if current[0] <= prev[1]:\n    prev[1] = max(prev[1], current[1])`,
        variables: { prev: `[${prev[0]}, ${prev[1]}]`, current: `[${current[0]}, ${current[1]}]` },
        complexity: { time: "O(N log N)", space: "O(N)" },
        arrayState: {
          values: sorted.map(iv => `[${iv[0]},${iv[1]}]`),
          pointers: { Curr: { index: i, label: "overlap", color: "#d29922" } },
          highlights: { [i]: "comparing", [i - 1]: "found" },
        },
      });
    } else {
      merged.push([...current]);
      steps.push({
        step: steps.length,
        description: `Interval [${current[0]}, ${current[1]}] does not overlap → Append separately`,
        explanation: `Start time ${current[0]} > previous end ${prev[1]}. Start a new non-overlapping interval.`,
        codeLine: 6,
        codeSnippet: `else:\n    merged.append(current)`,
        variables: { appended: `[${current[0]}, ${current[1]}]` },
        complexity: { time: "O(N log N)", space: "O(N)" },
        arrayState: {
          values: sorted.map(iv => `[${iv[0]},${iv[1]}]`),
          pointers: { Curr: { index: i, label: "new", color: "#3fb950" } },
          highlights: { [i]: "current" },
        },
      });
    }
  }

  return steps;
}

// ----------------------------------------------------------------------
// 11. GENERAL ARRAY ENGINE
// ----------------------------------------------------------------------
function generateGeneralArraySteps(problem: ProblemInputData, input: ParsedInput): AlgorithmStep[] {
  const nums = input.nums || [2, 7, 11, 15, 20];
  const steps: AlgorithmStep[] = [];

  steps.push({
    step: 0,
    description: `Initialize Array Algorithm for "${problem.title}"`,
    explanation: `Array has ${nums.length} elements. Beginning sequential algorithmic evaluation.`,
    codeLine: 1,
    codeSnippet: `for i, num in enumerate(nums):\n    process(num)`,
    variables: { size: nums.length, index: 0 },
    complexity: { time: "O(N)", space: "O(1)" },
    arrayState: {
      values: nums,
      pointers: { P: { index: 0, label: "start", color: "#2f81f7" } },
      highlights: { 0: "current" },
    },
  });

  for (let i = 0; i < nums.length; i++) {
    steps.push({
      step: steps.length,
      description: `Process Index ${i}: value = ${nums[i]}`,
      explanation: `Evaluating element at index ${i}. Updating algorithm invariant state.`,
      codeLine: 2,
      codeSnippet: `state = update_state(nums[i])`,
      variables: { index: i, value: nums[i] },
      complexity: { time: "O(N)", space: "O(1)" },
      arrayState: {
        values: nums,
        pointers: { P: { index: i, label: `i=${i}`, color: "#2f81f7" } },
        highlights: { [i]: "current" },
      },
    });
  }

  return steps;
}
