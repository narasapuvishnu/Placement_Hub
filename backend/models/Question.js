const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["DSA", "System Design", "SQL", "Aptitude"],
      required: true,
    },
    topic: {
      type: String,
      default: "",
      trim: true,
    },
    questionType: {
      type: String,
      enum: ["coding", "system-design", "mcq"],
      default: "coding",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    tags: [
      {
        type: String,
      },
    ],
    companies: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    inputFormat: {
      type: String,
      default: "",
    },
    outputFormat: {
      type: String,
      default: "",
    },
    constraints: [
      {
        type: String,
      },
    ],
    sampleCases: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    options: [{ type: String }],
    correctOption: { type: Number, min: 0 },
    answerExplanation: { type: String, default: "" },
    starterCode: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    hints: [
      {
        type: String,
      },
    ],
    solutionApproach: {
      type: String,
      default: "",
    },
    solutionCode: {
      type: String,
      default: "",
    },
    acceptanceRate: {
      type: Number,
      default: 75,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
