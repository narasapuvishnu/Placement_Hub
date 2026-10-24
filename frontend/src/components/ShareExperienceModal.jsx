import React, { useState } from "react";
import axios from "axios";

const ShareExperienceModal = ({ isOpen, onClose, onExperienceSubmitted }) => {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    title: "",
    outcome: "Offered",
    batchYear: new Date().getFullYear(),
    jobType: "Full-Time",
    overallDifficulty: "Medium",
    salaryDetails: "",
    location: "Bangalore, India",
    summary: "",
    tags: "",
  });

  const [rounds, setRounds] = useState([
    { roundName: "Round 1: Online Assessment", roundType: "Online Assessment", description: "", questionsAsked: "", tips: "" },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoundChange = (index, field, value) => {
    const updated = [...rounds];
    updated[index][field] = value;
    setRounds(updated);
  };

  const addRound = () => {
    setRounds([
      ...rounds,
      { roundName: `Round ${rounds.length + 1}: Technical`, roundType: "Technical Coding", description: "", questionsAsked: "", tips: "" },
    ]);
  };

  const removeRound = (index) => {
    if (rounds.length === 1) return;
    setRounds(rounds.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Please log in to submit your interview experience.");
      return;
    }

    try {
      setSubmitting(true);
      const parsedRounds = rounds.map((r) => ({
        ...r,
        questionsAsked: typeof r.questionsAsked === "string"
          ? r.questionsAsked.split("\n").filter((q) => q.trim() !== "")
          : r.questionsAsked,
      }));

      const parsedTags = typeof formData.tags === "string"
        ? formData.tags.split(",").map((t) => t.trim()).filter((t) => t !== "")
        : [];

      const payload = {
        ...formData,
        rounds: parsedRounds,
        tags: parsedTags,
      };

      const res = await axios.post("/api/experiences", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        onExperienceSubmitted(res.data.experience);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || "Failed to submit interview experience.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal fade show d-block bg-dark bg-opacity-75" tabIndex="-1" style={{ zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-primary text-white p-4">
            <div>
              <h5 className="modal-title fw-bold mb-0">✍️ Share Your Interview Experience</h5>
              <p className="small mb-0 text-white-50">Help your peers by documenting your hiring journey</p>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {errorMsg && <div className="alert alert-danger py-2 small">{errorMsg}</div>}

              {/* Title & Company info */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    className="form-control"
                    placeholder="e.g. Google, Amazon, TCS"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Role Title *</label>
                  <input
                    type="text"
                    name="role"
                    className="form-control"
                    placeholder="e.g. Software Engineer (SDE-1)"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Post Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. My Google SDE-1 Campus Placement Experience (2024)"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Outcome, Difficulty & Type */}
              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Interview Outcome</label>
                  <select name="outcome" className="form-select" value={formData.outcome} onChange={handleChange}>
                    <option value="Offered">Offered 🎉</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined Offer</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Overall Difficulty</label>
                  <select name="overallDifficulty" className="form-select" value={formData.overallDifficulty} onChange={handleChange}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Very Hard">Very Hard</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Job Type</label>
                  <select name="jobType" className="form-select" value={formData.jobType} onChange={handleChange}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Co-Op">Co-Op</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Batch Year</label>
                  <input
                    type="number"
                    name="batchYear"
                    className="form-control"
                    value={formData.batchYear}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Salary / Compensation (Optional)</label>
                  <input
                    type="text"
                    name="salaryDetails"
                    className="form-control"
                    placeholder="e.g. ₹28 LPA Base + Stocks"
                    value={formData.salaryDetails}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Bangalore / Remote"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Overall Experience Summary *</label>
                <textarea
                  name="summary"
                  className="form-control"
                  rows="3"
                  placeholder="Summarize the timeline, overall feel, communication with recruiter, and key takeaways..."
                  value={formData.summary}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* Dynamic Rounds */}
              <div className="border-top pt-3 mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 text-dark">Interview Rounds ({rounds.length})</h6>
                  <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={addRound}>
                    + Add Round
                  </button>
                </div>

                {rounds.map((round, idx) => (
                  <div key={idx} className="bg-light p-3 rounded-3 border mb-3 position-relative">
                    {rounds.length > 1 && (
                      <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 m-2"
                        onClick={() => removeRound(idx)}
                        title="Remove round"
                      ></button>
                    )}

                    <div className="row g-2 mb-2">
                      <div className="col-md-7">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Round Name (e.g. Round 1: OA)"
                          value={round.roundName}
                          onChange={(e) => handleRoundChange(idx, "roundName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-5">
                        <select
                          className="form-select form-select-sm"
                          value={round.roundType}
                          onChange={(e) => handleRoundChange(idx, "roundType", e.target.value)}
                        >
                          <option value="Online Assessment">Online Assessment</option>
                          <option value="Technical Coding">Technical Coding</option>
                          <option value="System Design">System Design</option>
                          <option value="Behavioral / HR">Behavioral / HR</option>
                          <option value="Bar Raiser">Bar Raiser</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-2">
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        placeholder="Round Description (What happened, duration, topics covered...)"
                        value={round.description}
                        onChange={(e) => handleRoundChange(idx, "description", e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm font-monospace"
                        placeholder="Questions Asked (One per line if multiple)"
                        value={round.questionsAsked}
                        onChange={(e) => handleRoundChange(idx, "questionsAsked", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  className="form-control form-control-sm"
                  placeholder="e.g. Google, DP, Graphs, System Design"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer bg-light p-3 border-top">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={submitting}>
                {submitting ? "Posting..." : "Publish Experience"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareExperienceModal;
