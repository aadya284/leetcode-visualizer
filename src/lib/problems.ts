export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python: string;
    c: string;
    cpp: string;
    java: string;
  };
}

export const problems: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: {
      python: `def twoSum(nums, target):
    # Write your code here
    pass`,
      c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write your code here
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
    }
}`,
    },
  },
  {
    id: "2",
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807.",
      },
      {
        input: "l1 = [0], l2 = [0]",
        output: "[0]",
      },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]",
      },
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros.",
    ],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def addTwoNumbers(l1, l2):
    # Write your code here
    pass`,
      c: `struct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) {
    // Write your code here
}`,
      cpp: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Write your code here
    }
};`,
      java: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Write your code here
    }
}`,
    },
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    starterCode: {
      python: `def lengthOfLongestSubstring(s):
    # Write your code here
    pass`,
      c: `int lengthOfLongestSubstring(char* s) {
    // Write your code here
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
    }
}`,
    },
  },
  {
    id: "4",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    starterCode: {
      python: `def search(nums, target):
    # Write your code here
    pass`,
      c: `int search(int* nums, int numsSize, int target) {
    // Write your code here
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your code here
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
    }
}`,
    },
  },
  {
    id: "5",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    description: "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]",
      },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order.",
    ],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeTwoLists(list1, list2):
    # Write your code here
    pass`,
      c: `struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {
    // Write your code here
}`,
      cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Write your code here
    }
};`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your code here
    }
}`,
    },
  },
  {
    id: "6",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    starterCode: {
      python: `def isValid(s):
    # Write your code here
    pass`,
      c: `bool isValid(char* s) {
    // Write your code here
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Write your code here
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
    }
}`,
    },
  },
];
