const MockInterview = require("../models/MockInterview");
const {
  generateInterviewQuestions,
  evaluateAnswer,
  calculateFinalScorecard,
} = require("../services/mockInterviewService");

// @desc    Start a new mock interview session
// @route   POST /api/mock-interviews/start
// @access  Private
exports.startInterview = async (req, res) => {
  try {
    const { role, experience, duration, topics } = req.body;

    if (!role || !topics || topics.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please choose a role and select at least one topic.",
      });
    }

    const generatedQuestions = await generateInterviewQuestions({
      role,
      experience: experience || "Fresher",
      duration: duration || 30,
      topics,
    });

    const interview = await MockInterview.create({
      user: req.user._id,
      role,
      experience: experience || "Fresher",
      duration: duration || 30,
      topics,
      questions: generatedQuestions,
      currentQuestionIndex: 0,
      status: "In-Progress",
    });

    res.status(201).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Error starting mock interview:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get interview session details
// @route   GET /api/mock-interviews/:id
// @access  Private
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await MockInterview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview session not found." });
    }

    res.json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit an answer for current question
// @route   POST /api/mock-interviews/:id/answer
// @access  Private
exports.submitAnswer = async (req, res) => {
  try {
    const { questionIndex, userAnswer } = req.body;
    const interview = await MockInterview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview session not found." });
    }

    if (questionIndex < 0 || questionIndex >= interview.questions.length) {
      return res.status(400).json({ success: false, message: "Invalid question index." });
    }

    const targetQuestion = interview.questions[questionIndex];

    // Evaluate answer with AI
    const evaluation = await evaluateAnswer({
      question: targetQuestion.question,
      topic: targetQuestion.topic,
      role: interview.role,
      experience: interview.experience,
      userAnswer,
    });

    targetQuestion.userAnswer = userAnswer;
    targetQuestion.score = evaluation.score;
    targetQuestion.feedback = evaluation.feedback;
    targetQuestion.strengths = evaluation.strengths;
    targetQuestion.improvements = evaluation.improvements;
    targetQuestion.answeredAt = new Date();

    const isLastQuestion = questionIndex === interview.questions.length - 1;
    if (!isLastQuestion) {
      interview.currentQuestionIndex = questionIndex + 1;
    }

    await interview.save();

    res.json({
      success: true,
      updatedQuestion: targetQuestion,
      isLastQuestion,
      nextIndex: isLastQuestion ? questionIndex : questionIndex + 1,
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Conclude interview and compute scorecard
// @route   POST /api/mock-interviews/:id/finish
// @access  Private
exports.finishInterview = async (req, res) => {
  try {
    const interview = await MockInterview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview session not found." });
    }

    const scorecard = await calculateFinalScorecard(interview);

    interview.status = "Completed";
    interview.result = scorecard;

    await interview.save();

    res.json({
      success: true,
      result: scorecard,
      interview,
    });
  } catch (error) {
    console.error("Error finalizing interview:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user interview history
// @route   GET /api/mock-interviews/history
// @access  Private
exports.getInterviewHistory = async (req, res) => {
  try {
    const interviews = await MockInterview.find({ user: req.user._id })
      .select("role experience duration topics status result createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
