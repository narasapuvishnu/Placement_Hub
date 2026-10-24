const mongoose = require("mongoose");

const ExperienceRoundSchema = new mongoose.Schema({
  roundName: {
    type: String,
    required: true,
  },
  roundType: {
    type: String,
    enum: ["Online Assessment", "Technical Coding", "System Design", "Behavioral / HR", "Bar Raiser"],
    default: "Technical Coding",
  },
  description: {
    type: String,
    required: true,
  },
  questionsAsked: [
    {
      type: String,
    },
  ],
  tips: {
    type: String,
    default: "",
  },
});

const ExperienceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    outcome: {
      type: String,
      enum: ["Offered", "Rejected", "Pending", "Declined"],
      default: "Offered",
    },
    batchYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Internship", "Co-Op"],
      default: "Full-Time",
    },
    overallDifficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Very Hard"],
      default: "Medium",
    },
    salaryDetails: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "Remote / Onsite",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    rounds: [ExperienceRoundSchema],
    tags: [
      {
        type: String,
      },
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Experience", ExperienceSchema);
