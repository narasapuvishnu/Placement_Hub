const mongoose = require("mongoose");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Question = require("../models/Question");

const defaultCompanies = [
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    website: "https://careers.google.com",
    industry: "Big Tech / Internet",
    headquarters: "Mountain View, CA, USA",
    description: "Google is a global technology leader focused on search, cloud computing, software, and hardware innovation.",
    difficulty: "Very Hard",
    hiringRoles: ["Software Engineer (L3/L4/L5)", "Site Reliability Engineer", "Product Manager", "Data Scientist"],
    interviewRounds: [
      { roundNumber: 1, name: "Online Assessment (OA)", roundType: "Online Assessment", duration: "90 mins", description: "2 algorithmic problem-solving questions on Google's internal testing platform.", tips: "Focus on edge cases, time/space complexity analysis, and clean modular code." },
      { roundNumber: 2, name: "Technical Phone Screen", roundType: "Technical", duration: "45 mins", description: "Data structures & algorithms question in a shared Google Doc without syntax highlighting.", tips: "Communicate your thought process out loud before writing any code." },
      { roundNumber: 3, name: "Onsite Technical Rounds (3-4 rounds)", roundType: "Technical & System Design", duration: "45 mins each", description: "Advanced algorithms, graphs, dynamic programming, and system design for experienced roles.", tips: "Clarify constraints, discuss trade-offs, and write production-grade code." },
      { roundNumber: 4, name: "Googliness & Leadership", roundType: "HR/Cultural", duration: "45 mins", description: "Behavioral questions evaluating collaboration, dealing with ambiguity, and ethical decisions.", tips: "Use the STAR method with concrete examples showing initiative and team empathy." }
    ],
    frequentTopics: ["Dynamic Programming", "Graphs & BFS/DFS", "Trie & Segment Trees", "Distributed Systems"],
    salaryRange: "₹25 - 55 LPA"
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    website: "https://www.amazon.jobs",
    industry: "E-Commerce / Cloud Computing",
    headquarters: "Seattle, WA, USA",
    description: "Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.",
    difficulty: "Hard",
    hiringRoles: ["Software Development Engineer (SDE-1/2)", "Solutions Architect", "Cloud Support Engineer"],
    interviewRounds: [
      { roundNumber: 1, name: "Online Assessment (OA)", roundType: "Online Assessment", duration: "90 mins", description: "2 coding questions, work style assessment, and debugging exercises.", tips: "Align your work style responses directly with Amazon's 16 Leadership Principles." },
      { roundNumber: 2, name: "Technical Rounds (2-3 rounds)", roundType: "Technical", duration: "60 mins each", description: "Tree/graph traversal, arrays, hash maps, and Object Oriented Design.", tips: "Every round starts with 20 minutes of behavioral questions based on Leadership Principles." },
      { roundNumber: 3, name: "System Design (SDE-2+)", roundType: "System Design", duration: "60 mins", description: "Distributed caching, pub/sub messaging, microservices decomposition, and scale.", tips: "Estimate QPS, storage, and latency requirements before jumping into diagrams." }
    ],
    frequentTopics: ["Binary Trees & BST", "Priority Queues & Heaps", "Object-Oriented Design", "16 Leadership Principles"],
    salaryRange: "₹20 - 45 LPA"
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    website: "https://careers.microsoft.com",
    industry: "Enterprise Software & Cloud",
    headquarters: "Redmond, WA, USA",
    description: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.",
    difficulty: "Hard",
    hiringRoles: ["Software Engineer", "Cloud Solution Architect", "Support Engineer"],
    interviewRounds: [
      { roundNumber: 1, name: "Codility Online Assessment", roundType: "Online Assessment", duration: "90 mins", description: "3 coding problems testing string manipulation, dynamic programming, and graphs.", tips: "Pay attention to boundary limits and potential integer overflow." },
      { roundNumber: 2, name: "Data Structures & Algorithms", roundType: "Technical", duration: "45 mins", description: "Binary trees, linked lists, matrix manipulation, and recursion.", tips: "Demonstrate modular code with descriptive variable naming." },
      { roundNumber: 3, name: "Design & High-Level Architecture", roundType: "System Design", duration: "45 mins", description: "Design a scalable service (e.g. Teams chat, OneDrive sync, or Azure blob storage).", tips: "Proactively discuss single points of failure, redundancy, and load balancing." }
    ],
    frequentTopics: ["Binary Trees & BST", "Linked Lists & Hash Tables", "System Architecture", "Growth Mindset"],
    salaryRange: "₹22 - 48 LPA"
  },
  {
    name: "Uber",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    website: "https://www.uber.com/careers",
    industry: "Mobility & Logistics",
    headquarters: "San Francisco, CA, USA",
    description: "Uber develops, markets, and operates ride-sharing, food delivery, and freight networks.",
    difficulty: "Very Hard",
    hiringRoles: ["Software Engineer 1/2", "Backend Engineer", "Data Engineer"],
    interviewRounds: [
      { roundNumber: 1, name: "HackerRank Coding Screen", roundType: "Online Assessment", duration: "90 mins", description: "Algorithmic challenges and concurrency/threading questions.", tips: "Be comfortable with multi-threading, concurrency, and complex graph algorithms." },
      { roundNumber: 2, name: "Low-Level Design (Machine Coding)", roundType: "Technical", duration: "90 mins", description: "Write runnable, modular, object-oriented code for problems like Ride Matching or Splitwise.", tips: "Follow SOLID design principles and include unit tests." },
      { roundNumber: 3, name: "High-Level System Design", roundType: "System Design", duration: "60 mins", description: "Location tracking at scale, Quadtree/Geohash spatial indexing, and message streaming.", tips: "Master Kafka, Redis geo-queries, and horizontal database sharding." }
    ],
    frequentTopics: ["Spatial Indexing (Geohash / QuadTree)", "Low-Level Machine Coding", "Event-Driven Architecture", "Concurrency & Locks"],
    salaryRange: "₹30 - 65 LPA"
  },
  {
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    website: "https://www.metacareers.com",
    industry: "Social Media / AI & VR",
    headquarters: "Menlo Park, CA, USA",
    description: "Meta builds technologies that help people connect, find communities, and grow businesses across Facebook, Instagram, WhatsApp, and Quest.",
    difficulty: "Very Hard",
    hiringRoles: ["Software Engineer (E3/E4/E5)", "Product Manager", "Production Engineer", "AI/ML Engineer"],
    interviewRounds: [
      { roundNumber: 1, name: "OA & Recruiter Screen", roundType: "Online Assessment", duration: "45 mins", description: "Technical screen and rapid algorithmic problem solving on CoderPad.", tips: "Aim for clean, working code in under 20 minutes per problem." },
      { roundNumber: 2, name: "Coding Loop (2 Rounds)", roundType: "Technical", duration: "45 mins each", description: "Fast-paced DSA questions testing trees, graphs, and dynamic programming.", tips: "Time management is critical: write runnable, optimal code without hesitation." },
      { roundNumber: 3, name: "System Design", roundType: "System Design", duration: "45 mins", description: "Architecture for global distributed products like NewsFeed, Messenger, or Instagram Stories.", tips: "Clarify scale (billions of daily active users), dive deep into caching and data models." }
    ],
    frequentTopics: ["Binary Trees & BFS/DFS", "Dynamic Programming", "Hash Tables & Strings", "Large-Scale System Design"],
    salaryRange: "₹28 - 62 LPA"
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    website: "https://www.apple.com/careers",
    industry: "Consumer Electronics & OS",
    headquarters: "Cupertino, CA, USA",
    description: "Apple designs consumer electronics, software, and online services including iPhone, Mac, iOS, macOS, and iCloud.",
    difficulty: "Hard",
    hiringRoles: ["Software Engineer (ICT2/ICT3/ICT4)", "iOS/macOS Engineer", "Systems Software Engineer", "Firmware Engineer"],
    interviewRounds: [
      { roundNumber: 1, name: "Recruiter Screen", roundType: "Screening", duration: "30 mins", description: "Discussion on past projects, technical background, and domain relevance.", tips: "Be specific about your direct contributions to high-performance products." },
      { roundNumber: 2, name: "Technical Phone Screen", roundType: "Technical", duration: "60 mins", description: "Algorithms, memory management, and language internals (C++/Swift/Rust).", tips: "Demonstrate deep understanding of pointers, stack vs heap, and time-space tradeoffs." },
      { roundNumber: 3, name: "Onsite Technical Loop (4-5 rounds)", roundType: "Technical & Architecture", duration: "60 mins each", description: "Deep dive into OS internals, multi-threading, concurrency, and algorithms.", tips: "Focus on zero-latency optimization, thread safety, and clean architecture." }
    ],
    frequentTopics: ["Memory Management & Pointers", "Concurrency & Multithreading", "Data Structures & Trees", "Low-Level Optimization"],
    salaryRange: "₹24 - 52 LPA"
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    website: "https://jobs.netflix.com",
    industry: "Streaming Media & Entertainment",
    headquarters: "Los Gatos, CA, USA",
    description: "Netflix is the world's leading streaming entertainment service with over 260 million paid memberships worldwide.",
    difficulty: "Very Hard",
    hiringRoles: ["Senior Software Engineer (L5/L6)", "Distributed Systems Engineer", "Data Infrastructure Engineer"],
    interviewRounds: [
      { roundNumber: 1, name: "Technical Screen", roundType: "Technical", duration: "60 mins", description: "Algorithmic scenarios, asynchronous programming, and concurrency.", tips: "Write elegant, highly readable code with proper error handling." },
      { roundNumber: 2, name: "System Design Deep Dive", roundType: "System Design", duration: "60 mins", description: "High-throughput microservices, CDN video delivery, and distributed caching topologies.", tips: "Discuss fault tolerance, rate limiting, and chaos engineering practices." },
      { roundNumber: 3, name: "Culture & Values", roundType: "Cultural", duration: "60 mins", description: "Direct discussion on Netflix Culture memo: Freedom and Responsibility, Context Not Control.", tips: "Read the Netflix Culture Deck thoroughly before the interview." }
    ],
    frequentTopics: ["High-Scale Microservices", "Distributed Caching (Redis/Memcached)", "Chaos Engineering & Resilience", "Asynchronous Event Streams"],
    salaryRange: "₹35 - 75 LPA"
  },
  {
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
    website: "https://www.adobe.com/careers.html",
    industry: "Creative Cloud & Digital Media",
    headquarters: "San Jose, CA, USA",
    description: "Adobe is changing the world through digital experiences, powering Photoshop, Illustrator, Acrobat, Premiere, and Creative Cloud.",
    difficulty: "Medium",
    hiringRoles: ["Member of Technical Staff", "Full Stack Developer", "Computer Vision Engineer", "Cloud Software Engineer"],
    interviewRounds: [
      { roundNumber: 1, name: "Online Assessment", roundType: "Online Assessment", duration: "90 mins", description: "3 DSA coding problems on HackerEarth testing arrays, trees, and dynamic programming.", tips: "Aim for complete test case passes with optimal time complexity." },
      { roundNumber: 2, name: "Technical Round 1", roundType: "Technical", duration: "60 mins", description: "Data structures, string manipulation, and 2D matrix algorithms.", tips: "Explain edge cases (empty matrix, null pointers, bounds) upfront." },
      { roundNumber: 3, name: "Technical Round 2 (Design)", roundType: "System & Low-Level Design", duration: "60 mins", description: "Object-oriented design of canvas, undo/redo history, or layer management.", tips: "Use Command Pattern, Observer Pattern, and clean inheritance hierarchies." }
    ],
    frequentTopics: ["2D/3D Geometry & Coordinates", "Object-Oriented Design (OOD)", "Graphs & Dynamic Programming", "Memory & Performance Optimization"],
    salaryRange: "₹18 - 38 LPA"
  }
];

// Helper to auto-seed companies if missing
const ensureCompaniesSeeded = async () => {
  try {
    const count = await Company.countDocuments();
    if (count < 8) {
      for (const comp of defaultCompanies) {
        await Company.findOneAndUpdate({ name: comp.name }, comp, { upsert: true, new: true });
      }
    }
  } catch (e) {
    console.error("Auto-seed error:", e.message);
  }
};

// Auto run on load
ensureCompaniesSeeded();

// @desc    Get all companies with optional filter/search
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    await ensureCompaniesSeeded();
    const { search, industry, difficulty } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (industry && industry !== "All") {
      query.industry = industry;
    }
    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }

    const rawCompanies = await Company.find(query).sort({ name: 1 }).lean();

    // Enrich each company with top repeated practice questions and open positions
    const companies = await Promise.all(
      rawCompanies.map(async (comp) => {
        const [relatedQuestions, relatedJobs] = await Promise.all([
          Question.find({
            companies: { $regex: new RegExp(`^${comp.name}$`, "i") },
          })
            .select("title difficulty category tags")
            .limit(3)
            .lean(),
          Job.find({
            company: { $regex: new RegExp(`^${comp.name}$`, "i") },
            status: "Open",
          })
            .select("title location experience employmentType applyUrl")
            .limit(2)
            .lean(),
        ]);

        const [totalQuestionsCount, totalJobsCount] = await Promise.all([
          Question.countDocuments({
            companies: { $regex: new RegExp(`^${comp.name}$`, "i") },
          }),
          Job.countDocuments({
            company: { $regex: new RegExp(`^${comp.name}$`, "i") },
            status: "Open",
          }),
        ]);

        return {
          ...comp,
          repeatedQuestions: relatedQuestions,
          totalQuestionsCount,
          openPositions: relatedJobs,
          totalJobsCount,
        };
      })
    );

    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Get company by ID or name with related jobs and questions
// @route   GET /api/companies/:id
// @access  Public
exports.getCompanyById = async (req, res) => {
  try {
    let company = null;
    const identifier = req.params.id;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      company = await Company.findById(identifier);
    }
    if (!company) {
      company = await Company.findOne({
        name: { $regex: new RegExp(`^${identifier}$`, "i") },
      });
    }

    if (!company) {
      return res.status(404).json({ msg: "Company not found" });
    }

    // Fetch related active jobs for this company
    const jobs = await Job.find({
      company: { $regex: new RegExp(`^${company.name}$`, "i") },
    });

    // Fetch related practice questions tagged with this company
    const questions = await Question.find({
      companies: { $regex: new RegExp(`^${company.name}$`, "i") },
    });

    res.json({
      company,
      jobs,
      questions,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Create a new company
// @route   POST /api/companies
// @access  Public/Admin
exports.createCompany = async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
