const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    college: String,
    degree: String,
    graduationYear: Number,
    skills: [String],
    preferredRoles: [String],
    preferredLocations: [String],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        link: String,
        github: String,
      },
    ],
    github: String,
    linkedin: String,
    portfolio: String,
    resumeUrl: String,
    resumeFileName: String,
    resumeText: String,
    resumeUploadedAt: Date,
    resumeAnalysis: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
