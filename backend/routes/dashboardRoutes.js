const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Submission = require("../models/Submission");
const JobApplication = require("../models/JobApplication");
const MockInterview = require("../models/MockInterview");
const User = require("../models/User");
const Job = require("../models/Job");
const Question = require("../models/Question");

// @desc    Get comprehensive user dashboard metrics, streak, activity heatmap & recommendations
// @route   GET /api/dashboard/summary
// @access  Private
router.get("/summary", protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // 1. Fetch user data
    const user = await User.findById(userId).select("name email role streak lastActiveDate createdAt");

    // 2. Fetch submissions
    const submissions = await Submission.find({ user: userId })
      .populate("question", "title category difficulty")
      .sort({ createdAt: -1 });

    const acceptedSubmissions = submissions.filter((s) => s.status === "Accepted");
    const uniqueSolvedMap = new Map();
    acceptedSubmissions.forEach((s) => {
      if (s.question && s.question._id) {
        uniqueSolvedMap.set(s.question._id.toString(), s.question);
      }
    });

    const solvedQuestions = Array.from(uniqueSolvedMap.values());
    const totalSolved = solvedQuestions.length;

    const difficultyBreakdown = {
      Easy: solvedQuestions.filter((q) => q.difficulty === "Easy").length,
      Medium: solvedQuestions.filter((q) => q.difficulty === "Medium").length,
      Hard: solvedQuestions.filter((q) => q.difficulty === "Hard").length,
    };

    // 3. Fetch Job Applications
    const jobApplications = await JobApplication.find({ user: userId })
      .populate("job", "title company location salary status jobType")
      .sort({ createdAt: -1 });

    // 4. Fetch Mock Interviews
    const mockInterviews = await MockInterview.find({ user: userId })
      .select("role experience duration status result createdAt")
      .sort({ createdAt: -1 });

    const completedInterviews = mockInterviews.filter((m) => m.status === "Completed");
    const totalInterviews = completedInterviews.length;

    let avgInterviewScore = 0;
    if (totalInterviews > 0) {
      const sum = completedInterviews.reduce((acc, curr) => {
        return acc + (curr.result?.overallScore || 0);
      }, 0);
      avgInterviewScore = Number((sum / totalInterviews).toFixed(1));
    }

    // 5. Activity Matrix (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const activityByDate = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      activityByDate[key] = { date: key, submissions: 0, interviews: 0, applications: 0, total: 0 };
    }

    submissions.forEach((s) => {
      const key = new Date(s.createdAt).toISOString().split("T")[0];
      if (activityByDate[key]) {
        activityByDate[key].submissions += 1;
        activityByDate[key].total += 1;
      }
    });

    mockInterviews.forEach((m) => {
      const key = new Date(m.createdAt).toISOString().split("T")[0];
      if (activityByDate[key]) {
        activityByDate[key].interviews += 1;
        activityByDate[key].total += 1;
      }
    });

    jobApplications.forEach((a) => {
      const key = new Date(a.createdAt).toISOString().split("T")[0];
      if (activityByDate[key]) {
        activityByDate[key].applications += 1;
        activityByDate[key].total += 1;
      }
    });

    const activityHeatmap = Object.values(activityByDate);

    // 6. Streak validation & update
    let currentStreak = user?.streak || 0;
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const todayActivity = (activityByDate[todayStr]?.total || 0) > 0;
    const yesterdayActivity = (activityByDate[yesterdayStr]?.total || 0) > 0;

    if (!todayActivity && !yesterdayActivity && currentStreak > 0) {
      currentStreak = 0;
      if (user) {
        user.streak = 0;
        await user.save();
      }
    } else if (todayActivity && currentStreak === 0) {
      currentStreak = 1;
      if (user) {
        user.streak = 1;
        user.lastActiveDate = now;
        await user.save();
      }
    }

    // 7. Profile-Based Recommended Jobs for quick apply
    const Profile = require("../models/Profile");
    const profile = await Profile.findOne({ user: userId });
    const allOpenJobs = await Job.find({ status: "Open" }).sort({ createdAt: -1 });

    let recommendedJobs = [];
    if (profile && (profile.skills?.length > 0 || profile.preferredRoles?.length > 0)) {
      const candidateSkills = (profile.skills || []).map((s) => s.toLowerCase().trim());
      const candidateRoles = (profile.preferredRoles || []).map((r) => r.toLowerCase().trim());

      const scored = allOpenJobs.map((job) => {
        let matchScore = 20;
        const titleLower = (job.title || "").toLowerCase();
        const isNonTech = /\b(writer|copywriter|finance manager|accountant|accounting|investor relations|marketing manager)\b/i.test(titleLower);
        const isTech = /\b(software|developer|engineer|sde|frontend|backend|full stack|fullstack|data engineer|cloud|devops)\b/i.test(titleLower);

        if (isNonTech) matchScore -= 30;
        if (isTech) matchScore += 25;

        const jobSkills = (job.skills || []).map((s) => s.toLowerCase().trim());
        const matched = jobSkills.filter((js) => candidateSkills.some((cs) => {
          if (js === cs) return true;
          if (js.length > 3 && cs.includes(js)) return true;
          return false;
        }));
        matchScore += Math.min(45, matched.length * 15);

        if (candidateRoles.some((cr) => titleLower.includes(cr))) {
          matchScore += 20;
        }

        const finalScore = Math.min(98, Math.max(15, matchScore));
        return {
          ...job.toObject(),
          matchScore: finalScore,
          matchedSkillsCount: matched.length,
        };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);
      recommendedJobs = scored.slice(0, 3);
    } else {
      recommendedJobs = allOpenJobs.filter(j => !/\b(writer|accountant|finance manager)\b/i.test(j.title)).slice(0, 3).map(j => ({ ...j.toObject(), matchScore: 70 }));
    }



    // 8. Daily Goal checklist computation
    const dailyGoals = {
      solveProblem: (activityByDate[todayStr]?.submissions || 0) > 0,
      mockInterview: (activityByDate[todayStr]?.interviews || 0) > 0,
      applyJob: (activityByDate[todayStr]?.applications || 0) > 0,
    };

    res.json({
      success: true,
      data: {
        user: {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          streak: currentStreak,
        },
        metrics: {
          totalSolved,
          difficultyBreakdown,
          jobsApplied: jobApplications.length,
          mockInterviewsTaken: totalInterviews,
          avgInterviewScore,
        },
        activityHeatmap,
        dailyGoals,
        recentSubmissions: submissions.slice(0, 5),
        recentApplications: jobApplications.slice(0, 5),
        recentInterviews: mockInterviews.slice(0, 5),
        recommendedJobs,
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
