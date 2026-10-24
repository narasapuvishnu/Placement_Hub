const express = require("express");
const {
  startInterview,
  getInterviewById,
  submitAnswer,
  finishInterview,
  getInterviewHistory,
} = require("../controllers/mockInterviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All mock interview routes require authentication
router.use(protect);

router.post("/start", startInterview);
router.get("/history", getInterviewHistory);
router.get("/:id", getInterviewById);
router.post("/:id/answer", submitAnswer);
router.post("/:id/finish", finishInterview);

module.exports = router;
