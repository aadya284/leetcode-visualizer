import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";

export async function POST(request: NextRequest) {
  try {
    const { code, language, languageName, problemId } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    // If no API key is configured, return a mock response
    if (!RAPIDAPI_KEY) {
      return NextResponse.json({
        output: `Mock execution for ${languageName}:\n\nCode received:\n${code}\n\n✓ Code compiled successfully (demo mode)\n\nNote: Configure RAPIDAPI_KEY environment variable to use Judge0 API for real code execution.`,
        status: { description: "Accepted" },
      });
    }

    console.log("Executing code for problem:", problemId, "language:", language);

    // Prepare code with necessary headers and test cases
    let processedCode = code;
    
    // Wrap C++ code with main function and includes
    if (language === 54) { // C++ language ID
      // Always add includes and main for C++, regardless of problem
      let mainCode = "";
      
      if (String(problemId) === "1") {
        // Two Sum test cases
        mainCode = `int main() {
    Solution sol;
    
    // Test case 1
    vector<int> nums1 = {2, 7, 11, 15};
    int target1 = 9;
    vector<int> result1 = sol.twoSum(nums1, target1);
    cout << "Test 1: ";
    for (int i = 0; i < result1.size(); i++) {
        cout << result1[i];
        if (i < result1.size() - 1) cout << " ";
    }
    cout << endl;
    
    // Test case 2
    vector<int> nums2 = {3, 2, 4};
    int target2 = 6;
    vector<int> result2 = sol.twoSum(nums2, target2);
    cout << "Test 2: ";
    for (int i = 0; i < result2.size(); i++) {
        cout << result2[i];
        if (i < result2.size() - 1) cout << " ";
    }
    cout << endl;
    
    // Test case 3
    vector<int> nums3 = {3, 3};
    int target3 = 6;
    vector<int> result3 = sol.twoSum(nums3, target3);
    cout << "Test 3: ";
    for (int i = 0; i < result3.size(); i++) {
        cout << result3[i];
        if (i < result3.size() - 1) cout << " ";
    }
    cout << endl;
    
    return 0;
}`;
      } else if (String(problemId) === "2") {
        // Add Two Numbers - linked list
        mainCode = `int main() {
    Solution sol;
    
    // Test case 1: 342 + 465 = 807
    ListNode* l1_1 = new ListNode(2);
    l1_1->next = new ListNode(4);
    l1_1->next->next = new ListNode(3);
    
    ListNode* l2_1 = new ListNode(5);
    l2_1->next = new ListNode(6);
    l2_1->next->next = new ListNode(4);
    
    ListNode* result1 = sol.addTwoNumbers(l1_1, l2_1);
    cout << "Test 1: ";
    while (result1) {
        cout << result1->val;
        if (result1->next) cout << " -> ";
        result1 = result1->next;
    }
    cout << endl;
    
    // Test case 2: 0 + 0 = 0
    ListNode* l1_2 = new ListNode(0);
    ListNode* l2_2 = new ListNode(0);
    
    ListNode* result2 = sol.addTwoNumbers(l1_2, l2_2);
    cout << "Test 2: ";
    while (result2) {
        cout << result2->val;
        if (result2->next) cout << " -> ";
        result2 = result2->next;
    }
    cout << endl;
    
    // Test case 3: 9999999 + 9999 = 10009998
    ListNode* l1_3 = new ListNode(9);
    l1_3->next = new ListNode(9);
    l1_3->next->next = new ListNode(9);
    l1_3->next->next->next = new ListNode(9);
    l1_3->next->next->next->next = new ListNode(9);
    l1_3->next->next->next->next->next = new ListNode(9);
    l1_3->next->next->next->next->next->next = new ListNode(9);
    
    ListNode* l2_3 = new ListNode(9);
    l2_3->next = new ListNode(9);
    l2_3->next->next = new ListNode(9);
    l2_3->next->next->next = new ListNode(9);
    
    ListNode* result3 = sol.addTwoNumbers(l1_3, l2_3);
    cout << "Test 3: ";
    while (result3) {
        cout << result3->val;
        if (result3->next) cout << " -> ";
        result3 = result3->next;
    }
    cout << endl;
    
    return 0;
}`;
      } else if (String(problemId) === "3") {
        // Longest Substring
        mainCode = `int main() {
    Solution sol;
    
    // Test case 1
    string s1 = "abcabcbb";
    int result1 = sol.lengthOfLongestSubstring(s1);
    cout << "Test 1: " << result1 << endl;
    
    // Test case 2
    string s2 = "bbbbb";
    int result2 = sol.lengthOfLongestSubstring(s2);
    cout << "Test 2: " << result2 << endl;
    
    // Test case 3
    string s3 = "pwwkew";
    int result3 = sol.lengthOfLongestSubstring(s3);
    cout << "Test 3: " << result3 << endl;
    
    return 0;
}`;
      } else if (String(problemId) === "4") {
        // Binary Search
        mainCode = `int main() {
    Solution sol;
    
    // Test case 1
    vector<int> nums1 = {-1, 0, 3, 5, 9, 12};
    int target1 = 9;
    int result1 = sol.search(nums1, target1);
    cout << "Test 1: " << result1 << endl;
    
    // Test case 2
    vector<int> nums2 = {-1, 0, 3, 5, 9, 12};
    int target2 = 13;
    int result2 = sol.search(nums2, target2);
    cout << "Test 2: " << result2 << endl;
    
    // Test case 3
    vector<int> nums3 = {5};
    int target3 = 5;
    int result3 = sol.search(nums3, target3);
    cout << "Test 3: " << result3 << endl;
    
    return 0;
}`;
      } else if (String(problemId) === "5") {
        // Merge Two Sorted Lists
        mainCode = `int main() {
    Solution sol;
    
    // Test case 1
    ListNode* list1_1 = new ListNode(1);
    list1_1->next = new ListNode(2);
    list1_1->next->next = new ListNode(4);
    
    ListNode* list2_1 = new ListNode(1);
    list2_1->next = new ListNode(3);
    list2_1->next->next = new ListNode(4);
    
    ListNode* result1 = sol.mergeTwoLists(list1_1, list2_1);
    cout << "Test 1: ";
    while (result1) {
        cout << result1->val;
        if (result1->next) cout << " -> ";
        result1 = result1->next;
    }
    cout << endl;
    
    // Test case 2: Empty lists
    ListNode* list1_2 = nullptr;
    ListNode* list2_2 = nullptr;
    
    ListNode* result2 = sol.mergeTwoLists(list1_2, list2_2);
    cout << "Test 2: ";
    if (result2 == nullptr) {
        cout << "empty";
    } else {
        while (result2) {
            cout << result2->val;
            if (result2->next) cout << " -> ";
            result2 = result2->next;
        }
    }
    cout << endl;
    
    // Test case 3: One empty, one not
    ListNode* list1_3 = nullptr;
    ListNode* list2_3 = new ListNode(0);
    
    ListNode* result3 = sol.mergeTwoLists(list1_3, list2_3);
    cout << "Test 3: ";
    while (result3) {
        cout << result3->val;
        if (result3->next) cout << " -> ";
        result3 = result3->next;
    }
    cout << endl;
    
    return 0;
}`;
      } else if (String(problemId) === "6") {
        // Valid Parentheses
        mainCode = `int main() {
    Solution sol;
    
    // Test case 1
    string s1 = "()";
    bool result1 = sol.isValid(s1);
    cout << "Test 1: " << (result1 ? "true" : "false") << endl;
    
    // Test case 2
    string s2 = "()[]{}";
    bool result2 = sol.isValid(s2);
    cout << "Test 2: " << (result2 ? "true" : "false") << endl;
    
    // Test case 3
    string s3 = "(]";
    bool result3 = sol.isValid(s3);
    cout << "Test 3: " << (result3 ? "true" : "false") << endl;
    
    return 0;
}`;
      }
      
      processedCode = `#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <string>
#include <algorithm>
#include <queue>
#include <stack>
using namespace std;

// ListNode definition for linked list problems
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x = 0, ListNode* next = nullptr) : val(x), next(next) {}
};

${code}

${mainCode}`;
    } else if (language === 71) { // Python language ID
      if (problemId === "1") {
        // Two Sum test cases
        processedCode = `${code}

# Test cases
if __name__ == "__main__":
    sol = Solution()
    
    # Test case 1
    nums1 = [2, 7, 11, 15]
    target1 = 9
    result1 = sol.twoSum(nums1, target1)
    print(f"Test 1: {result1}")
    
    # Test case 2
    nums2 = [3, 2, 4]
    target2 = 6
    result2 = sol.twoSum(nums2, target2)
    print(f"Test 2: {result2}")
    
    # Test case 3
    nums3 = [3, 3]
    target3 = 6
    result3 = sol.twoSum(nums3, target3)
    print(f"Test 3: {result3}")`;
      } else {
        // For other problems, no wrapping needed - user code should be complete
        processedCode = code;
      }
    } else if (language === 50) { // C language ID
      if (problemId === "1") {
        // Two Sum test cases
        processedCode = `#include <stdio.h>
#include <stdlib.h>

${code}

int main() {
    // Test case 1
    int nums1[] = {2, 7, 11, 15};
    int numsSize1 = 4;
    int target1 = 9;
    int returnSize1 = 0;
    int* result1 = twoSum(nums1, numsSize1, target1, &returnSize1);
    printf("Test 1: ");
    for (int i = 0; i < returnSize1; i++) {
        printf("%d", result1[i]);
        if (i < returnSize1 - 1) printf(" ");
    }
    printf("\\n");
    free(result1);
    
    // Test case 2
    int nums2[] = {3, 2, 4};
    int numsSize2 = 3;
    int target2 = 6;
    int returnSize2 = 0;
    int* result2 = twoSum(nums2, numsSize2, target2, &returnSize2);
    printf("Test 2: ");
    for (int i = 0; i < returnSize2; i++) {
        printf("%d", result2[i]);
        if (i < returnSize2 - 1) printf(" ");
    }
    printf("\\n");
    free(result2);
    
    // Test case 3
    int nums3[] = {3, 3};
    int numsSize3 = 2;
    int target3 = 6;
    int returnSize3 = 0;
    int* result3 = twoSum(nums3, numsSize3, target3, &returnSize3);
    printf("Test 3: ");
    for (int i = 0; i < returnSize3; i++) {
        printf("%d", result3[i]);
        if (i < returnSize3 - 1) printf(" ");
    }
    printf("\\n");
    free(result3);
    
    return 0;
}`;
      } else {
        // For other problems, user must provide complete code with main
        processedCode = code;
      }
    } else if (language === 62) { // Java language ID
      if (problemId === "1") {
        // Two Sum test cases
        processedCode = `${code}

public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        // Test case 1
        int[] nums1 = {2, 7, 11, 15};
        int target1 = 9;
        int[] result1 = sol.twoSum(nums1, target1);
        System.out.print("Test 1: ");
        for (int i = 0; i < result1.length; i++) {
            System.out.print(result1[i]);
            if (i < result1.length - 1) System.out.print(" ");
        }
        System.out.println();
        
        // Test case 2
        int[] nums2 = {3, 2, 4};
        int target2 = 6;
        int[] result2 = sol.twoSum(nums2, target2);
        System.out.print("Test 2: ");
        for (int i = 0; i < result2.length; i++) {
            System.out.print(result2[i]);
            if (i < result2.length - 1) System.out.print(" ");
        }
        System.out.println();
        
        // Test case 3
        int[] nums3 = {3, 3};
        int target3 = 6;
        int[] result3 = sol.twoSum(nums3, target3);
        System.out.print("Test 3: ");
        for (int i = 0; i < result3.length; i++) {
            System.out.print(result3[i]);
            if (i < result3.length - 1) System.out.print(" ");
        }
        System.out.println();
    }
}`;
      } else {
        // For other problems, user code should be complete
        processedCode = code;
      }
    }
    const submissionResponse = await axios.post(
      `${JUDGE0_API}/submissions?base64_encoded=true&wait=true`,
      {
        source_code: Buffer.from(processedCode).toString('base64'),
        language_id: language,
        stdin: "",
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    const result = submissionResponse.data;

    // Decode base64 fields if they exist
    const decodeBase64 = (str: string | null) => {
      if (!str) return "";
      try {
        return Buffer.from(str, 'base64').toString('utf-8');
      } catch {
        return str;
      }
    };

    const stdout = decodeBase64(result.stdout);
    const stderr = decodeBase64(result.stderr);
    const compileOutput = decodeBase64(result.compile_output);

    // Handle compilation errors
    if (compileOutput) {
      return NextResponse.json({
        error: compileOutput,
        status: result.status,
      });
    }

    // Handle runtime errors
    if (stderr) {
      return NextResponse.json({
        error: stderr,
        status: result.status,
      });
    }

    // Return successful output
    return NextResponse.json({
      output: stdout || "No output",
      status: result.status,
    });
  } catch (error: any) {
    console.error("Code execution error:", error);
    
    return NextResponse.json(
      {
        error: error.response?.data?.error || "Failed to execute code. Please try again.",
      },
      { status: 500 }
    );
  }
}
