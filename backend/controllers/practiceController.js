const Question = require("../models/Question");
const Submission = require("../models/Submission");
const User = require("../models/User");

// @desc    Get all questions with filters & user solve status
// @route   GET /api/practice
// @access  Public (Optional auth for solved status)
exports.getQuestions = async (req, res) => {
  try {
    const { category, topic, difficulty, company, search } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }
    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }
    if (topic && topic !== "All") {
      query.topic = topic;
    }
    if (company && company !== "All") {
      query.companies = { $regex: new RegExp(company, "i") };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const questions = await Question.find(query)
      .select("-solutionCode -solutionApproach")
      .sort({ createdAt: -1 });

    // If user is authenticated, check which questions they have solved
    let solvedQuestionIds = new Set();
    if (req.user && req.user.id) {
      const userSubmissions = await Submission.find({
        user: req.user.id,
        status: "Accepted",
      }).select("question");
      solvedQuestionIds = new Set(
        userSubmissions.map((s) => s.question.toString())
      );
    }

    const questionsWithStatus = questions.map((q) => ({
      ...q.toObject(),
      isSolved: solvedQuestionIds.has(q._id.toString()),
    }));

    res.json(questionsWithStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Get single question details
// @route   GET /api/practice/:id
// @access  Public
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    let userSubmission = null;
    if (req.user && req.user.id) {
      userSubmission = await Submission.findOne({
        user: req.user.id,
        question: question._id,
      }).sort({ createdAt: -1 });
    }

    res.json({
      question,
      lastSubmission: userSubmission,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Question not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Submit code / solution for a question
// @route   POST /api/practice/:id/submit
// @access  Private
exports.submitSolution = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    const { code, language = "javascript", status = "Accepted" } = req.body;

    // Validate that code is provided and not empty
    if (!code || !code.trim()) {
      return res.status(400).json({
        msg: "Cannot submit empty code. Please write your solution before submitting.",
      });
    }

    // Check if code is unmodified starter code
    const strip = (s) =>
      (s || "")
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
        .replace(/#.*$/gm, "")
        .replace(/--.*$/gm, "")
        .replace(/\s+/g, "");

    const starter =
      question.starterCode?.[language] ||
      question.starterCode?.sql ||
      question.starterCode?.javascript ||
      "";
    const cleanUser = strip(code);
    const cleanStarter = strip(starter);

    if (cleanUser.length === 0) {
      return res.status(400).json({
        msg: "Submission contains only comments or whitespace. Please write your solution before submitting.",
      });
    }

    if (cleanStarter.length > 0 && cleanUser === cleanStarter) {
      return res.status(400).json({
        msg: "Cannot submit unmodified starter template. Please implement your solution before submitting.",
      });
    }

    // Empty function body check
    const emptyFnRegex =
      /(?:function\s*\w*\s*\([^)]*\)|=>|\)\s*\{)\s*\{\s*\}|def\s+\w+\s*\([^)]*\)\s*:\s*(?:pass|\.\.\.)?\s*$/;
    if (emptyFnRegex.test(code.trim())) {
      return res.status(400).json({
        msg: "Function body is empty. Please implement the solution before submitting.",
      });
    }

    const isAccepted = status === "Accepted";

    const submission = new Submission({
      user: req.user.id,
      question: question._id,
      code,
      language,
      status: isAccepted ? "Accepted" : "Wrong Answer",
      executionTimeMs: Math.floor(Math.random() * 50) + 20,
    });

    await submission.save();

    // Increment user streak / update streak date ONLY if Accepted
    let userStreak = 0;
    const user = await User.findById(req.user.id);
    if (user) {
      if (isAccepted) {
        const today = new Date().toDateString();
        const lastActive = user.lastActiveDate
          ? new Date(user.lastActiveDate).toDateString()
          : null;

        if (!lastActive || lastActive !== today) {
          user.streak = (user.streak || 0) + 1;
          user.lastActiveDate = new Date();
          await user.save();
        }
      }
      userStreak = user.streak || 0;
    }

    res.json({
      msg: isAccepted ? "Solution submitted successfully!" : "Solution submitted with failed test cases.",
      submission,
      userStreak,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Get user's practice statistics
// @route   GET /api/practice/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user.id,
      status: "Accepted",
    }).populate("question");

    // Unique solved question IDs
    const uniqueSolvedMap = new Map();
    submissions.forEach((s) => {
      if (s.question) {
        uniqueSolvedMap.set(s.question._id.toString(), s.question);
      }
    });

    const solvedQuestions = Array.from(uniqueSolvedMap.values());
    const totalSolved = solvedQuestions.length;

    const byDifficulty = {
      Easy: solvedQuestions.filter((q) => q.difficulty === "Easy").length,
      Medium: solvedQuestions.filter((q) => q.difficulty === "Medium").length,
      Hard: solvedQuestions.filter((q) => q.difficulty === "Hard").length,
    };

    const byCategory = {
      DSA: solvedQuestions.filter((q) => q.category === "DSA").length,
      "System Design": solvedQuestions.filter(
        (q) => q.category === "System Design"
      ).length,
      SQL: solvedQuestions.filter((q) => q.category === "SQL").length,
      Aptitude: solvedQuestions.filter((q) => q.category === "Aptitude").length,
    };

    const recentSubmissions = await Submission.find({ user: req.user.id })
      .populate("question", "title category difficulty")
      .sort({ createdAt: -1 })
      .limit(5);

    const user = await User.findById(req.user.id).select("streak");

    res.json({
      totalSolved,
      byDifficulty,
      byCategory,
      streak: user ? user.streak : 0,
      recentSubmissions,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
