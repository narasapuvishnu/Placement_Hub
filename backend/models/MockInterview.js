const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
  expectedPoints: [String],
  userAnswer: {
    type: String,
    default: "",
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: null,
  },
  feedback: {
    type: String,
    default: "",
  },
  strengths: [String],
  improvements: [String],
  answeredAt: Date,
});

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: [
        "Software Developer",
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "QA/Testing",
        "Data Analyst",
        "Digital Specialist",
        "Graduate Engineer",
      ],
    },
    experience: {
      type: String,
      required: true,
      enum: ["Fresher", "1-2 years", "3+ years"],
      default: "Fresher",
    },
    duration: {
      type: Number,
      required: true,
      enum: [15, 30, 45],
      default: 30,
    },
    topics: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one topic must be selected.",
      },
    },
    status: {
      type: String,
      enum: ["In-Progress", "Completed", "Abandoned"],
      default: "In-Progress",
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    questions: [questionSchema],
    result: {
      overallScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      technicalScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      communicationScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      problemSolvingScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      strongAreas: [String],
      needsImprovement: [String],
      detailedFeedback: String,
      completedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockInterview", mockInterviewSchema);
