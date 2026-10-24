import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  ClipboardPaste, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  RefreshCw,
  ArrowRight,
  X
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const emptyProfile = {
  college: "",
  degree: "",
  graduationYear: "",
  skills: "",
  preferredRoles: "",
  preferredLocations: "",
  github: "",
  linkedin: "",
  portfolio: "",
  resumeUrl: "",
};

const splitValues = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

const ResumeStudio = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [pasting, setPasting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Optimized Resume generation state
  const [generatingOptimized, setGeneratingOptimized] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState("");
  const [copied, setCopied] = useState(false);
  const [showOptimizedModal, setShowOptimizedModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = response.data.data;
        if (profile) {
          setForm({
            college: profile.college || "",
            degree: profile.degree || "",
            graduationYear: profile.graduationYear || "",
            skills: profile.skills ? profile.skills.join(", ") : "",
            preferredRoles: profile.preferredRoles ? profile.preferredRoles.join(", ") : "",
            preferredLocations: profile.preferredLocations ? profile.preferredLocations.join(", ") : "",
            github: profile.github || "",
            linkedin: profile.linkedin || "",
            portfolio: profile.portfolio || "",
            resumeUrl: profile.resumeUrl || "",
          });
          if (profile.resumeAnalysis) {
            setAnalysis(profile.resumeAnalysis);
          }
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const readiness = useMemo(() => {
    const checks = [
      { label: "Name and contact", complete: Boolean(user?.name && user?.email) },
      { label: "Education", complete: Boolean(form.college && form.degree && form.graduationYear) },
      { label: "Skills", complete: splitValues(form.skills).length >= 3 },
      { label: "Role preference", complete: splitValues(form.preferredRoles).length > 0 },
      { label: "Professional link", complete: Boolean(form.github || form.linkedin || form.portfolio) },
    ];
    return { checks, complete: checks.filter((check) => check.complete).length };
  }, [form, user]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setMessage("");
  };

  const handleResumeUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token || !resumeFile) return;
    setUploading(true);
    setMessage("");
    setError("");
    try {
      const payload = new FormData();
      payload.append("resume", resumeFile);
      const response = await axios.post("/api/profile/resume", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const extracted = response.data.extracted || {};
      setAnalysis(null);
      setForm((current) => ({
        ...current,
        college: extracted.college || current.college,
        degree: extracted.degree || current.degree,
        graduationYear: extracted.graduationYear || current.graduationYear,
        skills: extracted.skills?.length ? extracted.skills.join(", ") : current.skills,
        preferredRoles: extracted.preferredRoles?.length ? extracted.preferredRoles.join(", ") : current.preferredRoles,
        github: extracted.github || current.github,
        linkedin: extracted.linkedin || current.linkedin,
        portfolio: extracted.portfolio || current.portfolio,
      }));
      setMessage("Resume parsed and profile updated! Head to Jobs > Profile Recommended to see jobs matched to your skills.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not scan that resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await axios.put(
        "/api/profile/me",
        {
          ...form,
          graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
          skills: splitValues(form.skills),
          preferredRoles: splitValues(form.preferredRoles),
          preferredLocations: splitValues(form.preferredLocations),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile saved successfully. Your placement readiness has been updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to analyze your resume.");
      return;
    }
    
    if (!jobDescription || !jobDescription.trim()) {
      setError("Please paste a target job description before analyzing.");
      return;
    }
    
    if (jobDescription.trim().length < 30) {
      setError("Job description is too short. Please paste a complete job description.");
      return;
    }
    
    setAnalyzing(true);
    setMessage("");
    setError("");
    
    try {
      const response = await axios.post(
        "/api/profile/resume/analyze",
        { jobDescription: jobDescription.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success && response.data.analysis) {
        setAnalysis(response.data.analysis);
        setMessage(`ATS analysis complete! Match Level: ${response.data.analysis.matchLevel}. Review your detailed gap analysis below.`);
      } else {
        setError("Analysis completed but no data returned.");
      }
    } catch (requestError) {
      const errorMsg = requestError.response?.data?.message || requestError.message || "Could not analyze your resume.";
      setError(`Analysis failed: ${errorMsg}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClearAnalysis = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete("/api/profile/resume/analysis", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalysis(null);
      setJobDescription("");
      setOptimizedResume("");
      setShowOptimizedModal(false);
      setMessage("Analysis cleared.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not clear analysis.");
    }
  };

  const handlePastedResume = async () => {
    const token = localStorage.getItem("token");
    if (!token || !resumeText.trim()) return;
    setPasting(true);
    setMessage("");
    setError("");
    try {
      const response = await axios.post("/api/profile/resume/text", { resumeText }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const extracted = response.data.extracted || {};
      setAnalysis(null);
      setForm((current) => ({
        ...current,
        college: extracted.college || current.college,
        degree: extracted.degree || current.degree,
        graduationYear: extracted.graduationYear || current.graduationYear,
        skills: extracted.skills?.length ? extracted.skills.join(", ") : current.skills,
        preferredRoles: extracted.preferredRoles?.length ? extracted.preferredRoles.join(", ") : current.preferredRoles,
        github: extracted.github || current.github,
        linkedin: extracted.linkedin || current.linkedin,
        portfolio: extracted.portfolio || current.portfolio,
      }));
      setMessage("Resume text saved and profile fields extracted! Check out Jobs > Profile Recommended for roles tailored to your stack.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not process the pasted resume.");
    } finally {
      setPasting(false);
    }
  };

  const handleGenerateOptimized = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setGeneratingOptimized(true);
    setMessage("");
    setError("");
    try {
      const response = await axios.post(
        "/api/profile/resume/generate-optimized",
        { jobDescription: jobDescription.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success && response.data.optimizedResume) {
        setOptimizedResume(response.data.optimizedResume);
        setShowOptimizedModal(true);
        setMessage("Optimized resume generated! You can copy or download it below.");
      } else {
        setError("Could not generate optimized resume.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate optimized resume.");
    } finally {
      setGeneratingOptimized(false);
    }
  };

  const handleCopyResume = () => {
    navigator.clipboard.writeText(optimizedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadResume = () => {
    const element = document.createElement("a");
    const file = new Blob([optimizedResume], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${user?.name?.replace(/\s+/g, "_") || "Candidate"}_Optimized_Resume.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3 fw-bold">Resume Studio & ATS Optimizer</h1>
        <p className="text-muted">Sign in to build your profile, analyze ATS scores, and generate optimized resumes.</p>
        <Link to="/login" className="btn btn-primary rounded-pill px-4">Sign in</Link>
      </div>
    );
  }

  if (loading) return <div className="container py-5 text-center">Loading your profile...</div>;

  const scoreColor = (score) => {
    if (score >= 80) return "#198754"; // green
    if (score >= 60) return "#0d6efd"; // blue
    if (score >= 45) return "#ffc107"; // yellow
    return "#dc3545"; // red
  };

  return (
    <div className="resume-studio container py-4 py-lg-5">
      {/* Header */}
      <div className="resume-studio-header d-flex flex-wrap justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <div>
          <h1 className="h2 fw-bold mb-1">Resume Studio & ATS Optimizer</h1>
          <p className="text-muted mb-0">
            Resume → Job Description → Deep Gap Analysis → ATS Scoring → AI Optimized Resume
          </p>
        </div>
        <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
          <div className="badge bg-light text-dark border p-2 px-3 rounded-pill">
            <span className="fw-semibold">Readiness:</span> {readiness.complete}/5 Complete
          </div>
        </div>
      </div>

      {message && <div className="alert alert-success alert-dismissible fade show">{message}</div>}
      {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}

      {/* Input Panel */}
      <div className="row g-4 mb-4">
        {/* Step 1: Resume Input */}
        <div className="col-lg-6">
          <div className="card h-100 border shadow-sm p-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary text-white rounded-circle p-2">1</span>
              <h2 className="h5 fw-bold mb-0">Your Resume</h2>
            </div>
            <p className="small text-muted mb-3">Upload your PDF/TXT resume or paste your resume text below.</p>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Upload PDF / TXT Document</label>
              <div className="d-flex gap-2">
                <input
                  className="form-control"
                  type="file"
                  accept="application/pdf,text/plain,.pdf,.txt"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
                <button
                  className="btn btn-outline-dark px-3 text-nowrap"
                  type="button"
                  onClick={handleResumeUpload}
                  disabled={!resumeFile || uploading}
                >
                  {uploading ? "Scanning..." : "Upload & Parse"}
                </button>
              </div>
              {resumeFile && <small className="text-muted d-block mt-1">Selected: {resumeFile.name}</small>}
            </div>

            <div className="mt-2">
              <label className="form-label small fw-semibold">Or Paste Resume Text</label>
              <textarea
                className="form-control font-monospace small"
                rows="5"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste experience, skills, education, and project details here..."
              />
              <button
                className="btn btn-sm btn-outline-secondary mt-2 d-flex align-items-center gap-1"
                type="button"
                onClick={handlePastedResume}
                disabled={pasting || !resumeText.trim()}
              >
                <ClipboardPaste size={14} />
                {pasting ? "Parsing..." : "Use Pasted Text"}
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Job Description Input */}
        <div className="col-lg-6">
          <div className="card h-100 border shadow-sm p-4 d-flex flex-column">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary text-white rounded-circle p-2">2</span>
              <h2 className="h5 fw-bold mb-0">Target Job Description</h2>
            </div>
            <p className="small text-muted mb-3">Paste the job description below to calculate your ATS match score and discover skill gaps.</p>

            <div className="mb-3 flex-grow-1">
              <label className="form-label small fw-semibold">Paste Job Description</label>
              <textarea
                className="form-control small"
                style={{ minHeight: "185px" }}
                rows="8"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste role responsibilities, required qualifications, technical skills, and tools here..."
              />
            </div>

            <div className="mt-auto pt-2">
              <button
                className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing || !jobDescription.trim()}
              >
                {analyzing ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" />
                    Running ATS Engine & Gap Analysis...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze Resume & ATS Score
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ATS Output Section */}
      {analysis && (
        <section className="card border shadow-sm p-4 mb-4 bg-white">
          <div className="d-flex flex-wrap justify-content-between align-items-start border-bottom pb-3 mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-dark text-white px-2 py-1">ATS ANALYSIS REPORT</span>
                <span className="badge bg-success bg-opacity-10 text-success border border-success">
                  {analysis.matchLevel || "Evaluated"}
                </span>
              </div>
              <h2 className="h4 fw-bold mb-0">ATS Compatibility & Skill Gap Analysis</h2>
              <small className="text-muted">
                Analyzed on {new Date(analysis.analyzedAt || Date.now()).toLocaleDateString()}
              </small>
            </div>

            <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
              {/* Overall Score Dial */}
              <div
                className="d-flex flex-column align-items-center justify-content-center border rounded-circle"
                style={{
                  width: "90px",
                  height: "90px",
                  borderWidth: "4px !important",
                  borderColor: scoreColor(analysis.score || analysis.overallScore) + " !important",
                  backgroundColor: "#fcfcfd",
                }}
              >
                <span className="h3 fw-bold mb-0" style={{ color: scoreColor(analysis.score || analysis.overallScore) }}>
                  {Math.round(analysis.score || analysis.overallScore || 0)}
                </span>
                <span className="small text-muted" style={{ fontSize: "11px" }}>/ 100</span>
              </div>

              <button
                className="btn btn-sm btn-outline-secondary rounded-circle"
                type="button"
                onClick={handleClearAnalysis}
                title="Clear analysis"
                style={{ width: "32px", height: "32px", padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Categorical Breakdown */}
          {analysis.breakdown && (
            <div className="mb-4">
              <h3 className="h6 fw-bold text-uppercase text-secondary mb-3">Categorical ATS Breakdown</h3>
              <div className="row g-3">
                {[
                  { key: "skillsMatch", label: "Skills Match", value: analysis.breakdown.skillsMatch },
                  { key: "experienceMatch", label: "Experience Match", value: analysis.breakdown.experienceMatch },
                  { key: "educationMatch", label: "Education Match", value: analysis.breakdown.educationMatch },
                  { key: "keywordsMatch", label: "Keywords Match", value: analysis.breakdown.keywordsMatch },
                  { key: "projectsMatch", label: "Projects Match", value: analysis.breakdown.projectsMatch },
                ].map((item) => (
                  <div className="col-md" key={item.key}>
                    <div className="border rounded p-3 bg-light h-100">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-semibold">{item.label}</span>
                        <span className="fw-bold" style={{ color: scoreColor(item.value) }}>
                          {item.value}%
                        </span>
                      </div>
                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: scoreColor(item.value),
                          }}
                        />
                      </div>
                      <div className="small text-muted mt-2 d-flex align-items-center gap-1">
                        {item.value >= 75 ? (
                          <CheckCircle2 size={13} className="text-success" />
                        ) : (
                          <AlertTriangle size={13} className="text-warning" />
                        )}
                        <span>{item.value >= 75 ? "Strong match" : "Room to improve"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Match & Missing Keywords */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CheckCircle2 size={18} className="text-success" />
                  <h4 className="h6 fw-bold text-success mb-0">
                    Matched Keywords ({analysis.matchedKeywords?.length || 0})
                  </h4>
                </div>
                <p className="small text-muted mb-2">Found in both your resume and the target job description:</p>
                <div className="d-flex flex-wrap gap-2">
                  {analysis.matchedKeywords?.length > 0 ? (
                    analysis.matchedKeywords.map((kw) => (
                      <span key={kw} className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1">
                        ✓ {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted small">No direct keyword overlap identified.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <AlertTriangle size={18} className="text-warning" />
                  <h4 className="h6 fw-bold text-dark mb-0">
                    Missing Keywords ({analysis.missingKeywords?.length || 0})
                  </h4>
                </div>
                <p className="small text-muted mb-2">Crucial skills and keywords required by JD that are missing from your resume:</p>
                <div className="d-flex flex-wrap gap-2">
                  {analysis.missingKeywords?.length > 0 ? (
                    analysis.missingKeywords.map((kw) => (
                      <span key={kw} className="badge bg-warning bg-opacity-10 text-dark border border-warning px-2 py-1">
                        • {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-success small">No missing keywords found! Great job.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Changes */}
          {analysis.recommendedChanges?.length > 0 && (
            <div className="mb-4">
              <h3 className="h6 fw-bold text-uppercase text-secondary mb-3">Recommended Changes</h3>
              <div className="list-group">
                {analysis.recommendedChanges.map((change, idx) => (
                  <div className="list-group-item d-flex align-items-start gap-3 p-3" key={idx}>
                    <span
                      className={`badge mt-1 ${
                        change.type === "Add"
                          ? "bg-primary"
                          : change.type === "Rewrite"
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {change.type || "Update"}
                    </span>
                    <div className="flex-grow-1">
                      <span className="text-dark">{change.text || change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gap Analysis Summary */}
          {analysis.gapAnalysis && (
            <div className="border rounded p-3 mb-4 bg-light">
              <h3 className="h6 fw-bold text-dark mb-2">Executive Gap Analysis</h3>
              <p className="small text-secondary mb-3">{analysis.gapAnalysis.summary}</p>
              <div className="row g-3">
                {analysis.gapAnalysis.strengths?.length > 0 && (
                  <div className="col-md-6">
                    <strong className="small text-success d-block mb-1">Key Strengths:</strong>
                    <ul className="small text-secondary mb-0 ps-3">
                      {analysis.gapAnalysis.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.gapAnalysis.criticalGaps?.length > 0 && (
                  <div className="col-md-6">
                    <strong className="small text-danger d-block mb-1">Critical Skill Gaps:</strong>
                    <ul className="small text-secondary mb-0 ps-3">
                      {analysis.gapAnalysis.criticalGaps.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Row: Generate Optimized Resume */}
          <div className="d-flex flex-wrap align-items-center justify-content-between p-3 border rounded bg-light">
            <div>
              <h4 className="h6 fw-bold mb-1">Generate an ATS-Optimized Resume</h4>
              <p className="small text-muted mb-0">
                Use AI to rewrite bullet points with action verbs, integrate missing keywords naturally, and produce a high-scoring resume.
              </p>
            </div>
            <button
              className="btn btn-success d-flex align-items-center gap-2 mt-2 mt-md-0 px-4 py-2 fw-semibold"
              type="button"
              onClick={handleGenerateOptimized}
              disabled={generatingOptimized}
            >
              {generatingOptimized ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Generating Tailored Resume...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Optimized Resume
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* Optimized Resume Modal / Section */}
      {showOptimizedModal && optimizedResume && (
        <section className="card border-success shadow mb-4">
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center py-3">
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={18} />
              <h3 className="h6 fw-bold mb-0">Generated ATS-Optimized Resume</h3>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-light d-flex align-items-center gap-1"
                type="button"
                onClick={handleCopyResume}
              >
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button
                className="btn btn-sm btn-light d-flex align-items-center gap-1"
                type="button"
                onClick={handleDownloadResume}
              >
                <Download size={14} />
                Download (.md)
              </button>
              <button
                className="btn btn-sm btn-outline-light rounded-circle"
                type="button"
                onClick={() => setShowOptimizedModal(false)}
                style={{ width: "28px", height: "28px", padding: 0 }}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="card-body p-4 bg-light">
            <div className="p-3 bg-white border rounded font-monospace small" style={{ whiteSpace: "pre-wrap", maxHeight: "600px", overflowY: "auto" }}>
              {optimizedResume}
            </div>
          </div>
        </section>
      )}

      {/* Profile Foundation & Preview Form */}
      <div className="row g-4">
        <div className="col-lg-7">
          <form className="card border shadow-sm p-4" onSubmit={handleSave}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0">Profile Foundation</h2>
              <span className="badge bg-light text-dark border">Editable Profile Data</span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">College / University</label>
                <input className="form-control" name="college" value={form.college} onChange={handleChange} placeholder="Your university or college" />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Degree & Major</label>
                <input className="form-control" name="degree" value={form.degree} onChange={handleChange} placeholder="B.Tech Computer Science" />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Graduation Year</label>
                <input className="form-control" name="graduationYear" value={form.graduationYear} onChange={handleChange} inputMode="numeric" placeholder="2026" />
              </div>
              <div className="col-md-8">
                <label className="form-label small fw-semibold">Target Roles (comma-separated)</label>
                <input className="form-control" name="preferredRoles" value={form.preferredRoles} onChange={handleChange} placeholder="Software Engineer, Full Stack Developer" />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">
                  Technical Skills <span className="text-muted fw-normal">(comma-separated)</span>
                </label>
                <input className="form-control" name="skills" value={form.skills} onChange={handleChange} placeholder="Java, Python, React, Node.js, SQL, MongoDB" />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Preferred Locations</label>
                <input className="form-control" name="preferredLocations" value={form.preferredLocations} onChange={handleChange} placeholder="Bangalore, Hyderabad, Remote" />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">GitHub URL</label>
                <input className="form-control" name="github" value={form.github} onChange={handleChange} placeholder="github.com/..." />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">LinkedIn URL</label>
                <input className="form-control" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/..." />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Portfolio URL</label>
                <input className="form-control" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="portfolio.dev" />
              </div>
            </div>
            <div className="mt-4">
              <button className="btn btn-primary px-4" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        <div className="col-lg-5">
          <aside className="card border shadow-sm p-4 mb-4">
            <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
              <div>
                <h2 className="h5 fw-bold mb-1">{user?.name || "Candidate Name"}</h2>
                <div className="small text-muted">{user?.email || "candidate@email.com"}</div>
              </div>
              <span className="badge bg-light text-secondary border">Profile Preview</span>
            </div>
            <div className="small text-secondary mb-3">
              {form.degree || "Degree"}{form.college ? ` · ${form.college}` : ""}{form.graduationYear ? ` · ${form.graduationYear}` : ""}
            </div>
            <h3 className="h6 fw-semibold text-dark mb-1">Target Roles</h3>
            <p className="small text-muted mb-3">{form.preferredRoles || "Add target roles to help match relevant jobs."}</p>
            <h3 className="h6 fw-semibold text-dark mb-1">Core Skills</h3>
            <div className="d-flex flex-wrap gap-1 mb-3">
              {splitValues(form.skills).length > 0 ? (
                splitValues(form.skills).map((skill) => (
                  <span className="badge bg-light text-dark border" key={skill}>{skill}</span>
                ))
              ) : (
                <span className="small text-muted">No skills added yet.</span>
              )}
            </div>
            <h3 className="h6 fw-semibold text-dark mb-1">Links</h3>
            <p className="small text-muted mb-0">
              {[form.github, form.linkedin, form.portfolio].filter(Boolean).join(" · ") || "Add GitHub, LinkedIn, or portfolio."}
            </p>
          </aside>

          <aside className="card border shadow-sm p-4">
            <h2 className="h6 fw-bold mb-3">Readiness Checklist</h2>
            {readiness.checks.map((check) => (
              <div className="d-flex align-items-center justify-content-between py-1 border-bottom" key={check.label}>
                <span className="small">{check.label}</span>
                {check.complete ? (
                  <span className="badge bg-success bg-opacity-10 text-success">✓ Complete</span>
                ) : (
                  <span className="badge bg-secondary bg-opacity-10 text-muted">Incomplete</span>
                )}
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ResumeStudio;
