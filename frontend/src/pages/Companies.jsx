import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Briefcase,
  Code2,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [industry, setIndustry] = useState("All");

  useEffect(() => {
    fetchCompanies();
  }, [difficulty, industry]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      let url = "/api/companies?";
      if (difficulty !== "All") url += `difficulty=${difficulty}&`;
      if (industry !== "All") url += `industry=${encodeURIComponent(industry)}&`;
      if (search) url += `search=${encodeURIComponent(search)}`;

      const res = await axios.get(url);
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  const getDifficultyBadge = (level) => {
    switch (level) {
      case "Easy":
        return "bg-success";
      case "Medium":
        return "bg-primary";
      case "Hard":
        return "bg-warning text-dark";
      case "Very Hard":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container py-4">
      {/* Hero Header */}
      <div className="p-4 p-md-5 mb-4 rounded-4 bg-white border shadow-sm">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill mb-2">
              🎯 Company-Wise Preparation
            </span>
            <h1 className="h2 fw-bold text-dark mb-2">
              Top Tech Companies & Interview Roadmaps
            </h1>
            <p className="text-muted mb-0 lead fs-6">
              Master the exact interview patterns, online assessments, and high-frequency technical questions asked at leading tech giants.
            </p>
          </div>
          <div className="col-lg-4 mt-3 mt-lg-0 text-lg-end">
            <div className="d-inline-flex gap-3 text-start">
              <div className="p-3 bg-light rounded-3 border">
                <div className="fw-bold fs-4 text-primary">{companies.length}</div>
                <div className="small text-muted">Companies</div>
              </div>
              <div className="p-3 bg-light rounded-3 border">
                <div className="fw-bold fs-4 text-success">100%</div>
                <div className="small text-muted">Verified Rounds</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by company name or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </div>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Very Hard">Very Hard</option>
            </select>
          </div>

          <div className="col-md-4">
            <div className="d-flex gap-2">
              {["All", "Google", "Amazon", "Microsoft", "Uber"].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => {
                    setSearch(quick === "All" ? "" : quick);
                    setTimeout(fetchCompanies, 50);
                  }}
                  className={`btn btn-sm ${
                    search === quick || (quick === "All" && !search)
                      ? "btn-dark"
                      : "btn-outline-secondary"
                  } rounded-pill px-3`}
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading companies...</span>
          </div>
          <p className="text-muted mt-2">Loading company roadmaps...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border">
          <h4 className="text-muted">No companies found matching criteria.</h4>
          <button
            className="btn btn-outline-primary btn-sm mt-2"
            onClick={() => {
              setSearch("");
              setDifficulty("All");
              setIndustry("All");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {companies.map((comp) => (
            <div key={comp._id} className="col-md-6 col-lg-6">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                <div className="card-body p-4 d-flex flex-column">
                  {/* Card Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {comp.logo ? (
                        <div
                          className="bg-white border rounded-3 p-2 d-flex align-items-center justify-content-center"
                          style={{ width: "54px", height: "54px" }}
                        >
                          <img
                            src={comp.logo}
                            alt={comp.name}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                          />
                        </div>
                      ) : (
                        <div
                          className="bg-primary text-white fw-bold rounded-3 d-flex align-items-center justify-content-center fs-4"
                          style={{ width: "54px", height: "54px" }}
                        >
                          {comp.name[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="h5 fw-bold mb-0 text-dark">{comp.name}</h4>
                        <span className="small text-muted">{comp.industry} • {comp.headquarters}</span>
                      </div>
                    </div>
                    <span className={`badge ${getDifficultyBadge(comp.difficulty)} px-3 py-2 rounded-pill`}>
                      {comp.difficulty}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted small mb-3 flex-grow-1" style={{ lineHeight: "1.6" }}>
                    {comp.description}
                  </p>

                  {/* Compensation & Rounds Metric */}
                  <div className="row g-2 mb-3 bg-light rounded-3 p-2 border">
                    <div className="col-6">
                      <div className="small text-muted">Compensation</div>
                      <div className="fw-semibold text-dark small">{comp.salaryRange || "Competitive"}</div>
                    </div>
                    <div className="col-6 border-start ps-3">
                      <div className="small text-muted">Interview Rounds</div>
                      <div className="fw-semibold text-primary small">
                        {comp.interviewRounds?.length || 0} Stages Detailed
                      </div>
                    </div>
                  </div>

                  {/* Frequent Topics */}
                  <div className="mb-3">
                    <div className="small text-muted mb-1 fw-semibold">Frequent Topics:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {comp.frequentTopics?.slice(0, 4).map((topic, i) => (
                        <span key={i} className="badge bg-secondary-subtle text-secondary small fw-normal">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Repeatedly Asked Practice Problems */}
                  <div className="mb-3 p-3 rounded-3 bg-light border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-1 text-dark small fw-bold">
                        <Code2 size={16} className="text-primary" />
                        <span>Repeated Practice Problems</span>
                        <span className="badge bg-primary-subtle text-primary ms-1 small">
                          {comp.totalQuestionsCount || comp.repeatedQuestions?.length || 0}
                        </span>
                      </div>
                      <Link
                        to={`/companies/${comp._id}?tab=questions`}
                        className="small text-primary text-decoration-none fw-semibold"
                      >
                        All Problems →
                      </Link>
                    </div>

                    {comp.repeatedQuestions && comp.repeatedQuestions.length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {comp.repeatedQuestions.slice(0, 3).map((q) => (
                          <div
                            key={q._id}
                            className="d-flex justify-content-between align-items-center bg-white p-2 rounded-2 border"
                          >
                            <Link
                              to={`/practice/${q._id}`}
                              className="text-decoration-none text-dark fw-medium small text-truncate me-2"
                              style={{ maxWidth: "220px" }}
                              title={q.title}
                            >
                              🔥 {q.title}
                            </Link>
                            <div className="d-flex align-items-center gap-1 flex-shrink-0">
                              <span
                                className={`badge ${
                                  q.difficulty === "Easy"
                                    ? "bg-success-subtle text-success"
                                    : q.difficulty === "Medium"
                                    ? "bg-warning-subtle text-warning-emphasis"
                                    : "bg-danger-subtle text-danger"
                                } rounded-pill px-2 py-1 small`}
                                style={{ fontSize: "10px" }}
                              >
                                {q.difficulty}
                              </span>
                              <Link
                                to={`/practice/${q._id}`}
                                className="btn btn-sm btn-outline-primary py-0 px-2 rounded-pill"
                                style={{ fontSize: "11px" }}
                              >
                                Solve
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="small text-muted py-1">
                        Explore full interview problem set in detail roadmap.
                      </div>
                    )}
                  </div>

                  {/* Active Open Positions in Company */}
                  <div className="mb-3 p-3 rounded-3 bg-white border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-1 text-dark small fw-bold">
                        <Briefcase size={16} className="text-success" />
                        <span>Active Open Positions</span>
                        <span className="badge bg-success-subtle text-success ms-1 small">
                          {comp.totalJobsCount || comp.openPositions?.length || 0} Hiring
                        </span>
                      </div>
                      <Link
                        to={`/companies/${comp._id}?tab=jobs`}
                        className="small text-success text-decoration-none fw-semibold"
                      >
                        All Roles →
                      </Link>
                    </div>

                    {comp.openPositions && comp.openPositions.length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {comp.openPositions.slice(0, 2).map((job) => (
                          <div
                            key={job._id}
                            className="p-2 rounded-2 bg-light border d-flex justify-content-between align-items-center"
                          >
                            <div className="me-2 overflow-hidden">
                              <div className="fw-semibold text-dark small text-truncate">
                                {job.title}
                              </div>
                              <div className="text-muted d-flex align-items-center gap-2" style={{ fontSize: "11px" }}>
                                <span>📍 {job.location}</span>
                                <span>•</span>
                                <span>⏱ {job.experience}</span>
                              </div>
                            </div>
                            <Link
                              to={`/jobs/${job._id}`}
                              className="btn btn-sm btn-outline-success py-0 px-2 rounded-pill flex-shrink-0"
                              style={{ fontSize: "11px" }}
                            >
                              Apply
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="small text-muted py-1">
                        Roles profiled: {comp.hiringRoles?.slice(0, 2).join(", ") || "General SWE"}
                      </div>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 border-top d-flex justify-content-between align-items-center mt-auto">
                    <div className="d-flex align-items-center gap-2 small text-muted">
                      <span>🎯 {comp.interviewRounds?.length || 0} Rounds</span>
                      <span>•</span>
                      <span>🔥 {comp.totalQuestionsCount || 0} Questions</span>
                    </div>
                    <Link
                      to={`/companies/${comp._id}`}
                      className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1"
                    >
                      View Roadmap & Hub <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
