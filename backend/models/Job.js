const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyLogo: { type: String, default: "" },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    location: { type: String, required: true },
    skills: [{ type: String }],
    experience: { type: String, required: true }, // e.g., "0-2 years"
    employmentType: { type: String, required: true }, // e.g., "Full-time", "Internship", "Part-time"
    salary: { type: String, default: "Not Disclosed" }, // e.g., "₹8 - ₹12 LPA", "₹30,000/month", "$90k - $120k"
    batchEligible: [{ type: String }], // e.g., ["2024", "2025", "2026", "2027"]
    degreeEligible: [{ type: String }], // e.g., ["B.Tech", "B.E.", "MCA", "B.Sc", "Any Degree"]
    workMode: { type: String, enum: ["In-Office", "Remote", "Hybrid"], default: "In-Office" },
    category: {
      type: String,
      enum: ["OFF_CAMPUS", "ON_CAMPUS", "EXCLUSIVE", "INTERNSHIP"],
      default: "OFF_CAMPUS",
    },
    source: { type: String, default: "PlacementHub" },
    sourceUrl: { type: String },
    applyUrl: { type: String }, // Direct, actual application link
    externalId: { type: String, index: true }, // Unique ID from remote source for deduplication
    deadline: { type: Date },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);

