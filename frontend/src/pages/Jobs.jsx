import React, { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "OFF_CAMPUS";
  const filterParam = searchParams.get("filter") || "ALL";

  const [jobs, setJobs] = useState([]);
  const [counts, setCounts] = useState({ ALL: 0, OFF_CAMPUS: 0, ON_CAMPUS: 0, INTERNSHIP: 0, RECOMMENDED: 0 });
  const [profileSummary, setProfileSummary] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // Filter states
  const [search, setSearch] = useState("");
  const [workMode, setWorkMode] = useState("ALL");
  const [location, setLocation] = useState("ALL");
  const [experience, setExperience] = useState("ALL");

  const { user } = useContext(AuthContext);

  // Load applied jobs for logged-in user
  useEffect(() => {
    if (user) {
      axios
        .get("/api/jobs/applications/me")
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.data)) {
            const ids = new Set(
              res.data.data.map((app) => (typeof app.job === "object" ? app.job?._id : app.job))
            );
            setAppliedJobIds(ids);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Fetch jobs whenever category, search, or filters change
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      if (categoryParam === "RECOMMENDED") {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get("/api/jobs/recommended", { headers });
        if (res.data.success) {
          let recJobs = res.data.data || [];
          setHasProfile(res.data.hasProfile);
          setProfileSummary(res.data.profileSummary);
          
          if (workMode !== "ALL") recJobs = recJobs.filter(j => j.workMode === workMode);
          if (location !== "ALL") recJobs = recJobs.filter(j => (j.location || "").toLowerCase().includes(location.toLowerCase()));
          if (experience !== "ALL") recJobs = recJobs.filter(j => (j.experience || "").toLowerCase().includes(experience.toLowerCase()));
          if (search.trim()) {
            const s = search.toLowerCase();
            recJobs = recJobs.filter(j => 
              j.title?.toLowerCase().includes(s) || 
              j.company?.toLowerCase().includes(s) || 
              j.skills?.some(sk => sk.toLowerCase().includes(s))
            );
          }
          setJobs(recJobs);
          setCounts(prev => ({ ...prev, RECOMMENDED: recJobs.length }));
        }
      } else {
        const params = {
          category: categoryParam,
          workMode: workMode !== "ALL" ? workMode : undefined,
          location: location !== "ALL" ? location : undefined,
          experience: experience !== "ALL" ? experience : undefined,
          search: search.trim() || undefined,
        };

        const res = await axios.get("/api/jobs", { params });
        if (res.data.success) {
          setJobs(res.data.data || []);
          if (res.data.counts) {
            setCounts(prev => ({ ...prev, ...res.data.counts }));
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchJobs();
  }, [categoryParam, workMode, location, experience]);

  // Handle live search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  // Switch top category tabs (AccioJob: Off Campus vs On Campus vs Internships vs All)
  const handleCategoryChange = (newCat) => {
    searchParams.set("category", newCat);
    setSearchParams(searchParams);
  };

  // Switch subfilter: All Jobs vs Applied
  const handleFilterChange = (newFilter) => {
    searchParams.set("filter", newFilter);
    setSearchParams(searchParams);
  };

  // Trigger automated jobs update from career portals
  const handleTriggerSync = async () => {
    setSyncing(true);
    try {
      const res = await axios.post("/api/jobs/sync");
      if (res.data.success) {
        await fetchJobs();
      }
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  // Handle Direct Apply
  const handleApplyClick = async (job, e) => {
    // Record application in DB if user is logged in
    if (user && !appliedJobIds.has(job._id)) {
      try {
        await axios.post(`/api/jobs/${job._id}/apply`);
        setAppliedJobIds((prev) => new Set([...prev, job._id]));
      } catch (err) {
        // Continue even if server application fails or already recorded
      }
    }

    // Direct apply link
    const applyTarget = job.applyUrl || job.sourceUrl;
    if (applyTarget) {
      window.open(applyTarget, "_blank", "noopener,noreferrer");
    }
  };

  // Filter jobs by 'Applied' subfilter if active
  const displayedJobs = jobs.filter((job) => {
    if (filterParam === "APPLIED") {
      return appliedJobIds.has(job._id);
    }
    return true;
  });

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="accio-portal-container">
      {/* AccioJob-Style WhatsApp/Notice Ribbon */}
      <div className="accio-alert-ribbon">
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: "1.25rem" }}>⚡</span>
          <div>
            <strong>Daily Curated Tech Jobs:</strong> Verified listings automatically synced from company career portals (Google, Amazon, Microsoft, Swiggy, Greenhouse, Remotive).
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleTriggerSync}
            disabled={syncing}
            className="btn btn-sm btn-light text-dark fw-bold"
            title="Auto-fetch latest jobs from career pages"
          >
            {syncing ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                Updating Jobs...
              </>
            ) : (
              "🔄 Sync Latest Jobs"
            )}
          </button>
        </div>
      </div>

      {/* AccioJob Top Category Bar (RECOMMENDED, OFF_CAMPUS, INTERNSHIP, ON_CAMPUS, ALL) */}
      <div className="accio-category-bar">
        <div className="accio-category-tabs">
          <button
            className={`accio-category-tab ${categoryParam === "RECOMMENDED" ? "active" : ""}`}
            onClick={() => handleCategoryChange("RECOMMENDED")}
            style={categoryParam === "RECOMMENDED" ? { background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff" } : {}}
          >
            🎯 Profile Recommended
            <span className="accio-category-badge">
              {categoryParam === "RECOMMENDED" ? (counts.RECOMMENDED || jobs.length || 0) : "AI"}
            </span>
          </button>

          <button
            className={`accio-category-tab ${categoryParam === "OFF_CAMPUS" ? "active" : ""}`}
            onClick={() => handleCategoryChange("OFF_CAMPUS")}
          >
            Daily Curated Jobs (Off-Campus)
            <span className="accio-category-badge">{counts.OFF_CAMPUS || 0}</span>
          </button>

          <button
            className={`accio-category-tab ${categoryParam === "INTERNSHIP" ? "active" : ""}`}
            onClick={() => handleCategoryChange("INTERNSHIP")}
          >
            Internships
            <span className="accio-category-badge">{counts.INTERNSHIP || 0}</span>
          </button>

          <button
            className={`accio-category-tab ${categoryParam === "ON_CAMPUS" ? "active" : ""}`}
            onClick={() => handleCategoryChange("ON_CAMPUS")}
          >
            On-Campus Drives
            <span className="accio-category-badge">{counts.ON_CAMPUS || 0}</span>
          </button>

          <button
            className={`accio-category-tab ${categoryParam === "ALL" ? "active" : ""}`}
            onClick={() => handleCategoryChange("ALL")}
          >
            All Opportunities
            <span className="accio-category-badge">{counts.ALL || 0}</span>
          </button>
        </div>

        {user?.role === "Admin" && (
          <Link to="/admin" className="btn btn-outline-primary btn-sm fw-semibold">
            + Post Job (Admin)
          </Link>
        )}
      </div>


      {/* Subfilter Bar: AccioJob Sub-tabs (All Jobs vs Applied) */}
      <div className="accio-subfilter-bar">
        <div className="text-secondary small">
          These jobs are handpicked daily by our placement team, sourced from LinkedIn, Naukri, and career pages of top companies.
        </div>

        <div className="accio-subfilter-tabs">
          <button
            className={`accio-subfilter-btn ${filterParam === "ALL" ? "active" : ""}`}
            onClick={() => handleFilterChange("ALL")}
          >
            All Jobs
          </button>
          <button
            className={`accio-subfilter-btn ${filterParam === "APPLIED" ? "active" : ""}`}
            onClick={() => handleFilterChange("APPLIED")}
          >
            Applied
            {appliedJobIds.size > 0 && (
              <span className="accio-applied-counter">{appliedJobIds.size}</span>
            )}
          </button>
        </div>
      </div>

      {/* Recommendation Header Banner (Shown when category is RECOMMENDED) */}
      {categoryParam === "RECOMMENDED" && (
        <div className="accio-recommendation-banner">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-white text-dark fw-bold px-2 py-1 rounded-pill">
                  🎯 AI Profile Matching
                </span>
                {hasProfile ? (
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                    Profile Synced ({profileSummary?.skillsCount || 0} skills detected)
                  </span>
                ) : (
                  <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill">
                    Profile Not Complete
                  </span>
                )}
              </div>
              <h5 className="fw-bold mb-1">Recommended Jobs Based on Your Profile &amp; Resume</h5>
              <p className="mb-0 small opacity-90">
                {hasProfile
                  ? `Ranked using your parsed resume skills (${(profileSummary?.preferredRoles || []).join(", ") || "Tech Stack"}), degree eligibility, and preferred work parameters.`
                  : "We're showing high-match tech roles. Upload or paste your resume in Resume Studio to automatically generate a tailored match profile!"}
              </p>
            </div>
            <div>
              <Link to="/resume" className="btn btn-light fw-bold btn-sm rounded-pill px-3 shadow-sm text-primary">
                📄 {hasProfile ? "Update Resume & Profile" : "Upload Resume to Personalize"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search and Secondary Filters */}
      <div className="accio-filter-strip">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">

          <div className="col-lg-4 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by company, role, or tech stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <select
              className="form-select form-select-sm py-2"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
            >
              <option value="ALL">All Modes</option>
              <option value="In-Office">In-Office</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <select
              className="form-select form-select-sm py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="ALL">All Locations</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-4 col-6">
            <select
              className="form-select form-select-sm py-2"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="ALL">All Experience</option>
              <option value="0-1">0-1 years</option>
              <option value="0-2">0-2 years (Fresher)</option>
              <option value="1-3">1-3 years</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-4 col-6 d-flex gap-2">
            <button type="submit" className="btn btn-primary w-100 fw-semibold">
              Search
            </button>
            {(search || workMode !== "ALL" || location !== "ALL" || experience !== "ALL") && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearch("");
                  setWorkMode("ALL");
                  setLocation("ALL");
                  setExperience("ALL");
                }}
                title="Reset filters"
              >
                ✕
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Main Table / Job Listings */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading active career opportunities...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : displayedJobs.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border">
          <div className="display-6 mb-3">💼</div>
          <h5 className="fw-bold">
            {filterParam === "APPLIED"
              ? "Jobs you apply to will show up here"
              : "No jobs match your selected filters"}
          </h5>
          <p className="text-muted small">
            {filterParam === "APPLIED"
              ? "Click 'Apply' on any job and it will automatically be tracked in your applied jobs tab."
              : "Try adjusting your search criteria or hit 'Sync Latest Jobs' to fetch fresh opportunities."}
          </p>
          {filterParam === "APPLIED" ? (
            <button
              onClick={() => handleFilterChange("ALL")}
              className="btn btn-outline-primary btn-sm mt-2"
            >
              Browse all jobs &rarr;
            </button>
          ) : (
            <button onClick={handleTriggerSync} className="btn btn-primary btn-sm mt-2">
              Sync Latest Jobs from Portals
            </button>
          )}
        </div>
      ) : (
        <div className="accio-jobs-table-card">
          <div className="table-responsive">
            <table className="accio-jobs-table">
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>Company</th>
                  <th style={{ width: "24%" }}>Role Offered</th>
                  <th style={{ width: "26%" }}>Skills Required</th>
                  <th style={{ width: "12%" }}>Date Added</th>
                  <th style={{ width: "16%" }}>Source</th>
                  <th style={{ width: "10%", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Fast Track Placement Program Highlight Banner (Exact AccioJob Reference Row) */}
                <tr className="accio-fast-track-row">
                  <td>
                    <div className="accio-fast-track-badge">
                      ⚡ Fast Track Placement
                    </div>
                  </td>
                  <td colSpan={2}>
                    <div className="fw-bold">Bridge skill gaps with AI mock interviews &amp; structured prep</div>
                    <div className="small opacity-75">Guaranteed placement preparation assistance &amp; hiring partner referrals</div>
                  </td>
                  <td colSpan={2}>
                    <div className="fw-bold">Open to All Students</div>
                    <div className="small opacity-75">Direct Referral Assistance</div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link to="/practice" className="btn btn-sm text-white fw-bold" style={{ background: "#5b21b6" }}>
                      Practice Now
                    </Link>
                  </td>
                </tr>

                {/* Job Rows */}
                {displayedJobs.map((job) => {
                  const isApplied = appliedJobIds.has(job._id);
                  return (
                    <tr key={job._id}>
                      {/* Company Name & Logo */}
                      <td>
                        <div className="accio-company-col">
                          <div className="accio-company-logo">
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
                            <div className="fw-bold text-dark">{job.company}</div>
                            <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                              📍 {job.location || "Remote"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Offered & Details link */}
                      <td>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="fw-bold text-primary text-decoration-none"
                            style={{ fontSize: "0.95rem" }}
                          >
                            {job.title}
                          </Link>
                          {job.matchScore !== undefined && (
                            <span
                              className={`accio-match-badge ${
                                job.matchScore >= 80
                                  ? "accio-match-high"
                                  : job.matchScore >= 65
                                  ? "accio-match-medium"
                                  : "accio-match-standard"
                              }`}
                              title={job.recommendationReason || "Profile match score"}
                            >
                              ⭐ {job.matchScore}% Match
                            </span>
                          )}
                        </div>
                        {job.recommendationReason && categoryParam === "RECOMMENDED" && (
                          <div className="text-success small fw-semibold" style={{ fontSize: "0.72rem" }}>
                            ✓ {job.recommendationReason}
                          </div>
                        )}
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span className="badge bg-light text-secondary border" style={{ fontSize: "0.7rem" }}>
                            {job.workMode || "In-Office"}
                          </span>
                          <span className="badge bg-light text-secondary border" style={{ fontSize: "0.7rem" }}>
                            {job.experience || "0-2 yrs"}
                          </span>
                          {job.salary && job.salary !== "Not Disclosed" && (
                            <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: "0.7rem" }}>
                              💰 {job.salary}
                            </span>
                          )}
                        </div>
                      </td>


                      {/* Skills Required */}
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {job.skills && job.skills.length > 0 ? (
                            job.skills.slice(0, 4).map((skill) => (
                              <span key={skill} className="accio-skill-tag">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted small">Software Engineering</span>
                          )}
                          {job.skills && job.skills.length > 4 && (
                            <span className="text-muted small">+{job.skills.length - 4}</span>
                          )}
                        </div>
                      </td>

                      {/* Date Added */}
                      <td className="text-muted small">
                        {formatDate(job.createdAt || job.updatedAt)}
                      </td>

                      {/* Source */}
                      <td>
                        <div className="fw-semibold small text-dark">
                          {job.source || "Company Career Page"}
                        </div>
                        {job.applyUrl && (
                          <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                            Official Portal ↗
                          </div>
                        )}
                      </td>

                      {/* Direct Apply Action Button */}
                      <td style={{ textAlign: "right" }}>
                        <div className="d-flex justify-content-end align-items-center gap-2">
                          <button
                            onClick={(e) => handleApplyClick(job, e)}
                            className={`accio-apply-btn ${isApplied ? "accio-applied-btn" : ""}`}
                            title={isApplied ? "Applied - Click to re-open portal link" : "Apply directly on official portal"}
                          >
                            {isApplied ? "✓ Applied" : "Apply ↗"}
                          </button>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="btn btn-outline-secondary btn-sm p-1"
                            title="View Full Job & Eligibility Details"
                          >
                            ℹ️
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Info Banner */}
      <div className="mt-4 p-3 bg-white rounded-3 border d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="small text-muted">
          Showing <strong>{displayedJobs.length}</strong> opportunities • Automatic updates running periodically from verified career portals.
        </div>
        <div className="d-flex gap-2">
          <Link to="/practice" className="btn btn-sm btn-outline-primary">
            Prepare with Practice Problems &rarr;
          </Link>
          <Link to="/resume" className="btn btn-sm btn-primary">
            Build ATS Resume &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
