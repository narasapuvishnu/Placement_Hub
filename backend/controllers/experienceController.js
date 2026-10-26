const Experience = require("../models/Experience");
const { ensureExperiencesSeeded, syncInterviewStories } = require("../services/experienceSyncService");

// @desc    Get all interview experiences with search, filter, and sorting
// @route   GET /api/experiences
// @access  Public
exports.getExperiences = async (req, res) => {
  try {
    await ensureExperiencesSeeded();
    const { search, company, outcome, difficulty, sort } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    if (company && company !== "All") {
      query.company = { $regex: `^${company}$`, $options: "i" };
    }

    if (outcome && outcome !== "All") {
      query.outcome = outcome;
    }

    if (difficulty && difficulty !== "All") {
      query.overallDifficulty = difficulty;
    }

    let sortOption = { createdAt: -1 };
    if (sort === "upvotes") {
      sortOption = { upvotesCount: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    let experiences = await Experience.find(query)
      .populate("user", "name email role")
      .lean();

    // Compute upvotes count dynamically for sorting
    experiences = experiences.map((exp) => ({
      ...exp,
      upvotesCount: exp.upvotes ? exp.upvotes.length : 0,
    }));

    if (sort === "upvotes") {
      experiences.sort((a, b) => b.upvotesCount - a.upvotesCount);
    }

    res.json({
      success: true,
      count: experiences.length,
      experiences,
    });
  } catch (err) {
    console.error("Error fetching experiences:", err);
    res.status(500).json({ msg: "Server error fetching interview experiences" });
  }
};

// @desc    Get single interview experience by ID
// @route   GET /api/experiences/:id
// @access  Public
exports.getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id).populate(
      "user",
      "name email role department avatar"
    );

    if (!experience) {
      return res.status(404).json({ msg: "Interview experience not found" });
    }

    res.json({
      success: true,
      experience,
    });
  } catch (err) {
    console.error("Error fetching experience detail:", err);
    res.status(500).json({ msg: "Server error fetching experience details" });
  }
};

// @desc    Create new interview experience
// @route   POST /api/experiences
// @access  Private
exports.createExperience = async (req, res) => {
  try {
    const {
      company,
      companyLogo,
      role,
      outcome,
      batchYear,
      jobType,
      overallDifficulty,
      salaryDetails,
      location,
      title,
      summary,
      rounds,
      tags,
    } = req.body;

    if (!company || !role || !title || !summary) {
      return res.status(400).json({ msg: "Please fill in all required fields (Company, Role, Title, Summary)" });
    }

    const newExperience = new Experience({
      user: req.user.id,
      company,
      companyLogo: companyLogo || "",
      role,
      outcome: outcome || "Offered",
      batchYear: batchYear || new Date().getFullYear(),
      jobType: jobType || "Full-Time",
      overallDifficulty: overallDifficulty || "Medium",
      salaryDetails: salaryDetails || "",
      location: location || "Onsite",
      title,
      summary,
      rounds: rounds || [],
      tags: tags || [],
    });

    const savedExp = await newExperience.save();
    const populatedExp = await Experience.findById(savedExp._id).populate("user", "name email role");

    res.status(201).json({
      success: true,
      msg: "Interview experience posted successfully!",
      experience: populatedExp,
    });
  } catch (err) {
    console.error("Error creating experience:", err);
    res.status(500).json({ msg: "Server error submitting experience" });
  }
};

// @desc    Upvote / Toggle upvote on experience
// @route   POST /api/experiences/:id/upvote
// @access  Private
exports.toggleUpvoteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ msg: "Interview experience not found" });
    }

    const userIdStr = req.user.id.toString();
    const alreadyUpvoted = experience.upvotes.some(
      (upId) => upId.toString() === userIdStr
    );

    if (alreadyUpvoted) {
      // Remove upvote
      experience.upvotes = experience.upvotes.filter(
        (upId) => upId.toString() !== userIdStr
      );
    } else {
      // Add upvote
      experience.upvotes.push(req.user.id);
    }

    await experience.save();

    res.json({
      success: true,
      upvotesCount: experience.upvotes.length,
      isUpvoted: !alreadyUpvoted,
    });
  } catch (err) {
    console.error("Error upvoting experience:", err);
    res.status(500).json({ msg: "Server error processing upvote" });
  }
};

// @desc    Delete interview experience
// @route   DELETE /api/experiences/:id
// @access  Private
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ msg: "Experience not found" });
    }

    if (experience.user && experience.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to delete this experience" });
    }

    await experience.deleteOne();

    res.json({
      success: true,
      msg: "Interview experience deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting experience:", err);
    res.status(500).json({ msg: "Server error deleting experience" });
  }
};

// @desc    Trigger auto-sync of interview experiences
// @route   POST /api/experiences/sync
// @access  Public
exports.syncStories = async (req, res) => {
  try {
    const result = await syncInterviewStories();
    res.json(result);
  } catch (err) {
    console.error("Error triggering experience sync:", err);
    res.status(500).json({ success: false, msg: "Failed to sync interview experiences" });
  }
};
