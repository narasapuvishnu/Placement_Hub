import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  RefreshCw,
  Send,
  HelpCircle,
  FileCheck,
  RotateCcw,
  Edit3,
  Check
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const availableRoles = [
  "Full Stack Developer",
  "Software Developer",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "QA/Testing",
  "Data Analyst",
  "Digital Specialist",
  "Graduate Engineer",
];

const availableTopics = [
  "DSA",
  "Java",
  "JavaScript",
  "React",
  "Node.js",
  "SQL",
  "DBMS",
  "OOP",
  "OS",
  "Computer Networks",
  "System Design",
  "HR",
];

const roleTopicDefaults = {
  "Full Stack Developer": ["JavaScript", "React", "Node.js", "SQL", "System Design"],
  "Software Developer": ["DSA", "Java", "OOP", "DBMS", "OS"],
  "Software Engineer": ["DSA", "OOP", "Computer Networks", "DBMS", "System Design"],
  "Frontend Developer": ["JavaScript", "React", "HTML", "CSS", "Computer Networks"],
  "Backend Developer": ["Node.js", "Java", "SQL", "DBMS", "System Design"],
  "QA/Testing": ["Java", "SQL", "OOP", "HR"],
  "Data Analyst": ["SQL", "DBMS", "DSA", "HR"],
  "Digital Specialist": ["DSA", "OOP", "DBMS", "Computer Networks"],
  "Graduate Engineer": ["DSA", "OOP", "DBMS", "OS", "HR"],
};

const MockInterview = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Setup state
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  const [selectedExperience, setSelectedExperience] = useState("Fresher");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [selectedTopics, setSelectedTopics] = useState(roleTopicDefaults["Full Stack Developer"]);

  // Session state: "setup" | "interview" | "scorecard"
  const [viewState, setViewState] = useState("setup");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [error, setError] = useState("");

  // Active interview state
  const [interview, setInterview] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [lastEvaluation, setLastEvaluation] = useState(null);

  // Voice recording & Speech recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [autoReadQuestion, setAutoReadQuestion] = useState(true);
  const [micSupported, setMicSupported] = useState(true);
  const [allowManualEdit, setAllowManualEdit] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // History state
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Scorecard state
  const [scorecard, setScorecard] = useState(null);
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  useEffect(() => {
    fetchHistory();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicSupported(false);
    }
  }, []);

  // Automatically speak question when view enters interview mode or question index advances
  useEffect(() => {
    if (viewState === "interview" && interview?.questions?.[currentIdx] && autoReadQuestion) {
      speakQuestion(interview.questions[currentIdx].question);
    }
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [viewState, currentIdx, interview]);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startVoiceRecording = () => {
    setError("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please use Chrome/Edge or enable manual editing.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setError("Microphone permission was denied. Please allow microphone access in your browser settings.");
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const clearVoiceAnswer = () => {
    stopVoiceRecording();
    setUserAnswer("");
  };

  const speakQuestion = (text) => {
    if ("speechSynthesis" in window) {
      if (isSpeakingQuestion) {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      setIsSpeakingQuestion(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingHistory(true);
    try {
      const res = await axios.get("/api/mock-interviews/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setHistory(res.data.interviews || []);
      }
    } catch (err) {
      console.warn("Failed to load interview history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (roleTopicDefaults[role]) {
      setSelectedTopics(roleTopicDefaults[role]);
    }
  };

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleStartInterview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (selectedTopics.length === 0) {
      setError("Please select at least one topic.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "/api/mock-interviews/start",
        {
          role: selectedRole,
          experience: selectedExperience,
          duration: selectedDuration,
          topics: selectedTopics,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.interview) {
        setInterview(res.data.interview);
        setCurrentIdx(0);
        setUserAnswer("");
        setLastEvaluation(null);
        setViewState("interview");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start interview session.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    stopVoiceRecording();
    if (!userAnswer.trim()) {
      setError("Please speak your response using the microphone before submitting.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || !interview) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        `/api/mock-interviews/${interview._id}/answer`,
        {
          questionIndex: currentIdx,
          userAnswer: userAnswer.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setLastEvaluation(res.data.updatedQuestion);
        const updatedQuestions = [...interview.questions];
        updatedQuestions[currentIdx] = res.data.updatedQuestion;
        setInterview({ ...interview, questions: updatedQuestions });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to evaluate answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    stopVoiceRecording();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeakingQuestion(false);
    if (currentIdx < interview.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserAnswer("");
      setLastEvaluation(null);
    } else {
      handleFinishInterview();
    }
  };

  const handleFinishInterview = async () => {
    stopVoiceRecording();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeakingQuestion(false);

    const token = localStorage.getItem("token");
    if (!token || !interview) return;

    setFinalizing(true);
    setError("");
    try {
      const res = await axios.post(
        `/api/mock-interviews/${interview._id}/finish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setScorecard(res.data.result);
        setInterview(res.data.interview);
        setViewState("scorecard");
        fetchHistory();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to finalize scorecard.");
    } finally {
      setFinalizing(false);
    }
  };

  const handleReviewPastInterview = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/mock-interviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.interview) {
        setInterview(res.data.interview);
        setScorecard(res.data.interview.result);
        setViewState("scorecard");
      }
    } catch (err) {
      setError("Could not load past interview details.");
    } finally {
      setLoading(false);
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3 fw-bold mb-2">AI Voice Mock Interviews</h1>
        <p className="text-muted mb-4">Practice realistic spoken technical, behavioral, and system design interviews tailored to your target role.</p>
        <Link to="/login" className="btn btn-primary rounded-pill px-4">Sign in to start</Link>
      </div>
    );
  }

  const scoreDialColor = (score) => {
    if (score >= 75) return "#198754";
    if (score >= 60) return "#0d6efd";
    if (score >= 45) return "#ffc107";
    return "#dc3545";
  };

  return (
    <div className="mock-interview-container container py-4 py-lg-5">
      {/* View 1: Setup Screen */}
      {viewState === "setup" && (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border shadow-sm p-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-primary text-white rounded-circle p-2">
                  <Mic size={16} />
                </span>
                <h1 className="h4 fw-bold mb-0">Configure Voice Mock Interview</h1>
              </div>
              <p className="text-muted small mb-4">
                Select your target career role, experience level, interview duration, and focus topics. Use your microphone to speak your responses just like a real interview.
              </p>

              {error && <div className="alert alert-danger">{error}</div>}

              {/* Dimension 1: Role */}
              <div className="mb-4">
                <label className="form-label small fw-semibold">Choose Role</label>
                <select
                  className="form-select"
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Parameters: Experience & Duration */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Experience Level</label>
                  <select
                    className="form-select"
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                  >
                    <option value="Fresher">Fresher (Campus / Entry-level)</option>
                    <option value="1-2 years">1-2 years (Junior)</option>
                    <option value="3+ years">3+ years (Mid-Senior)</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Interview Duration</label>
                  <select
                    className="form-select"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  >
                    <option value={15}>15 minutes (Quick Screen - 3 Questions)</option>
                    <option value={30}>30 minutes (Standard Technical - 5 Questions)</option>
                    <option value={45}>45 minutes (In-Depth Technical - 7 Questions)</option>
                  </select>
                </div>
              </div>

              {/* Dimension 2: Topics */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-semibold mb-0">Select Topics</label>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none p-0 small"
                    onClick={() => {
                      if (roleTopicDefaults[selectedRole]) {
                        setSelectedTopics(roleTopicDefaults[selectedRole]);
                      }
                    }}
                  >
                    Reset to recommended for {selectedRole}
                  </button>
                </div>
                <div className="row g-2">
                  {availableTopics.map((topic) => {
                    const isChecked = selectedTopics.includes(topic);
                    return (
                      <div className="col-6 col-sm-4 col-md-3" key={topic}>
                        <div
                          onClick={() => toggleTopic(topic)}
                          className={`border rounded p-2 text-center small fw-semibold user-select-none ${
                            isChecked
                              ? "bg-primary text-white border-primary"
                              : "bg-light text-dark hover-border"
                          }`}
                          style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                        >
                          {isChecked ? "☑ " : "☐ "} {topic}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <small className="text-muted d-block mt-2">
                  {selectedTopics.length} topic{selectedTopics.length === 1 ? "" : "s"} selected
                </small>
              </div>

              {/* Start Interview Action */}
              <button
                className="btn btn-primary py-2 px-4 d-flex align-items-center justify-content-center gap-2 fw-semibold w-100"
                type="button"
                onClick={handleStartInterview}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" />
                    Generating Questions Tailored for {selectedRole}...
                  </>
                ) : (
                  <>
                    <Mic size={18} />
                    Start Voice Interview
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Past History Sidebar */}
          <div className="col-lg-4">
            <div className="card border shadow-sm p-4 h-100">
              <h2 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
                <Award size={18} className="text-primary" />
                Your Past Mock Interviews
              </h2>

              {loadingHistory ? (
                <div className="text-center py-4 text-muted small">Loading past attempts...</div>
              ) : history.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  No mock interviews completed yet. Start your first session to track performance and get AI feedback.
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {history.map((item) => (
                    <div
                      key={item._id}
                      className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong className="d-block small text-dark">{item.role}</strong>
                        <span className="text-muted" style={{ fontSize: "11px" }}>
                          {new Date(item.createdAt).toLocaleDateString()} · {item.duration}m · {item.status}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {item.result?.overallScore !== null && item.result?.overallScore !== undefined ? (
                          <span
                            className="badge fw-bold"
                            style={{
                              backgroundColor: scoreDialColor(item.result.overallScore) + "20",
                              color: scoreDialColor(item.result.overallScore),
                              border: `1px solid ${scoreDialColor(item.result.overallScore)}`,
                            }}
                          >
                            {item.result.overallScore}%
                          </span>
                        ) : null}
                        <button
                          className="btn btn-sm btn-outline-secondary p-1 px-2"
                          onClick={() => handleReviewPastInterview(item._id)}
                          title="View scorecard"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View 2: Active Voice Interview Screen */}
      {viewState === "interview" && interview && (
        <div className="card border shadow-sm p-4">
          {/* Header Bar */}
          <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-primary">{interview.role}</span>
                <span className="badge bg-light text-dark border">{interview.experience}</span>
                <span className="badge bg-light text-dark border">
                  Question {currentIdx + 1} of {interview.questions.length}
                </span>
              </div>
              <h2 className="h5 fw-bold mb-0 d-flex align-items-center gap-2">
                <Mic size={18} className="text-primary" />
                Live Voice Mock Interview
              </h2>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
              <span className="badge bg-dark bg-opacity-10 text-dark border px-3 py-2">
                <Clock size={14} className="me-1" />
                {interview.duration} Min Session
              </span>
              <button
                className="btn btn-sm btn-outline-danger"
                type="button"
                onClick={() => {
                  stopVoiceRecording();
                  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                  setViewState("setup");
                }}
              >
                Quit Interview
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress mb-4" style={{ height: "6px" }}>
            <div
              className="progress-bar bg-primary"
              style={{
                width: `${((currentIdx + 1) / interview.questions.length) * 100}%`,
              }}
            />
          </div>

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          {/* Current Question with Speaker Option */}
          {interview.questions[currentIdx] && (
            <div className="border rounded p-4 mb-4 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-secondary">
                  Topic: {interview.questions[currentIdx].topic}
                </span>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-secondary border">
                    Difficulty: {interview.questions[currentIdx].difficulty}
                  </span>
                  <button
                    className={`btn btn-sm ${isSpeakingQuestion ? "btn-danger" : "btn-outline-dark"} d-flex align-items-center gap-1 py-1 px-2`}
                    type="button"
                    onClick={() => speakQuestion(interview.questions[currentIdx].question)}
                    title="Listen to question"
                  >
                    {isSpeakingQuestion ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span style={{ fontSize: "12px" }}>{isSpeakingQuestion ? "Stop Audio" : "Listen to Question"}</span>
                  </button>
                </div>
              </div>
              <h3 className="h5 fw-semibold text-dark mb-3">
                {interview.questions[currentIdx].question}
              </h3>
              <p className="small text-muted mb-0">
                💡 Tip: Speak clearly into your microphone. Elaborate on core concepts, provide practical examples, and address architectural trade-offs.
              </p>
            </div>
          )}

          {/* Spoken Microphone Conversational Studio */}
          <div className="mb-4">
            {!lastEvaluation ? (
              <div className="card border p-4 bg-white text-center shadow-sm">
                <div className="d-flex flex-column align-items-center justify-content-center py-3">
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`btn rounded-circle d-flex align-items-center justify-content-center shadow ${
                      isRecording ? "btn-danger" : "btn-primary"
                    }`}
                    style={{
                      width: "96px",
                      height: "96px",
                      transition: "all 0.25s ease-in-out",
                      boxShadow: isRecording
                        ? "0 0 0 16px rgba(220, 53, 69, 0.25)"
                        : "0 6px 20px rgba(13, 110, 253, 0.35)",
                    }}
                    title={isRecording ? "Click when finished speaking" : "Click to speak your answer"}
                  >
                    {isRecording ? <Square size={36} /> : <Mic size={42} />}
                  </button>

                  <div className="mt-3">
                    {isRecording ? (
                      <div className="d-flex flex-column align-items-center">
                        <span className="badge bg-danger px-3 py-2 fs-6 mb-2 d-inline-flex align-items-center gap-2">
                          <span className="spinner-grow spinner-grow-sm" role="status" />
                          Listening: {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:
                          {String(recordingSeconds % 60).padStart(2, "0")}
                        </span>
                        <h4 className="h6 text-danger fw-bold mb-1">
                          Speak your answer now into the mic
                        </h4>
                        <small className="text-muted">
                          Tap the red button when you are done. The AI will directly evaluate your response!
                        </small>
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-center">
                        <h4 className="h6 fw-bold text-dark mb-1">
                          {userAnswer.trim() ? "Answer captured. Tap to re-record or submit below." : "Tap the Mic & Speak Your Answer"}
                        </h4>
                        <small className="text-muted">
                          Natural oral communication — speak your thoughts freely without typing
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Real-time live transcript bubble */}
                {userAnswer.trim() && (
                  <div className="mt-3 p-3 rounded text-start bg-light border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small fw-bold text-primary">🗣️ Your Spoken Words:</span>
                      {!isRecording && (
                        <button
                          className="btn btn-sm btn-link text-danger text-decoration-none p-0 small"
                          type="button"
                          onClick={clearVoiceAnswer}
                        >
                          <RotateCcw size={12} className="me-1" />
                          Clear & Re-record
                        </button>
                      )}
                    </div>
                    <p className="mb-0 text-dark small" style={{ fontStyle: "italic", lineHeight: "1.6" }}>
                      "{userAnswer}"
                    </p>
                  </div>
                )}

                {/* Direct submission button when finished */}
                {userAnswer.trim() && !isRecording && (
                  <div className="mt-4">
                    <button
                      className="btn btn-primary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                      type="button"
                      onClick={() => handleSubmitAnswer()}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" />
                          AI is analyzing your spoken answer...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Send to AI for Direct Evaluation
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Conversational Spoken Answer & AI Evaluation Flow */}
          {lastEvaluation && (
            <div className="mb-4">
              {/* Candidate's Spoken Speech Bubble */}
              <div className="card border-0 bg-light p-3 mb-3 border-start border-primary border-4">
                <span className="small fw-bold text-secondary text-uppercase d-block mb-1">
                  🗣️ Your Spoken Answer
                </span>
                <p className="text-dark mb-0 small" style={{ fontStyle: "italic", lineHeight: "1.6" }}>
                  "{lastEvaluation.userAnswer}"
                </p>
              </div>

              {/* AI Direct Feedback Card */}
              <div className="card border-primary border-opacity-25 bg-white p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Sparkles size={18} className="text-primary" />
                    <strong className="text-dark">AI Interviewer Evaluation</strong>
                  </div>
                  <span
                    className="badge px-3 py-2"
                    style={{
                      backgroundColor: scoreDialColor(lastEvaluation.score * 10) + "20",
                      color: scoreDialColor(lastEvaluation.score * 10),
                      fontSize: "14px",
                    }}
                  >
                    Score: {lastEvaluation.score} / 10
                  </span>
                </div>

                <p className="text-dark small mb-3" style={{ lineHeight: "1.6" }}>{lastEvaluation.feedback}</p>

                <div className="row g-3">
                  {lastEvaluation.strengths?.length > 0 && (
                    <div className="col-md-6">
                      <strong className="small text-success d-block mb-1">
                        ✓ What you explained well:
                      </strong>
                      <ul className="small text-secondary mb-0 ps-3">
                        {lastEvaluation.strengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {lastEvaluation.improvements?.length > 0 && (
                    <div className="col-md-6">
                      <strong className="small text-warning text-dark d-block mb-1">
                        ⚠ Points to improve:
                      </strong>
                      <ul className="small text-secondary mb-0 ps-3">
                        {lastEvaluation.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="d-flex justify-content-between align-items-center pt-2 border-top">
            <span className="small text-muted">
              {currentIdx + 1} of {interview.questions.length} Questions
            </span>
            <div className="d-flex gap-2">
              {!lastEvaluation ? (
                <button
                  className="btn btn-primary d-flex align-items-center gap-2 px-4"
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={submitting || !userAnswer.trim()}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" />
                      Evaluating with AI...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Spoken Answer
                    </>
                  )}
                </button>
              ) : currentIdx < interview.questions.length - 1 ? (
                <button
                  className="btn btn-success d-flex align-items-center gap-2 px-4"
                  type="button"
                  onClick={handleNextQuestion}
                >
                  Next Question
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  className="btn btn-success d-flex align-items-center gap-2 px-4"
                  type="button"
                  onClick={handleFinishInterview}
                  disabled={finalizing}
                >
                  {finalizing ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" />
                      Finalizing Scorecard...
                    </>
                  ) : (
                    <>
                      <FileCheck size={16} />
                      Finish Interview & View Scorecard
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View 3: Scorecard & Results Screen */}
      {viewState === "scorecard" && scorecard && (
        <div className="card border shadow-sm p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-dark text-white px-2 py-1">OFFICIAL SCORECARD</span>
                <span className="badge bg-primary">{interview?.role}</span>
                <span className="badge bg-light text-dark border">{interview?.experience}</span>
              </div>
              <h2 className="h4 fw-bold mb-0">Interview Performance Summary</h2>
            </div>
            <button
              className="btn btn-outline-primary btn-sm rounded-pill px-3 mt-2 mt-md-0"
              type="button"
              onClick={() => {
                setViewState("setup");
                setInterview(null);
                setScorecard(null);
              }}
            >
              Start New Mock Interview
            </button>
          </div>

          {/* Top Score Matrix */}
          <div className="row g-4 mb-4 align-items-center">
            {/* Overall Score Dial */}
            <div className="col-md-3 text-center border-end">
              <span className="small text-muted fw-semibold text-uppercase d-block mb-2">Overall Score</span>
              <div
                className="d-inline-flex flex-column align-items-center justify-content-center border rounded-circle shadow-sm"
                style={{
                  width: "120px",
                  height: "120px",
                  borderColor: scoreDialColor(scorecard.overallScore) + " !important",
                  borderWidth: "5px !important",
                  backgroundColor: "#ffffff",
                }}
              >
                <span className="h2 fw-bold mb-0" style={{ color: scoreDialColor(scorecard.overallScore) }}>
                  {scorecard.overallScore}%
                </span>
                <span className="small text-muted" style={{ fontSize: "11px" }}>Interview Score</span>
              </div>
            </div>

            {/* 4 Multi-dimensional sub-scores */}
            <div className="col-md-9">
              <div className="row g-3">
                {[
                  { label: "Technical", value: scorecard.technicalScore },
                  { label: "Communication", value: scorecard.communicationScore },
                  { label: "Problem Solving", value: scorecard.problemSolvingScore },
                  { label: "Confidence", value: scorecard.confidenceScore },
                ].map((item) => (
                  <div className="col-6 col-md-3" key={item.label}>
                    <div className="border rounded p-3 bg-light h-100">
                      <span className="small fw-semibold text-muted d-block mb-1">{item.label}</span>
                      <div className="h4 fw-bold mb-2" style={{ color: scoreDialColor(item.value) }}>
                        {item.value}%
                      </div>
                      <div className="progress" style={{ height: "5px" }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: scoreDialColor(item.value),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strong Areas & Needs Improvement */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CheckCircle2 size={18} className="text-success" />
                  <h3 className="h6 fw-bold text-success mb-0">Strong Areas</h3>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {scorecard.strongAreas?.length > 0 ? (
                    scorecard.strongAreas.map((area) => (
                      <span key={area} className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1">
                        ✓ {area}
                      </span>
                    ))
                  ) : (
                    <span className="small text-muted">Keep practicing to build your core strengths.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <AlertTriangle size={18} className="text-warning" />
                  <h3 className="h6 fw-bold text-dark mb-0">Needs Improvement</h3>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {scorecard.needsImprovement?.length > 0 ? (
                    scorecard.needsImprovement.map((area) => (
                      <span key={area} className="badge bg-warning bg-opacity-10 text-dark border border-warning px-2 py-1">
                        ⚠ {area}
                      </span>
                    ))
                  ) : (
                    <span className="small text-success">Excellent balance across all topics!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Feedback Coach Summary */}
          {scorecard.detailedFeedback && (
            <div className="border rounded p-4 mb-4 bg-light">
              <h3 className="h6 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                Coach's Detailed Assessment
              </h3>
              <p className="small text-secondary mb-0" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                {scorecard.detailedFeedback}
              </p>
            </div>
          )}

          {/* Question-by-Question Detailed Review Toggle */}
          <div className="border rounded p-3">
            <button
              className="btn btn-sm btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
              type="button"
              onClick={() => setShowDetailedReview(!showDetailedReview)}
            >
              <span className="fw-semibold">
                {showDetailedReview ? "Hide" : "View"} Detailed Question-by-Question Feedback ({interview?.questions?.length || 0})
              </span>
              <span>{showDetailedReview ? "▲" : "▼"}</span>
            </button>

            {showDetailedReview && interview?.questions && (
              <div className="mt-3">
                {interview.questions.map((q, idx) => (
                  <div className="card border mb-3 p-3 bg-white" key={idx}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-light text-dark border">
                        Question {idx + 1} · {q.topic}
                      </span>
                      {q.score !== null && (
                        <span
                          className="badge"
                          style={{
                            backgroundColor: scoreDialColor(q.score * 10) + "20",
                            color: scoreDialColor(q.score * 10),
                          }}
                        >
                          Score: {q.score} / 10
                        </span>
                      )}
                    </div>
                    <strong className="d-block small text-dark mb-2">{q.question}</strong>
                    <div className="small text-muted p-2 rounded bg-light mb-2">
                      <strong>Your Spoken Response:</strong> {q.userAnswer || "No spoken answer recorded."}
                    </div>
                    {q.feedback && (
                      <div className="small text-secondary">
                        <strong>Feedback:</strong> {q.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
