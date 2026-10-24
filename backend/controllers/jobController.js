const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");

const { syncExternalJobs } = require("../services/jobSyncService");

// @desc    Get all jobs with rich filtering, search and category breakdown
// @route   GET /api/jobs
// @access  Public (served regardless of profile of user)
const getJobs = async (req, res) => {
  try {
    const {
      search,
      category,
      workMode,
      location,
      experience,
      sort = "newest",
    } = req.query;

    const query = { status: "Open" };

    if (category && category !== "ALL") {
      query.category = category;
    }

    if (workMode && workMode !== "ALL") {
      query.workMode = workMode;
    }

    if (location && location !== "ALL") {
      query.location = { $regex: location, $options: "i" };
    }

    if (experience && experience !== "ALL") {
      query.experience = { $regex: experience, $options: "i" };
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { skills: searchRegex },
        { location: searchRegex },
      ];
    }

    let sortQuery = { createdAt: -1 };
    if (sort === "oldest") sortQuery = { createdAt: 1 };
    if (sort === "company") sortQuery = { company: 1 };

    const jobs = await Job.find(query).sort(sortQuery);

    // Compute category counts for AccioJob-style category tabs
    const [allCount, offCampusCount, onCampusCount, internshipCount] =
      await Promise.all([
        Job.countDocuments({ status: "Open" }),
        Job.countDocuments({ status: "Open", category: "OFF_CAMPUS" }),
        Job.countDocuments({ status: "Open", category: "ON_CAMPUS" }),
        Job.countDocuments({ status: "Open", category: "INTERNSHIP" }),
      ]);

    res.json({
      success: true,
      data: jobs,
      counts: {
        ALL: allCount,
        OFF_CAMPUS: offCampusCount,
        ON_CAMPUS: onCampusCount,
        INTERNSHIP: internshipCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger manual or scheduled sync of jobs from external portals
// @route   POST /api/jobs/sync
// @access  Public or Admin
const triggerJobSync = async (req, res) => {
  try {
    const result = await syncExternalJobs();
    res.json({ success: true, message: "Job synchronization completed", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.json({ success: true, data: job });
    } else {
      res.status(404).json({ success: false, message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const alreadyApplied = await JobApplication.findOne({
      user: req.user._id,
      job: job._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: "Already applied" });
    }

    const application = await JobApplication.create({
      user: req.user._id,
      job: job._id,
      status: "Applied",
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get user's job applications
// @route   GET /api/jobs/applications/me
// @access  Private
const getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all job applications (Admin)
// @route   GET /api/jobs/applications/all
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate("job")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get smart recommended jobs tailored to user's profile and resume
// @route   GET /api/jobs/recommended
// @access  Private
const getRecommendedJobs = async (req, res) => {
  try {
    const Profile = require("../models/Profile");
    const profile = await Profile.findOne({ user: req.user._id });

    const openJobs = await Job.find({ status: "Open" }).sort({ createdAt: -1 });

    if (!profile) {
      // Default to latest open jobs if user has not yet created or parsed profile
      return res.json({
        success: true,
        data: openJobs.slice(0, 10).map((j) => ({
          ...j.toObject(),
          matchScore: 60,
          matchedSkills: [],
          recommendationReason: "Popular opening for upcoming batch",
        })),
        hasProfile: false,
      });
    }

    const candidateSkills = (profile.skills || []).map((s) => s.toLowerCase().trim());
    const candidateRoles = (profile.preferredRoles || []).map((r) => r.toLowerCase().trim());
    const candidateLocations = (profile.preferredLocations || []).map((l) => l.toLowerCase().trim());
    const candidateGradYear = profile.graduationYear ? String(profile.graduationYear) : null;
    const candidateDegree = profile.degree ? profile.degree.toLowerCase() : "";

    // Candidate domain detection (software / tech)
    const isTechCandidate = candidateSkills.some(s => 
      /javascript|react|node|python|java|c\+\+|sql|express|html|css|developer|engineer|dsa|algorithms/i.test(s)
    ) || candidateRoles.some(r => /engineer|developer|sde|full stack|backend|frontend/i.test(r)) || /b\.?tech|b\.?e|mca|bca|cs|computer/i.test(candidateDegree);

    const scoredJobs = openJobs.map((job) => {
      let score = 0;
      const matchedSkills = [];
      const reasons = [];

      const titleLower = (job.title || "").toLowerCase();
      const descLower = (job.description || "").toLowerCase();

      // Check if job is non-technical (e.g. freelance writer, accountant, finance manager, marketing manager)
      const isNonTechJob = /\b(writer|copywriter|content|finance manager|accountant|accounting|investor relations|marketing manager|human resources|sales executive|telecaller)\b/i.test(titleLower) &&
        !/\b(software|developer|sde|full stack|frontend|backend|devops|data engineer|qa|cloud)\b/i.test(titleLower);

      // Check if job is explicitly a software / technical role
      const isTechJob = /\b(software|developer|engineer|sde|frontend|backend|full stack|fullstack|data engineer|cloud|devops|programmer|qa|tester|intern)\b/i.test(titleLower);

      // 1. Skill Matching (Up to 55 points)
      // Use exact equality or strict token match to prevent 'rest' matching 'rest api' or 'go' matching 'google'
      const jobSkills = (job.skills || []).map((s) => s.toLowerCase().trim());
      if (jobSkills.length > 0 && candidateSkills.length > 0) {
        jobSkills.forEach((js) => {
          // Normalize short skills
          const isMatch = candidateSkills.some((cs) => {
            if (js === cs) return true;
            if (js.length > 3 && cs.includes(js)) return true;
            if (cs.length > 3 && js.includes(cs)) return true;
            return false;
          });
          if (isMatch) {
            matchedSkills.push(js);
          }
        });

        if (matchedSkills.length > 0) {
          const skillRatio = matchedSkills.length / Math.max(1, jobSkills.length);
          const skillScore = Math.round(skillRatio * 45) + Math.min(10, matchedSkills.length * 3);
          score += Math.min(55, skillScore);
          reasons.push(`${matchedSkills.length} skills matched (${matchedSkills.slice(0, 3).join(", ")})`);
        }
      }

      // 2. Role Title & Domain Alignment (Up to 30 points, or severe penalty)
      if (isTechCandidate) {
        if (isNonTechJob) {
          // Heavy penalty if software engineer is shown a finance/writer job
          score -= 40;
        } else if (isTechJob) {
          score += 20;
          reasons.push("Tech / SDE role matching your domain");
        }
      }

      // Match against candidate's specific preferred roles (e.g. Full Stack, SDE, Frontend)
      if (candidateRoles.length > 0) {
        const preferredMatch = candidateRoles.some((cr) => {
          const core = cr.replace(/developer|engineer|intern/gi, "").trim();
          return titleLower.includes(cr) || (core.length > 2 && titleLower.includes(core));
        });
        if (preferredMatch) {
          score += 15;
          reasons.push("Direct match for your preferred role");
        }
      } else if (isTechCandidate && isTechJob) {
        // If candidate hasn't explicitly set preferredRoles yet, default give credit for matching tech roles
        score += 10;
      }

      // 3. Batch Year Eligibility (Up to 10 points)
      if (candidateGradYear && Array.isArray(job.batchEligible) && job.batchEligible.length > 0) {
        if (job.batchEligible.includes(candidateGradYear) || job.batchEligible.includes("Any Batch")) {
          score += 10;
          reasons.push(`Open to ${candidateGradYear} batch`);
        }
      }

      // 4. Degree Eligibility (Up to 10 points)
      if (candidateDegree && Array.isArray(job.degreeEligible) && job.degreeEligible.length > 0) {
        const degreeMatch = job.degreeEligible.some(
          (d) => candidateDegree.includes(d.toLowerCase()) || d.toLowerCase().includes("any")
        );
        if (degreeMatch) {
          score += 10;
        }
      }

      // 5. Preferred Location & Work Mode (Up to 5 points)
      const jobLocLower = (job.location || "").toLowerCase();
      if (candidateLocations.length > 0) {
        const locMatch = candidateLocations.some(
          (cl) => jobLocLower.includes(cl) || job.workMode === "Remote"
        );
        if (locMatch) score += 5;
      }

      // Disallow non-tech jobs with 0 matched tech skills from having high scores
      if (isNonTechJob && matchedSkills.length === 0) {
        score = Math.min(25, score);
      }

      // Calculate final score between 15% and 98%
      const finalScore = Math.min(98, Math.max(15, score));

      return {
        ...job.toObject(),
        matchScore: finalScore,
        matchedSkills,
        recommendationReason: reasons.slice(0, 2).join(" • ") || "General opportunity matching batch criteria",
      };
    });

    // Sort by match score descending
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);


    res.json({
      success: true,
      data: scoredJobs,
      hasProfile: true,
      profileSummary: {
        skillsCount: candidateSkills.length,
        preferredRoles: profile.preferredRoles || [],
        college: profile.college,
        degree: profile.degree,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  getRecommendedJobs,
  applyForJob,
  createJob,
  getMyApplications,
  getAllApplications,
  triggerJobSync,
};


