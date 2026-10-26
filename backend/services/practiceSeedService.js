const Question = require("../models/Question");

const defaultPracticeQuestions = [
  // DSA Questions
  {
    title: "Two Sum",
    questionType: "coding",
    category: "DSA",
    topic: "Hash Tables",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    companies: ["Google", "Amazon", "Microsoft", "Uber", "Meta"],
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
    ],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n};`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};`,
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
    questionType: "coding",
    category: "DSA",
    topic: "Sliding Window",
    difficulty: "Medium",
    tags: ["Strings", "Sliding Window", "Hash Table"],
    companies: ["Amazon", "Google", "Microsoft", "Uber"],
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
    ],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    // Write your solution here\n};`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        return 0;\n    }\n};`,
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
    questionType: "coding",
    category: "DSA",
    topic: "Hash Tables",
    difficulty: "Hard",
    tags: ["Design", "Doubly Linked List", "Hash Table"],
    companies: ["Google", "Amazon", "Uber", "Microsoft", "Netflix"],
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class with `get(key)` and `put(key, value)` in O(1) average time complexity.",
    inputFormat: "Operations sequence and key-value inputs",
    outputFormat: "Outputs of get and put operations",
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
    ],
    sampleCases: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2]]',
        output: "[null, null, null, 1, null, -1]",
        explanation: "Key 2 is evicted when key 3 is added because capacity is 2.",
      },
    ],
    starterCode: {
      javascript: `var LRUCache = function(capacity) {\n    // Initialize cache\n};\nLRUCache.prototype.get = function(key) {};\nLRUCache.prototype.put = function(key, value) {};`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass`,
      java: `class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`,
      cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`,
    },
    hints: [
      "Combine a Doubly Linked List with a Hash Map to achieve O(1) lookup and O(1) removal/insertion.",
    ],
    solutionApproach:
      "A hash map maps key -> Node pointer. A doubly linked list maintains the LRU order: head is Most Recently Used, tail is Least Recently Used.",
    acceptanceRate: 52,
  },
  {
    title: "Best Time to Buy and Sell Stock",
    questionType: "coding",
    category: "DSA",
    topic: "Arrays",
    difficulty: "Easy",
    tags: ["Arrays", "Greedy"],
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    description:
      "Given an array prices where prices[i] is the price of a stock on day i, return the maximum profit from buying on one day and selling on a later day. If no profit is possible, return 0.",
    inputFormat: "prices: integer array",
    outputFormat: "Maximum profit as an integer",
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    sampleCases: [{ input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy at 1 and sell at 6 for profit 5." }],
    starterCode: {
      javascript: `function maxProfit(prices) {\n  // Write your solution here\n}`,
      python: `class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        pass`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        return 0;\n    }\n};`,
    },
    hints: ["Track the lowest price seen so far.", "Update the answer with price - lowestPrice each day."],
    solutionApproach: "Scan once while tracking the minimum price and best profit in O(n) time and O(1) space.",
    acceptanceRate: 75,
  },
  {
    title: "Product of Array Except Self",
    questionType: "coding",
    category: "DSA",
    topic: "Arrays",
    difficulty: "Medium",
    tags: ["Arrays", "Prefix Product"],
    companies: ["Amazon", "Microsoft", "Uber", "Apple"],
    description:
      "Return an array answer such that answer[i] equals the product of every element of nums except nums[i]. Do not use division.",
    inputFormat: "nums: integer array",
    outputFormat: "Integer array",
    constraints: ["2 <= nums.length <= 10^5"],
    sampleCases: [{ input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "Each position combines its left and right products." }],
    starterCode: {
      javascript: `function productExceptSelf(nums) {\n  // Write your solution here\n}`,
      python: `class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        pass`,
      java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        return new int[]{};\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        return {};\n    }\n};`,
    },
    hints: ["Build prefix products from left.", "Multiply running suffix products from right."],
    solutionApproach: "Prefix and suffix product passes in O(n) time and O(1) extra space.",
    acceptanceRate: 68,
  },
  {
    title: "Trapping Rain Water",
    questionType: "coding",
    category: "DSA",
    topic: "Two Pointers",
    difficulty: "Hard",
    tags: ["Two Pointers", "Stacks", "Arrays"],
    companies: ["Google", "Amazon", "Microsoft", "Uber"],
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    inputFormat: "height: integer array",
    outputFormat: "Total trapped water as integer",
    constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    sampleCases: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "6 units of rain water are trapped." }],
    starterCode: {
      javascript: `function trap(height) {\n  // Write your solution here\n}`,
      python: `class Solution:\n    def trap(self, height: list[int]) -> int:\n        pass`,
      java: `class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        return 0;\n    }\n};`,
    },
    hints: ["Water trapped at i is min(maxLeft, maxRight) - height[i].", "Two pointers from ends can eliminate extra arrays."],
    solutionApproach: "Two pointer approach tracking leftMax and rightMax in O(n) time and O(1) space.",
    acceptanceRate: 59,
  },
  {
    title: "Valid Parentheses",
    questionType: "coding",
    category: "DSA",
    topic: "Stacks",
    difficulty: "Easy",
    tags: ["Stack", "Strings"],
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    inputFormat: "s: string",
    outputFormat: "boolean",
    constraints: ["1 <= s.length <= 10^4"],
    sampleCases: [
      { input: 's = "()"', output: "true", explanation: "Valid bracket match." },
      { input: 's = "()[]{}"', output: "true", explanation: "All closed in order." },
      { input: 's = "(]"', output: "false", explanation: "Mismatch bracket." },
    ],
    starterCode: {
      javascript: `function isValid(s) {\n  // Write your solution here\n}`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        return false;\n    }\n};`,
    },
    hints: ["Use a stack. Push opening brackets, pop and verify on closing brackets."],
    solutionApproach: "Stack-based bracket matching in O(n) time and O(n) space.",
    acceptanceRate: 85,
  },
  // System Design Questions
  {
    title: "Design a URL Shortener (TinyURL)",
    questionType: "system-design",
    category: "System Design",
    topic: "API Fundamentals",
    difficulty: "Medium",
    tags: ["Distributed Systems", "Hashing", "Database Design", "Caching"],
    companies: ["Google", "Amazon", "Microsoft", "Uber", "Meta"],
    description:
      "Design a scalable URL shortening service like TinyURL. Given a long URL, generate a shorter unique alias (e.g., https://tiny.url/xyz123). When users access the short link, redirect them to the original URL in under 20ms.",
    inputFormat: "System architecture, API design, database schema, scaling, and caching strategy.",
    outputFormat: "Structured system design blueprint",
    constraints: ["100 Million new URLs created per month", "1 Billion redirection queries per month", "High availability (99.99%)"],
    sampleCases: [],
    hints: ["Consider Base62 encoding of an auto-incrementing ID or distributed snowflake ID.", "Cache hot redirection URLs in Redis."],
    solutionApproach: "API Gateway -> Load Balancer -> Web Application -> Distributed ID generator -> Redis cache -> Relational/NoSQL database for URL mappings.",
    acceptanceRate: 72,
  },
  {
    title: "Design a Rate Limiter",
    questionType: "system-design",
    category: "System Design",
    topic: "API Fundamentals",
    difficulty: "Medium",
    tags: ["Distributed Systems", "Redis", "API Design"],
    companies: ["Google", "Amazon", "Uber", "Netflix"],
    description:
      "Design a distributed API rate limiter for a public platform that serves 1 million users. The limiter must support per-user and per-IP limits, return HTTP 429 Too Many Requests, and remain available during traffic spikes.",
    inputFormat: "Explain the architecture, storage model, algorithm, APIs, and failure behavior.",
    outputFormat: "A structured system design response",
    constraints: ["P99 decision latency below 10 ms", "Multiple application regions", "Configurable limits by plan"],
    sampleCases: [],
    hints: ["Compare token bucket and sliding window counter approaches.", "Discuss Redis atomic operations with Lua scripts."],
    solutionApproach: "Use an API Gateway filter with a Redis-backed token bucket, atomic Lua updates, and graceful fail-open on cache downtime.",
    acceptanceRate: 68,
  },
  {
    title: "Design a Notification Service",
    questionType: "system-design",
    category: "System Design",
    topic: "Communication Patterns",
    difficulty: "Hard",
    tags: ["Event Driven", "Kafka", "Microservices"],
    companies: ["Amazon", "Microsoft", "Uber", "Meta"],
    description:
      "Design a notification platform that sends Email, SMS, and Push notifications for product events. It must support user preferences, retries, deduplication, provider failover, and delivery tracking.",
    inputFormat: "Explain components, event flow, data model, and operational trade-offs.",
    outputFormat: "A structured system design response",
    constraints: ["10,000 events per second", "At-least-once event delivery", "Per-channel provider limits"],
    sampleCases: [],
    hints: ["Separate event ingestion from channel delivery workers.", "Use idempotency keys and dead-letter queues."],
    solutionApproach: "Durable event bus (Kafka) -> Notification Service -> User Preference Service -> Channel Workers (APNS/FCM/Twilio/SendGrid) -> Dead Letter Queue.",
    acceptanceRate: 61,
  },
  {
    title: "Design a Ride Matching System",
    questionType: "system-design",
    category: "System Design",
    topic: "Distributed Systems",
    difficulty: "Hard",
    tags: ["Geospatial", "Streaming", "Concurrency"],
    companies: ["Uber", "Google"],
    description:
      "Design the core matching service for riders and drivers. Explain how nearby drivers are found, how matches are reserved safely without double-booking, and how location updates scale.",
    inputFormat: "Explain geospatial indexing, matching, events, and consistency.",
    outputFormat: "A structured system design response",
    constraints: ["Millions of active drivers", "Frequent GPS updates (every 3 seconds)", "No double booking"],
    sampleCases: [],
    hints: ["Consider Geohash or Google S2 spatial cells.", "Use distributed Redis locks or short-lived reservation leases."],
    solutionApproach: "Partition location updates into spatial cells (Geohash), maintain driver state in Redis, and reserve matches via short-lived atomic leases.",
    acceptanceRate: 49,
  },
  // SQL Questions
  {
    title: "Second Highest Salary",
    questionType: "coding",
    category: "SQL",
    topic: "Subqueries",
    difficulty: "Easy",
    tags: ["SQL", "Subquery", "Distinct"],
    companies: ["Amazon", "Microsoft", "Google", "Adobe"],
    description:
      "Write a query to find the second highest distinct salary from the `Employee` table. Return NULL when a second salary does not exist.",
    inputFormat: "Employee(id INT, salary INT)",
    outputFormat: "SecondHighestSalary",
    constraints: ["Salary values may repeat."],
    sampleCases: [{ input: "Employee: [(1, 100), (2, 200), (3, 300)]", output: "200", explanation: "300 is highest, 200 is second highest." }],
    starterCode: {
      sql: "-- Write your SQL query here\nSELECT (\n    SELECT DISTINCT salary\n    FROM Employee\n    ORDER BY salary DESC\n    LIMIT 1 OFFSET 1\n) AS SecondHighestSalary;",
      mysql: "-- Write your MySQL query here\n",
      postgresql: "-- Write your PostgreSQL query here\n",
    },
    hints: ["Use DISTINCT before ordering.", "Wrap with SELECT (...) to return NULL if row is absent."],
    solutionApproach: "Select distinct salary in descending order, limit 1 offset 1 wrapped in an outer select.",
    acceptanceRate: 76,
  },
  {
    title: "Department Top Three Salaries",
    questionType: "coding",
    category: "SQL",
    topic: "Advanced String Functions",
    difficulty: "Hard",
    tags: ["SQL", "Window Function", "Dense Rank"],
    companies: ["Google", "Amazon", "Microsoft", "Uber"],
    description:
      "A company's executives are interested in seeing who earns the most money in each of the company's departments. Write a solution to find the employees who are high earners in each of the departments (top 3 unique salaries).",
    inputFormat: "Employee(id, name, salary, departmentId), Department(id, name)",
    outputFormat: "Department, Employee, Salary",
    constraints: ["Ties share the same salary rank."],
    sampleCases: [{ input: "Department and Employee tables", output: "Top 3 distinct earners per department", explanation: "DENSE_RANK preserves ties." }],
    starterCode: {
      sql: "-- Write your SQL query here using DENSE_RANK()\n",
      mysql: "-- Write your MySQL 8.0 query here\n",
      postgresql: "-- Write your PostgreSQL query here\n",
    },
    hints: ["Use DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC).", "Filter ranks <= 3."],
    solutionApproach: "Use Common Table Expression (CTE) with DENSE_RANK partitioned by department.",
    acceptanceRate: 54,
  },
  // Aptitude Questions
  {
    title: "Pipes and Cisterns Efficiency",
    questionType: "mcq",
    category: "Aptitude",
    topic: "Quantitative",
    difficulty: "Medium",
    tags: ["Aptitude", "Multiple Choice", "Time & Work"],
    companies: ["Google", "Amazon", "Microsoft", "TCS", "Infosys"],
    description:
      "Two pipes A and B can fill a cistern in 20 and 30 minutes respectively. Pipe C can empty it in 15 minutes. If all three are opened together, how long will it take to fill the cistern?",
    inputFormat: "Multiple Choice Question",
    outputFormat: "Correct Option",
    constraints: [],
    sampleCases: [],
    options: ["30 minutes", "45 minutes", "60 minutes", "90 minutes"],
    correctOption: 2,
    answerExplanation: "Net rate = 1/20 + 1/30 - 1/15 = 3/60 + 2/60 - 4/60 = 1/60 cistern per minute. Therefore, time required is 60 minutes.",
    hints: ["Calculate net fractional filling rate per minute."],
    solutionApproach: "Net rate = (1/A + 1/B - 1/C) = 1/60 per min, so 60 mins.",
    acceptanceRate: 80,
  },
  {
    title: "Profit and Loss: Marked Price Discount",
    questionType: "mcq",
    category: "Aptitude",
    topic: "Quantitative",
    difficulty: "Easy",
    tags: ["Aptitude", "Multiple Choice", "Profit & Loss"],
    companies: ["Amazon", "Microsoft", "Wipro", "Cognizant"],
    description:
      "An article marked at ₹1,000 is sold at a discount of 10%. If the dealer still makes a profit of 20%, what was the cost price of the article?",
    inputFormat: "Multiple Choice Question",
    outputFormat: "Correct Option",
    constraints: [],
    sampleCases: [],
    options: ["₹700", "₹750", "₹800", "₹850"],
    correctOption: 1,
    answerExplanation: "Selling Price (SP) = 1000 - 10% = ₹900. Since SP gives 20% profit on CP: 1.20 × CP = 900 => CP = 900 / 1.2 = ₹750.",
    hints: ["Find SP first after the 10% discount on ₹1,000, then find CP from 1.20 * CP = SP."],
    solutionApproach: "SP = ₹900. CP = 900 / 1.20 = ₹750.",
    acceptanceRate: 85,
  },
  {
    title: "Percentages: Successive Change",
    questionType: "mcq",
    category: "Aptitude",
    topic: "Quantitative",
    difficulty: "Easy",
    tags: ["Aptitude", "Multiple Choice", "Percentages"],
    companies: ["Google", "Amazon", "Uber"],
    description:
      "A software developer's base salary increases by 20% in Year 1, but due to market conditions decreases by 20% in Year 2. What is the net percentage change in their salary from original?",
    inputFormat: "Multiple Choice Question",
    outputFormat: "Correct Option",
    constraints: [],
    sampleCases: [],
    options: ["No change (0%)", "4% decrease", "4% increase", "2% decrease"],
    correctOption: 1,
    answerExplanation: "Net factor = (1 + 0.20) × (1 - 0.20) = 1.20 × 0.80 = 0.96. 0.96 represents 96% of the original salary, which is a 4% decrease.",
    hints: ["Multiply the change multipliers: (1 + 0.20) * (1 - 0.20)."],
    solutionApproach: "Formula: x + y + (xy/100) = 20 - 20 - (400/100) = -4%.",
    acceptanceRate: 89,
  },
];

let isSeeding = false;

const ensureQuestionsSeeded = async () => {
  try {
    const count = await Question.countDocuments();
    if (count < defaultPracticeQuestions.length && !isSeeding) {
      isSeeding = true;
      console.log(`[Practice] Seeding questions (current: ${count}, required: ${defaultPracticeQuestions.length})...`);
      for (const q of defaultPracticeQuestions) {
        await Question.findOneAndUpdate({ title: q.title }, q, {
          upsert: true,
          new: true,
        });
      }
      console.log(`[Practice] Questions successfully verified and seeded!`);
      isSeeding = false;
    }
  } catch (err) {
    console.error("[Practice] Auto-seed error:", err.message);
    isSeeding = false;
  }
};

module.exports = {
  defaultPracticeQuestions,
  ensureQuestionsSeeded,
};
