const express = require("express");
const multer = require("multer");
const {
	getMyProfile,
	updateMyProfile,
	uploadResume,
	analyzeMyResume,
	savePastedResume,
	analyzeJobDescriptionFile,
	generateOptimized,
	clearAnalysis,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, callback) => {
		const accepted = file.mimetype === "application/pdf" || file.mimetype === "text/plain";
		callback(accepted ? null : new Error("Only PDF and text resume files are supported."), accepted);
	},
});

router.use(protect);
router.route("/me").get(getMyProfile).put(updateMyProfile);
router.post("/resume", upload.single("resume"), uploadResume);
router.post("/resume/text", savePastedResume);
router.post("/resume/analyze", analyzeMyResume);
router.post("/resume/analyze-file", upload.single("jobDescription"), analyzeJobDescriptionFile);
router.post("/resume/generate-optimized", generateOptimized);
router.delete("/resume/analysis", clearAnalysis);

module.exports = router;
