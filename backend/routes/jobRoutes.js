const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobById,
  getRecommendedJobs,
  applyForJob,
  createJob,
  getMyApplications,
  getAllApplications,
  triggerJobSync,
} = require("../controllers/jobController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(getJobs).post(protect, admin, createJob);
router.route("/recommended").get(protect, getRecommendedJobs);
router.route("/sync").post(triggerJobSync).get(triggerJobSync);
router.route("/applications/me").get(protect, getMyApplications);
router.route("/applications/all").get(protect, admin, getAllApplications);
router.route("/:id").get(getJobById);
router.route("/:id/apply").post(protect, applyForJob);

module.exports = router;


