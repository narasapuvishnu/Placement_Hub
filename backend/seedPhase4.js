require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Experience = require("./models/Experience");
const User = require("./models/User");

const experiencesData = [
  {
    company: "Google",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    role: "Software Engineer (L3 - New Grad)",
    outcome: "Offered",
    batchYear: 2024,
    jobType: "Full-Time",
    overallDifficulty: "Hard",
    salaryDetails: "₹32 LPA Base + ₹12 Lakh Stocks + ₹3 Lakh Joining Bonus",
    location: "Bangalore, India",
    title: "My 2024 Google Onsite Interview Experience (Cracked L3 Offer!)",
    summary:
      "Applied through campus placement / off-campus referral. Process consisted of 1 Online Assessment and 4 Onsite rounds (3 Coding + 1 Googliness & Leadership). Focus heavily on Graph algorithms, Dynamic Programming, and clear verbal communication.",
    rounds: [
      {
        roundName: "Round 1: Online Assessment",
        roundType: "Online Assessment",
        description: "2 algorithmic coding questions on Google's internal portal with 90 mins limit.",
        questionsAsked: [
          "Graph Shortest Path variation with dynamic edge weight modifications.",
          "Sliding window median calculation using two heaps.",
        ],
        tips: "Make sure code handles large inputs and edge cases cleanly. Submit early if all test cases pass.",
      },
      {
        roundName: "Round 2: Onsite Technical Round 1 (Trees & Graphs)",
        roundType: "Technical Coding",
        description: "Focus on binary tree traversals and LCA with ancestor constraints.",
        questionsAsked: [
          "Lowest Common Ancestor in a Binary Tree with parent pointers.",
          "Optimize space complexity from O(H) to O(1).",
        ],
        tips: "State your time/space complexity before writing a single line of code in the shared document.",
      },
      {
        roundName: "Round 3: Onsite Technical Round 2 (DP & Strings)",
        roundType: "Technical Coding",
        description: "String matching and Dynamic Programming with state compression.",
        questionsAsked: [
          "Edit Distance variant with custom operation costs.",
          "Trace DP table state transitions on whiteboard / doc.",
        ],
        tips: "Start with recursive top-down approach before writing bottom-up tabulation.",
      },
      {
        roundName: "Round 4: Googliness & Leadership Round",
        roundType: "Behavioral / HR",
        description: "45-minute behavioral round evaluating cross-team empathy and handling ambiguity.",
        questionsAsked: [
          "Tell me about a time you had a technical disagreement with a teammate.",
          "How do you prioritize deadlines when requirements change midway?",
        ],
        tips: "Structure answers using the STAR (Situation, Task, Action, Result) method.",
      },
    ],
    tags: ["Google", "L3", "Graphs", "DP", "Trees", "STAR"],
  },
  {
    company: "Amazon",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    role: "Software Development Engineer (SDE-1)",
    outcome: "Offered",
    batchYear: 2024,
    jobType: "Full-Time",
    overallDifficulty: "Hard",
    salaryDetails: "₹28.5 LPA (₹16.5 Base + ₹6.5 Sign-on + ₹5.5 Stocks)",
    location: "Hyderabad, India",
    title: "Amazon SDE-1 Interview Experience & Leadership Principles Breakdown",
    summary:
      "4-round process comprising 1 OA and 3 Technical interview loops (including Bar Raiser). Amazon emphasizes their 16 Leadership Principles heavily in every round!",
    rounds: [
      {
        roundName: "Round 1: Amazon Online Assessment (OA)",
        roundType: "Online Assessment",
        description: "2 coding questions + Work Style Assessment evaluating Leadership Principles.",
        questionsAsked: [
          "Top K Frequently Mentioned Keywords / Customer Reviews (Priority Queue / Hash Map).",
          "Reorder Data in Log Files (Custom comparator sorting).",
        ],
        tips: "Do not underestimate the Work Style survey; answer aligned with Customer Obsession and Ownership.",
      },
      {
        roundName: "Round 2: Technical Loop 1 (Data Structures)",
        roundType: "Technical Coding",
        description: "20 mins Leadership Principles + 40 mins coding.",
        questionsAsked: [
          "LRU Cache implementation with O(1) get and put.",
          "LP Question: Tell me about a time you went above and beyond for a customer.",
        ],
        tips: "Prepare 2 concrete stories for each of the 16 Leadership Principles.",
      },
      {
        roundName: "Round 3: Technical Loop 2 (Object-Oriented Design)",
        roundType: "Technical Coding",
        description: "Low-Level Machine Coding & OOP Class Diagrams.",
        questionsAsked: [
          "Design a Parking Lot system with multiple vehicle types and dynamic pricing strategy.",
        ],
        tips: "Use SOLID principles, Strategy Pattern, and Factory Pattern in your class design.",
      },
      {
        roundName: "Round 4: Bar Raiser Round",
        roundType: "Bar Raiser",
        description: "Senior Engineering Manager outside hiring team conducting deep dive LP & system scalability.",
        questionsAsked: [
          "LP: Describe a situation where you had to make a decision without complete data (Bias for Action).",
          "Word Ladder / BFS Shortest Transformation.",
        ],
        tips: "Stay calm, do not argue, and admit trade-offs openly.",
      },
    ],
    tags: ["Amazon", "SDE-1", "OOD", "Leadership Principles", "LRU Cache"],
  },
  {
    company: "Microsoft",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    role: "Software Engineer",
    outcome: "Offered",
    batchYear: 2024,
    jobType: "Full-Time",
    overallDifficulty: "Medium",
    salaryDetails: "₹26 LPA Base + ₹8 Lakh Stocks + ₹2 Lakh Performance Bonus",
    location: "Noida, India",
    title: "Microsoft Campus Placement Journey (4 Rounds - Clean Code Focus)",
    summary:
      "Codility OA followed by 3 Technical Onsite rounds. Microsoft interviewers love clean, production-grade modular code and thorough edge-case checking.",
    rounds: [
      {
        roundName: "Round 1: Codility Online Assessment",
        roundType: "Online Assessment",
        description: "3 medium-level coding questions on Codility in 75 minutes.",
        questionsAsked: [
          "Minimum deletions to make frequency of each character unique.",
          "Find largest subarray with equal number of 0s and 1s.",
        ],
        tips: "Codility tests against strict performance memory limits. Aim for O(N) linear time.",
      },
      {
        roundName: "Round 2: Technical Round 1 (Linked Lists & Trees)",
        roundType: "Technical Coding",
        description: "Pointer manipulation and tree traversals.",
        questionsAsked: [
          "Reverse Nodes in k-Group in a Singly Linked List.",
          "Serialize and Deserialize a Binary Tree.",
        ],
        tips: "Write helper functions and use meaningful variable names.",
      },
      {
        roundName: "Round 3: Technical Round 2 (System Design & Memory)",
        roundType: "System Design",
        description: "Low level storage design & thread safety.",
        questionsAsked: [
          "Design an in-memory Thread-Safe Key-Value store with TTL expiry.",
        ],
        tips: "Discuss mutex locks, atomic operations, and garbage collection mechanisms.",
      },
    ],
    tags: ["Microsoft", "Codility", "Trees", "Linked List", "System Design"],
  },
  {
    company: "Uber",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    role: "Software Engineer (Backend)",
    outcome: "Offered",
    batchYear: 2024,
    jobType: "Full-Time",
    overallDifficulty: "Very Hard",
    salaryDetails: "₹38 LPA (₹25 Base + ₹10 Equity + ₹3 Joining Bonus)",
    location: "Bangalore, India",
    title: "Uber Backend Engineer Interview: Geohashing & Machine Coding",
    summary:
      "Uber's process is extremely rigorous, focusing on real-world system architecture (spatial indexing, concurrency locks) and dynamic programming.",
    rounds: [
      {
        roundName: "Round 1: CodeSignal OA",
        roundType: "Online Assessment",
        description: "4 questions on CodeSignal framework in 70 mins.",
        questionsAsked: [
          "Matrix diagonal sorting with secondary constraints.",
          "Subarray sum divisible by K using prefix sum modulo.",
        ],
        tips: "Speed is crucial on CodeSignal score calculation.",
      },
      {
        roundName: "Round 2: Machine Coding (90 mins)",
        roundType: "Technical Coding",
        description: "Write fully runnable object-oriented code with unit tests.",
        questionsAsked: [
          "Design a Ride Matching & Surge Pricing Service for Drivers & Riders.",
        ],
        tips: "Keep your code modular with clear interface boundaries and concurrency safety.",
      },
      {
        roundName: "Round 3: High-Level System Design",
        roundType: "System Design",
        description: "Distributed location tracking and spatial indexing.",
        questionsAsked: [
          "Design Uber Location Tracking service handling 5 Million active driver GPS pings per second.",
        ],
        tips: "Use QuadTrees or Geohash, Redis geospatial indexes, and Kafka event streaming.",
      },
    ],
    tags: ["Uber", "Machine Coding", "System Design", "Geohash", "Concurrency"],
  },
];

async function seedPhase4() {
  try {
    await connectDB();
    console.log("Connected to DB for Phase 4 seeding...");

    // Find or create seed user
    let seedUser = await User.findOne({ email: "student@placementhub.dev" });
    if (!seedUser) {
      seedUser = await User.create({
        name: "Rahul Sharma",
        email: "student@placementhub.dev",
        password: "hashedpassword123",
        role: "Student",
      });
      console.log("Created default seed user: Rahul Sharma");
    }

    for (const exp of experiencesData) {
      await Experience.findOneAndUpdate(
        { title: exp.title },
        { ...exp, user: seedUser._id },
        { upsert: true, returnDocument: "after" }
      );
      console.log(`Seeded experience: ${exp.title}`);
    }

    console.log("Phase 4 interview experiences seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding Phase 4:", err);
    process.exit(1);
  }
}

seedPhase4();
