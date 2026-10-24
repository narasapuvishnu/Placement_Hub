import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Practice = () => {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [company, setCompany] = useState("All");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", "DSA", "System Design", "SQL", "Aptitude"];
  const companies = ["All", "Google", "Amazon", "Microsoft", "Uber"];
  const topicGroups = {
    DSA: ["Arrays", "Strings", "Hash Tables", "Two Pointers", "Sliding Window", "Stacks", "Dynamic Programming", "Matrix"],
    "System Design": ["Core Concepts", "Networking", "API Fundamentals", "Communication Patterns", "Storage Systems", "Distributed Systems"],
    SQL: ["Select", "Basic Joins", "Aggregate Functions", "Subqueries", "Advanced String Functions"],
  };

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty, company, topic]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let url = "/api/practice?";
      if (category !== "All") url += `category=${encodeURIComponent(category)}&`;
      if (category !== "All" && topic !== "All") url += `topic=${encodeURIComponent(topic)}&`;
      if (difficulty !== "All") url += `difficulty=${difficulty}&`;
      if (company !== "All") url += `company=${encodeURIComponent(company)}&`;
      if (search) url += `search=${encodeURIComponent(search)}`;

      const res = await axios.get(url, { headers });
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching practice questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("/api/practice/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setTopic("All");
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case "Easy":
        return "bg-success-subtle text-success border border-success-subtle";
      case "Medium":
        return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
      case "Hard":
        return "bg-danger-subtle text-danger border border-danger-subtle";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case "DSA":
        return "bg-primary-subtle text-primary";
      case "System Design":
        return "bg-info-subtle text-info-emphasis";
      case "SQL":
        return "bg-success-subtle text-success";
      case "Aptitude":
        return "bg-secondary-subtle text-secondary";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="p-4 p-md-5 mb-4 rounded-4 bg-white border shadow-sm">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill mb-2">
              ⚡ Practice & Mastery Hub
            </span>
            <h1 className="h2 fw-bold text-dark mb-2">
              Technical Problem Solving & Assessments
            </h1>
            <p className="text-muted mb-0 lead fs-6">
              Hand-picked Data Structures, System Design blueprints, SQL challenges, and Aptitude assessments tested by top hiring managers.
            </p>
          </div>

          <div className="col-lg-5 mt-3 mt-lg-0">
            {user && stats ? (
              <div className="p-3 bg-light rounded-4 border">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-bold text-dark">Your Problem Solving Record</span>
                  <span className="badge bg-danger rounded-pill px-3 py-1">
                    🔥 {stats.streak || 1} Day Streak
                  </span>
                </div>
                <div className="row g-2 text-center">
                  <div className="col-3">
                    <div className="fs-5 fw-bold text-primary">{stats.totalSolved}</div>
                    <div className="small text-muted" style={{ fontSize: "11px" }}>Total Solved</div>
                  </div>
                  <div className="col-3">
                    <div className="fs-5 fw-bold text-success">{stats.byDifficulty?.Easy || 0}</div>
                    <div className="small text-muted" style={{ fontSize: "11px" }}>Easy</div>
                  </div>
                  <div className="col-3">
                    <div className="fs-5 fw-bold text-warning">{stats.byDifficulty?.Medium || 0}</div>
                    <div className="small text-muted" style={{ fontSize: "11px" }}>Medium</div>
                  </div>
                  <div className="col-3">
                    <div className="fs-5 fw-bold text-danger">{stats.byDifficulty?.Hard || 0}</div>
                    <div className="small text-muted" style={{ fontSize: "11px" }}>Hard</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-light rounded-4 border text-center">
                <div className="fw-semibold text-dark small mb-1">Track Your Daily Streak</div>
                <p className="small text-muted mb-2">
                  Log in to save your solutions, maintain streaks, and see solution explanations.
                </p>
                <Link to="/login" className="btn btn-primary btn-sm rounded-pill px-4">
                  Log In to Track Progress
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`btn rounded-pill px-4 fw-semibold ${
              category === cat ? "btn-dark shadow-sm" : "btn-light border text-muted"
            }`}
          >
            {cat === "All" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      {category !== "All" && topicGroups[category] && (
        <section className="practice-topic-nav mb-4" aria-label={`${category} topics`}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
            <div>
              <div className="practice-topic-eyebrow">{category === "SQL" ? "SQL 50 Study Plan" : `${category} Practice`}</div>
              <h2 className="h5 fw-bold text-dark mb-0">
                {category === "DSA" ? "Patterns" : category === "System Design" ? "Design Topics" : "Sections"}
              </h2>
            </div>
            <span className="small text-muted">Select a topic to filter the problems below</span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`practice-topic-option ${topic === "All" ? "active" : ""}`}
              onClick={() => setTopic("All")}
            >
              All {category === "SQL" ? "SQL Problems" : "Problems"}
            </button>
            {topicGroups[category].map((topicName) => (
              <button
                type="button"
                key={topicName}
                className={`practice-topic-option ${topic === topicName ? "active" : ""}`}
                onClick={() => setTopic(topicName)}
              >
                {topicName}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Filters & Search */}
      <div className="card border-0 shadow-sm p-3 mb-4 bg-white">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search problem title or topic tag..."
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
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="All">All Companies</option>
              {companies
                .filter((c) => c !== "All")
                .map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
            </select>
          </div>
        </form>
      </div>

      {/* Questions Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading practice problems...</span>
          </div>
          <p className="text-muted mt-2">Loading practice challenges...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border">
          <h4 className="text-muted">No problems found matching selected criteria.</h4>
          <button
            className="btn btn-outline-primary btn-sm mt-2"
            onClick={() => {
              setCategory("All");
              setTopic("All");
              setDifficulty("All");
              setCompany("All");
              setSearch("");
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted text-uppercase">
                  <th style={{ width: "40px" }} className="ps-4">Status</th>
                  <th>Title & Topics</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Acceptance</th>
                  <th>Companies</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q._id}>
                    <td className="ps-4">
                      {q.isSolved ? (
                        <span className="text-success fs-5" title="Solved">
                          ✓
                        </span>
                      ) : (
                        <span className="text-muted" title="Unsolved">
                          ○
                        </span>
                      )}
                    </td>
                    <td>
                      <div>
                        <Link
                          to={`/practice/${q._id}`}
                          className="fw-bold text-dark text-decoration-none hover-primary"
                        >
                          {q.title}
                        </Link>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {q.tags?.map((t, idx) => (
                            <span key={idx} className="badge bg-light text-muted border" style={{ fontSize: "11px" }}>
                              {t}
                            </span>
                          ))}
                          {q.category === "SQL" && q.topic && (
                            <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: "11px" }}>
                              {q.topic}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getCategoryBadge(q.category)} rounded-pill px-3 py-1`}>
                        {q.category}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getDifficultyBadge(q.difficulty)} rounded-pill px-3 py-1`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className="small text-muted">{q.acceptanceRate}%</span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {q.companies?.slice(0, 3).map((comp, i) => (
                          <span key={i} className="badge bg-light text-dark border" style={{ fontSize: "10px" }}>
                            {comp}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <Link
                        to={`/practice/${q._id}`}
                        className={`btn btn-sm rounded-pill px-4 fw-semibold ${
                          q.isSolved ? "btn-outline-success" : "btn-primary"
                        }`}
                      >
                        {q.isSolved ? "Re-solve" : "Solve"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Practice;
