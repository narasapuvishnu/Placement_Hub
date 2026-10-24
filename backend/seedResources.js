require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const connectDB = require("./config/db");
const Resource = require("./models/Resource");

const resources = [
  {
    title: "DSA Pattern Revision Guide",
    resourceType: "Study Guide",
    category: "DSA",
    description: "A compact route through arrays, hash tables, two pointers, sliding windows, stacks, trees, graphs, and dynamic programming.",
    url: "https://neetcode.io/roadmap",
    source: "NeetCode Roadmap",
    tags: ["patterns", "revision", "interview"],
    readTime: "20 min read",
    featured: true,
  },
  {
    title: "Data Structures Cheat Sheet",
    resourceType: "PDF",
    category: "DSA",
    description: "A printable reference for common data structures, operation costs, and algorithmic complexity.",
    url: "https://cp-algorithms.com/",
    source: "CP-Algorithms",
    tags: ["complexity", "cheat sheet", "algorithms"],
    readTime: "10 min read",
  },
  {
    title: "System Design Interview Primer",
    resourceType: "Study Guide",
    category: "System Design",
    description: "A practical framework for requirements, capacity estimates, APIs, data storage, scaling, reliability, and trade-offs.",
    url: "https://github.com/donnemartin/system-design-primer",
    source: "System Design Primer",
    tags: ["architecture", "scalability", "interviews"],
    readTime: "30 min read",
    featured: true,
  },
  {
    title: "Designing Data-Intensive Applications Notes",
    resourceType: "Note",
    category: "System Design",
    description: "Reading notes and topic prompts for replication, partitioning, transactions, consistency, and stream processing.",
    url: "https://dataintensive.net/",
    source: "Designing Data-Intensive Applications",
    tags: ["distributed systems", "databases", "notes"],
    readTime: "15 min read",
  },
  {
    title: "SQL Interview Query Patterns",
    resourceType: "Study Guide",
    category: "SQL",
    description: "Practice route for filtering, joins, aggregation, subqueries, window functions, dates, and string operations.",
    url: "https://www.postgresql.org/docs/current/tutorial.html",
    source: "PostgreSQL Tutorial",
    tags: ["select", "joins", "windows", "interview"],
    readTime: "25 min read",
    featured: true,
  },
  {
    title: "SQL Window Functions Reference",
    resourceType: "Note",
    category: "SQL",
    description: "A focused reference for rank, dense rank, lag, lead, running totals, and partitioned calculations.",
    url: "https://www.thoughtspot.com/sql-tutorial/sql-window-functions",
    source: "ThoughtSpot SQL Tutorial",
    tags: ["window functions", "ranking", "analytics"],
    readTime: "12 min read",
  },
  {
    title: "Quantitative Aptitude Formula Sheet",
    resourceType: "PDF",
    category: "Aptitude",
    description: "Formula revision for percentages, ratios, averages, time and work, speed, probability, and simple interest.",
    url: "https://www.geeksforgeeks.org/aptitude/",
    source: "GeeksforGeeks Aptitude",
    tags: ["formulas", "quantitative", "revision"],
    readTime: "15 min read",
  },
  {
    title: "Logical Reasoning Practice Notes",
    resourceType: "Note",
    category: "Aptitude",
    description: "Short notes for series, arrangements, syllogisms, data interpretation, and constraint-based reasoning.",
    url: "https://www.geeksforgeeks.org/logical-reasoning/",
    source: "GeeksforGeeks Reasoning",
    tags: ["reasoning", "series", "data interpretation"],
    readTime: "18 min read",
  },
  {
    title: "Resume and Interview Preparation Checklist",
    resourceType: "Study Guide",
    category: "Career",
    description: "A practical checklist for tailoring a resume, preparing project stories, researching roles, and closing interviews well.",
    url: "https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/",
    source: "Harvard Career Services",
    tags: ["resume", "interview", "career"],
    readTime: "10 min read",
    featured: true,
  },
  {
    title: "Behavioral Interview STAR Notes",
    resourceType: "Note",
    category: "Career",
    description: "Prompts for turning project experiences into concise situation, task, action, and result stories.",
    url: "https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/",
    source: "Harvard Career Services",
    tags: ["behavioral", "STAR", "communication"],
    readTime: "8 min read",
  },
];

async function seedResources() {
  try {
    await connectDB();
    for (const resource of resources) {
      await Resource.findOneAndUpdate({ title: resource.title }, resource, { upsert: true, returnDocument: "after" });
      console.log(`Seeded resource: ${resource.title}`);
    }
    console.log(`Seeded ${resources.length} resources.`);
    process.exit(0);
  } catch (error) {
    console.error("Resource seed failed:", error);
    process.exit(1);
  }
}

seedResources();
