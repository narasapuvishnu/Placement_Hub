require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Company = require("./models/Company");
const Question = require("./models/Question");

const companiesData = [
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    website: "https://careers.google.com",
    industry: "Big Tech / Internet",
    headquarters: "Mountain View, CA, USA",
    description:
      "Google is a global technology leader focused on search, cloud computing, software, and hardware innovation.",
    difficulty: "Very Hard",
    hiringRoles: [
      "Software Engineer (L3/L4/L5)",
      "Site Reliability Engineer",
      "Product Manager",
      "Data Scientist",
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        name: "Online Assessment (OA)",
        roundType: "Online Assessment",
        duration: "90 mins",
        description: "2 algorithmic problem-solving questions on Google's internal testing platform.",
        tips: "Focus on edge cases, time/space complexity analysis, and clean modular code.",
      },
      {
        roundNumber: 2,
        name: "Technical Phone Screen",
        roundType: "Technical",
        duration: "45 mins",
        description: "Data structures & algorithms question in a shared Google Doc without syntax highlighting.",
        tips: "Communicate your thought process out loud before writing any code.",
      },
      {
        roundNumber: 3,
        name: "Onsite Technical Rounds (3-4 rounds)",
        roundType: "Technical & System Design",
        duration: "45 mins each",
        description: "Advanced algorithms, graphs, dynamic programming, and system design for experienced roles.",
        tips: "Clarify constraints, discuss trade-offs, and write production-grade code.",
      },
      {
        roundNumber: 4,
        name: "Googliness & Leadership",
        roundType: "HR/Cultural",
        duration: "45 mins",
        description: "Behavioral questions evaluating collaboration, dealing with ambiguity, and ethical decisions.",
        tips: "Use the STAR method with concrete examples showing initiative and team empathy.",
      },
    ],
    frequentTopics: [
      "Dynamic Programming",
      "Graphs & BFS/DFS",
      "Trie & Segment Trees",
      "Distributed Systems",
    ],
    salaryRange: "₹25 - 55 LPA (India) / $140k - $220k (US)",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    website: "https://www.amazon.jobs",
    industry: "E-Commerce / Cloud Computing",
    headquarters: "Seattle, WA, USA",
    description:
      "Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.",
    difficulty: "Hard",
    hiringRoles: [
      "Software Development Engineer (SDE-1/2)",
      "Solutions Architect",
      "Cloud Support Engineer",
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        name: "Online Assessment (OA)",
        roundType: "Online Assessment",
        duration: "90 mins",
        description: "2 coding questions, work style assessment, and debugging exercises.",
        tips: "Align your work style responses directly with Amazon's 16 Leadership Principles.",
      },
      {
        roundNumber: 2,
        name: "Technical Rounds (2-3 rounds)",
        roundType: "Technical",
        duration: "60 mins each",
        description: "Tree/graph traversal, arrays, hash maps, and Object Oriented Design.",
        tips: "Every round starts with 20 minutes of behavioral questions based on Leadership Principles.",
      },
      {
        roundNumber: 3,
        name: "System Design (SDE-2+)",
        roundType: "System Design",
        duration: "60 mins",
        description: "Design scalable distributed systems like S3, Shopping Cart, or Notification Service.",
        tips: "Focus on scalability, data partitioning, consistency models, and single points of failure.",
      },
      {
        roundNumber: 4,
        name: "The Bar Raiser Round",
        roundType: "Bar Raiser",
        duration: "60 mins",
        description: "Evaluator from outside the hiring team to ensure candidate raises the company bar.",
        tips: "Provide deep customer-obsessed stories and demonstrate resilience under pressure.",
      },
    ],
    frequentTopics: [
      "Trees & Graphs",
      "Leadership Principles (STAR)",
      "Object-Oriented Design",
      "Microservices Architecture",
    ],
    salaryRange: "₹20 - 45 LPA (India) / $130k - $190k (US)",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    website: "https://careers.microsoft.com",
    industry: "Software & Cloud",
    headquarters: "Redmond, WA, USA",
    description:
      "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.",
    difficulty: "Hard",
    hiringRoles: [
      "Software Engineer",
      "Cloud Solution Architect",
      "Full Stack Developer",
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        name: "Codility Online Assessment",
        roundType: "Online Assessment",
        duration: "75 mins",
        description: "2-3 coding problems evaluating algorithm correctness and edge cases.",
        tips: "Focus on passing all hidden performance test cases (O(N) or O(N log N) requirements).",
      },
      {
        roundNumber: 2,
        name: "Data Structures & Algorithms",
        roundType: "Technical",
        duration: "45-60 mins",
        description: "Trees, Linked Lists, Matrix manipulations, and Recursion.",
        tips: "Demonstrate structured thinking and clean variable naming conventions.",
      },
      {
        roundNumber: 3,
        name: "Design & High-Level Architecture",
        roundType: "System Design",
        duration: "60 mins",
        description: "Database schema design, APIs, caching strategies, and resilience.",
        tips: "Discuss trade-offs between SQL vs NoSQL and latency vs consistency.",
      },
      {
        roundNumber: 4,
        name: "Managerial / AA (As Appropriate)",
        roundType: "HR/Cultural",
        duration: "45 mins",
        description: "Culture fit, growth mindset, and vision alignment with Microsoft core values.",
        tips: "Exhibit curiosity and how you learn from past software failures.",
      },
    ],
    frequentTopics: [
      "Binary Trees & BST",
      "Linked Lists & Hash Tables",
      "System Architecture",
      "Growth Mindset",
    ],
    salaryRange: "₹18 - 42 LPA (India) / $125k - $185k (US)",
  },
  {
    name: "Uber",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    website: "https://www.uber.com/careers",
    industry: "Mobility & Logistics",
    headquarters: "San Francisco, CA, USA",
    description:
      "Uber develops, markets, and operates ride-sharing, food delivery, and freight networks.",
    difficulty: "Very Hard",
    hiringRoles: ["Software Engineer 1/2", "Backend Engineer", "Data Engineer"],
    interviewRounds: [
      {
        roundNumber: 1,
        name: "HackerRank Coding Screen",
        roundType: "Online Assessment",
        duration: "90 mins",
        description: "Algorithmic challenges and concurrency/threading questions.",
        tips: "Be comfortable with multi-threading, concurrency, and complex graph algorithms.",
      },
      {
        roundNumber: 2,
        name: "Low-Level Design (Machine Coding)",
        roundType: "Technical",
        duration: "90 mins",
        description: "Write runnable, modular, object-oriented code for problems like Ride Matching or Splitwise.",
        tips: "Follow SOLID design principles and include unit tests.",
      },
      {
        roundNumber: 3,
        name: "High-Level System Design",
        roundType: "System Design",
        duration: "60 mins",
        description: "Location tracking at scale, Quadtree/Geohash spatial indexing, and message streaming.",
        tips: "Master Kafka, Redis geo-queries, and horizontal database sharding.",
      },
    ],
    frequentTopics: [
      "Spatial Indexing (Geohash / QuadTree)",
      "Low-Level Machine Coding",
      "Event-Driven Architecture",
      "Concurrency & Locks",
    ],
    salaryRange: "₹30 - 65 LPA (India) / $150k - $240k (US)",
  },
  {
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    website: "https://www.metacareers.com",
    industry: "Social Media / AI & VR",
    headquarters: "Menlo Park, CA, USA",
    description:
      "Meta builds technologies that help people connect, find communities, and grow businesses across Facebook, Instagram, WhatsApp, and Quest.",
    difficulty: "Very Hard",
    hiringRoles: [
      "Software Engineer (E3/E4/E5)",
      "Product Manager",
      "Production Engineer",
      "AI/ML Engineer",
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        name: "OA & Recruiter Screen",
        roundType: "Online Assessment",
        duration: "45 mins",
        description: "Technical screen and rapid algorithmic problem solving on CoderPad.",
        tips: "Aim for clean, working code in under 20 minutes per problem.",
      },
      {
        roundNumber: 2,
        name: "Coding Loop (2 Rounds)",
        roundType: "Technical",
        duration: "45 mins each",
        description: "Fast-paced DSA questions (2 questions per round) testing trees, graphs, and dynamic programming.",
        tips: "Time management is critical: write runnable, optimal code without hesitation.",
      },
      {
        roundNumber: 3,
        name: "System Design",
        roundType: "System Design",
        duration: "45 mins",
        description: "Architecture for global distributed products like NewsFeed, Messenger, or Instagram Stories.",
        tips: "Clarify scale (billions of daily active users), dive deep into caching and data models.",
      },
      {
        roundNumber: 4,
        name: "Behavioral & Values",
        roundType: "HR/Cultural",
        duration: "45 mins",
        description: "Questions aligned with Meta values: Move Fast, Focus on Long-Term Impact, and Be Bold.",
        tips: "Provide specific examples demonstrating high ownership and handling setbacks.",
      },
    ],
    frequentTopics: [
      "Binary Trees & BFS/DFS",
      "Dynamic Programming",
      "Hash Tables & Strings",
      "Large-Scale System Design",
    ],
    salaryRange: "₹28 - 62 LPA (India) / $150k - $250k (US)",
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    website: "https://www.apple.com/careers",
    industry: "Consumer Electronics & OS",
    headquarters: "Cupertino, CA, USA",
    description:
      "Apple designs consumer electronics, software, and online services including iPhone, Mac, iOS, macOS, and iCloud.",
    difficulty: "Hard",
    hiringRoles: [
      "Software Engineer (ICT2/ICT3/ICT4)",
      "iOS/macOS Engineer",
      "Systems Software Engineer",
      "Firmware Engineer",
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        name: "Recruiter Screen",
        roundType: "Screening",
        duration: "30 mins",
        description: "Discussion on past projects, technical background, and domain relevance.",
        tips: "Be specific about your direct contributions to high-performance products.",
      },
      {
        roundNumber: 2,
        name: "Technical Phone Screen",
        roundType: "Technical",
        duration: "60 mins",
        description: "Algorithms, memory management, and language internals (C++/Swift/Rust).",
        tips: "Demonstrate deep understanding of pointers, stack vs heap, and time-space tradeoffs.",
      },
      {
        roundNumber: 3,
        name: "Onsite Technical Loop (4-5 rounds)",
        roundType: "Technical & Architecture",
        duration: "60 mins each",
        description: "Deep dive into OS internals, multi-threading, concurrency, and algorithms.",
        tips: "Focus on zero-latency optimization, thread safety, and clean architecture.",
      },
    ],
    frequentTopics: [
      "Memory Management & Pointers",
      "Concurrency & Multithreading",
      "Data Structures & Trees",
      "Low-Level Optimization",
    ],
    salaryRange: "₹24 - 52 LPA (India) / $140k - $230k (US)",
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    website: "https://jobs.netflix.com",
    industry: "Streaming Media & Entertainment",
    headquarters: "Los Gatos, CA, USA",
    description:
      "Netflix is the world's leading streaming entertainment service with over 260 million paid memberships worldwide.",
    difficulty: "Very Hard",
    hiringRoles: [
      "Senior Software Engineer (L5/L6)",
      "Distributed Systems Engineer",
      "Data Infrastructure Engineer",
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        name: "Technical Screen",
        roundType: "Technical",
        duration: "60 mins",
        description: "Algorithmic scenarios, asynchronous programming, and concurrency.",
        tips: "Write elegant, highly readable code with proper error handling.",
      },
      {
        roundNumber: 2,
        name: "System Design Deep Dive",
        roundType: "System Design",
        duration: "60 mins",
        description: "High-throughput microservices, CDN video delivery, and distributed caching topologies.",
        tips: "Discuss fault tolerance, rate limiting, and chaos engineering practices.",
      },
      {
        roundNumber: 3,
        name: "Culture & Values",
        roundType: "Cultural",
        duration: "60 mins",
        description: "Direct discussion on Netflix Culture memo: Freedom and Responsibility, Context Not Control.",
        tips: "Read the Netflix Culture Deck thoroughly before the interview.",
      },
    ],
    frequentTopics: [
      "High-Scale Microservices",
      "Distributed Caching (Redis/Memcached)",
      "Chaos Engineering & Resilience",
      "Asynchronous Event Streams",
    ],
    salaryRange: "₹35 - 75 LPA (India) / $220k - $380k (US)",
  },
  {
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
    website: "https://www.adobe.com/careers.html",
    industry: "Creative Cloud & Digital Media",
    headquarters: "San Jose, CA, USA",
    description:
      "Adobe is changing the world through digital experiences, powering Photoshop, Illustrator, Acrobat, Premiere, and Creative Cloud.",
    difficulty: "Medium",
    hiringRoles: [
      "Member of Technical Staff",
      "Full Stack Developer",
      "Computer Vision Engineer",
      "Cloud Software Engineer",
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        name: "Online Assessment",
        roundType: "Online Assessment",
        duration: "90 mins",
        description: "3 DSA coding problems on HackerEarth testing arrays, trees, and dynamic programming.",
        tips: "Aim for complete test case passes with optimal time complexity.",
      },
      {
        roundNumber: 2,
        name: "Technical Round 1",
        roundType: "Technical",
        duration: "60 mins",
        description: "Data structures, string manipulation, and 2D matrix algorithms.",
        tips: "Explain edge cases (empty matrix, null pointers, bounds) upfront.",
      },
      {
        roundNumber: 3,
        name: "Technical Round 2 (Design)",
        roundType: "System & Low-Level Design",
        duration: "60 mins",
        description: "Object-oriented design of canvas, undo/redo history, or layer management.",
        tips: "Use Command Pattern, Observer Pattern, and clean inheritance hierarchies.",
      },
    ],
    frequentTopics: [
      "2D/3D Geometry & Coordinates",
      "Object-Oriented Design (OOD)",
      "Graphs & Dynamic Programming",
      "Memory & Performance Optimization",
    ],
    salaryRange: "₹18 - 38 LPA (India) / $115k - $175k (US)",
  },
];

const questionsData = [
  {
    title: "Two Sum",
    category: "DSA",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    companies: ["Google", "Amazon", "Microsoft", "Uber"],
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    inputFormat: "nums: Array of integers, target: integer",
    outputFormat: "Array of two indices [i, j]",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    sampleCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 6, return [0, 1].",
      },
    ],
    starterCode: {
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    
};`,
      c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    
}`,
      csharp: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        
    }
}`,
      go: `func twoSum(nums []int, target int) []int {
    
}`,
      rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        
    }
}`,
    },
    hints: [
      "A brute force approach checks all pairs in O(n^2) time.",
      "Can you use extra space (like a Hash Map) to check complement values in O(1) time?",
    ],
    solutionApproach:
      "Use a Hash Map to store previously visited elements and their indices. For each number, compute target - num. If it exists in the map, return the pair in O(n) time and O(n) space.",
    acceptanceRate: 88,
  },
  {
    title: "Longest Substring Without Repeating Characters",
    category: "DSA",
    difficulty: "Medium",
    tags: ["Strings", "Sliding Window", "Hash Table"],
    companies: ["Amazon", "Google", "Microsoft"],
    description:
      "Given a string `s`, find the length of the longest substring without duplicate characters.",
    inputFormat: "s: string",
    outputFormat: "integer: length of longest substring",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    sampleCases: [
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
    starterCode: {
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        
    }
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        `,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    
};`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
    
};`,
      c: `int lengthOfLongestSubstring(char* s) {
    
}`,
      csharp: `public class Solution {
    public int LengthOfLongestSubstring(string s) {
        
    }
}`,
      go: `func lengthOfLongestSubstring(s string) int {
    
}`,
      rust: `impl Solution {
    pub fn length_of_longest_substring(s: String) -> i32 {
        
    }
}`,
    },
    hints: [
      "Think about a sliding window with two pointers [left, right].",
      "Whenever you see a character that exists in the current window, move the left pointer past its previous index.",
    ],
    solutionApproach:
      "Use the sliding window technique with a hash map recording each character's most recent position.",
    acceptanceRate: 64,
  },
  {
    title: "LRU Cache Design",
    category: "DSA",
    difficulty: "Hard",
    tags: ["Design", "Doubly Linked List", "Hash Table"],
    companies: ["Google", "Amazon", "Uber", "Microsoft"],
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n- `int get(int key)` Return the value of the key if the key exists, otherwise return -1.\n- `void put(int key, int value)` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in O(1) average time complexity.",
    inputFormat: "Operations sequence and key-value inputs",
    outputFormat: "Outputs of get and put operations",
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put.",
    ],
    sampleCases: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
        explanation: "cache.get(2) returns -1 because key 2 was evicted as least recently used.",
      },
    ],
    starterCode: {
      cpp: `class LRUCache {
public:
    LRUCache(int capacity) {
        
    }
    
    int get(int key) {
        
    }
    
    void put(int key, int value) {
        
    }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache* obj = new LRUCache(capacity);
 * int param_1 = obj->get(key);
 * obj->put(key,value);
 */`,
      java: `class LRUCache {

    public LRUCache(int capacity) {
        
    }
    
    public int get(int key) {
        
    }
    
    public void put(int key, int value) {
        
    }
}`,
      python: `class LRUCache:

    def __init__(self, capacity: int):
        

    def get(self, key: int) -> int:
        

    def put(self, key: int, value: int) -> None:
        `,
      javascript: `/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    
};`,
      typescript: `class LRUCache {
    constructor(capacity: number) {
        
    }

    get(key: number): number {
        
    }

    put(key: number, value: number): void {
        
    }
}`,
      csharp: `public class LRUCache {

    public LRUCache(int capacity) {
        
    }
    
    public int Get(int key) {
        
    }
    
    public void Put(int key, int value) {
        
    }
}`,
      go: `type LRUCache struct {
    
}

func Constructor(capacity int) LRUCache {
    
}

func (this *LRUCache) Get(key int) int {
    
}

func (this *LRUCache) Put(key int, value int)  {
    
}`,
      rust: `struct LRUCache {

}

impl LRUCache {

    fn new(capacity: i32) -> Self {
        
    }
    
    fn get(&self, key: i32) -> i32 {
        
    }
    
    fn put(&self, key: i32, value: i32) {
        
    }
}`,
    },
    hints: [
      "To achieve O(1) access and O(1) update order, combine a Doubly Linked List with a Hash Map.",
      "A hash map gives O(1) lookup to node pointers. The doubly linked list allows removing a node and placing it at the head in O(1) time.",
    ],
    solutionApproach:
      "A hash map maps key -> Node pointer. A doubly linked list maintains the LRU order: head is Most Recently Used, tail is Least Recently Used.",
    acceptanceRate: 52,
  },
  {
    title: "Valid Parentheses",
    category: "DSA",
    difficulty: "Easy",
    tags: ["Stack", "Strings"],
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    description:
      "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    inputFormat: "s: string",
    outputFormat: "boolean",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    sampleCases: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "Simple matching parentheses.",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All brackets properly opened and closed in order.",
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "Mismatched closing bracket.",
      },
    ],
    starterCode: {
      cpp: `class Solution {
public:
    bool isValid(string s) {
        
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        
    }
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        `,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    
};`,
      typescript: `function isValid(s: string): boolean {
    
};`,
      c: `bool isValid(char* s) {
    
}`,
      csharp: `public class Solution {
    public bool IsValid(string s) {
        
    }
}`,
      go: `func isValid(s string) bool {
    
}`,
      rust: `impl Solution {
    pub fn is_valid(s: String) -> bool {
        
    }
}`,
    },
    hints: [
      "Use a LIFO Stack data structure.",
      "Push opening brackets onto the stack. When encountering a closing bracket, check if it matches the top of the stack.",
    ],
    solutionApproach:
      "Iterate through the string with a stack. Push opening brackets `(`, `{`, `[`. When a closing bracket is seen, pop from stack and check match. Return true if stack is empty at end.",
    acceptanceRate: 85,
  },
  {
    title: "Trapping Rain Water",
    category: "DSA",
    difficulty: "Hard",
    tags: ["Two Pointers", "Dynamic Programming", "Stack"],
    companies: ["Google", "Amazon", "Microsoft", "Uber"],
    description:
      "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    inputFormat: "height: Array of non-negative integers",
    outputFormat: "integer: total units of trapped rain water",
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5",
    ],
    sampleCases: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.",
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
        explanation: "Trapped water volume is 9 units.",
      },
    ],
    starterCode: {
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        
    }
}`,
      python: `class Solution:
    def trap(self, height: List[int]) -> int:
        `,
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    
};`,
      typescript: `function trap(height: number[]): number {
    
};`,
      c: `int trap(int* height, int heightSize) {
    
}`,
      csharp: `public class Solution {
    public int Trap(int[] height) {
        
    }
}`,
      go: `func trap(height []int) int {
    
}`,
      rust: `impl Solution {
    pub fn trap(height: Vec<i32>) -> i32 {
        
    }
}`,
    },
    hints: [
      "Water at index i is determined by min(max_left, max_right) - height[i].",
      "Can you maintain two pointers from left and right to do this in O(1) space?",
    ],
    solutionApproach:
      "Two Pointers: Maintain left and right pointers with left_max and right_max. Move the pointer with the smaller max inward, adding (max - height) to the total.",
    acceptanceRate: 59,
  },
  {
    title: "Design a URL Shortener (TinyURL)",
    category: "System Design",
    difficulty: "Medium",
    tags: ["System Design", "Hashing", "Distributed Caching", "Database Sharding"],
    companies: ["Google", "Amazon", "Uber", "Microsoft"],
    description:
      "Design a scalable URL shortening service like TinyURL or bit.ly.\n\n### Functional Requirements:\n1. Given a long URL, generate a unique 7-character short URL alias.\n2. When users access the short link, redirect them to the original URL with < 100ms latency.\n3. Custom alias support (optional).\n4. Links expire after a default TTL (e.g., 2 years).\n\n### Non-Functional Requirements:\n1. Highly available (99.99% uptime).\n2. Read-heavy workload (100:1 read-to-write ratio).\n3. 100 Million new URLs shortened per month.",
    inputFormat: "POST /api/shorten { url: string }",
    outputFormat: "GET /{shortCode} => 302 Redirect to destination URL",
    constraints: [
      "Throughput: 1000 writes/sec, 100,000 reads/sec",
      "Storage: ~6 TB per year",
      "P99 Latency: < 50ms",
    ],
    sampleCases: [
      {
        input: 'Original: "https://placementhub.dev/practice/system-design"',
        output: 'Shortened: "https://tiny.ph/7xK9pQ"',
        explanation: "Base62 encoding of a distributed counter or MD5 hash prefix.",
      },
    ],
    starterCode: {
      javascript: `// System Design Architectural Blueprint (Node.js / Express)
class URLShortenerService {
  constructor() {
    this.BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  }

  encodeBase62(counterId) {
    let shortCode = "";
    while (counterId > 0) {
      shortCode = this.BASE62[counterId % 62] + shortCode;
      counterId = Math.floor(counterId / 62);
    }
    return shortCode.padStart(7, "0");
  }

  async shortenUrl(originalUrl) {
    // 1. Check Redis Cache
    // 2. Fetch distributed range ID (KGS)
    // 3. Encode Base62 & save to DB
  }
}`,
      python: `# System Design Architectural Blueprint (Python 3)
class URLShortenerService:
    BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    def encode_base62(self, counter_id: int) -> str:
        short_code = []
        while counter_id > 0:
            short_code.append(self.BASE62[counter_id % 62])
            counter_id //= 62
        return "".join(reversed(short_code)).zfill(7)

    def shorten_url(self, original_url: str) -> str:
        pass`,
      go: `package main

// URLShortener blueprint in Go
type URLShortenerService struct {
    Base62 string
}

func (s *URLShortenerService) ShortenUrl(originalUrl string) string {
    // Implement KGS + Base62
    return ""
}`,
      java: `public class URLShortenerService {
    private static final String BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public String shortenUrl(String originalUrl) {
        // Implement KGS + Base62
        return "";
    }
}`,
    },
    hints: [
      "How many unique URLs can a 7-character Base62 string represent? (62^7 = ~3.5 Trillion)",
      "Why is a 302 redirect preferred over a 301 redirect if analytics/click tracking is required?",
      "How do you prevent duplicate ID collisions across multiple servers? Consider a Token Range Key Generation Service (KGS).",
    ],
    solutionApproach:
      "1. Use Base62 (a-z, A-Z, 0-9) encoding over a 64-bit distributed auto-increment ID.\n2. Add a Redis cache cluster fronting the database to serve 90% of requests in memory.\n3. Return HTTP 302 (Found) so clicks route through your analytics pipeline.",
    acceptanceRate: 70,
  },
  {
    title: "Department Highest Salary",
    category: "SQL",
    difficulty: "Medium",
    tags: ["SQL", "Join", "Window Function", "Group By"],
    companies: ["Amazon", "Microsoft", "Google"],
    description:
      "Table: Employee\n+---------------+---------+\n| Column Name   | Type    |\n+---------------+---------+\n| id            | int     |\n| name          | varchar |\n| salary        | int     |\n| departmentId  | int     |\n+---------------+---------+\n\nTable: Department\n+---------------+---------+\n| Column Name   | Type    |\n+---------------+---------+\n| id            | int     |\n| name          | varchar |\n+---------------+---------+\n\nWrite a solution to find employees who have the highest salary in each of the departments.\nReturn the result table in any order.",
    inputFormat: "Employee table and Department table schema",
    outputFormat: "Columns: Department, Employee, Salary",
    constraints: ["Salary is a positive integer."],
    sampleCases: [
      {
        input: "Employee: [1, 'Joe', 85000, 1], [2, 'Henry', 80000, 2], [3, 'Sam', 60000, 2], [4, 'Max', 90000, 1]\nDepartment: [1, 'IT'], [2, 'Sales']",
        output: "Department: IT | Employee: Max | Salary: 90000\nDepartment: Sales | Employee: Henry | Salary: 80000",
        explanation: "Max has highest in IT (90000), Henry has highest in Sales (80000).",
      },
    ],
    starterCode: {
      mysql: `/*
  ===================================================================
  FULL DATABASE TABLE SCHEMA & SAMPLE INSERT DATA
  ===================================================================
  CREATE TABLE Department (
      id INT PRIMARY KEY,
      name VARCHAR(50)
  );

  CREATE TABLE Employee (
      id INT PRIMARY KEY,
      name VARCHAR(50),
      salary INT,
      departmentId INT,
      FOREIGN KEY (departmentId) REFERENCES Department(id)
  );

  INSERT INTO Department VALUES (1, 'IT'), (2, 'Sales');
  INSERT INTO Employee VALUES 
  (1, 'Joe', 85000, 1),
  (2, 'Henry', 80000, 2),
  (3, 'Sam', 60000, 2),
  (4, 'Max', 90000, 1);
  ===================================================================
*/

-- Write your MySQL 8.0 Query below:
`,
      postgresql: `/*
  ===================================================================
  FULL DATABASE TABLE SCHEMA & SAMPLE INSERT DATA
  ===================================================================
  CREATE TABLE Department (id INT PRIMARY KEY, name VARCHAR(50));
  CREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, departmentId INT);
  ===================================================================
*/

-- Write your PostgreSQL 15 Query below:
`,
      oracle: `/*
  ===================================================================
  FULL DATABASE TABLE SCHEMA & SAMPLE INSERT DATA
  ===================================================================
  CREATE TABLE Department (id NUMBER PRIMARY KEY, name VARCHAR2(50));
  CREATE TABLE Employee (id NUMBER PRIMARY KEY, name VARCHAR2(50), salary NUMBER, departmentId NUMBER);
  ===================================================================
*/

-- Write your Oracle SQL Query below:
`,
      mssql: `/*
  ===================================================================
  FULL DATABASE TABLE SCHEMA & SAMPLE INSERT DATA
  ===================================================================
  CREATE TABLE Department (id INT PRIMARY KEY, name VARCHAR(50));
  CREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, departmentId INT);
  ===================================================================
*/

-- Write your MS SQL Server (T-SQL) Query below:
`,
      sql: `/*
  ===================================================================
  FULL DATABASE TABLE SCHEMA & SAMPLE INSERT DATA
  ===================================================================
  CREATE TABLE Department (id INT PRIMARY KEY, name VARCHAR(50));
  CREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, departmentId INT);
  ===================================================================
*/

-- Write your Standard SQL / SQLite Query below:
`,
    },
    hints: [
      "You can use a subquery with GROUP BY departmentId and MAX(salary).",
      "Alternatively, use DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC).",
    ],
    solutionApproach:
      "Filter employees whose (departmentId, salary) matches the MAX(salary) grouped by departmentId, then JOIN with Department table to fetch department name.",
    acceptanceRate: 76,
  },
  {
    title: "Recyclable and Low Fat Products",
    category: "SQL",
    difficulty: "Easy",
    tags: ["SQL", "Select", "Filter"],
    companies: ["Amazon", "Google", "Facebook"],
    description:
      "Table: Products\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| product_id  | int     |\n| low_fats    | enum    |\n| recyclable  | enum    |\n+-------------+---------+\n\nproduct_id is the primary key for this table.\nlow_fats is an ENUM ('Y', 'N') and recyclable is an ENUM ('Y', 'N').\n\nWrite a solution to find the ids of products that are both low fat and recyclable.",
    inputFormat: "Products table schema",
    outputFormat: "product_id (int)",
    constraints: ["product_id is unique."],
    sampleCases: [
      {
        input: "Products: [0, 'Y', 'N'], [1, 'Y', 'Y'], [2, 'N', 'Y'], [3, 'Y', 'Y'], [4, 'N', 'N']",
        output: "product_id: 1, 3",
        explanation: "Products 1 and 3 are low fat ('Y') and recyclable ('Y').",
      },
    ],
    starterCode: {
      mysql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Products (
      product_id INT PRIMARY KEY,
      low_fats ENUM('Y', 'N'),
      recyclable ENUM('Y', 'N')
  );
  INSERT INTO Products VALUES (0, 'Y', 'N'), (1, 'Y', 'Y'), (2, 'N', 'Y'), (3, 'Y', 'Y'), (4, 'N', 'N');
  ===================================================================
*/

-- Write your MySQL 8.0 Query below:
`,
      postgresql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Products (product_id INT PRIMARY KEY, low_fats VARCHAR(1), recyclable VARCHAR(1));
  ===================================================================
*/

-- Write your PostgreSQL 15 Query below:
`,
      oracle: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Products (product_id NUMBER PRIMARY KEY, low_fats VARCHAR2(1), recyclable VARCHAR2(1));
  ===================================================================
*/

-- Write your Oracle SQL Query below:
`,
      mssql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Products (product_id INT PRIMARY KEY, low_fats CHAR(1), recyclable CHAR(1));
  ===================================================================
*/

-- Write your MS SQL Server (T-SQL) Query below:
`,
      sql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Products (product_id INT PRIMARY KEY, low_fats TEXT, recyclable TEXT);
  ===================================================================
*/

-- Write your Standard SQL / SQLite Query below:
`,
    },
    hints: ["Use a simple WHERE clause filtering low_fats = 'Y' AND recyclable = 'Y'."],
    solutionApproach: "Filter products table where low_fats = 'Y' and recyclable = 'Y'.",
    acceptanceRate: 94,
  },
  {
    title: "Find Customer Referee",
    category: "SQL",
    difficulty: "Easy",
    tags: ["SQL", "Select", "Null Handling"],
    companies: ["Amazon", "Google", "Microsoft"],
    description:
      "Table: Customer\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| name        | varchar |\n| referee_id  | int     |\n+-------------+---------+\n\nFind the names of the customer that are not referred by the customer with id = 2.",
    inputFormat: "Customer table schema",
    outputFormat: "name (varchar)",
    constraints: ["referee_id can be NULL."],
    sampleCases: [
      {
        input: "Customer: [1, 'Will', null], [2, 'Jane', null], [3, 'Alex', 2], [4, 'Bill', null], [5, 'Zack', 1], [6, 'Mark', 2]",
        output: "Will, Jane, Bill, Zack",
        explanation: "Customers not referred by ID 2.",
      },
    ],
    starterCode: {
      mysql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Customer (
      id INT PRIMARY KEY,
      name VARCHAR(50),
      referee_id INT
  );
  INSERT INTO Customer VALUES (1, 'Will', NULL), (2, 'Jane', NULL), (3, 'Alex', 2), (4, 'Bill', NULL), (5, 'Zack', 1), (6, 'Mark', 2);
  ===================================================================
*/

-- Write your MySQL 8.0 Query below:
`,
      postgresql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Customer (id INT PRIMARY KEY, name VARCHAR(50), referee_id INT);
  ===================================================================
*/

-- Write your PostgreSQL 15 Query below:
`,
      oracle: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Customer (id NUMBER PRIMARY KEY, name VARCHAR2(50), referee_id NUMBER);
  ===================================================================
*/

-- Write your Oracle SQL Query below:
`,
      mssql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Customer (id INT PRIMARY KEY, name VARCHAR(50), referee_id INT);
  ===================================================================
*/

-- Write your MS SQL Server (T-SQL) Query below:
`,
      sql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Customer (id INT PRIMARY KEY, name VARCHAR(50), referee_id INT);
  ===================================================================
*/

-- Write your Standard SQL / SQLite Query below:
`,
    },
    hints: ["Remember in SQL, NULL != 2 evaluates to UNKNOWN, so you must explicitly check IS NULL or use IS DISTINCT FROM."],
    solutionApproach: "Select name from Customer where referee_id != 2 OR referee_id IS NULL.",
    acceptanceRate: 89,
  },
  {
    title: "Big Countries",
    category: "SQL",
    difficulty: "Easy",
    tags: ["SQL", "Select", "Where"],
    companies: ["Google", "Amazon", "Uber"],
    description:
      "Table: World\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| name        | varchar |\n| continent   | varchar |\n| area        | int     |\n| population  | int     |\n| gdp         | bigint  |\n+-------------+---------+\n\nA country is big if:\n- it has an area of at least 3 million (3,000,000 km2), or\n- it has a population of at least 25 million (25,000,000).\n\nWrite a solution to find the name, population, and area of the big countries.",
    inputFormat: "World table schema",
    outputFormat: "name, population, area",
    constraints: ["area and population are non-negative."],
    sampleCases: [
      {
        input: "World: ['Afghanistan', 'Asia', 652230, 25500100, 20364000000], ['Algeria', 'Africa', 2381741, 37100000, 188681000000]",
        output: "Afghanistan (population > 25M), Algeria (population > 25M)",
        explanation: "Both countries meet the big country criteria.",
      },
    ],
    starterCode: {
      mysql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE World (
      name VARCHAR(50) PRIMARY KEY,
      continent VARCHAR(50),
      area INT,
      population INT,
      gdp BIGINT
  );
  INSERT INTO World VALUES ('Afghanistan', 'Asia', 652230, 25500100, 20364000000), ('Algeria', 'Africa', 2381741, 37100000, 188681000000);
  ===================================================================
*/

-- Write your MySQL 8.0 Query below:
`,
      postgresql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE World (name VARCHAR(50) PRIMARY KEY, continent VARCHAR(50), area INT, population INT, gdp BIGINT);
  ===================================================================
*/

-- Write your PostgreSQL 15 Query below:
`,
      oracle: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE World (name VARCHAR2(50) PRIMARY KEY, continent VARCHAR2(50), area NUMBER, population NUMBER, gdp NUMBER);
  ===================================================================
*/

-- Write your Oracle SQL Query below:
`,
      mssql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE World (name VARCHAR(50) PRIMARY KEY, continent VARCHAR(50), area INT, population INT, gdp BIGINT);
  ===================================================================
*/

-- Write your MS SQL Server (T-SQL) Query below:
`,
      sql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE World (name VARCHAR(50) PRIMARY KEY, continent VARCHAR(50), area INT, population INT, gdp BIGINT);
  ===================================================================
*/

-- Write your Standard SQL / SQLite Query below:
`,
    },
    hints: ["Use WHERE area >= 3000000 OR population >= 25000000."],
    solutionApproach: "Select name, population, area from World with area >= 3M or population >= 25M.",
    acceptanceRate: 82,
  },
  {
    title: "Second Highest Salary",
    category: "SQL",
    difficulty: "Medium",
    tags: ["SQL", "Subquery", "Window Function", "Null Handling"],
    companies: ["Google", "Amazon", "Microsoft", "Uber"],
    description:
      "Table: Employee\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| salary      | int     |\n+-------------+---------+\n\nWrite a solution to find the second highest salary from the Employee table. If there is no second highest salary, return null.",
    inputFormat: "Employee table schema",
    outputFormat: "SecondHighestSalary (int or NULL)",
    constraints: ["id is primary key."],
    sampleCases: [
      {
        input: "Employee: [1, 100], [2, 200], [3, 300]",
        output: "SecondHighestSalary: 200",
        explanation: "200 is the second highest distinct salary.",
      },
      {
        input: "Employee: [1, 100]",
        output: "SecondHighestSalary: null",
        explanation: "Only 1 salary exists, return null.",
      },
    ],
    starterCode: {
      mysql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Employee (
      id INT PRIMARY KEY,
      salary INT
  );
  INSERT INTO Employee VALUES (1, 100), (2, 200), (3, 300);
  ===================================================================
*/

-- Write your MySQL 8.0 Query below:
`,
      postgresql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Employee (id INT PRIMARY KEY, salary INT);
  ===================================================================
*/

-- Write your PostgreSQL 15 Query below:
`,
      oracle: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Employee (id NUMBER PRIMARY KEY, salary NUMBER);
  ===================================================================
*/

-- Write your Oracle SQL Query below:
`,
      mssql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Employee (id INT PRIMARY KEY, salary INT);
  ===================================================================
*/

-- Write your MS SQL Server (T-SQL) Query below:
`,
      sql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Employee (id INT PRIMARY KEY, salary INT);
  ===================================================================
*/

-- Write your Standard SQL / SQLite Query below:
`,
    },
    hints: [
      "Wrapping the subquery in SELECT (...) AS SecondHighestSalary ensures NULL is returned when offset 1 is empty.",
      "Alternatively, use MAX(salary) WHERE salary < (SELECT MAX(salary) FROM Employee).",
    ],
    solutionApproach: "Use MAX(salary) with a subquery filtering out the highest salary, or subquery with LIMIT 1 OFFSET 1 wrapped in SELECT.",
    acceptanceRate: 48,
  },
  {
    title: "Consecutive Numbers",
    category: "SQL",
    difficulty: "Medium",
    tags: ["SQL", "Window Function", "Lead/Lag", "Join"],
    companies: ["Amazon", "Google", "Uber"],
    description:
      "Table: Logs\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| num         | varchar |\n+-------------+---------+\n\nFind all numbers that appear at least three times consecutively.\nReturn the result table in any order.",
    inputFormat: "Logs table schema",
    outputFormat: "ConsecutiveNums (varchar)",
    constraints: ["id is an autoincrementing primary key."],
    sampleCases: [
      {
        input: "Logs: [1, '1'], [2, '1'], [3, '1'], [4, '2'], [5, '1'], [6, '2'], [7, '2']",
        output: "ConsecutiveNums: 1",
        explanation: "1 is the only number that appears consecutively 3 times (id 1, 2, 3).",
      },
    ],
    starterCode: {
      mysql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      num VARCHAR(10)
  );
  INSERT INTO Logs (id, num) VALUES (1, '1'), (2, '1'), (3, '1'), (4, '2'), (5, '1'), (6, '2'), (7, '2');
  ===================================================================
*/

-- Write your MySQL 8.0 Query below:
`,
      postgresql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Logs (id INT PRIMARY KEY, num VARCHAR(10));
  ===================================================================
*/

-- Write your PostgreSQL 15 Query below:
`,
      oracle: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Logs (id NUMBER PRIMARY KEY, num VARCHAR2(10));
  ===================================================================
*/

-- Write your Oracle SQL Query below:
`,
      mssql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Logs (id INT PRIMARY KEY, num VARCHAR(10));
  ===================================================================
*/

-- Write your MS SQL Server (T-SQL) Query below:
`,
      sql: `/*
  ===================================================================
  FULL TABLE SCHEMA & SAMPLE DATA
  ===================================================================
  CREATE TABLE Logs (id INT PRIMARY KEY, num VARCHAR(10));
  ===================================================================
*/

-- Write your Standard SQL / SQLite Query below:
`,
    },
    hints: ["Use window functions LEAD(num, 1) and LEAD(num, 2) ordered by ID, or self-join Logs 3 times."],
    solutionApproach: "Use LEAD window function to compare current number with next two rows.",
    acceptanceRate: 51,
  },
  {
    title: "Pipes and Cisterns Efficiency",
    category: "Aptitude",
    difficulty: "Medium",
    tags: ["Time and Work", "Aptitude", "Quantitative"],
    companies: ["Google", "Amazon", "Microsoft"],
    description:
      "Two pipes A and B can fill a cistern in 20 minutes and 30 minutes respectively. A third pipe C can empty the full cistern in 15 minutes.\n\nIf all three pipes are opened together simultaneously, how long will it take to fill the cistern completely?",
    inputFormat: "Pipe A = 20 mins, Pipe B = 30 mins, Pipe C = -15 mins",
    outputFormat: "Time in minutes to fill the cistern",
    constraints: ["All rates are constant."],
    sampleCases: [
      {
        input: "Pipe A: +1/20, Pipe B: +1/30, Pipe C: -1/15",
        output: "60 minutes",
        explanation: "Net rate per minute = 1/20 + 1/30 - 1/15 = (3 + 2 - 4) / 60 = 1/60 cistern/min. Therefore, 60 minutes.",
      },
    ],
    starterCode: {
      javascript: `/**
 * @return {number} fill time in minutes
 */
function calculateFillTime() {
    // Write formula here
    return 60;
}`,
      python: `def calculate_fill_time() -> int:
    # Write formula here
    return 60`,
      cpp: `class Solution {
public:
    int calculateFillTime() {
        return 60;
    }
};`,
      java: `class Solution {
    public int calculateFillTime() {
        return 60;
    }
}`,
    },
    hints: [
      "Use the LCM method to assume the total capacity of the cistern.",
      "LCM of 20, 30, 15 is 60 units.",
      "Net rate = Rate(A) + Rate(B) - Rate(C).",
    ],
    solutionApproach:
      "1. Find LCM(20, 30, 15) = 60 liters.\n2. Rate A = 3 L/min, Rate B = 2 L/min, Rate C = -4 L/min.\n3. Net flow = 3 + 2 - 4 = 1 L/min.\n4. Time needed = 60 / 1 = 60 minutes.",
    acceptanceRate: 91,
  },
];

async function seedPhase3() {
  try {
    await connectDB();
    console.log("Database connected for Phase 3 seed...");

    // Seed Companies
    for (const comp of companiesData) {
      await Company.findOneAndUpdate({ name: comp.name }, comp, {
        upsert: true,
        returnDocument: "after",
      });
      console.log(`Seeded company: ${comp.name}`);
    }

    // Seed Practice Questions
    for (const q of questionsData) {
      await Question.findOneAndUpdate({ title: q.title }, q, {
        upsert: true,
        returnDocument: "after",
      });
      console.log(`Seeded question: ${q.title}`);
    }

    console.log("Phase 3 data with multi-language starter codes seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding Phase 3:", err);
    process.exit(1);
  }
}

seedPhase3();
