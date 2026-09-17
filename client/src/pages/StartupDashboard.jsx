import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllStartups } from "../services/StartupService";
import { getUserMessages } from "../services/MessageService";

function StartupDashboard() {
  const navigate = useNavigate();
  const [myStartup, setMyStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messagesCount, setMessagesCount] = useState(0);

  const savedUserStr = localStorage.getItem("user");
  const user = savedUserStr ? JSON.parse(savedUserStr) : null;

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const [startupsRes, messagesRes] = await Promise.allSettled([
          getAllStartups(),
          getUserMessages(user.email),
        ]);

        if (startupsRes.status === "fulfilled" && Array.isArray(startupsRes.value.data)) {
          const found = startupsRes.value.data.find((s) => s.email === user.email);
          setMyStartup(found || null);
        }

        if (messagesRes.status === "fulfilled" && Array.isArray(messagesRes.value.data)) {
          setMessagesCount(messagesRes.value.data.length);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <>
      <Navbar />

      <main className="dashboard-page animate-fade-in">
        <header className="dashboard-header">
          <div className="dashboard-title-group">
            <h1>
              Founder <span className="text-gradient">Launchpad</span>
            </h1>
            <p>Welcome back, {user?.name || user?.email}. Manage your venture presentation and investor inquiries.</p>
          </div>

          <button
            type="button"
            onClick={() => navigate(myStartup ? "/my-startup" : "/create")}
            style={{
              background: "var(--primary)",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "var(--radius-sm)",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            {myStartup ? "Edit Venture Profile" : "+ Create Startup Profile"}
          </button>
        </header>

        {/* Stats Row */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <small>Profile Status</small>
              <h3 style={{ fontSize: "18px", color: myStartup ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                {myStartup ? "Published & Live" : "Pending Creation"}
              </h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper stat-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="stat-info">
              <small>Target Capital</small>
              <h3>
                {myStartup && myStartup.funding != null
                  ? `₹${Number(myStartup.funding).toLocaleString("en-IN")}`
                  : "Not Set"}
              </h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper stat-pink">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <small>Investor Inquiries</small>
              <h3>{messagesCount}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper stat-amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <small>Industry Domain</small>
              <h3 style={{ fontSize: "18px" }}>
                {myStartup ? myStartup.industry || "General" : "N/A"}
              </h3>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="dashboard-sections-grid">
          <section className="dashboard-main-card">
            <div className="section-header">
              <h2>My Venture Overview</h2>
              {myStartup && (
                <button
                  type="button"
                  className="btn-sm-primary"
                  onClick={() => navigate(`/startup/${myStartup.id}`, { state: { startup: myStartup } })}
                >
                  View Public Page →
                </button>
              )}
            </div>

            {loading ? (
              <p style={{ color: "var(--text-dim)" }}>Loading venture details...</p>
            ) : myStartup ? (
              <div style={{ background: "var(--bg-surface)", padding: "24px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>{myStartup.startupName}</h3>
                <p style={{ color: "var(--text-dim)", fontSize: "14px", marginBottom: "16px" }}>
                  Founded by <strong>{myStartup.founderName}</strong> • {myStartup.industry}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
                  {myStartup.description}
                </p>

                <div style={{ display: "flex", gap: "12px" }}>
                  <Link to="/my-startup">
                    <button type="button" className="btn-sm-primary">
                      Manage Full Profile
                    </button>
                  </Link>
                  <Link to="/messages">
                    <button
                      type="button"
                      className="btn-sm-primary"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                    >
                      Check Messages ({messagesCount})
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <h3>You Haven't Created a Startup Profile Yet</h3>
                <p style={{ color: "var(--text-muted)", margin: "10px 0 20px" }}>
                  Publish your startup pitch to get discovered by accredited angel investors and venture funds.
                </p>
                <button type="button" className="btn-sm-primary" onClick={() => navigate("/create")}>
                  Create Startup Profile Now →
                </button>
              </div>
            )}
          </section>

          <aside>
            <div className="dashboard-main-card">
              <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Founder Quick Actions</h2>

              <div className="quick-action-card" onClick={() => navigate(myStartup ? "/my-startup" : "/create")}>
                <h3>{myStartup ? "Update Pitch" : "Create Profile"}</h3>
                <p>Keep your financial targets, metrics, and description up to date.</p>
              </div>

              <div className="quick-action-card" onClick={() => navigate("/messages")}>
                <h3>Messages & Offers</h3>
                <p>Respond to angel investor term inquiries and set up meetings.</p>
              </div>

              <div className="quick-action-card" onClick={() => navigate("/browse")}>
                <h3>Explore Ecosystem</h3>
                <p>See other startup peers across your domain and market.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default StartupDashboard;