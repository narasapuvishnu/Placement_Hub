import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef(null);

  useEffect(() => {
    if (!exploreOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!exploreRef.current?.contains(event.target)) {
        setExploreOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setExploreOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [exploreOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-0">
      <div className="container">
        <Link className="navbar-brand navbar-brand-modern text-white d-flex align-items-center gap-2" to="/">
          <span className="navbar-brand-icon">🎓</span>
          <span className="navbar-brand-text">
            Placement<span className="navbar-brand-accent">Hub</span>
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/jobs">
                Jobs
              </Link>
            </li>
            <li ref={exploreRef} className={`nav-item dropdown ${exploreOpen ? "show" : ""}`}>
              <button
                className="nav-link navbar-explore-toggle fw-medium"
                type="button"
                aria-expanded={exploreOpen}
                onClick={() => setExploreOpen(!exploreOpen)}
              >
                <LayoutGrid size={15} strokeWidth={2.2} aria-hidden="true" />
                Explore
              </button>
              <div className={`dropdown-menu dropdown-menu-end navbar-explore-menu ${exploreOpen ? "show" : ""}`}>
                <div className="navbar-menu-label">Prepare & discover</div>
                <Link className="dropdown-item" to="/companies" onClick={() => setExploreOpen(false)}>
                  <strong>Companies</strong><span>Interview roadmaps</span>
                </Link>
                <Link className="dropdown-item" to="/practice" onClick={() => setExploreOpen(false)}>
                  <strong>Practice</strong><span>DSA, SQL & system design</span>
                </Link>
                <Link className="dropdown-item" to="/experiences" onClick={() => setExploreOpen(false)}>
                  <strong>Interview Stories</strong><span>Real candidate experiences</span>
                </Link>
                <Link className="dropdown-item" to="/resources" onClick={() => setExploreOpen(false)}>
                  <strong>Resources</strong><span>Notes, guides & links</span>
                </Link>
                <Link className="dropdown-item" to="/resume" onClick={() => setExploreOpen(false)}>
                  <strong>Resume Studio</strong><span>Build a job-ready profile</span>
                </Link>
                <Link className="dropdown-item" to="/mock-interview" onClick={() => setExploreOpen(false)}>
                  <strong>Mock Interview</strong><span>Role & topic AI interviews</span>
                </Link>
              </div>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                {user.role === "Admin" && (
                  <li className="nav-item">
                    <Link className="nav-link text-warning fw-semibold" to="/admin">
                      ⚙️ Admin
                    </Link>
                  </li>
                )}
                <li className="nav-item ms-2">
                  <button className="btn btn-outline-light btn-sm rounded-pill px-3 py-1 fw-semibold" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm ms-2" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
