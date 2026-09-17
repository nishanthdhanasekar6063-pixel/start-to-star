import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

function Investors() {
  const navigate = useNavigate();

  const sectors = [
    { title: "Artificial Intelligence", count: "80+ Deals", desc: "Generative AI, LLM tooling, automated enterprise workflows, and robotics." },
    { title: "Fintech & Banking", count: "45+ Deals", desc: "Cross-border payments, embedded finance, automated bookkeeping, and insurtech." },
    { title: "Healthcare & Bio", count: "35+ Deals", desc: "Predictive diagnostics, telemedicine infrastructure, and longevity research." },
    { title: "B2B SaaS & Cloud", count: "60+ Deals", desc: "Developer tools, workflow orchestration, cyber defense, and data analytics." },
    { title: "CleanTech & Energy", count: "25+ Deals", desc: "Carbon capture, renewable grid management, and EV ecosystem tech." },
    { title: "E-Commerce & D2C", count: "40+ Deals", desc: "Omnichannel retail tech, supply chain AI, and creator monetization." },
  ];

  return (
    <>
      <Navbar />

      <main className="container animate-fade-in" style={{ padding: "60px 24px 100px" }}>
        {/* Header */}
        <header style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 60px" }}>
          <div className="badge-pill badge-green" style={{ marginBottom: "16px" }}>
            Accredited Investor Network
          </div>
          <h1 style={{ fontSize: "44px", marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Access Verified <span className="text-gradient">High-Growth Dealflow</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-muted)", lineHeight: "1.6" }}>
            Connect directly with ambitious founders raising Seed, Pre-Series A, and Series A rounds across India and global markets.
          </p>

          <div style={{ marginTop: "28px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register">
              <button type="button" className="btn-nav-register" style={{ padding: "12px 28px", fontSize: "15px" }}>
                Join as Investor →
              </button>
            </Link>
            <Link to="/browse">
              <button type="button" className="btn-nav-login" style={{ padding: "12px 24px", fontSize: "15px" }}>
                Explore Active Startups
              </button>
            </Link>
          </div>
        </header>

        {/* Sectors Grid */}
        <section style={{ marginBottom: "70px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "28px", textAlign: "center" }}>
            High-Demand Investment Sectors
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {sectors.map((sec) => (
              <div key={sec.title} className="glass-panel" style={{ padding: "28px", transition: "transform 0.2s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span className="badge-pill badge-purple">{sec.count}</span>
                </div>
                <h3 style={{ fontSize: "20px", marginBottom: "8px", color: "var(--primary)" }}>{sec.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>{sec.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Invest on Start-to-Star */}
        <section className="glass-panel" style={{ padding: "48px 40px", marginBottom: "70px" }}>
          <h2 style={{ fontSize: "28px", textAlign: "center", marginBottom: "40px" }}>
            Built for Modern Angel Investors
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            <div>
              <h4 style={{ fontSize: "18px", marginBottom: "8px", color: "var(--primary)" }}>Private & Confidential</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Review pitches privately and message founders directly with complete control over your identity.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "18px", marginBottom: "8px", color: "var(--primary)" }}>Fast Evaluation</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Key metrics, capital requirements, and market insights are standardized for quick decision making.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "18px", marginBottom: "8px", color: "var(--primary)" }}>Personal Watchlists</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Bookmark interesting companies into your Investor Command Center and track progress over time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Investors;