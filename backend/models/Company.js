const mongoose = require("mongoose");

const InterviewRoundSchema = new mongoose.Schema(
  {
    roundNumber: Number,
    name: String,
    roundType: String,
    duration: String,
    description: String,
    tips: String,
  },
  { _id: false }
);

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "Technology",
    },
    headquarters: {
      type: String,
      default: "Global",
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Very Hard"],
      default: "Medium",
    },
    hiringRoles: [
      {
        type: String,
      },
    ],
    interviewRounds: [InterviewRoundSchema],
    frequentTopics: [
      {
        type: String,
      },
    ],
    salaryRange: {
      type: String,
      default: "Competitive",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
