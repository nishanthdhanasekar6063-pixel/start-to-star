import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedUser = localStorage.getItem("user");
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    return user.role === "Investor" ? "/investor-dashboard" : "/startup-dashboard";
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="nav-brand">
          <div className="brand-logo-svg">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="10" fill="#2563EB" />
              {/* Rocket Body */}
              <path d="M18 7C14 11 13 18 13 23L18 20L23 23C23 18 22 11 18 7Z" fill="white" />
              {/* Cockpit Window */}
              <circle cx="18" cy="14" r="2" fill="#2563EB" />
              {/* Rocket Thruster Flame */}
              <path d="M16 23L18 27L20 23Z" fill="#93C5FD" />
              {/* Shining Stars */}
              <path d="M26 9L27 11L29 12L27 13L26 15L25 13L23 12L25 11L26 9Z" fill="#60A5FA" />
              <circle cx="9" cy="12" r="1.5" fill="#BFDBFE" />
            </svg>
          </div>
          <span className="brand-title">
            Start<span className="brand-title-accent">-to-</span>Star
          </span>
        </Link>

        <ul className={`nav-menu ${mobileMenuOpen ? "open" : ""}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Explore Startups
            </NavLink>
          </li>
          <li>
            <NavLink to="/investors" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Investors
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              About
            </NavLink>
          </li>

          {user && (
            <>
              <li>
                <NavLink to={getDashboardLink()} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Dashboard
                </NavLink>
              </li>
              {user.role === "Startup" && (
                <li>
                  <NavLink to="/my-startup" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    My Startup
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/messages" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Messages
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="nav-actions">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="user-badge">
                <div className="user-avatar">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.name || user.email.split("@")[0]}</span>
                <span className="role-tag">{user.role || "Member"}</span>
              </div>

              <button type="button" className="btn-nav-logout" onClick={handleLogout} title="Sign Out">
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/login">
                <button type="button" className="btn-nav-login">Sign In</button>
              </Link>
              <Link to="/register">
                <button type="button" className="btn-nav-register">Get Started</button>
              </Link>
            </div>
          )}

          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;