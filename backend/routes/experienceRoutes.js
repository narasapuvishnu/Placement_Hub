const express = require("express");
const router = express.Router();
const {
  getExperiences,
  getExperienceById,
  createExperience,
  toggleUpvoteExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getExperiences).post(protect, createExperience);
router.route("/:id").get(getExperienceById).delete(protect, deleteExperience);
router.route("/:id/upvote").post(protect, toggleUpvoteExperience);

module.exports = router;
