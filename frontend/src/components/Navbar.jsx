import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
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
    setNavOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setNavOpen(false);
    setExploreOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-0">
      <div className="container">
        <Link className="navbar-brand navbar-brand-modern text-white d-flex align-items-center gap-2" to="/" onClick={closeMenu}>
          <span className="navbar-brand-icon">🎓</span>
          <span className="navbar-brand-text">
            Placement<span className="navbar-brand-accent">Hub</span>
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
          onClick={() => setNavOpen(!navOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${navOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/jobs" onClick={closeMenu}>
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
                <Link className="dropdown-item" to="/companies" onClick={closeMenu}>
                  <strong>Companies</strong><span>Interview roadmaps</span>
                </Link>
                <Link className="dropdown-item" to="/practice" onClick={closeMenu}>
                  <strong>Practice</strong><span>DSA, SQL & system design</span>
                </Link>
                <Link className="dropdown-item" to="/experiences" onClick={closeMenu}>
                  <strong>Interview Stories</strong><span>Real candidate experiences</span>
                </Link>
                <Link className="dropdown-item" to="/resources" onClick={closeMenu}>
                  <strong>Resources</strong><span>Notes, guides & links</span>
                </Link>
                <Link className="dropdown-item" to="/resume" onClick={closeMenu}>
                  <strong>Resume Studio</strong><span>Build a job-ready profile</span>
                </Link>
                <Link className="dropdown-item" to="/mock-interview" onClick={closeMenu}>
                  <strong>Mock Interview</strong><span>Role & topic AI interviews</span>
                </Link>
              </div>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/dashboard" onClick={closeMenu}>
                    Dashboard
                  </Link>
                </li>
                {user.role === "Admin" && (
                  <li className="nav-item">
                    <Link className="nav-link text-warning fw-semibold" to="/admin" onClick={closeMenu}>
                      ⚙️ Admin
                    </Link>
                  </li>
                )}
                <li className="nav-item ms-lg-2 my-2 my-lg-0">
                  <button className="btn btn-outline-light btn-sm rounded-pill px-3 py-1 fw-semibold w-100" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
                <li className="nav-item my-1 my-lg-0">
                  <Link className="btn btn-primary btn-sm ms-lg-2" to="/register" onClick={closeMenu}>
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
