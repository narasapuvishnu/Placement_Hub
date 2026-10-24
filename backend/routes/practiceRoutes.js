const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  submitSolution,
  getUserStats,
} = require("../controllers/practiceController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

router.get("/", optionalAuth, getQuestions);
router.get("/stats", protect, getUserStats);
router.get("/:id", optionalAuth, getQuestionById);
router.post("/:id/submit", protect, submitSolution);

module.exports = router;
