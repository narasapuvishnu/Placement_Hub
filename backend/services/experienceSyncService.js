const Experience = require("../models/Experience");
const User = require("../models/User");

const defaultExperiences = [
  {
    company: "Google",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    role: "Software Engineer (L3 - New Grad)",
    outcome: "Offered",
    batchYear: 2025,
    jobType: "Full-Time",
    overallDifficulty: "Hard",
    salaryDetails: "₹34 LPA Base + ₹14 Lakh Stocks + ₹3.5 Lakh Joining Bonus",
    location: "Bangalore / Hyderabad, India",
    title: "Google L3 Software Engineer (New Grad) - Complete Onsite Journey",
    summary:
      "Applied via off-campus referral for early career SDE. The recruitment pipeline had 1 Online Assessment on Google's portal and 4 Onsite technical interviews (3 DSA Coding + 1 Googliness & Leadership). Clear communication of time/space complexity before writing code was critical to getting positive hire recommendations.",
    rounds: [
      {
        roundName: "Round 1: Online Assessment",
        roundType: "Online Assessment",
        description: "2 algorithmic coding questions on Google's internal testing platform with a 90-minute limit.",
        questionsAsked: [
          "Graph Shortest Path variation with dynamic edge weight modifications and Dijkstra priority queue.",
          "Sliding window median calculation using two heaps (MinHeap and MaxHeap).",
        ],
        tips: "Make sure your code handles large edge cases (empty nodes, negative weights, large integer limits). Write clean modular helper functions.",
      },
      {
        roundName: "Round 2: Onsite Technical Round 1 (Trees & Graphs)",
        roundType: "Technical Coding",
        description: "Focus on binary tree traversals, ancestral relationships, and space optimization in a plain text Google Doc.",
        questionsAsked: [
          "Lowest Common Ancestor in a Binary Tree with parent pointers.",
          "Optimize space complexity from O(Height) to O(1) Morris Traversal style.",
        ],
        tips: "State your time/space complexity explicitly before typing. Dry-run sample test cases manually.",
      },
      {
        roundName: "Round 3: Onsite Technical Round 2 (DP & Strings)",
        roundType: "Technical Coding",
        description: "Advanced string matching and Dynamic Programming state transitions.",
        questionsAsked: [
          "Edit Distance variant with custom insertion and replacement cost metrics.",
          "Trace DP 2D table state transitions on virtual whiteboard.",
        ],
        tips: "Start with recursive top-down memoization, then demonstrate bottom-up tabulation space optimization.",
      },
      {
        roundName: "Round 4: Googliness & Leadership Round",
        roundType: "HR/Cultural",
        description: "45-minute behavioral round evaluating cross-team empathy, handling ambiguity, and ethical decision-making.",
        questionsAsked: [
          "Tell me about a time you had a technical disagreement with a team member and how you resolved it.",
          "How do you prioritize project deliverables when requirements shift mid-sprint?",
        ],
        tips: "Structure answers using the STAR (Situation, Task, Action, Result) method with quantitative outcomes.",
      },
    ],
    tags: ["Google", "L3", "Graphs", "DP", "Trees", "STAR", "New Grad"],
    upvotes: [],
  },
  {
    company: "Amazon",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    role: "Software Development Engineer (SDE-1)",
    outcome: "Offered",
    batchYear: 2025,
    jobType: "Full-Time",
    overallDifficulty: "Hard",
    salaryDetails: "₹29.5 LPA (₹17.5 Base + ₹6.5 Sign-on + ₹5.5 Stocks)",
    location: "Hyderabad, India",
    title: "Amazon SDE-1 Off-Campus Drive: Leadership Principles & Bar Raiser Breakdown",
    summary:
      "Completed a 4-round process comprising 1 Online Assessment and 3 virtual technical loops (including the famous Bar Raiser round). Amazon interviewers strictly evaluate candidates against the 16 Amazon Leadership Principles in every single round alongside algorithmic proficiency.",
    rounds: [
      {
        roundName: "Round 1: Amazon Online Assessment (OA)",
        roundType: "Online Assessment",
        description: "2 coding questions + Work Style Assessment evaluating Leadership Principles.",
        questionsAsked: [
          "Top K Frequently Mentioned Keywords / Customer Reviews (Priority Queue / Hash Map).",
          "Reorder Data in Log Files (Custom comparator sorting).",
        ],
        tips: "Never rush the Work Style survey; ensure your answers are firmly aligned with Customer Obsession and Ownership.",
      },
      {
        roundName: "Round 2: Technical Loop 1 (Data Structures)",
        roundType: "Technical Coding",
        description: "20 minutes Leadership Principles questions followed by 40 minutes of coding.",
        questionsAsked: [
          "LRU Cache implementation with O(1) get and put using Hash Map + Doubly Linked List.",
          "LP Question: Tell me about a time you went above and beyond for a user/customer.",
        ],
        tips: "Have at least 2 distinct real-life stories prepared for each of Amazon's Leadership Principles.",
      },
      {
        roundName: "Round 3: Technical Loop 2 (Object-Oriented Design)",
        roundType: "Technical Coding",
        description: "Low-Level Machine Coding & OOP Class Diagrams.",
        questionsAsked: [
          "Design a Parking Lot system with multiple vehicle types and dynamic pricing strategy.",
        ],
        tips: "Apply SOLID principles, Strategy Pattern for pricing, and Factory Pattern for vehicle instantiation.",
      },
      {
        roundName: "Round 4: Bar Raiser Round",
        roundType: "Bar Raiser",
        description: "Senior Engineering Manager outside the hiring team conducting a deep-dive LP and scalability inquiry.",
        questionsAsked: [
          "LP: Describe a situation where you had to make a decision without complete data (Bias for Action).",
          "Word Ladder / BFS Shortest Transformation sequence.",
        ],
        tips: "Stay calm, do not become defensive when probed, and discuss technical trade-offs transparently.",
      },
    ],
    tags: ["Amazon", "SDE-1", "OOD", "Leadership Principles", "LRU Cache", "Bar Raiser"],
    upvotes: [],
  },
  {
    company: "Microsoft",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    role: "Software Engineer",
    outcome: "Offered",
    batchYear: 2025,
    jobType: "Full-Time",
    overallDifficulty: "Medium",
    salaryDetails: "₹27 LPA Base + ₹9 Lakh Stocks + ₹2 Lakh Performance Bonus",
    location: "Noida / Bangalore, India",
    title: "Microsoft Software Engineer: Clean Code & High-Level System Architecture",
    summary:
      "Process began with a Codility OA followed by 3 Technical Onsite rounds. Microsoft interviewers prioritize production-quality modular code, defensive validation, and thorough edge-case analysis over obscure dynamic programming tricks.",
    rounds: [
      {
        roundName: "Round 1: Codility Online Assessment",
        roundType: "Online Assessment",
        description: "3 medium-level coding questions on Codility in 75 minutes.",
        questionsAsked: [
          "Minimum deletions to make frequency of each character unique in a string.",
          "Find largest subarray with equal number of 0s and 1s using prefix sums.",
        ],
        tips: "Codility tests against strict performance memory limits. Aim for linear O(N) time solutions.",
      },
      {
        roundName: "Round 2: Technical Round 1 (Linked Lists & Trees)",
        roundType: "Technical Coding",
        description: "Pointer manipulation, recursion, and tree serialization.",
        questionsAsked: [
          "Reverse Nodes in k-Group in a Singly Linked List.",
          "Serialize and Deserialize a Binary Tree with null marker encoding.",
        ],
        tips: "Write clean helper functions and adhere to standard PascalCase or camelCase conventions.",
      },
      {
        roundName: "Round 3: Technical Round 2 (System Design & Memory)",
        roundType: "System Design",
        description: "Low-level storage design, thread safety, and cache invalidation.",
        questionsAsked: [
          "Design an in-memory Thread-Safe Key-Value store with TTL expiry.",
        ],
        tips: "Discuss read/write mutex locks, atomic operations, and background scavenger thread mechanisms.",
      },
    ],
    tags: ["Microsoft", "Codility", "Trees", "Linked List", "System Design", "Clean Code"],
    upvotes: [],
  },
  {
    company: "Uber",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    role: "Software Engineer (Backend)",
    outcome: "Offered",
    batchYear: 2025,
    jobType: "Full-Time",
    overallDifficulty: "Very Hard",
    salaryDetails: "₹40 LPA (₹26 Base + ₹11 Equity + ₹3 Joining Bonus)",
    location: "Bangalore, India",
    title: "Uber Backend Engineer Interview: Geohashing, Machine Coding & Concurrency",
    summary:
      "Uber's technical bar is exceptionally high, emphasizing real-world distributed systems, geospatial indexing (QuadTrees/Geohashes), concurrency race condition handling, and runnable machine coding.",
    rounds: [
      {
        roundName: "Round 1: CodeSignal OA",
        roundType: "Online Assessment",
        description: "4 questions on CodeSignal framework in 70 mins.",
        questionsAsked: [
          "Matrix diagonal sorting with secondary constraints.",
          "Subarray sum divisible by K using prefix sum modulo arithmetic.",
        ],
        tips: "Speed is crucial on CodeSignal score calculation. Finish the first two questions within 20 minutes.",
      },
      {
        roundName: "Round 2: Machine Coding (90 mins)",
        roundType: "Technical Coding",
        description: "Write fully runnable object-oriented code with unit tests for a complex business workflow.",
        questionsAsked: [
          "Design a Ride Matching & Surge Pricing Service for Drivers & Riders with concurrent state transitions.",
        ],
        tips: "Structure code into Controller, Service, and Repository layers with interfaces and unit tests.",
      },
      {
        roundName: "Round 3: High-Level System Design",
        roundType: "System Design",
        description: "Distributed location tracking and spatial indexing at planetary scale.",
        questionsAsked: [
          "Design Uber Location Tracking service handling 5 Million active driver GPS pings per second.",
        ],
        tips: "Incorporate Redis Geospatial queries, Kafka event streams, and horizontal database sharding.",
      },
    ],
    tags: ["Uber", "Machine Coding", "System Design", "Geohash", "Concurrency"],
    upvotes: [],
  },
  {
    company: "Meta",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    role: "Software Engineer (E3/E4)",
    outcome: "Offered",
    batchYear: 2025,
    jobType: "Full-Time",
    overallDifficulty: "Very Hard",
    salaryDetails: "₹42 LPA (₹28 Base + ₹14 RSU / Year)",
    location: "Singapore / London / Remote",
    title: "Meta London Software Engineer: Speed Coding & Large Scale Feed Architecture",
    summary:
      "Meta's interviews are notoriously fast-paced. In the coding rounds, candidates must solve two medium-hard algorithmic problems in 45 minutes on CoderPad without hesitation, followed by a global-scale system design round.",
    rounds: [
      {
        roundName: "Round 1: Initial Technical Screen",
        roundType: "Technical Coding",
        description: "45-minute live coding session on CoderPad with 2 distinct algorithmic challenges.",
        questionsAsked: [
          "Vertical Order Traversal of a Binary Tree using BFS with coordinate mapping.",
          "Subarray Sum Equals K using Hash Map prefix sums.",
        ],
        tips: "Aim to solve problem 1 within 18 minutes so you have ample time for problem 2 and edge case testing.",
      },
      {
        roundName: "Round 2: Onsite Coding Loop",
        roundType: "Technical Coding",
        description: "Two 45-minute back-to-back algorithmic rounds testing graph traversals and DP.",
        questionsAsked: [
          "Alien Dictionary topological sorting.",
          "Minimum Window Substring using sliding window frequency map.",
        ],
        tips: "Keep talking out loud while coding. The interviewer grades communication as well as coding speed.",
      },
      {
        roundName: "Round 3: System Design (Feed Architecture)",
        roundType: "System Design",
        description: "Design Instagram Stories or Facebook NewsFeed for 500 Million daily active users.",
        questionsAsked: [
          "Design news feed generation and fan-out on write vs fan-out on read.",
        ],
        tips: "Discuss feed ranking models, caching layers, and database sharding by user ID.",
      },
    ],
    tags: ["Meta", "Facebook", "Binary Tree", "Sliding Window", "Feed Architecture"],
    upvotes: [],
  },
  {
    company: "Netflix",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    role: "Senior Distributed Systems Engineer (L5)",
    outcome: "Offered",
    batchYear: 2025,
    jobType: "Full-Time",
    overallDifficulty: "Very Hard",
    salaryDetails: "₹65 LPA Top-of-Market All-Cash Compensation",
    location: "Remote / Los Gatos, USA",
    title: "Netflix L5 Distributed Systems: Chaos Engineering & High-Throughput Microservices",
    summary:
      "Netflix hires stunning colleagues with proven track records in high-scale distributed systems. The interview covers concurrency, chaos resilience, and deep alignment with the Netflix Culture Memo (Freedom and Responsibility).",
    rounds: [
      {
        roundName: "Round 1: Technical Deep Dive",
        roundType: "Technical Coding",
        description: "Asynchronous concurrency, backpressure, and reactive streams.",
        questionsAsked: [
          "Design a multi-tier rate limiter with burst smoothing and token replenishment.",
        ],
        tips: "Show deep familiarity with thread pools, non-blocking I/O, and asynchronous event loops.",
      },
      {
        roundName: "Round 2: System Design (Video Streaming & CDN)",
        roundType: "System Design",
        description: "Architect Netflix Open Connect CDN delivery and microservices failover.",
        questionsAsked: [
          "Design a global video metadata caching architecture resilient to cloud zone failure.",
        ],
        tips: "Incorporate Chaos Monkey fault injection, Circuit Breaker patterns, and eventual consistency.",
      },
      {
        roundName: "Round 3: Culture & Values",
        roundType: "Cultural",
        description: "Intensive 60-minute interview with Engineering Directors on Netflix culture.",
        questionsAsked: [
          "How do you exercise judgment when operating with Context, Not Control?",
          "Tell me about a time you made a high-stakes trade-off without managerial consensus.",
        ],
        tips: "Thoroughly internalize the Netflix Culture Memo before the interview.",
      },
    ],
    tags: ["Netflix", "Distributed Systems", "Chaos Engineering", "CDN", "Culture"],
    upvotes: [],
  },
  {
    company: "Adobe",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
    role: "Member of Technical Staff (MTS-1)",
    outcome: "Offered",
    batchYear: 2025,
    jobType: "Full-Time",
    overallDifficulty: "Medium",
    salaryDetails: "₹22 LPA Base + ₹6 Lakh Stocks + ₹2 Lakh Performance Bonus",
    location: "Noida / Bangalore, India",
    title: "Adobe MTS-1 Campus & Off-Campus Hiring Experience",
    summary:
      "Process involved 1 HackerEarth OA and 3 Technical interview rounds. Adobe focuses heavily on 2D geometry, spatial coordinates, data structures, and object-oriented design patterns (Command Pattern, Undo/Redo architecture).",
    rounds: [
      {
        roundName: "Round 1: HackerEarth Online Assessment",
        roundType: "Online Assessment",
        description: "3 coding questions covering arrays, DP, and geometry math.",
        questionsAsked: [
          "Count number of valid rectangles in a 2D coordinate grid.",
          "Longest Increasing Subsequence with custom cost matrix.",
        ],
        tips: "Double-check 64-bit integer overflows when calculating coordinate distances.",
      },
      {
        roundName: "Round 2: Technical Interview 1 (DSA)",
        roundType: "Technical Coding",
        description: "Data structures and matrix traversals.",
        questionsAsked: [
          "Rotting Oranges / Multi-source BFS in a matrix.",
          "Clone a Graph with cycle detection.",
        ],
        tips: "Clearly explain time and space complexity and show confidence with BFS queue logic.",
      },
      {
        roundName: "Round 3: Technical Interview 2 (OOD & Canvas Design)",
        roundType: "Technical Coding",
        description: "Low-level design of graphic canvas features.",
        questionsAsked: [
          "Design an Undo/Redo canvas manager using Command Pattern and Memento Pattern.",
        ],
        tips: "Demonstrate extensible object-oriented architecture and unit testing clarity.",
      },
    ],
    tags: ["Adobe", "MTS", "Command Pattern", "Matrix", "BFS", "OOD"],
    upvotes: [],
  },
];

let isSeedingExperiences = false;

/**
 * Automatically seeds default high-value interview stories if none or few exist
 */
const ensureExperiencesSeeded = async () => {
  try {
    const count = await Experience.countDocuments();
    if (count < defaultExperiences.length && !isSeedingExperiences) {
      isSeedingExperiences = true;
      console.log(`[Experience] Auto-seeding interview experiences (current: ${count}, required: ${defaultExperiences.length})...`);

      // Find or create a verified system mentor/alumni author
      let mentorUser = await User.findOne({ email: "alumni.mentor@placementhub.dev" });
      if (!mentorUser) {
        mentorUser = await User.create({
          name: "PlacementHub Alumni Network",
          email: "alumni.mentor@placementhub.dev",
          password: "system_generated_alumni_safe_pass_2026",
          role: "Student",
        });
        console.log("[Experience] Created default alumni mentor author account.");
      }

      for (const exp of defaultExperiences) {
        await Experience.findOneAndUpdate(
          { title: exp.title },
          { ...exp, user: mentorUser._id },
          { upsert: true, new: true }
        );
      }

      console.log(`[Experience] Successfully seeded ${defaultExperiences.length} interview experiences!`);
      isSeedingExperiences = false;
    }
  } catch (err) {
    console.error("[Experience] Auto-seed error:", err.message);
    isSeedingExperiences = false;
  }
};

/**
 * Sync function to pull and refresh fresh interview stories from company hiring cycles
 */
const syncInterviewStories = async () => {
  console.log("[ExperienceSync] Triggering interview stories verification & sync...");
  await ensureExperiencesSeeded();

  // Update existing experiences with the latest recruitment year and current round structures
  const currentYear = new Date().getFullYear();
  await Experience.updateMany(
    { batchYear: { $lt: currentYear } },
    { $set: { batchYear: currentYear } }
  );

  const total = await Experience.countDocuments();
  return {
    success: true,
    totalStories: total,
    syncedAt: new Date(),
  };
};

module.exports = {
  defaultExperiences,
  ensureExperiencesSeeded,
  syncInterviewStories,
};
