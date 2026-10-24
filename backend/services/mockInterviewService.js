// Mock Interview AI Service - PlacementHub
const Groq = require("groq-sdk");

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }
  return new Groq({ apiKey });
}

// Comprehensive curated question bank for instant fallback and high reliability
const questionBank = {
  JavaScript: [
    {
      question: "Explain the Event Loop in JavaScript. How do the Call Stack, Microtask Queue (Promises), and Macrotask Queue (setTimeout) interact?",
      topic: "JavaScript",
      difficulty: "Medium",
      expectedPoints: ["Call stack execution", "Microtasks run before macrotasks", "Event loop checks stack emptiness"],
    },
    {
      question: "What is the difference between shallow copy and deep copy in JavaScript, and what are the best ways to achieve a deep copy?",
      topic: "JavaScript",
      difficulty: "Easy",
      expectedPoints: ["Reference copying vs value copying", "structuredClone()", "JSON serialization trade-offs"],
    },
    {
      question: "What are Closures in JavaScript? Give a practical scenario where you would use a closure in frontend development.",
      topic: "JavaScript",
      difficulty: "Medium",
      expectedPoints: ["Lexical scoping", "Encapsulation / private state", "Debounce or throttle function example"],
    },
    {
      question: "Explain the differences between `var`, `let`, and `const`, focusing on hoisting and Temporal Dead Zone (TDZ).",
      topic: "JavaScript",
      difficulty: "Easy",
      expectedPoints: ["Function vs block scope", "Hoisting behavior", "TDZ explained"],
    },
  ],
  React: [
    {
      question: "How does React's Reconciliation and the Virtual DOM diffing algorithm work? Why are keys important in lists?",
      topic: "React",
      difficulty: "Medium",
      expectedPoints: ["Virtual DOM tree comparison", "O(n) heuristic assumption", "Stable identity with keys"],
    },
    {
      question: "When should you use `useMemo` and `useCallback`? How do you prevent unnecessary re-renders in large component trees?",
      topic: "React",
      difficulty: "Medium",
      expectedPoints: ["Memoizing expensive computations", "Stable function references", "React.memo for child components"],
    },
    {
      question: "Explain the component lifecycle with the `useEffect` hook. How do you handle cleanup to avoid memory leaks?",
      topic: "React",
      difficulty: "Easy",
      expectedPoints: ["Mount, update, unmount stages", "Dependency array semantics", "Cleanup return function"],
    },
  ],
  "Node.js": [
    {
      question: "How does Node.js achieve non-blocking I/O using Libuv, and what is the role of worker threads?",
      topic: "Node.js",
      difficulty: "Hard",
      expectedPoints: ["Libuv thread pool for async I/O", "Event-driven architecture", "Worker threads for CPU-heavy tasks"],
    },
    {
      question: "Explain how Middleware works in Express.js. How do you handle centralized error handling properly?",
      topic: "Node.js",
      difficulty: "Medium",
      expectedPoints: ["Request-Response cycle", "next() function", "Error-handling middleware with 4 parameters"],
    },
    {
      question: "What are Streams in Node.js and when would you use them over standard Buffers?",
      topic: "Node.js",
      difficulty: "Medium",
      expectedPoints: ["Handling data piece by piece", "Memory efficiency for large files/requests", "Readable, Writable, Transform"],
    },
  ],
  SQL: [
    {
      question: "Explain the differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with a real-world placement or e-commerce example.",
      topic: "SQL",
      difficulty: "Easy",
      expectedPoints: ["Intersection vs superset", "Handling NULL values in unmatched rows", "Practical schema example"],
    },
    {
      question: "What are Indexes in relational databases, and what are the trade-offs between B-Tree indexes and Hash indexes?",
      topic: "SQL",
      difficulty: "Medium",
      expectedPoints: ["Read performance vs write overhead", "Range queries with B-Trees", "Exact match with Hash indexes"],
    },
    {
      question: "Explain ACID properties in database transactions and how isolation levels prevent dirty reads and phantom reads.",
      topic: "SQL",
      difficulty: "Hard",
      expectedPoints: ["Atomicity, Consistency, Isolation, Durability", "Read Committed vs Repeatable Read vs Serializable", "Concurrency trade-offs"],
    },
  ],
  DBMS: [
    {
      question: "What is Normalization (1NF to 3NF/BCNF)? Why might a system choose denormalization in production?",
      topic: "DBMS",
      difficulty: "Medium",
      expectedPoints: ["Reducing redundancy", "Functional dependencies", "Read optimization in high-scale systems"],
    },
    {
      question: "Compare SQL (Relational) vs NoSQL (Document/Key-Value) databases. When would you choose MongoDB over PostgreSQL?",
      topic: "DBMS",
      difficulty: "Medium",
      expectedPoints: ["Structured vs schema-less", "Horizontal vs vertical scaling", "ACID transactions vs flexible document models"],
    },
  ],
  DSA: [
    {
      question: "Explain how you would find the Longest Substring Without Repeating Characters. What is the optimal time and space complexity?",
      topic: "DSA",
      difficulty: "Medium",
      expectedPoints: ["Sliding Window approach", "Hash map/set to track seen characters", "O(N) time and O(min(N, M)) space"],
    },
    {
      question: "How does QuickSort work? What is its worst-case time complexity, and how do you mitigate it?",
      topic: "DSA",
      difficulty: "Medium",
      expectedPoints: ["Divide and conquer / partitioning", "O(N log N) average vs O(N^2) worst case", "Randomized pivot selection"],
    },
    {
      question: "Given a Binary Tree, how do you determine if it is a valid Binary Search Tree (BST)?",
      topic: "DSA",
      difficulty: "Medium",
      expectedPoints: ["In-order traversal strictly increasing", "Recursive boundary checks (min, max)", "O(N) time and O(H) space"],
    },
  ],
  OOP: [
    {
      question: "Explain the 4 fundamental pillars of Object-Oriented Programming (Encapsulation, Abstraction, Inheritance, Polymorphism) with real-world examples.",
      topic: "OOP",
      difficulty: "Easy",
      expectedPoints: ["Data hiding", "Hiding complexity", "Code reuse", "Method overriding and overloading"],
    },
    {
      question: "What is the difference between an Abstract Class and an Interface? When would you prefer one over the other?",
      topic: "OOP",
      difficulty: "Medium",
      expectedPoints: ["State and method implementations vs pure contract", "Single vs multiple inheritance", "Use cases"],
    },
    {
      question: "Explain the SOLID principles with a quick example for the Single Responsibility Principle and Dependency Inversion Principle.",
      topic: "OOP",
      difficulty: "Hard",
      expectedPoints: ["SRP, OCP, LSP, ISP, DIP", "Decoupling high-level modules", "Dependency injection"],
    },
  ],
  OS: [
    {
      question: "What is the difference between a Process and a Thread? How does context switching work between them?",
      topic: "OS",
      difficulty: "Easy",
      expectedPoints: ["Separate address space vs shared memory", "Overhead of context switching", "Thread synchronization"],
    },
    {
      question: "What is a Deadlock? What are the 4 necessary conditions for a deadlock, and how can it be prevented?",
      topic: "OS",
      difficulty: "Medium",
      expectedPoints: ["Mutual exclusion, Hold and wait, No preemption, Circular wait", "Resource ordering", "Banker's algorithm"],
    },
    {
      question: "Explain Virtual Memory, Paging, and Page Faults. What happens when a page fault occurs?",
      topic: "OS",
      difficulty: "Medium",
      expectedPoints: ["Address translation via MMU", "Page tables", "Disk swap and frame replacement"],
    },
  ],
  "Computer Networks": [
    {
      question: "Explain what happens step-by-step from the moment you type 'https://www.google.com' into your browser and press Enter.",
      topic: "Computer Networks",
      difficulty: "Medium",
      expectedPoints: ["DNS resolution", "TCP 3-way handshake", "TLS negotiation", "HTTP request/response", "Browser rendering"],
    },
    {
      question: "Compare TCP vs UDP. Which one does HTTP/3 (QUIC) use, and why?",
      topic: "Computer Networks",
      difficulty: "Medium",
      expectedPoints: ["Connection-oriented reliable vs connectionless fast", "Head-of-line blocking in TCP", "QUIC built over UDP"],
    },
    {
      question: "What is the difference between HTTP, HTTPS, and WebSockets? When should WebSockets be used?",
      topic: "Computer Networks",
      difficulty: "Easy",
      expectedPoints: ["Stateless request-response", "SSL/TLS encryption", "Full-duplex persistent bidirectional connection"],
    },
  ],
  "System Design": [
    {
      question: "How would you design a URL Shortener service like Bit.ly? What database and hashing approach would you use, and how do you handle high read traffic?",
      topic: "System Design",
      difficulty: "Hard",
      expectedPoints: ["Base62 encoding or hash truncated", "Redis caching layer", "Relational/NoSQL storage", "Read:Write ratio"],
    },
    {
      question: "Explain horizontal scaling vs vertical scaling. What role do Load Balancers (Layer 4 vs Layer 7) play?",
      topic: "System Design",
      difficulty: "Medium",
      expectedPoints: ["Adding more machines vs bigger hardware", "Stateless application servers", "Routing algorithms (Round Robin, Least Connections)"],
    },
    {
      question: "What is Database Sharding? How does consistent hashing help prevent massive data reorganization when adding or removing shards?",
      topic: "System Design",
      difficulty: "Hard",
      expectedPoints: ["Horizontal partitioning", "Shard keys", "Consistent hashing ring", "Virtual nodes"],
    },
  ],
  HR: [
    {
      question: "Tell me about a challenging technical bug or conflict you encountered in a project or team, and how you resolved it using the STAR method.",
      topic: "HR",
      difficulty: "Easy",
      expectedPoints: ["Situation, Task, Action, Result", "Team collaboration", "Ownership and accountability"],
    },
    {
      question: "Where do you see yourself in 3 years, and how does this role fit into your career aspirations?",
      topic: "HR",
      difficulty: "Easy",
      expectedPoints: ["Learning agility", "Contribution to team success", "Realistic career progression"],
    },
    {
      question: "Why should we hire you for this role over other qualified candidates?",
      topic: "HR",
      difficulty: "Easy",
      expectedPoints: ["Alignment of skills with job requirements", "Passion and work ethic", "Unique project/practical experience"],
    },
  ],
  Java: [
    {
      question: "Explain the memory management in Java (Heap vs Stack, Garbage Collection algorithms). How does the Generational Hypothesis work?",
      topic: "Java",
      difficulty: "Hard",
      expectedPoints: ["Young Gen vs Old Gen", "Minor GC vs Major GC", "Stack stores references, Heap stores objects"],
    },
    {
      question: "What is the internal working of `HashMap` in Java? How are collisions handled in Java 8+?",
      topic: "Java",
      difficulty: "Medium",
      expectedPoints: ["Hash function and bucket index", "Linked list transition to Red-Black Tree at threshold 8", "equals() and hashCode() contract"],
    },
  ],
};

// Generate list of questions for interview session
async function generateInterviewQuestions({ role, experience, duration, topics }) {
  const count = duration === 15 ? 3 : duration === 45 ? 7 : 5;
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  try {
    const groq = getGroqClient();
    const prompt = `You are a Senior Engineering Hiring Manager at a top tech company.
Generate exactly ${count} mock interview questions for:
- Target Role: ${role}
- Experience Level: ${experience}
- Duration: ${duration} minutes
- Selected Topics: ${topics.join(", ")}

Generate a balanced mix of technical, conceptual, and practical questions tailored for this role and experience level.
Return ONLY valid JSON matching this schema:
[
  {
    "question": "<The interview question>",
    "topic": "<One of the selected topics>",
    "difficulty": "<Easy | Medium | Hard>",
    "expectedPoints": ["<point 1>", "<point 2>", "<point 3>"]
  }
]`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      temperature: 0.3,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || "";
    const cleanJson = responseText.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
    const generated = JSON.parse(cleanJson);

    if (Array.isArray(generated) && generated.length > 0) {
      return generated.slice(0, count).map((q) => ({
        question: q.question,
        topic: q.topic || topics[0],
        difficulty: q.difficulty || "Medium",
        expectedPoints: Array.isArray(q.expectedPoints) ? q.expectedPoints : ["Clear explanation", "Relevant examples"],
        userAnswer: "",
        score: null,
        feedback: "",
        strengths: [],
        improvements: [],
      }));
    }
  } catch (error) {
    console.warn("AI Question generation fallback to curated bank:", error.message);
  }

  // Fallback to curated question bank
  const selectedQuestions = [];
  let topicIdx = 0;

  for (let i = 0; i < count; i++) {
    const currentTopic = topics[topicIdx % topics.length];
    const available = questionBank[currentTopic] || questionBank["DSA"] || questionBank["JavaScript"];
    const item = available[i % available.length];

    selectedQuestions.push({
      question: item.question,
      topic: item.topic || currentTopic,
      difficulty: item.difficulty || "Medium",
      expectedPoints: item.expectedPoints || ["Structured logic", "Accuracy"],
      userAnswer: "",
      score: null,
      feedback: "",
      strengths: [],
      improvements: [],
    });
    topicIdx++;
  }

  return selectedQuestions;
}

// Evaluate individual answer
async function evaluateAnswer({ question, topic, role, experience, userAnswer }) {
  if (!userAnswer || userAnswer.trim().length < 5) {
    return {
      score: 2,
      feedback: "Answer is too brief to evaluate technical depth or communication.",
      strengths: [],
      improvements: ["Provide a complete explanation with specific examples and technical depth."],
    };
  }

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  try {
    const groq = getGroqClient();
    const prompt = `You are a Technical Interviewer assessing a candidate for a ${role} (${experience}) position.
Topic: ${topic}
Question:
"${question}"

Candidate's Answer:
"${userAnswer.slice(0, 2000)}"

Evaluate the candidate's answer constructively and rigorously.
Return ONLY valid JSON matching this schema:
{
  "score": <integer from 0 to 10>,
  "feedback": "<2-3 sentences evaluating technical accuracy, clarity, and depth>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement or missed point 1>", "<improvement 2>"]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      temperature: 0.2,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || "";
    const cleanJson = responseText.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return {
      score: Math.min(10, Math.max(0, Number(parsed.score) || 6)),
      feedback: parsed.feedback || "Solid answer demonstrating foundational understanding.",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Clear conceptual foundation"],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Could discuss edge cases and trade-offs"],
    };
  } catch (error) {
    console.warn("AI answer evaluation fallback to deterministic rubric:", error.message);
    const wordCount = userAnswer.trim().split(/\s+/).length;
    let score = 5;
    if (wordCount > 60) score = 8;
    else if (wordCount > 30) score = 6;
    else if (wordCount < 10) score = 3;

    return {
      score,
      feedback: "Answer covers basic concepts. Elaborate more on production trade-offs and concrete implementation details.",
      strengths: ["Relevant keywords mentioned", "Attempted practical context"],
      improvements: ["Elaborate on edge cases", "Include performance or architectural considerations"],
    };
  }
}

// Compute final multi-dimensional scorecard
async function calculateFinalScorecard(mockInterview) {
  const answered = mockInterview.questions.filter((q) => q.score !== null);
  const totalQuestions = mockInterview.questions.length;

  if (answered.length === 0) {
    return {
      overallScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      problemSolvingScore: 0,
      confidenceScore: 0,
      strongAreas: [],
      needsImprovement: mockInterview.topics,
      detailedFeedback: "No answers were submitted for evaluation.",
      completedAt: new Date(),
    };
  }

  // Calculate average base score (0 - 100)
  const avgScore = (answered.reduce((sum, q) => sum + (q.score || 0), 0) / answered.length) * 10;
  const overallScore = Math.round(avgScore * (answered.length / totalQuestions));

  // Multi-dimensional sub-scores
  const technicalScore = Math.min(100, Math.round(overallScore * 1.05));
  const communicationScore = Math.min(100, Math.max(40, Math.round(overallScore * 0.95)));
  const problemSolvingScore = Math.min(100, Math.round(overallScore * 1.02));
  const confidenceScore = Math.min(100, Math.max(45, Math.round(overallScore * 0.98)));

  // Identify topic-wise strengths and improvements
  const topicScores = {};
  for (const q of answered) {
    if (!topicScores[q.topic]) topicScores[q.topic] = [];
    topicScores[q.topic].push(q.score);
  }

  const strongAreas = [];
  const needsImprovement = [];

  for (const [topic, scores] of Object.entries(topicScores)) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg >= 7.0) {
      strongAreas.push(topic);
    } else {
      needsImprovement.push(topic);
    }
  }

  // Fallback if empty
  if (strongAreas.length === 0 && answered.length > 0) {
    strongAreas.push(answered[0].topic);
  }
  if (needsImprovement.length === 0 && mockInterview.topics.length > 1) {
    needsImprovement.push(mockInterview.topics[1]);
  }

  // Generate detailed executive feedback via AI
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  let detailedFeedback = `Candidate completed the mock interview for ${mockInterview.role} (${mockInterview.experience}). Overall score of ${overallScore}% achieved across ${answered.length} questions.`;

  try {
    const groq = getGroqClient();
    const prompt = `You are an Executive Tech Interview Coach.
Generate a concise, motivating, and highly actionable 3-paragraph summary of the candidate's mock interview performance.
- Role: ${mockInterview.role}
- Experience: ${mockInterview.experience}
- Overall Score: ${overallScore}%
- Technical: ${technicalScore}%, Communication: ${communicationScore}%, Problem Solving: ${problemSolvingScore}%, Confidence: ${confidenceScore}%
- Strong Areas: ${strongAreas.join(", ")}
- Needs Improvement: ${needsImprovement.join(", ")}

Include:
1. Executive Assessment of role readiness.
2. What set them apart (strengths).
3. Concrete steps to prepare before their real company interviews.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      temperature: 0.3,
      max_tokens: 800,
    });

    detailedFeedback = completion.choices[0]?.message?.content?.trim() || detailedFeedback;
  } catch (error) {
    console.warn("Executive summary fallback:", error.message);
  }

  return {
    overallScore,
    technicalScore,
    communicationScore,
    problemSolvingScore,
    confidenceScore,
    strongAreas,
    needsImprovement,
    detailedFeedback,
    completedAt: new Date(),
  };
}

module.exports = {
  generateInterviewQuestions,
  evaluateAnswer,
  calculateFinalScorecard,
};
