import { Link, useNavigate } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  const navigate = useNavigate();
  const savedUser = localStorage.getItem("user");

  return (
    <section className="hero-wrapper">
      <div className="hero-glow"></div>
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-announcement">
            Next-Gen Startup & Angel Investment Ecosystem
          </div>

          <h1 className="hero-headline">
            Where Visionary <span className="text-gradient">Startups</span> Meet Strategic <span className="text-gradient">Investors</span>.
          </h1>

          <p className="hero-description">
            Start-to-Star bridges the gap between ambitious founders building the future and accredited investors looking for extraordinary ventures.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={() => navigate("/browse")}
            >
              Explore Startups →
            </button>

            {savedUser ? (
              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => {
                  const user = JSON.parse(savedUser);
                  navigate(user.role === "Startup" ? "/startup-dashboard" : "/investor-dashboard");
                }}
              >
                Go to Dashboard →
              </button>
            ) : (
              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => navigate("/register")}
              >
                Join as Founder or Investor →
              </button>
            )}
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <span className="hero-stat-value">₹50Cr+</span>
              <span className="hero-stat-label">Capital Targeted</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">250+</span>
              <span className="hero-stat-label">Vetted Startups</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">98%</span>
              <span className="hero-stat-label">Response Rate</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-card">
            <div className="floating-pill floating-pill-1">
              ₹2.5 Cr Seed Term Sheet Sent
            </div>

            <span className="preview-badge">Featured AI Startup</span>
            <h3 className="preview-title">NeuralHealth Technologies</h3>
            <p className="preview-desc">
              AI-driven predictive diagnostic platform revolutionizing preventative cardiac healthcare workflows.
            </p>

            <div className="preview-metrics">
              <div className="preview-metric-item">
                <small>Seeking</small>
                <strong>₹1,50,00,000</strong>
              </div>
              <div className="preview-metric-item">
                <small>Industry</small>
                <strong style={{ color: "#2563EB" }}>AI & Health</strong>
              </div>
            </div>
            
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>Founder: Dr. Aisha Rao</span>
              <button
                type="button"
                onClick={() => navigate("/browse")}
                style={{
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                View Deal
              </button>
            </div>

            <div className="floating-pill floating-pill-2">
              Verified Angel Connected
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;