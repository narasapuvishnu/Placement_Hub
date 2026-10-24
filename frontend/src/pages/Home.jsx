import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const initialCompanies = [
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    difficulty: "Very Hard",
    focus: "Graphs, DP, Dynamic Sliding Window, & Googliness.",
    salaryRange: "₹25 - 55 LPA",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    difficulty: "Hard",
    focus: "Trees, Heaps, OOD, & 16 Leadership Principles.",
    salaryRange: "₹20 - 45 LPA",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    difficulty: "Hard",
    focus: "Codility OA, Linked Lists, Matrix, & System Architecture.",
    salaryRange: "₹22 - 48 LPA",
  },
  {
    name: "Uber",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    difficulty: "Very Hard",
    focus: "Machine Coding, Geohash Indexing, & Concurrency Locks.",
    salaryRange: "₹30 - 65 LPA",
  },
  {
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    difficulty: "Very Hard",
    focus: "Rapid Bug-Free Coding, BFS/DFS, & 3B+ Scaled Systems.",
    salaryRange: "₹28 - 62 LPA",
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    difficulty: "Hard",
    focus: "Low-Level Memory, C++/Swift Internals, & Concurrency.",
    salaryRange: "₹24 - 52 LPA",
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    difficulty: "Very Hard",
    focus: "Distributed Caching, CDN Edge Routing, & Chaos Resilience.",
    salaryRange: "₹35 - 75 LPA",
  },
  {
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
    difficulty: "Medium",
    focus: "Geometry/Graphics Algorithms, OOD Canvas Design, & C++.",
    salaryRange: "₹18 - 38 LPA",
  },
];

const Home = () => {
  const [companies, setCompanies] = useState(initialCompanies);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/companies");
        if (res.data && res.data.length > 0) {
          // Merge API data with frontend display highlights
          const merged = initialCompanies.map((initComp) => {
            const found = res.data.find(
              (c) => c.name.toLowerCase() === initComp.name.toLowerCase()
            );
            return found
              ? { ...initComp, ...found, _id: found._id, focus: initComp.focus }
              : initComp;
          });
          setCompanies(merged);
        }
      } catch (err) {
        console.error("Could not fetch live companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  const getDifficultyBadgeClass = (diff) => {
    switch (diff) {
      case "Easy":
        return "bg-success-subtle text-success";
      case "Medium":
        return "bg-primary-subtle text-primary";
      case "Hard":
        return "bg-warning-subtle text-warning-emphasis";
      case "Very Hard":
        return "bg-danger-subtle text-danger";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  return (
    <div className="home-page w-100 overflow-hidden">
      {/* 1. Hero Section */}
      <section
        className="home-hero-section pt-3 pb-5 text-white position-relative"
        style={{
          background: "radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 100%)",
        }}
      >
        <div className="container pt-1 pb-4">
          <div className="row justify-content-center text-center">
            <div className="col-lg-11 col-xl-10">
              <span className="badge bg-primary bg-opacity-25 text-primary border border-primary px-3 py-1 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-2">
                <span>🚀</span> All-In-One Engineering Career Platform
              </span>

              <h1 className="home-hero-title fw-black mb-2" style={{ letterSpacing: "-0.5px", lineHeight: "1.12" }}>
                Prepare Smarter. Get Hired Faster.
              </h1>

              <p className="home-hero-description lead text-light mb-3 mx-auto" style={{ maxWidth: "760px", color: "#e2e8f0", lineHeight: "1.5" }}>
                Your complete placement preparation engine — practice coding, master company tracks, and unlock verified interview insights.
              </p>

              {/* 3 Distinct Feature Highlights (Unmerged & Structured) */}
              <div className="home-feature-grid row g-3 justify-content-center mb-4 text-start">
                <div className="col-md-4">
                  <div
                    className="home-feature-card p-3 rounded-4 h-100 border border-white border-opacity-15 shadow-sm transition-all"
                    style={{ background: "rgba(255, 255, 255, 0.06)", backdropFilter: "blur(10px)" }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="fs-5">🏢</span>
                      <h6 className="fw-bold text-white mb-0">Company Roadmaps</h6>
                    </div>
                    <p className="small mb-0 text-white-50" style={{ lineHeight: "1.5" }}>
                      Curated round-by-round interview guides & question banks for Google, Amazon, Microsoft, and Uber.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div
                    className="home-feature-card p-3 rounded-4 h-100 border border-white border-opacity-15 shadow-sm transition-all"
                    style={{ background: "rgba(255, 255, 255, 0.06)", backdropFilter: "blur(10px)" }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="fs-5">⚡</span>
                      <h6 className="fw-bold text-white mb-0">Polyglot Browser IDE</h6>
                    </div>
                    <p className="small mb-0 text-white-50" style={{ lineHeight: "1.5" }}>
                      Practice high-frequency DSA & SQL 50 problems across 9 programming languages with live schema inserts.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div
                    className="home-feature-card p-3 rounded-4 h-100 border border-white border-opacity-15 shadow-sm transition-all"
                    style={{ background: "rgba(255, 255, 255, 0.06)", backdropFilter: "blur(10px)" }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="fs-5">🗣️</span>
                      <h6 className="fw-bold text-white mb-0">Interview Stories</h6>
                    </div>
                    <p className="small mb-0 text-white-50" style={{ lineHeight: "1.5" }}>
                      Explore authentic candidate journeys, CTC offers, difficulty ratings, and round breakdowns.
                    </p>
                  </div>
                </div>
              </div>

              <div className="home-hero-actions d-flex justify-content-center flex-wrap gap-3 mb-5">
                <Link to="/practice" className="btn btn-primary btn-lg rounded-pill px-4 shadow-lg fw-bold d-flex align-items-center gap-2">
                  <span>⚡</span> Start Practice Hub
                </Link>
                <Link to="/mock-interview" className="btn btn-outline-info text-white btn-lg rounded-pill px-4 fw-bold shadow">
                  🎙️ AI Mock Interview
                </Link>
                <Link to="/companies" className="btn btn-outline-light btn-lg rounded-pill px-4 fw-semibold">
                  🏢 Company Roadmaps
                </Link>
                <Link to="/experiences" className="btn btn-warning text-dark btn-lg rounded-pill px-4 fw-bold shadow">
                  🗣️ Interview Stories
                </Link>
                <Link to="/jobs" className="btn btn-info text-dark btn-lg rounded-pill px-4 fw-bold shadow">
                  💼 Off-Campus Jobs
                </Link>
              </div>

              {/* Stats & Capability Highlights */}
              <div className="home-stats-grid row g-4 justify-content-center pt-4 border-top border-secondary border-opacity-25 text-white-50">
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                    <div className="fw-black text-white fs-3">500+</div>
                    <div className="small text-light">Curated Problems</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                    <div className="fw-black text-white fs-3">9 Langs</div>
                    <div className="small text-light">DSA Polyglot IDE</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                    <div className="fw-black text-white fs-3">5 Dialects</div>
                    <div className="small text-light">SQL 50 Support</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                    <div className="fw-black text-white fs-3">100%</div>
                    <div className="small text-light">Free Placement Prep</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Modules Grid Showcase */}
      <section className="home-modules-section py-5">
        <div className="container py-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">
              Everything You Need to Succeed
            </span>
            <h2 className="display-6 fw-bold text-dark mb-3">All-In-One Placement Engine</h2>
            <p className="text-muted lead">
              Structured preparation paths designed to bridge the gap between college curriculum and top product-based company interviews.
            </p>
          </div>

          <div className="row g-4">
            {/* Card 1: Practice Hub */}
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-light hover-shadow transition-all">
                <div className="rounded-3 bg-primary bg-opacity-10 text-primary p-3 d-inline-block mb-3" style={{ width: "fit-content" }}>
                  <span className="fs-3">⚡</span>
                </div>
                <h5 className="fw-bold text-dark mb-2">Practice Hub & IDE</h5>
                <p className="text-muted small mb-3">
                  In-browser polyglot compiler supporting 9 languages + 5 SQL Dialects with schema DDL templates.
                </p>
                <Link to="/practice" className="fw-bold text-primary text-decoration-none small mt-auto">
                  Explore Problems →
                </Link>
              </div>
            </div>

            {/* Card 2: Company Roadmaps */}
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-light hover-shadow transition-all">
                <div className="rounded-3 bg-success bg-opacity-10 text-success p-3 d-inline-block mb-3" style={{ width: "fit-content" }}>
                  <span className="fs-3">🏢</span>
                </div>
                <h5 className="fw-bold text-dark mb-2">Company Roadmaps</h5>
                <p className="text-muted small mb-3">
                  Round-by-round interview guides, salary benchmarks, and question banks for Google, Amazon, and Uber.
                </p>
                <Link to="/companies" className="fw-bold text-success text-decoration-none small mt-auto">
                  View Roadmaps →
                </Link>
              </div>
            </div>

            {/* Card 3: Interview Stories */}
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-light hover-shadow transition-all">
                <div className="rounded-3 bg-warning bg-opacity-10 text-warning-emphasis p-3 d-inline-block mb-3" style={{ width: "fit-content" }}>
                  <span className="fs-3">🗣️</span>
                </div>
                <h5 className="fw-bold text-dark mb-2">Interview Stories</h5>
                <p className="text-muted small mb-3">
                  Read authentic candidate interview journeys with CTC salary packages, questions asked, and upvotes.
                </p>
                <Link to="/experiences" className="fw-bold text-warning-emphasis text-decoration-none small mt-auto">
                  Read Stories →
                </Link>
              </div>
            </div>

            {/* Card 4: Jobs Portal */}
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-light hover-shadow transition-all">
                <div className="rounded-3 bg-info bg-opacity-10 text-info-emphasis p-3 d-inline-block mb-3" style={{ width: "fit-content" }}>
                  <span className="fs-3">💼</span>
                </div>
                <h5 className="fw-bold text-dark mb-2">Off-Campus Job Portal</h5>
                <p className="text-muted small mb-3">
                  Discover software engineering opportunities, apply with 1-click, and track application status live.
                </p>
                <Link to="/jobs" className="fw-bold text-info-emphasis text-decoration-none small mt-auto">
                  Browse Openings →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Company Hiring Carousel / Showcase */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container py-4">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-2">
            <div>
              <span className="badge bg-dark text-white px-3 py-1 rounded-pill small mb-2">Top Employers</span>
              <h3 className="fw-bold text-dark mb-1">Prepare for Tech Giants</h3>
              <p className="text-muted small mb-0">
                Click any company card below to explore round-by-round interview roadmaps, compensation benchmarks, and past questions.
              </p>
            </div>
            <Link to="/companies" className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-semibold">
              Explore All Companies →
            </Link>
          </div>

          <div className="row g-4">
            {companies.map((comp) => {
              const targetRoute = `/companies/${comp._id || comp.name}`;
              return (
                <div key={comp.name} className="col-12 col-sm-6 col-lg-3">
                  <Link
                    to={targetRoute}
                    className="text-decoration-none text-dark d-block h-100"
                  >
                    <div
                      className="card border-0 shadow-sm rounded-4 p-4 bg-white text-center h-100 position-relative d-flex flex-column"
                      style={{
                        transition: "all 0.25s ease-in-out",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.09)";
                        e.currentTarget.style.borderColor = "#3b82f6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                        e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.08)";
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center mb-3 mx-auto"
                        style={{ height: "42px", width: "120px" }}
                      >
                        <img
                          src={comp.logo}
                          alt={comp.name}
                          style={{ maxHeight: "36px", maxWidth: "110px", objectFit: "contain" }}
                        />
                      </div>

                      <h6 className="fw-bold text-dark mb-1">{comp.name}</h6>
                      
                      <div className="mb-2">
                        <span className={`badge ${getDifficultyBadgeClass(comp.difficulty)} px-2 py-1`}>
                          {comp.difficulty}
                        </span>
                      </div>

                      <p
                        className="small text-muted mb-3 flex-grow-1"
                        style={{ fontSize: "0.85rem", lineHeight: "1.45" }}
                      >
                        {comp.focus}
                      </p>

                      <div className="border-top pt-2 mt-auto">
                        <div className="small text-dark fw-bold mb-2">
                          Avg: {comp.salaryRange}
                        </div>
                        <span className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-semibold py-1">
                          View Roadmap →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Four-Step Roadmap Timeline */}
      <section className="py-5 bg-white">
        <div className="container py-4 text-center">
          <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold mb-2">
            The Proven Placement Formula
          </span>
          <h2 className="display-6 fw-bold text-dark mb-5">How PlacementHub Works</h2>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="p-4 rounded-4 bg-light border h-100 position-relative">
                <div className="badge bg-primary rounded-circle mb-3 fs-5" style={{ width: "45px", height: "45px", lineHeight: "32px" }}>1</div>
                <h5 className="fw-bold text-dark mb-2">Study Roadmaps</h5>
                <p className="small text-muted mb-0">Learn company hiring criteria, interview rounds, and frequent topics.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 rounded-4 bg-light border h-100 position-relative">
                <div className="badge bg-primary rounded-circle mb-3 fs-5" style={{ width: "45px", height: "45px", lineHeight: "32px" }}>2</div>
                <h5 className="fw-bold text-dark mb-2">Solve Problems</h5>
                <p className="small text-muted mb-0">Solve DSA, SQL 50, and System Design problems in our browser IDE.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 rounded-4 bg-light border h-100 position-relative">
                <div className="badge bg-primary rounded-circle mb-3 fs-5" style={{ width: "45px", height: "45px", lineHeight: "32px" }}>3</div>
                <h5 className="fw-bold text-dark mb-2">Read Experiences</h5>
                <p className="small text-muted mb-0">Gain real insights from actual candidate interview stories and CTC packages.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 rounded-4 bg-light border h-100 position-relative">
                <div className="badge bg-success rounded-circle mb-3 fs-5" style={{ width: "45px", height: "45px", lineHeight: "32px" }}>4</div>
                <h5 className="fw-bold text-dark mb-2">Land the Offer</h5>
                <p className="small text-muted mb-0">Apply to off-campus engineering jobs and track your applications live.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call To Action Banner */}
      <section className="py-5 bg-dark text-white text-center position-relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}>
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <h2 className="display-6 fw-bold mb-3">Ready to Crack Your Dream Tech Interview?</h2>
          <p className="lead text-light mb-4 opacity-90 mx-auto" style={{ maxWidth: "650px" }}>
            Join thousands of candidates preparing for Software Engineering, SDE-1, and Product roles on PlacementHub.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-lg">
              Get Started for Free
            </Link>
            <Link to="/practice" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-semibold">
              Explore Practice Problems
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
