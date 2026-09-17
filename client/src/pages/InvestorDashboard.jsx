import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserMessages } from "../services/MessageService";

function InvestorDashboard() {
  const navigate = useNavigate();
  const [savedStartups, setSavedStartups] = useState([]);
  const [messageCount, setMessageCount] = useState(0);

  const savedUserStr = localStorage.getItem("user");
  const user = savedUserStr ? JSON.parse(savedUserStr) : null;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("savedStartups")) || [];
      setSavedStartups(saved);
    } catch {
      setSavedStartups([]);
    }

    if (user?.email) {
      getUserMessages(user.email)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setMessageCount(res.data.length);
          }
        })
        .catch((err) => console.error("Could not fetch messages count:", err));
    }
  }, []);

  const handleRemoveSaved = (startupId) => {
    const updated = savedStartups.filter((s) => s.id !== startupId);
    setSavedStartups(updated);
    localStorage.setItem("savedStartups", JSON.stringify(updated));
  };

  const handleContactFounder = (startup) => {
    navigate("/messages", {
      state: {
        receiverEmail: startup.email,
        prefillSubject: `Investment Interest: ${startup.startupName}`,
      },
    });
  };

  return (
    <>
      <Navbar />

      <main className="dashboard-page animate-fade-in">
        <header className="dashboard-header">
          <div className="dashboard-title-group">
            <h1>
              Investor <span className="text-gradient">Command Center</span>
            </h1>
            <p>Welcome back, {user?.name || user?.email || "Investor"}. Monitor your deal flow and active communications.</p>
          </div>

          <Link to="/browse">
            <button
              type="button"
              style={{
                background: "var(--gradient-primary)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "var(--radius-sm)",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              + Discover New Startups
            </button>
          </Link>
        </header>

        {/* Stats Row */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div className="stat-info">
              <small>Saved Dealflow</small>
              <h3>{savedStartups.length}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper stat-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <small>Messages Exchanged</small>
              <h3>{messageCount}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper stat-pink">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
            <div className="stat-info">
              <small>Ecosystem Opportunities</small>
              <h3>250+</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper stat-amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div className="stat-info">
              <small>Investor Status</small>
              <h3 style={{ fontSize: "18px", color: "var(--accent-amber)" }}>Verified</h3>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="dashboard-sections-grid">
          {/* Saved Startups Box */}
          <section className="dashboard-main-card">
            <div className="section-header">
              <h2>Bookmarked Dealflow</h2>
              <span style={{ fontSize: "13px", color: "var(--text-dim)" }}>
                {savedStartups.length} Saved
              </span>
            </div>

            {savedStartups.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
                  You haven't bookmarked any startups yet.
                </p>
                <Link to="/browse">
                  <button type="button" className="btn-sm-primary">
                    Browse Verified Startups →
                  </button>
                </Link>
              </div>
            ) : (
              <div className="saved-list">
                {savedStartups.map((startup) => (
                  <div className="saved-item" key={startup.id}>
                    <div className="saved-item-info">
                      <h3>{startup.startupName}</h3>
                      <p>
                        <strong>{startup.industry || "General"}</strong> • Founder: {startup.founderName || "Anonymous"} • Target:{" "}
                        <span style={{ color: "var(--accent-emerald)", fontWeight: "600" }}>
                          {startup.funding != null ? `₹${Number(startup.funding).toLocaleString("en-IN")}` : "Undisclosed"}
                        </span>
                      </p>
                    </div>

                    <div className="saved-item-actions">
                      <button
                        type="button"
                        className="btn-sm-primary"
                        onClick={() => navigate(`/startup/${startup.id}`, { state: { startup } })}
                      >
                        View Pitch
                      </button>

                      <button
                        type="button"
                        className="btn-sm-primary"
                        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                        onClick={() => handleContactFounder(startup)}
                      >
                        Contact
                      </button>

                      <button
                        type="button"
                        className="btn-sm-remove"
                        onClick={() => handleRemoveSaved(startup.id)}
                        title="Remove bookmark"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions Sidebar */}
          <aside>
            <div className="dashboard-main-card">
              <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Direct Shortcuts</h2>

              <div className="quick-action-card" onClick={() => navigate("/browse")}>
                <h3>Explore Directory</h3>
                <p>Filter by AI, Fintech, SaaS, and review founder pitches.</p>
              </div>

              <div className="quick-action-card" onClick={() => navigate("/messages")}>
                <h3>Communication Hub</h3>
                <p>Direct message founders and negotiate deal terms.</p>
              </div>

              <div className="quick-action-card" onClick={() => navigate("/about")}>
                <h3>Investment Guidelines</h3>
                <p>Learn how deal syndication and verification works.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default InvestorDashboard;