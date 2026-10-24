import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get("/api/dashboard/summary", { headers });
      if (res.data.success) {

        setData(res.data.data);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Unable to load full dashboard summary. Using cached view.");
    } finally {
      setLoading(false);
    }
  };

  const metrics = data?.metrics || {
    totalSolved: 0,
    difficultyBreakdown: { Easy: 0, Medium: 0, Hard: 0 },
    jobsApplied: 0,
    mockInterviewsTaken: 0,
    avgInterviewScore: 0,
  };

  const streak = data?.user?.streak || 0;
  const heatmap = data?.activityHeatmap || [];
  const dailyGoals = data?.dailyGoals || { solveProblem: false, mockInterview: false, applyJob: false };

  // Calculate greeting time of day
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div className="p-4 p-md-5 mb-4 rounded-4 bg-white border shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-light text-dark border px-3 py-1 rounded-pill fw-semibold">
                Student Placement Portal
              </span>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 rounded-pill fw-bold">
                🔥 {streak} Day Streak
              </span>
            </div>
            <h1 className="h2 fw-bold text-dark mb-1">
              {timeOfDay}, {user?.name || "Student"}! 👋
            </h1>
            <p className="text-muted mb-0">
              Here is your comprehensive preparation hub, streak tracker, and real-time activity metrics.
            </p>
          </div>
          <div className="mt-3 mt-md-0 d-flex flex-wrap gap-2">
            <Link to="/practice" className="btn btn-primary rounded-pill px-4 fw-semibold">
              ⚡ Practice DSA
            </Link>
            <Link to="/mock-interview" className="btn btn-outline-primary rounded-pill px-4 fw-semibold">
              🎙️ AI Mock Interview
            </Link>
            <Link to="/jobs" className="btn btn-outline-dark rounded-pill px-4 fw-semibold">
              💼 Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        {/* Streak Counter Card */}
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm h-100 border-0 rounded-4 bg-white text-center p-3">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <div className="display-4 fw-bold text-danger mb-1">
                🔥 {streak}
              </div>
              <h6 className="fw-bold text-dark mb-1">Active Day Streak</h6>
              <p className="small text-muted mb-2">
                {streak > 0
                  ? "Great momentum! Keep your placement streak burning!"
                  : "Solve a problem or take a mock interview today to trigger your streak!"}
              </p>
              <div className="w-100 bg-light rounded-pill py-1 px-3 border text-center small fw-semibold text-secondary">
                {streak >= 7 ? "🏆 Consistency Champion" : "🚀 Rising Star"}
              </div>
            </div>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm h-100 border-0 rounded-4 bg-white p-3">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small fw-semibold text-uppercase">Problems Solved</span>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Practice</span>
                </div>
                <h2 className="display-6 fw-bold text-primary mb-2">
                  {metrics.totalSolved}
                </h2>
                <div className="d-flex gap-2 small text-muted mb-3">
                  <span className="text-success fw-semibold">E: {metrics.difficultyBreakdown?.Easy || 0}</span>
                  <span>•</span>
                  <span className="text-warning fw-semibold">M: {metrics.difficultyBreakdown?.Medium || 0}</span>
                  <span>•</span>
                  <span className="text-danger fw-semibold">H: {metrics.difficultyBreakdown?.Hard || 0}</span>
                </div>
              </div>
              <Link to="/practice" className="small text-decoration-none fw-semibold">
                Solve DSA & SQL →
              </Link>
            </div>
          </div>
        </div>

        {/* Mock Interviews */}
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm h-100 border-0 rounded-4 bg-white p-3">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small fw-semibold text-uppercase">Mock Interviews</span>
                  <span className="badge bg-info-subtle text-info border border-info-subtle">AI Voice</span>
                </div>
                <h2 className="display-6 fw-bold text-info mb-2">
                  {metrics.mockInterviewsTaken}
                </h2>
                <p className="small text-muted mb-3">
                  Average Score:{" "}
                  <strong className="text-dark">
                    {metrics.avgInterviewScore > 0 ? `${metrics.avgInterviewScore} / 10` : "No sessions yet"}
                  </strong>
                </p>
              </div>
              <Link to="/mock-interview" className="small text-decoration-none fw-semibold text-info">
                Take AI Interview →
              </Link>
            </div>
          </div>
        </div>

        {/* Jobs Applied */}
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm h-100 border-0 rounded-4 bg-white p-3">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small fw-semibold text-uppercase">Jobs Applied</span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle">Career</span>
                </div>
                <h2 className="display-6 fw-bold text-success mb-2">
                  {metrics.jobsApplied}
                </h2>
                <p className="small text-muted mb-3">
                  Applications submitted to verified company listings
                </p>
              </div>
              <Link to="/jobs" className="small text-decoration-none fw-semibold text-success">
                Explore Tech Jobs →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Row: 30-Day Activity Matrix & Today's Target Checklist */}
      <div className="row g-4 mb-4">
        {/* Activity Heatmap Grid */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-0">Placement Activity Calendar</h5>
                <p className="text-muted small mb-0">Last 30 days active practice and interview submissions</p>
              </div>
              <div className="d-flex align-items-center gap-2 small text-muted">
                <span>Less</span>
                <span className="rounded-1" style={{ width: 12, height: 12, backgroundColor: "#ebedf0", display: "inline-block" }}></span>
                <span className="rounded-1" style={{ width: 12, height: 12, backgroundColor: "#9be9a8", display: "inline-block" }}></span>
                <span className="rounded-1" style={{ width: 12, height: 12, backgroundColor: "#40c463", display: "inline-block" }}></span>
                <span className="rounded-1" style={{ width: 12, height: 12, backgroundColor: "#216e39", display: "inline-block" }}></span>
                <span>More</span>
              </div>
            </div>

            {/* Grid */}
            <div className="d-flex flex-wrap gap-2 pt-2 pb-3">
              {heatmap.length > 0 ? (
                heatmap.map((item, index) => {
                  const count = item.total;
                  let bg = "#ebedf0";
                  if (count === 1) bg = "#9be9a8";
                  else if (count >= 2 && count <= 3) bg = "#40c463";
                  else if (count > 3) bg = "#216e39";

                  return (
                    <div
                      key={item.date || index}
                      title={`${item.date}: ${count} activity (${item.submissions} practice, ${item.interviews} interviews, ${item.applications} jobs)`}
                      className="rounded-2 d-flex flex-column align-items-center justify-content-center cursor-pointer transition-all"
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: bg,
                        fontSize: 10,
                        fontWeight: 600,
                        color: count > 1 ? "#fff" : "#555",
                      }}
                    >
                      {item.date ? item.date.slice(-2) : index + 1}
                    </div>
                  );
                })
              ) : (
                <div className="text-muted small py-4">Activity matrix loading...</div>
              )}
            </div>

            <div className="border-top pt-3 d-flex justify-content-between align-items-center small text-muted">
              <span>🟢 Practice submissions, interviews, and applications contribute to your daily activity.</span>
              <span className="fw-semibold text-dark">Total 30-Day Actions: {heatmap.reduce((acc, h) => acc + h.total, 0)}</span>
            </div>
          </div>
        </div>

        {/* Daily Placement Targets */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100">
            <h5 className="fw-bold text-dark mb-1">Today's Placement Goals</h5>
            <p className="text-muted small mb-3">Complete your daily routine to secure your streak</p>

            <div className="list-group list-group-flush gap-2">
              {/* Goal 1: Solve DSA */}
              <div className={`p-3 rounded-3 border d-flex align-items-center justify-content-between ${dailyGoals.solveProblem ? "bg-success-subtle border-success-subtle" : "bg-light"}`}>
                <div className="d-flex align-items-center gap-3">
                  <span className="fs-5">{dailyGoals.solveProblem ? "✅" : "⚡"}</span>
                  <div>
                    <h6 className="mb-0 fw-bold text-dark small">Solve 1 Coding Problem</h6>
                    <span className="text-muted" style={{ fontSize: 11 }}>DSA / SQL / System Design</span>
                  </div>
                </div>
                {!dailyGoals.solveProblem && (
                  <Link to="/practice" className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2 fw-semibold" style={{ fontSize: 12 }}>
                    Solve
                  </Link>
                )}
              </div>

              {/* Goal 2: Mock Interview */}
              <div className={`p-3 rounded-3 border d-flex align-items-center justify-content-between ${dailyGoals.mockInterview ? "bg-success-subtle border-success-subtle" : "bg-light"}`}>
                <div className="d-flex align-items-center gap-3">
                  <span className="fs-5">{dailyGoals.mockInterview ? "✅" : "🎙️"}</span>
                  <div>
                    <h6 className="mb-0 fw-bold text-dark small">AI Voice Mock Interview</h6>
                    <span className="text-muted" style={{ fontSize: 11 }}>Practice verbal tech answers</span>
                  </div>
                </div>
                {!dailyGoals.mockInterview && (
                  <Link to="/mock-interview" className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2 fw-semibold" style={{ fontSize: 12 }}>
                    Start
                  </Link>
                )}
              </div>

              {/* Goal 3: Check Jobs */}
              <div className={`p-3 rounded-3 border d-flex align-items-center justify-content-between ${dailyGoals.applyJob ? "bg-success-subtle border-success-subtle" : "bg-light"}`}>
                <div className="d-flex align-items-center gap-3">
                  <span className="fs-5">{dailyGoals.applyJob ? "✅" : "💼"}</span>
                  <div>
                    <h6 className="mb-0 fw-bold text-dark small">Apply for 1 Curated Job</h6>
                    <span className="text-muted" style={{ fontSize: 11 }}>Keep active in recruitment</span>
                  </div>
                </div>
                {!dailyGoals.applyJob && (
                  <Link to="/jobs" className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2 fw-semibold" style={{ fontSize: 12 }}>
                    Apply
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="badge bg-secondary-subtle text-secondary py-1 px-3 rounded-pill fw-semibold small">
                {Object.values(dailyGoals).filter(Boolean).length} of 3 completed today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Recommended Jobs & Quick Navigation Cards */}
      <div className="row g-4 mb-4">
        {/* Recommended Jobs */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-0">Profile Recommended Jobs</h5>
                <span className="text-muted small" style={{ fontSize: "0.75rem" }}>Matched to your parsed skills</span>
              </div>
              <Link to="/jobs?category=RECOMMENDED" className="small text-decoration-none fw-semibold">
                Explore all matches →
              </Link>
            </div>

            {data?.recommendedJobs?.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {data.recommendedJobs.map((job) => (
                  <div key={job._id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="fw-bold mb-0 text-dark">{job.title}</h6>
                        {job.matchScore && (
                          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: "0.7rem" }}>
                            ⭐ {job.matchScore}% Match
                          </span>
                        )}
                      </div>
                      <div className="text-muted small mt-1">
                        <span>🏢 {job.company}</span> • <span>📍 {job.location || "Remote"}</span>
                      </div>
                    </div>
                    <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-semibold">
                      Apply
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted small mb-0">No active job listings found at the moment.</p>
            )}
          </div>
        </div>


        {/* Placement Preparation Roadmap & Resources */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100">
            <h5 className="fw-bold text-dark mb-3">Quick Study Launchpad</h5>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="fs-3 mb-1">🏢</div>
                    <h6 className="fw-bold text-dark mb-1">Company Roadmaps</h6>
                    <p className="text-muted small mb-2">Google, Amazon, Microsoft, Uber interview rounds and patterns.</p>
                  </div>
                  <Link to="/companies" className="btn btn-sm btn-outline-primary rounded-pill fw-semibold">
                    Explore Companies →
                  </Link>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="fs-3 mb-1">📄</div>
                    <h6 className="fw-bold text-dark mb-1">AI Resume Studio</h6>
                    <p className="text-muted small mb-2">Match ATS keywords with job descriptions and optimize your CV.</p>
                  </div>
                  <Link to="/resume" className="btn btn-sm btn-outline-success rounded-pill fw-semibold">
                    Optimize Resume →
                  </Link>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="fs-3 mb-1">💬</div>
                    <h6 className="fw-bold text-dark mb-1">Interview Stories</h6>
                    <p className="text-muted small mb-2">Read real experiences, round breakdowns, and candidate advice.</p>
                  </div>
                  <Link to="/experiences" className="btn btn-sm btn-outline-secondary rounded-pill fw-semibold">
                    Read Experiences →
                  </Link>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="fs-3 mb-1">📚</div>
                    <h6 className="fw-bold text-dark mb-1">Study Resources</h6>
                    <p className="text-muted small mb-2">Download cheatsheets, CS fundamentals, and aptitude guides.</p>
                  </div>
                  <Link to="/resources" className="btn btn-sm btn-outline-dark rounded-pill fw-semibold">
                    Browse Notes →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
