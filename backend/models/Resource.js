const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    resourceType: {
      type: String,
      enum: ["PDF", "Note", "Link", "Study Guide"],
      required: true,
    },
    category: {
      type: String,
      enum: ["DSA", "System Design", "SQL", "Aptitude", "Career"],
      required: true,
    },
    description: { type: String, required: true },
    url: { type: String, required: true },
    source: { type: String, default: "PlacementHub" },
    tags: [{ type: String }],
    readTime: { type: String, default: "5 min read" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
