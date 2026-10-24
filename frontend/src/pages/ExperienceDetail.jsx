import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ExperienceDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchExperienceDetail();
  }, [id]);

  const fetchExperienceDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/experiences/${id}`);
      if (res.data.success) {
        setExperience(res.data.experience);
      }
    } catch (err) {
      console.error("Error fetching experience detail:", err);
      setErrorMsg("Interview experience not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to upvote this experience!");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/experiences/${id}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const currentUserId = user?._id || user?.id;
        let updatedUpvotes = [...(experience.upvotes || [])];

        if (res.data.isUpvoted) {
          updatedUpvotes.push(currentUserId);
        } else {
          updatedUpvotes = updatedUpvotes.filter((u) => u.toString() !== currentUserId?.toString());
        }

        setExperience({ ...experience, upvotes: updatedUpvotes });
      }
    } catch (err) {
      console.error("Error toggling upvote:", err);
    }
  };

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case "Offered":
        return "bg-success text-white";
      case "Rejected":
        return "bg-danger text-white";
      case "Pending":
        return "bg-warning text-dark";
      default:
        return "bg-secondary text-white";
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading story...</span>
        </div>
        <p className="text-muted mt-2">Loading detailed interview breakdown...</p>
      </div>
    );
  }

  if (errorMsg || !experience) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold text-dark mb-3">{errorMsg || "Story Not Found"}</h4>
        <Link to="/experiences" className="btn btn-primary rounded-pill px-4">
          ← Back to Interview Hub
        </Link>
      </div>
    );
  }

  const currentUserId = user?._id || user?.id;
  const isUpvoted = experience.upvotes?.some((u) => u.toString() === currentUserId?.toString());

  return (
    <div className="container py-4">
      {/* Top Back Navigation */}
      <div className="mb-3">
        <Link to="/experiences" className="text-decoration-none text-muted small fw-semibold">
          ← Back to Interview Hub
        </Link>
      </div>

      <div className="row g-4">
        {/* Main Article Content */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
            {/* Header: Company & Outcome */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center gap-3">
                {experience.companyLogo ? (
                  <img
                    src={experience.companyLogo}
                    alt={experience.company}
                    className="rounded-3 border p-1"
                    style={{ width: "56px", height: "56px", objectFit: "contain" }}
                  />
                ) : (
                  <div
                    className="rounded-3 bg-primary-subtle text-primary fw-bold display-6 d-flex align-items-center justify-content-center"
                    style={{ width: "56px", height: "56px" }}
                  >
                    {experience.company?.[0]}
                  </div>
                )}
                <div>
                  <h3 className="h4 fw-bold text-dark mb-0">{experience.company}</h3>
                  <span className="text-muted fw-semibold">{experience.role}</span>
                </div>
              </div>

              <span className={`badge ${getOutcomeBadge(experience.outcome)} px-3 py-2 rounded-pill fs-6`}>
                {experience.outcome === "Offered" ? "🎉 Offered" : experience.outcome}
              </span>
            </div>

            {/* Title */}
            <h1 className="h3 fw-bold text-dark mb-3">{experience.title}</h1>

            {/* Author & Meta */}
            <div className="d-flex flex-wrap align-items-center gap-3 pb-3 mb-4 border-bottom text-muted small">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark">👤 {experience.user?.name || "Student Alumni"}</span>
                <span className="badge bg-light text-muted border">{experience.user?.role || "Candidate"}</span>
              </div>
              <span>•</span>
              <span>📅 Posted on {new Date(experience.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>📍 {experience.location}</span>
            </div>

            {/* Compensation Highlight Card if offered */}
            {experience.salaryDetails && (
              <div className="alert alert-success border-success bg-success-subtle rounded-3 p-3 mb-4 d-flex align-items-center gap-3">
                <div className="fs-3">💰</div>
                <div>
                  <div className="fw-bold text-success-emphasis mb-0">Compensation / CTC Package:</div>
                  <div className="fw-semibold text-dark">{experience.salaryDetails}</div>
                </div>
              </div>
            )}

            {/* Overall Executive Summary */}
            <div className="mb-5">
              <h5 className="fw-bold text-dark mb-3">📌 Executive Summary</h5>
              <div className="p-3 bg-light rounded-3 border text-secondary" style={{ lineHeight: "1.7", whiteSpace: "pre-line" }}>
                {experience.summary}
              </div>
            </div>

            {/* Round-by-Round Timeline */}
            <div className="mb-4">
              <h5 className="fw-bold text-dark mb-4">🧩 Round-by-Round Breakdown</h5>

              {experience.rounds && experience.rounds.length > 0 ? (
                <div className="timeline">
                  {experience.rounds.map((round, idx) => (
                    <div key={idx} className="card border-0 shadow-sm rounded-4 mb-4 p-4 bg-light border-start border-4 border-primary">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold text-dark mb-0">{round.roundName}</h6>
                        <span className="badge bg-primary-subtle text-primary small">
                          {round.roundType}
                        </span>
                      </div>

                      <p className="text-secondary small mb-3">{round.description}</p>

                      {/* Questions Asked */}
                      {round.questionsAsked && round.questionsAsked.length > 0 && (
                        <div className="mb-3">
                          <span className="small fw-bold text-dark d-block mb-1">❓ Questions Asked:</span>
                          <ul className="list-group list-group-flush rounded-3 border">
                            {round.questionsAsked.map((q, qIdx) => (
                              <li key={qIdx} className="list-group-item bg-white small font-monospace text-dark py-2">
                                • {q}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Round Tips */}
                      {round.tips && (
                        <div className="p-3 bg-warning-subtle rounded-3 border border-warning-subtle small text-dark">
                          <strong>💡 Pro-Tip for this round:</strong> {round.tips}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No specific round breakdown details provided.</p>
              )}
            </div>

            {/* Tags */}
            {experience.tags && experience.tags.length > 0 && (
              <div className="pt-3 border-top d-flex flex-wrap gap-2">
                {experience.tags.map((tag, idx) => (
                  <span key={idx} className="badge bg-light text-muted border px-3 py-2 rounded-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Summary Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: "90px" }}>
            <h5 className="fw-bold text-dark mb-3">Quick Overview</h5>

            <ul className="list-group list-group-flush mb-4 small">
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Target Company:</span>
                <span className="fw-semibold text-dark">{experience.company}</span>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Role:</span>
                <span className="fw-semibold text-dark">{experience.role}</span>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Batch Year:</span>
                <span className="fw-semibold text-dark">{experience.batchYear}</span>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Job Type:</span>
                <span className="fw-semibold text-dark">{experience.jobType}</span>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Overall Difficulty:</span>
                <span className="fw-semibold text-dark">{experience.overallDifficulty}</span>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Total Rounds:</span>
                <span className="fw-semibold text-dark">{experience.rounds?.length || 0} Rounds</span>
              </li>
            </ul>

            {/* Upvote Button */}
            <div className="d-grid mb-3">
              <button
                className={`btn btn-lg ${isUpvoted ? "btn-primary" : "btn-outline-primary"} rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2`}
                onClick={handleUpvote}
              >
                <span>🔥</span>
                <span>{isUpvoted ? "Upvoted!" : "Upvote Experience"}</span>
                <span className="badge bg-white text-primary rounded-circle ms-1">
                  {experience.upvotes?.length || 0}
                </span>
              </button>
            </div>

            <p className="small text-muted text-center mb-0">
              Found this experience helpful? Upvote to help fellow candidates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
