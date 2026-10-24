import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ShareExperienceModal from "../components/ShareExperienceModal";

const InterviewExperiences = () => {
  const { user } = useContext(AuthContext);

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedOutcome, setSelectedOutcome] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, [search, selectedCompany, selectedOutcome, selectedDifficulty, sortBy]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/experiences", {
        params: {
          search,
          company: selectedCompany,
          outcome: selectedOutcome,
          difficulty: selectedDifficulty,
          sort: sortBy,
        },
      });

      if (res.data.success) {
        setExperiences(res.data.experiences);
      }
    } catch (err) {
      console.error("Error fetching interview experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (expId, e) => {
    e.stopPropagation();
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to upvote interview experiences!");
      return;
    }

    try {
      const res = await axios.post(
        `/api/experiences/${expId}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Optimistically update local upvote count
        setExperiences((prev) =>
          prev.map((exp) => {
            if (exp._id === expId) {
              const currentUserId = user?._id || user?.id;
              let newUpvotes = [...(exp.upvotes || [])];

              if (res.data.isUpvoted) {
                newUpvotes.push(currentUserId);
              } else {
                newUpvotes = newUpvotes.filter((u) => u.toString() !== currentUserId?.toString());
              }
              return { ...exp, upvotes: newUpvotes, upvotesCount: res.data.upvotesCount };
            }
            return exp;
          })
        );
      }
    } catch (err) {
      console.error("Error upvoting:", err);
    }
  };

  const handleExperienceSubmitted = (newExp) => {
    setExperiences([newExp, ...experiences]);
  };

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case "Offered":
        return "bg-success text-white";
      case "Rejected":
        return "bg-danger text-white";
      case "Pending":
        return "bg-warning text-dark";
      case "Declined":
        return "bg-secondary text-white";
      default:
        return "bg-info text-dark";
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case "Easy":
        return "bg-success-subtle text-success border-success";
      case "Medium":
        return "bg-warning-subtle text-warning-emphasis border-warning";
      case "Hard":
      case "Very Hard":
        return "bg-danger-subtle text-danger border-danger";
      default:
        return "bg-light text-dark";
    }
  };

  const companiesList = ["All", "Google", "Amazon", "Microsoft", "Uber"];

  return (
    <div className="container py-4">
      {/* Hero Header */}
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 text-white overflow-hidden position-relative" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}>
        <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
          <div className="col-lg-8">
            <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm" style={{ fontSize: "14px" }}>
              🗣️ Community Interview Hub
            </span>
            <h1 className="display-5 fw-extrabold text-white mb-2" style={{ color: "#ffffff", letterSpacing: "-0.5px" }}>
              Real Interview Experiences
            </h1>
            <p className="lead text-light mb-4" style={{ color: "#f1f5f9", fontSize: "18px", opacity: 0.95 }}>
              Explore authentic, round-by-round interview journeys shared by candidate alumni from top tech companies.
            </p>

            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-primary btn-lg rounded-pill px-4 fw-bold shadow"
                onClick={() => setIsModalOpen(true)}
              >
                + Share Your Experience
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          {/* Search Box */}
          <div className="col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Search by company, role, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Company Filter */}
          <div className="col-sm-6 col-lg-2">
            <select
              className="form-select bg-light"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="All">All Companies</option>
              {companiesList.filter((c) => c !== "All").map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Outcome Filter */}
          <div className="col-sm-6 col-lg-2">
            <select
              className="form-select bg-light"
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value)}
            >
              <option value="All">All Outcomes</option>
              <option value="Offered">Offered 🎉</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="col-sm-6 col-lg-2">
            <select
              className="form-select bg-light"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Very Hard">Very Hard</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="col-sm-6 col-lg-2">
            <select
              className="form-select bg-light"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Latest Posts</option>
              <option value="upvotes">Top Upvoted 🔥</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Experience Cards Feed */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading interview experiences...</span>
          </div>
          <p className="text-muted mt-2">Fetching community experiences...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <h4 className="fw-bold text-dark mb-2">No Interview Experiences Found</h4>
          <p className="text-muted">Try adjusting your search terms or filters.</p>
          <div>
            <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => { setSearch(""); setSelectedCompany("All"); setSelectedOutcome("All"); setSelectedDifficulty("All"); }}>
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {experiences.map((exp) => {
            const currentUserId = user?._id || user?.id;
            const isUpvoted = exp.upvotes?.some((u) => u.toString() === currentUserId?.toString());

            return (
              <div key={exp._id} className="col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-white hover-shadow transition-all d-flex flex-column justify-content-between">
                  <div>
                    {/* Header: Company & Outcome */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        {exp.companyLogo ? (
                          <img
                            src={exp.companyLogo}
                            alt={exp.company}
                            className="rounded-3 border p-1"
                            style={{ width: "42px", height: "42px", objectFit: "contain" }}
                          />
                        ) : (
                          <div className="rounded-3 bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                            {exp.company?.[0]}
                          </div>
                        )}
                        <div>
                          <h6 className="fw-bold text-dark mb-0">{exp.company}</h6>
                          <span className="small text-muted">{exp.role}</span>
                        </div>
                      </div>

                      <span className={`badge ${getOutcomeBadge(exp.outcome)} px-3 py-2 rounded-pill small fw-semibold`}>
                        {exp.outcome === "Offered" ? "🎉 Offered" : exp.outcome}
                      </span>
                    </div>

                    {/* Title */}
                    <h5 className="fw-bold text-dark mb-2">
                      <Link to={`/experiences/${exp._id}`} className="text-decoration-none text-dark hover-primary">
                        {exp.title}
                      </Link>
                    </h5>

                    {/* Summary snippet */}
                    <p className="small text-muted mb-3" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {exp.summary}
                    </p>

                    {/* Badges / Pill Meta */}
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className={`badge border ${getDifficultyBadge(exp.overallDifficulty)} small`}>
                        Difficulty: {exp.overallDifficulty}
                      </span>
                      <span className="badge bg-light text-dark border small">
                        🧩 {exp.rounds?.length || 0} Rounds
                      </span>
                      {exp.salaryDetails && (
                        <span className="badge bg-success-subtle text-success border border-success small">
                          💰 {exp.salaryDetails}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Footer */}
                  <div className="pt-3 border-top d-flex justify-content-between align-items-center mt-3">
                    <div className="small text-muted">
                      <span>By <strong>{exp.user?.name || "Student Alumni"}</strong></span>
                      <span className="mx-1">•</span>
                      <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className={`btn btn-sm ${isUpvoted ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-3 py-1 d-flex align-items-center gap-1`}
                        onClick={(e) => handleUpvote(exp._id, e)}
                        title="Upvote experience"
                      >
                        <span>🔥</span>
                        <span>{exp.upvotes?.length || 0}</span>
                      </button>

                      <Link to={`/experiences/${exp._id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        Read Story →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share Experience Modal */}
      <ShareExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExperienceSubmitted={handleExperienceSubmitted}
      />
    </div>
  );
};

export default InterviewExperiences;
