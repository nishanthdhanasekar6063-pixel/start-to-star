import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function About() {
  return (
    <>
      <Navbar />

      <main className="container animate-fade-in" style={{ padding: "60px 24px 100px" }}>
        {/* Header */}
        <header style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 60px" }}>
          <div className="badge-pill badge-purple" style={{ marginBottom: "16px" }}>
            Our Mission & Vision
          </div>
          <h1 style={{ fontSize: "44px", marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Empowering the Next Generation of <span className="text-gradient">Breakthrough Companies</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-muted)", lineHeight: "1.6" }}>
            Start-to-Star is the modern matchmaking platform built to connect passionate entrepreneurs with visionary investors who provide more than just capital.
          </p>
        </header>

        {/* 3 Value Pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px", marginBottom: "70px" }}>
          <div className="glass-panel" style={{ padding: "32px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "var(--primary)" }}>Curated Dealflow</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6" }}>
              Every startup listed is structured with clear market validation, financial targets, and sector categorization for frictionless evaluation.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "32px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "var(--primary)" }}>Direct Messaging</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6" }}>
              No middleman delays. Investors can communicate with startup founders directly, request pitch decks, and align on terms within minutes.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "32px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "var(--primary)" }}>High-Trust Network</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6" }}>
              Built specifically for early-stage angels, syndicate leads, and founders seeking Seed to Series A capital without opaque gatekeepers.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <section className="glass-panel" style={{ padding: "48px 40px", marginBottom: "70px" }}>
          <h2 style={{ fontSize: "28px", textAlign: "center", marginBottom: "40px" }}>
            How <span className="text-gradient">Start-to-Star Works</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "32px" }}>
            <div>
              <div style={{ color: "var(--primary)", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>01.</div>
              <h4 style={{ fontSize: "18px", marginBottom: "8px" }}>Publish Venture</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Founders create a comprehensive company profile specifying industry domain, traction, and capital requirements.
              </p>
            </div>

            <div>
              <div style={{ color: "var(--primary)", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>02.</div>
              <h4 style={{ fontSize: "18px", marginBottom: "8px" }}>Discover & Bookmark</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Investors search deals using intelligent sector filters, funding sliders, and save opportunities to their private pipeline.
              </p>
            </div>

            <div>
              <div style={{ color: "var(--primary)", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>03.</div>
              <h4 style={{ fontSize: "18px", marginBottom: "8px" }}>Connect & Close</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Initiate direct conversations, share term sheets, and accelerate deal closing in a seamless environment.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section style={{
          background: "var(--gradient-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "50px 30px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>Ready to Start Your Journey?</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "600px", margin: "0 auto 30px" }}>
            Join hundreds of visionary founders and strategic angels shaping tomorrow's technology landscape.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register">
              <button type="button" className="btn-nav-register" style={{ padding: "12px 28px", fontSize: "15px" }}>
                Get Started Free →
              </button>
            </Link>
            <Link to="/browse">
              <button type="button" className="btn-nav-login" style={{ padding: "12px 24px", fontSize: "15px" }}>
                Explore Startups
              </button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default About;