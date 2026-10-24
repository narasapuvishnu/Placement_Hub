require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to Database
connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to PlacementHub API" });
});

// Define Routes
app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/users", require("./routes/users"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.use("/api/practice", require("./routes/practiceRoutes"));
app.use("/api/experiences", require("./routes/experienceRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/mock-interviews", require("./routes/mockInterviewRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);

  // Automated background job aggregation
  const { syncExternalJobs } = require("./services/jobSyncService");
  // Run initial sync 5 seconds after server start so DB is ready
  setTimeout(() => {
    syncExternalJobs().catch((err) =>
      console.error("[JobSync] Initial background sync error:", err.message)
    );
  }, 5000);

  // Auto-update every 6 hours
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
  setInterval(() => {
    console.log("[JobSync] Running scheduled 6-hour job update...");
    syncExternalJobs().catch((err) =>
      console.error("[JobSync] Scheduled sync error:", err.message)
    );
  }, SIX_HOURS_MS);
});

