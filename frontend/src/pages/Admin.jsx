import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Form states
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "Bangalore / Remote",
    jobType: "Full-Time",
    experienceLevel: "Entry Level",
    salary: "₹12 - 18 LPA",
    description: "",
    skillsRequired: "React, Node.js, JavaScript",
    applyLink: "https://example.com/apply",
  });

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    category: "DSA",
    difficulty: "Medium",
    topic: "Arrays & Hashing",
    companies: "Google, Amazon",
    description: "",
    sampleCases: [{ input: "[2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] == 9" }],
  });

  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "Big Tech / Software",
    headquarters: "Bangalore, India",
    difficulty: "Hard",
    description: "",
    salaryRange: "₹20 - 45 LPA",
    hiringRoles: "Software Engineer, Backend Developer",
    frequentTopics: "System Design, Trees, Graphs",
  });

  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchAdminData();
    }
  }, [user, activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      if (activeTab === "overview") {
        const res = await axios.get("/api/admin/stats", { headers: authHeaders });
        if (res.data.success) setStats(res.data.data);
      } else if (activeTab === "jobs") {
        const res = await axios.get("/api/admin/jobs", { headers: authHeaders });
        if (res.data.success) setJobs(res.data.data);
      } else if (activeTab === "questions") {
        const res = await axios.get("/api/admin/questions", { headers: authHeaders });
        if (res.data.success) setQuestions(res.data.data);
      } else if (activeTab === "companies") {
        const res = await axios.get("/api/admin/companies", { headers: authHeaders });
        if (res.data.success) setCompanies(res.data.data);
      } else if (activeTab === "applications") {
        const res = await axios.get("/api/admin/applications", { headers: authHeaders });
        if (res.data.success) setApplications(res.data.data);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
      setFeedback({ type: "danger", message: err.response?.data?.message || "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  // Job Actions
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newJob,
        skillsRequired: newJob.skillsRequired.split(",").map((s) => s.trim()),
      };
      const res = await axios.post("/api/admin/jobs", payload, { headers: authHeaders });
      if (res.data.success) {
        setFeedback({ type: "success", message: `Job "${res.data.data.title}" posted successfully!` });
        setNewJob({
          title: "",
          company: "",
          location: "Bangalore / Remote",
          jobType: "Full-Time",
          experienceLevel: "Entry Level",
          salary: "₹12 - 18 LPA",
          description: "",
          skillsRequired: "React, Node.js, JavaScript",
          applyLink: "https://example.com/apply",
        });
        fetchAdminData();
      }
    } catch (err) {
      setFeedback({ type: "danger", message: err.response?.data?.message || "Failed to create job" });
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await axios.delete(`/api/admin/jobs/${id}`, { headers: authHeaders });
      setFeedback({ type: "success", message: "Job deleted successfully." });
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (err) {
      setFeedback({ type: "danger", message: "Failed to delete job." });
    }
  };

  // Question Actions
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newQuestion,
        companies: newQuestion.companies.split(",").map((c) => c.trim()),
      };
      const res = await axios.post("/api/admin/questions", payload, { headers: authHeaders });
      if (res.data.success) {
        setFeedback({ type: "success", message: `Question "${res.data.data.title}" added successfully!` });
        setNewQuestion({
          title: "",
          category: "DSA",
          difficulty: "Medium",
          topic: "Arrays & Hashing",
          companies: "Google, Amazon",
          description: "",
          sampleCases: [{ input: "", output: "", explanation: "" }],
        });
        fetchAdminData();
      }
    } catch (err) {
      setFeedback({ type: "danger", message: err.response?.data?.message || "Failed to create question" });
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this practice question?")) return;
    try {
      await axios.delete(`/api/admin/questions/${id}`, { headers: authHeaders });
      setFeedback({ type: "success", message: "Question deleted successfully." });
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (err) {
      setFeedback({ type: "danger", message: "Failed to delete question." });
    }
  };

  // Application Status Update
  const handleUpdateApplication = async (id, status) => {
    try {
      await axios.put(`/api/admin/applications/${id}`, { status }, { headers: authHeaders });
      setApplications(applications.map((app) => (app._id === id ? { ...app, status } : app)));
      setFeedback({ type: "success", message: `Application status updated to ${status}` });
    } catch (err) {
      setFeedback({ type: "danger", message: "Failed to update application." });
    }
  };

  if (user?.role !== "Admin") {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 border-0 shadow-sm rounded-4 mx-auto" style={{ maxWidth: 500 }}>
          <div className="display-4 text-warning mb-3">🔒</div>
          <h3 className="fw-bold text-dark">Admin Access Required</h3>
          <p className="text-muted mb-4">
            You are logged in as a <strong>{user?.role || "Student"}</strong>. Switch to an admin account to manage placement listings, questions, and candidate applications.
          </p>
          <div className="alert alert-light border small text-start mb-4">
            <strong>Admin Demo Login:</strong><br />
            Email: <code>admin@placementhub.com</code><br />
            Password: <code>admin123</code>
          </div>
          <Link to="/login" className="btn btn-primary rounded-pill px-4 fw-semibold">
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="p-4 p-md-5 mb-4 rounded-4 bg-white border shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 rounded-pill fw-bold">
                Admin Control Center
              </span>
            </div>
            <h1 className="h2 fw-bold text-dark mb-1">PlacementHub Management</h1>
            <p className="text-muted mb-0">
              Manage jobs, practice problem repository, company roadmaps, and review live candidate applications.
            </p>
          </div>
          <div className="mt-3 mt-md-0">
            <span className="text-muted small">Logged in as: </span>
            <strong className="text-dark">{user?.name}</strong> ({user?.email})
          </div>
        </div>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show rounded-3 mb-4`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback({ type: "", message: "" })}></button>
        </div>
      )}

      {/* Tabs */}
      <div className="nav nav-pills mb-4 gap-2 border-bottom pb-3">
        <button
          className={`btn rounded-pill px-4 fw-semibold ${activeTab === "overview" ? "btn-primary" : "btn-light border"}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`btn rounded-pill px-4 fw-semibold ${activeTab === "jobs" ? "btn-primary" : "btn-light border"}`}
          onClick={() => setActiveTab("jobs")}
        >
          💼 Jobs ({jobs.length || stats?.counts?.jobs || 0})
        </button>
        <button
          className={`btn rounded-pill px-4 fw-semibold ${activeTab === "questions" ? "btn-primary" : "btn-light border"}`}
          onClick={() => setActiveTab("questions")}
        >
          🧩 Practice Questions ({questions.length || stats?.counts?.questions || 0})
        </button>
        <button
          className={`btn rounded-pill px-4 fw-semibold ${activeTab === "applications" ? "btn-primary" : "btn-light border"}`}
          onClick={() => setActiveTab("applications")}
        >
          📝 Candidate Applications ({applications.length || stats?.counts?.applications || 0})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && stats && (
        <div>
          <div className="row g-4 mb-4">
            <div className="col-md-3 col-6">
              <div className="card shadow-sm border-0 rounded-4 bg-white p-3 text-center">
                <span className="text-muted small fw-semibold text-uppercase">Total Users</span>
                <h3 className="fw-bold text-primary mb-0 mt-1">{stats.counts.users}</h3>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card shadow-sm border-0 rounded-4 bg-white p-3 text-center">
                <span className="text-muted small fw-semibold text-uppercase">Active Jobs</span>
                <h3 className="fw-bold text-success mb-0 mt-1">{stats.counts.jobs}</h3>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card shadow-sm border-0 rounded-4 bg-white p-3 text-center">
                <span className="text-muted small fw-semibold text-uppercase">Practice Questions</span>
                <h3 className="fw-bold text-info mb-0 mt-1">{stats.counts.questions}</h3>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card shadow-sm border-0 rounded-4 bg-white p-3 text-center">
                <span className="text-muted small fw-semibold text-uppercase">Job Applications</span>
                <h3 className="fw-bold text-warning mb-0 mt-1">{stats.counts.applications}</h3>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100">
                <h5 className="fw-bold text-dark mb-3">Recent Job Applications</h5>
                {stats.recentApplications?.length > 0 ? (
                  <div className="list-group list-group-flush gap-2">
                    {stats.recentApplications.map((app) => (
                      <div key={app._id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                        <div>
                          <strong className="text-dark">{app.user?.name || "Student"}</strong> applied to{" "}
                          <span className="text-primary fw-semibold">{app.job?.title || "Job"}</span>
                          <div className="small text-muted">🏢 {app.job?.company || "Company"} • {new Date(app.createdAt).toLocaleDateString()}</div>
                        </div>
                        <span className={`badge px-3 py-1 rounded-pill ${app.status === "Applied" ? "bg-primary" : app.status === "Interview" ? "bg-warning text-dark" : "bg-success"}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small mb-0">No job applications logged yet.</p>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100">
                <h5 className="fw-bold text-dark mb-3">Recent Registered Users</h5>
                {stats.recentUsers?.length > 0 ? (
                  <div className="list-group list-group-flush gap-2">
                    {stats.recentUsers.map((u) => (
                      <div key={u._id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                        <div>
                          <strong className="text-dark">{u.name}</strong>
                          <div className="small text-muted">{u.email}</div>
                        </div>
                        <span className={`badge px-3 py-1 rounded-pill ${u.role === "Admin" ? "bg-danger" : "bg-secondary"}`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small mb-0">No registered users found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Jobs Management */}
      {activeTab === "jobs" && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 rounded-4 bg-white p-4">
              <h5 className="fw-bold text-dark mb-3">Post New Job Listing</h5>
              <form onSubmit={handleCreateJob} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label small fw-semibold text-muted">Job Title *</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Frontend Engineer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    required
                  />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Company *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Google"
                      value={newJob.company}
                      onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Location</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    />
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Salary Package</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newJob.salary}
                      onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Job Type</label>
                    <select
                      className="form-select rounded-3"
                      value={newJob.jobType}
                      onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                    >
                      <option>Full-Time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label small fw-semibold text-muted">Required Skills (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={newJob.skillsRequired}
                    onChange={(e) => setNewJob({ ...newJob, skillsRequired: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold text-muted">Job Description *</label>
                  <textarea
                    rows="3"
                    className="form-control rounded-3"
                    placeholder="Describe role responsibilities and criteria..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="form-label small fw-semibold text-muted">Direct Apply Link</label>
                  <input
                    type="url"
                    className="form-control rounded-3"
                    value={newJob.applyLink}
                    onChange={(e) => setNewJob({ ...newJob, applyLink: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary rounded-pill py-2 fw-semibold mt-2">
                  Publish Job Posting
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm border-0 rounded-4 bg-white p-4">
              <h5 className="fw-bold text-dark mb-3">Existing Job Listings ({jobs.length})</h5>
              <div className="d-flex flex-column gap-3">
                {jobs.map((j) => (
                  <div key={j._id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold text-dark mb-1">{j.title}</h6>
                      <div className="small text-muted">
                        <span>🏢 {j.company}</span> • <span>📍 {j.location}</span> • <span>💰 {j.salary}</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-pill px-3"
                      onClick={() => handleDeleteJob(j._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Questions Management */}
      {activeTab === "questions" && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 rounded-4 bg-white p-4">
              <h5 className="fw-bold text-dark mb-3">Add Practice Problem</h5>
              <form onSubmit={handleCreateQuestion} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label small fw-semibold text-muted">Problem Title *</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Invert Binary Tree"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    required
                  />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Category</label>
                    <select
                      className="form-select rounded-3"
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    >
                      <option>DSA</option>
                      <option>System Design</option>
                      <option>SQL</option>
                      <option>Aptitude</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Difficulty</label>
                    <select
                      className="form-select rounded-3"
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Topic</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newQuestion.topic}
                      onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Companies (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newQuestion.companies}
                      onChange={(e) => setNewQuestion({ ...newQuestion, companies: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label small fw-semibold text-muted">Problem Statement *</label>
                  <textarea
                    rows="4"
                    className="form-control rounded-3"
                    placeholder="Given an array of integers..."
                    value={newQuestion.description}
                    onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary rounded-pill py-2 fw-semibold mt-2">
                  Save Problem to Repository
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm border-0 rounded-4 bg-white p-4">
              <h5 className="fw-bold text-dark mb-3">Question Repository ({questions.length})</h5>
              <div className="d-flex flex-column gap-3">
                {questions.map((q) => (
                  <div key={q._id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-secondary-subtle text-secondary">{q.category}</span>
                        <span className={`badge ${q.difficulty === "Easy" ? "bg-success" : q.difficulty === "Medium" ? "bg-warning text-dark" : "bg-danger"}`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <h6 className="fw-bold text-dark mb-0">{q.title}</h6>
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-pill px-3"
                      onClick={() => handleDeleteQuestion(q._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Candidate Applications */}
      {activeTab === "applications" && (
        <div className="card shadow-sm border-0 rounded-4 bg-white p-4">
          <h5 className="fw-bold text-dark mb-3">Manage Candidate Applications ({applications.length})</h5>
          {applications.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Candidate</th>
                    <th>Job Title & Company</th>
                    <th>Date Applied</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.user?.name || "Candidate"}</strong>
                        <div className="small text-muted">{app.user?.email}</div>
                      </td>
                      <td>
                        <span className="fw-semibold text-primary">{app.job?.title || "Role"}</span>
                        <div className="small text-muted">{app.job?.company}</div>
                      </td>
                      <td className="small text-muted">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`badge px-3 py-1 rounded-pill ${app.status === "Applied" ? "bg-primary" : app.status === "Interview" ? "bg-warning text-dark" : app.status === "Selected" ? "bg-success" : "bg-secondary"}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => handleUpdateApplication(app._id, "Interview")}
                          >
                            Interview
                          </button>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => handleUpdateApplication(app._id, "Selected")}
                          >
                            Selected
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleUpdateApplication(app._id, "Rejected")}
                          >
                            Rejected
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted small mb-0">No job applications recorded yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
