const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const Question = require("../models/Question");
const Company = require("../models/Company");
const Experience = require("../models/Experience");
const Resource = require("../models/Resource");
const MockInterview = require("../models/MockInterview");

// Apply admin protection to all admin routes
router.use(protect);
router.use(admin);

// @desc    Get system overview statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get("/stats", async (req, res) => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      totalQuestions,
      totalCompanies,
      totalExperiences,
      totalResources,
      totalMockInterviews,
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      JobApplication.countDocuments(),
      Question.countDocuments(),
      Company.countDocuments(),
      Experience.countDocuments(),
      Resource.countDocuments(),
      MockInterview.countDocuments(),
    ]);

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApplications = await JobApplication.find()
      .populate("user", "name email")
      .populate("job", "title company")
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        counts: {
          users: totalUsers,
          jobs: totalJobs,
          applications: totalApplications,
          questions: totalQuestions,
          companies: totalCompanies,
          experiences: totalExperiences,
          resources: totalResources,
          mockInterviews: totalMockInterviews,
        },
        recentUsers,
        recentApplications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== JOBS MANAGEMENT ====================
// @desc    Get all jobs (Admin)
// @route   GET /api/admin/jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create job (Admin)
// @route   POST /api/admin/jobs
router.post("/jobs", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Update job (Admin)
// @route   PUT /api/admin/jobs/:id
router.put("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete job (Admin)
// @route   DELETE /api/admin/jobs/:id
router.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== QUESTIONS MANAGEMENT ====================
// @desc    Get all questions (Admin)
// @route   GET /api/admin/questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create question (Admin)
// @route   POST /api/admin/questions
router.post("/questions", async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete question (Admin)
// @route   DELETE /api/admin/questions/:id
router.delete("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    res.json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== COMPANIES MANAGEMENT ====================
// @desc    Get all companies (Admin)
// @route   GET /api/admin/companies
router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create company (Admin)
// @route   POST /api/admin/companies
router.post("/companies", async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete company (Admin)
// @route   DELETE /api/admin/companies/:id
router.delete("/companies/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== APPLICATIONS MANAGEMENT ====================
// @desc    Get all applications with status update (Admin)
// @route   GET /api/admin/applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate("job")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update application status (Admin)
// @route   PUT /api/admin/applications/:id
router.put("/applications/:id", async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
