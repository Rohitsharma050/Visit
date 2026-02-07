// Example demo content you can use to test the Auto Format feature

export const demoContent = {
  dsaProblem: `TWO POINTER TECHNIQUE

Introduction:
Two pointer technique is used to solve array/string problems efficiently.

When to Use:
- Sorted arrays
- Finding pairs
- Removing duplicates
- Window sliding problems

Basic Template:

    function twoPointerTemplate(arr) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left < right) {
            // Process elements
            if (condition) {
                left++;
            } else {
                right--;
            }
        }
    }

Common Problems:

1. Two Sum in sorted array
2. Container with most water
3. Remove duplicates
4. Valid palindrome

Time Complexity Analysis:
Single pass through array: O(n)
Space complexity: O(1)

Key Points:
- Works on sorted data
- Reduces time complexity
- In-place processing
→ No extra space needed`,

  theoryNotes: `OPERATING SYSTEM CONCEPTS

Process vs Thread

Definition:
A process is an independent program in execution with its own memory space.

Process Characteristics:
• Has own memory space
• Independent execution
• Higher overhead
• Inter-process communication needed

Thread Characteristics:
• Shares process memory
• Lightweight
• Faster context switching
• Direct communication

Context Switching:

Step 1: Save current process state
Step 2: Load new process state  
Step 3: Resume execution

Types of Threads:

1. User-level threads
2. Kernel-level threads
3. Hybrid threads

Important Note:
Threads share the same address space but have separate stacks`,

  algorithmExplanation: `BINARY SEARCH ALGORITHM

What is Binary Search:
A search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.

Working Principle:

1. Start with entire array
2. Find middle element
3. Compare with target
4. Eliminate half of array
5. Repeat until found

Implementation:

    function binarySearch(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (arr[mid] === target) {
                return mid;
            }
            
            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }

Complexity Analysis:
Time: O(log n) - halving each iteration
Space: O(1) - constant extra space

Prerequisites:
- Array must be sorted
- Random access capability
- Comparison operation defined

Advantages:
Very fast for large datasets
Predictable performance
Simple to implement

Disadvantages:
Requires sorted data
Not suitable for linked lists
Preprocessing cost if unsorted`,

  chatGPTStyle: `EXPLAIN RECURSION LIKE I'M 5

Overview:
Recursion is when a function calls itself to solve smaller versions of the same problem.

The Mailbox Analogy:

Imagine you have a stack of mailboxes, one inside another.

Step 1: Open the outermost box
Step 2: Find another box inside
Step 3: Keep opening until you find the smallest box
Step 4: Take the gift from smallest box
Step 5: Close all boxes back

Code Example:

    function countdown(n) {
        // Base case - stop when we reach 0
        if (n === 0) {
            console.log("Blastoff!");
            return;
        }
        
        // Recursive case
        console.log(n);
        countdown(n - 1);
    }

Key Rules:

1. Must have a base case (stopping point)
2. Must make progress toward base case
3. Must call itself with modified input

Common Mistakes:
- Forgetting base case → infinite loop
- Wrong base case → incorrect results
- Not making progress → stack overflow

When to Use Recursion:
Tree traversal
Graph problems
Divide and conquer
Mathematical sequences
Backtracking problems

Memory Consideration:
Each recursive call uses stack space
Deep recursion can cause stack overflow
Consider iteration for simple loops`
};

// Usage in component:
// import { demoContent } from './demoContent';
// 
// <button onClick={() => onChange(demoContent.dsaProblem)}>
//   Load DSA Example
// </button>
