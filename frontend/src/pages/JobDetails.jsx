import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Check if current user has applied to this job
  useEffect(() => {
    if (user && id) {
      axios
        .get("/api/jobs/applications/me")
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.data)) {
            const hasApplied = res.data.data.some((app) => {
              const jobId = typeof app.job === "object" ? app.job?._id : app.job;
              return jobId === id;
            });
            setIsApplied(hasApplied);
          }
        })
        .catch(() => {});
    }
  }, [user, id]);

  const handleApply = async () => {
    if (!job) return;

    if (user && !isApplied) {
      setApplying(true);
      try {
        await axios.post(`/api/jobs/${job._id}/apply`);
        setIsApplied(true);
      } catch (err) {
        // Continue to external application link regardless
      } finally {
        setApplying(false);
      }
    }

    const targetUrl = job.applyUrl || job.sourceUrl;
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="accio-portal-container mt-4">
        <div className="alert alert-danger">{error || "Job not found"}</div>
        <Link to="/jobs" className="btn btn-outline-primary">
          &larr; Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="accio-portal-container">
      {/* Top Breadcrumb */}
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <Link to="/jobs" className="text-decoration-none fw-semibold text-secondary">
          &larr; Back to All Jobs
        </Link>
        <span className="badge bg-light text-dark border">
          Category: <strong>{job.category || "OFF_CAMPUS"}</strong>
        </span>
      </div>

      {/* AccioJob-Style Main Job Header Card */}
      <div className="accio-details-header">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="accio-company-logo" style={{ width: 56, height: 56, fontSize: "1.25rem" }}>
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  job.company?.charAt(0) || "C"
                )}
              </div>
              <div>
                <h2 className="fw-bold mb-1 text-dark" style={{ fontSize: "1.6rem" }}>
                  {job.title}
                </h2>
                <h5 className="text-secondary mb-0 fw-medium">
                  {job.company} • <span className="text-primary">{job.source || "Official Portal"}</span>
                </h5>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-3 pt-2">
              <span className="badge bg-light text-dark border px-3 py-2">
                📍 <strong>{job.location}</strong>
              </span>
              <span className="badge bg-light text-dark border px-3 py-2">
                💼 <strong>{job.experience}</strong>
              </span>
              <span className="badge bg-light text-dark border px-3 py-2">
                🏢 <strong>{job.workMode || "In-Office"}</strong>
              </span>
              <span className="badge bg-light text-dark border px-3 py-2">
                🕒 <strong>{job.employmentType}</strong>
              </span>
              {job.salary && job.salary !== "Not Disclosed" && (
                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                  💰 <strong>{job.salary}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
            <button
              onClick={handleApply}
              disabled={applying}
              className={`btn btn-lg w-100 ${
                isApplied ? "btn-success" : "btn-primary"
              } fw-bold py-3 shadow-sm`}
            >
              {applying ? (
                "Applying..."
              ) : isApplied ? (
                "✓ Applied (Re-open Portal ↗)"
              ) : (
                "Apply on Official Portal ↗"
              )}
            </button>
            <div className="small text-muted mt-2 text-center text-lg-end">
              Verified application link from {job.source || "hiring portal"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="row">
        {/* Left Column: Details, Criteria, Description */}
        <div className="col-lg-8">
          {/* AccioJob Eligibility Criteria Section */}
          <div className="accio-section-card">
            <h5 className="accio-section-heading">
              <span>🎯</span> Eligibility Criteria
            </h5>
            <ul className="accio-criteria-list">
              <li className="accio-criteria-item">
                <label>Eligible Batches</label>
                <span>
                  {job.batchEligible?.length
                    ? job.batchEligible.join(", ")
                    : "2024, 2025, 2026 Batch"}
                </span>
              </li>

              <li className="accio-criteria-item">
                <label>Eligible Degrees</label>
                <span>
                  {job.degreeEligible?.length
                    ? job.degreeEligible.join(", ")
                    : "B.Tech, B.E., MCA, Any Graduate"}
                </span>
              </li>

              <li className="accio-criteria-item">
                <label>Work Experience</label>
                <span>{job.experience || "0-2 years"}</span>
              </li>

              <li className="accio-criteria-item">
                <label>Work Mode</label>
                <span>{job.workMode || "In-Office / Hybrid"}</span>
              </li>
            </ul>
          </div>

          {/* AccioJob Salary & Stipend Details Section */}
          <div className="accio-section-card">
            <h5 className="accio-section-heading">
              <span>💰</span> Salary &amp; Stipend Details
            </h5>
            <div className="p-3 bg-light rounded-3 border">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <div className="small text-muted text-uppercase fw-bold">Estimated Compensation</div>
                  <div className="h4 fw-bold text-success mb-0">
                    {job.salary || "Best In Industry (Competitive)"}
                  </div>
                </div>
                <div className="text-end">
                  <div className="small text-muted text-uppercase fw-bold">Role Type</div>
                  <span className="badge bg-primary px-3 py-2">{job.employmentType}</span>
                </div>
              </div>
              <hr className="my-3 opacity-25" />
              <div className="small text-secondary">
                <strong>Important:</strong> Direct payroll opportunity with standard enterprise medical, wellness, and learning allowances.
              </div>
            </div>
          </div>

          {/* Skills Required Section */}
          <div className="accio-section-card">
            <h5 className="accio-section-heading">
              <span>🛠️</span> Skills &amp; Tech Stack
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {job.skills && job.skills.length > 0 ? (
                job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge bg-light text-dark border px-3 py-2 fw-semibold"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-muted">Software engineering fundamentals &amp; problem solving</span>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="accio-section-card">
            <h5 className="accio-section-heading">
              <span>📄</span> Job Description &amp; Overview
            </h5>
            <div className="text-secondary" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
              {job.description}
            </div>
          </div>

          {/* Key Responsibilities */}
          <div className="accio-section-card">
            <h5 className="accio-section-heading">
              <span>📌</span> Key Responsibilities
            </h5>
            {job.responsibilities && job.responsibilities.length > 0 ? (
              <ul className="mb-0 ps-3 text-secondary" style={{ lineHeight: 1.8 }}>
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="mb-2">
                    {resp}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mb-0 ps-3 text-secondary" style={{ lineHeight: 1.8 }}>
                <li>Design, develop, and test scalable software components and services.</li>
                <li>Collaborate with cross-functional product and engineering teams.</li>
                <li>Write clean, modular code with unit tests and technical documentation.</li>
              </ul>
            )}
          </div>
        </div>

        {/* Right Sidebar: AccioJob Quick Actions & Preparation Support */}
        <div className="col-lg-4">
          {/* Action Box */}
          <div className="accio-section-card">
            <h5 className="fw-bold mb-3">Application Status</h5>
            <div className="p-3 mb-3 rounded-3" style={{ background: isApplied ? "#ddf9e4" : "#f1f5f9" }}>
              <div className="fw-bold" style={{ color: isApplied ? "#075a39" : "#334155" }}>
                {isApplied ? "✓ Marked as Applied" : "Not Applied Yet"}
              </div>
              <div className="small text-muted mt-1">
                {isApplied
                  ? "We have recorded your application in PlacementHub. You can re-visit the company portal anytime."
                  : "Clicking apply will take you directly to the verified external career application form."}
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={applying}
              className={`btn ${isApplied ? "btn-success" : "btn-primary"} w-100 fw-bold py-2 mb-2`}
            >
              {isApplied ? "Re-open Portal Link ↗" : "Apply Now ↗"}
            </button>

            {job.applyUrl && (
              <div className="small text-break text-muted mt-2">
                <strong>Portal:</strong> {job.applyUrl}
              </div>
            )}
          </div>

          {/* Fast Track Placement & Skill Gap Card (AccioJob Style Sidebar Card) */}
          <div className="accio-section-card" style={{ background: "#f6edff", borderColor: "#d8b4fe" }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge" style={{ background: "#5b21b6", color: "#fff" }}>
                ⚡ Fast Track Preparation
              </span>
            </div>
            <h5 className="fw-bold" style={{ color: "#5b21b6" }}>
              Crack {job.company} Interview
            </h5>
            <p className="small text-secondary mb-3">
              Bridge your skill gaps with tailored practice questions, system design problems, and mock interviews matching {job.company}'s hiring bar.
            </p>
            <div className="d-grid gap-2">
              <Link to="/practice" className="btn btn-sm text-white fw-bold" style={{ background: "#5b21b6" }}>
                Practice {job.skills?.[0] || "Coding"} Questions &rarr;
              </Link>
              <Link to="/resume" className="btn btn-sm btn-outline-dark fw-bold">
                Tailor Resume for {job.title}
              </Link>
              <Link to="/mock-interview" className="btn btn-sm btn-light border fw-semibold">
                Start AI Mock Interview
              </Link>
            </div>
          </div>

          {/* Company Quick Summary */}
          <div className="accio-section-card">
            <h6 className="fw-bold mb-3">About {job.company}</h6>
            <div className="small text-secondary mb-3">
              {job.company} is actively seeking qualified talent for the {job.title} position. Apply promptly to ensure consideration before slots fill up.
            </div>
            <div className="border-top pt-3 small">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Deadline:</span>
                <strong>
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Rolling Applications"}
                </strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Listing Source:</span>
                <strong>{job.source || "PlacementHub"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
