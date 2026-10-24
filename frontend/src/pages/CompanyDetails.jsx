import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const CompanyDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "rounds";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["rounds", "questions", "jobs"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/companies/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Error loading company details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading company details...</span>
        </div>
        <p className="text-muted mt-2">Loading interview roadmap...</p>
      </div>
    );
  }

  if (!data || !data.company) {
    return (
      <div className="container py-5 text-center">
        <h4>Company not found</h4>
        <Link to="/companies" className="btn btn-primary mt-3">
          Back to Companies
        </Link>
      </div>
    );
  }

  const { company, jobs, questions } = data;

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

  const getRoundTypeBadge = (type) => {
    switch (type) {
      case "Online Assessment":
        return "bg-info text-dark";
      case "Technical":
        return "bg-primary";
      case "System Design":
      case "Technical & System Design":
        return "bg-purple text-white";
      case "HR/Cultural":
      case "Bar Raiser":
        return "bg-dark text-white";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb / Back button */}
      <div className="mb-3">
        <Link to="/companies" className="text-decoration-none text-muted small fw-semibold">
          ← Back to Companies
        </Link>
      </div>

      {/* Company Header Card */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="row align-items-center">
          <div className="col-md-8 d-flex align-items-center gap-4">
            {company.logo ? (
              <div
                className="bg-white border rounded-3 p-3 d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: "80px", height: "80px" }}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
            ) : (
              <div
                className="bg-primary text-white fw-bold rounded-3 d-flex align-items-center justify-content-center fs-2"
                style={{ width: "80px", height: "80px" }}
              >
                {company.name[0]}
              </div>
            )}
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h1 className="h3 fw-bold mb-0 text-dark">{company.name}</h1>
                <span className={`badge ${getDifficultyBadge(company.difficulty)} rounded-pill px-3`}>
                  {company.difficulty}
                </span>
              </div>
              <p className="text-muted small mb-2">
                {company.industry} • 📍 {company.headquarters}
              </p>
              <div className="d-flex flex-wrap gap-2">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-secondary btn-sm py-0 px-2 rounded-pill small"
                  >
                    🌐 Official Careers
                  </a>
                )}
                <span className="badge bg-light text-dark border py-1 px-2 rounded-pill small">
                  💰 {company.salaryRange}
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-3 mt-md-0 text-md-end">
            <div className="d-inline-flex gap-2">
              <span className="badge bg-primary-subtle text-primary p-2 px-3 rounded-3 text-start">
                <div className="fs-5 fw-bold">{company.interviewRounds?.length || 0}</div>
                <div className="small">Rounds</div>
              </span>
              <span className="badge bg-success-subtle text-success p-2 px-3 rounded-3 text-start">
                <div className="fs-5 fw-bold">{questions?.length || 0}</div>
                <div className="small">Questions</div>
              </span>
              <span className="badge bg-info-subtle text-info-emphasis p-2 px-3 rounded-3 text-start">
                <div className="fs-5 fw-bold">{jobs?.length || 0}</div>
                <div className="small">Openings</div>
              </span>
            </div>
          </div>
        </div>

        <hr className="my-4 text-muted" />

        <p className="text-secondary mb-0">{company.description}</p>
      </div>

      {/* Tabs */}
      <div className="d-flex border-bottom mb-4">
        <button
          className={`btn pb-3 px-4 fw-semibold rounded-0 border-0 ${
            activeTab === "rounds"
              ? "text-primary border-bottom border-primary border-3"
              : "text-muted"
          }`}
          onClick={() => setActiveTab("rounds")}
        >
          🎯 Interview Roadmap ({company.interviewRounds?.length || 0})
        </button>
        <button
          className={`btn pb-3 px-4 fw-semibold rounded-0 border-0 ${
            activeTab === "questions"
              ? "text-primary border-bottom border-primary border-3"
              : "text-muted"
          }`}
          onClick={() => setActiveTab("questions")}
        >
          💻 Practice Problems ({questions?.length || 0})
        </button>
        <button
          className={`btn pb-3 px-4 fw-semibold rounded-0 border-0 ${
            activeTab === "jobs"
              ? "text-primary border-bottom border-primary border-3"
              : "text-muted"
          }`}
          onClick={() => setActiveTab("jobs")}
        >
          💼 Open Positions ({jobs?.length || 0})
        </button>
      </div>

      {/* Tab 1: Interview Rounds Roadmap */}
      {activeTab === "rounds" && (
        <div className="space-y-4">
          <div className="mb-4">
            <h4 className="fw-bold text-dark mb-1">Hiring Process Breakdown</h4>
            <p className="text-muted small">
              Step-by-step breakdown of how {company.name} assesses candidates across technical and behavioral dimensions.
            </p>
          </div>

          <div className="row g-4">
            {company.interviewRounds?.map((round, idx) => (
              <div key={idx} className="col-12">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white position-relative">
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px", minWidth: "40px" }}
                      >
                        {round.roundNumber || idx + 1}
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0 text-dark">{round.name}</h5>
                        <span className="small text-muted">Estimated Duration: {round.duration}</span>
                      </div>
                    </div>
                    <span className={`badge ${getRoundTypeBadge(round.roundType)} px-3 py-2 rounded-pill`}>
                      {round.roundType}
                    </span>
                  </div>

                  <p className="text-secondary mb-3">{round.description}</p>

                  {round.tips && (
                    <div className="p-3 rounded-3 bg-light border-start border-primary border-4">
                      <div className="fw-semibold text-primary small mb-1">
                        💡 Insider Preparation Tip:
                      </div>
                      <div className="small text-muted">{round.tips}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Practice Problems */}
      {activeTab === "questions" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-1">
                Frequently Asked at {company.name}
              </h4>
              <p className="text-muted small mb-0">
                Problems reported in recent interview assessments at {company.name}.
              </p>
            </div>
            <Link to="/practice" className="btn btn-outline-primary btn-sm rounded-pill px-3">
              Explore All Practice Hub →
            </Link>
          </div>

          {questions?.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border">
              <p className="text-muted">No specific practice problems linked yet.</p>
              <Link to="/practice" className="btn btn-primary btn-sm">
                Browse Full Practice Library
              </Link>
            </div>
          ) : (
            <div className="row g-3">
              {questions.map((q) => (
                <div key={q._id} className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Link
                            to={`/practice/${q._id}`}
                            className="text-decoration-none fw-bold text-dark fs-6"
                          >
                            {q.title}
                          </Link>
                          <span
                            className={`badge ${
                              q.difficulty === "Easy"
                                ? "bg-success-subtle text-success"
                                : q.difficulty === "Medium"
                                ? "bg-warning-subtle text-warning-emphasis"
                                : "bg-danger-subtle text-danger"
                            } rounded-pill px-2 py-1 small`}
                          >
                            {q.difficulty}
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          <span className="badge bg-light text-secondary border small">
                            {q.category}
                          </span>
                          {q.tags?.map((t, i) => (
                            <span key={i} className="badge bg-light text-muted border small">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="col-md-3 text-muted small my-2 my-md-0">
                        Acceptance: <span className="fw-semibold text-dark">{q.acceptanceRate}%</span>
                      </div>

                      <div className="col-md-3 text-md-end">
                        <Link
                          to={`/practice/${q._id}`}
                          className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold"
                        >
                          Solve Challenge →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Open Positions */}
      {activeTab === "jobs" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-1">Active Job Openings</h4>
              <p className="text-muted small mb-0">
                Verified vacancies at {company.name} available for direct application.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-outline-primary btn-sm rounded-pill px-3">
              View All Jobs Hub →
            </Link>
          </div>

          {jobs?.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border">
              <p className="text-muted">No open vacancies at this time. Check back soon!</p>
              <Link to="/jobs" className="btn btn-primary btn-sm">
                Explore Other Jobs
              </Link>
            </div>
          ) : (
            <div className="row g-3">
              {jobs.map((job) => (
                <div key={job._id} className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="fw-bold text-dark mb-1">{job.title}</h5>
                        <div className="text-muted small">
                          📍 {job.location} • 💼 {job.employmentType} • ⏱ {job.experience}
                        </div>
                      </div>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-semibold"
                      >
                        View & Apply →
                      </Link>
                    </div>
                    <p className="text-secondary small mb-3">{job.description}</p>
                    <div className="d-flex flex-wrap gap-1">
                      {job.skills?.map((s, i) => (
                        <span key={i} className="badge bg-light text-primary border small">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
