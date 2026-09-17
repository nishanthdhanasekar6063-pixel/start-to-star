import Navbar from "../components/Navbar";
import "../styles/BrowseStartups.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStartups } from "../services/StartupService";

function BrowseStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("ALL");
  const [sortBy, setSortBy] = useState("DEFAULT");
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("savedStartups")) || [];
      return saved.map((s) => s.id);
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await getAllStartups();
        setStartups(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const handleToggleSave = (startup, e) => {
    e.stopPropagation();
    try {
      let saved = JSON.parse(localStorage.getItem("savedStartups")) || [];
      const isAlreadySaved = saved.some((s) => s.id === startup.id);

      if (isAlreadySaved) {
        saved = saved.filter((s) => s.id !== startup.id);
      } else {
        saved.push(startup);
      }

      localStorage.setItem("savedStartups", JSON.stringify(saved));
      setSavedIds(saved.map((s) => s.id));
    } catch (err) {
      console.error("Error updating bookmarks:", err);
    }
  };

  const handleViewDetails = (startup) => {
    navigate(`/startup/${startup.id}`, {
      state: { startup },
    });
  };

  // Filter and Sort Logic
  const filteredStartups = startups
    .filter((startup) => {
      const name = startup.startupName || "";
      const founder = startup.founderName || "";
      const desc = startup.description || "";
      const industry = startup.industry || "";

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry =
        selectedIndustry === "ALL" ||
        industry.toLowerCase() === selectedIndustry.toLowerCase();

      return matchesSearch && matchesIndustry;
    })
    .sort((a, b) => {
      if (sortBy === "FUNDING_HIGH") {
        return (b.funding || 0) - (a.funding || 0);
      }
      if (sortBy === "FUNDING_LOW") {
        return (a.funding || 0) - (b.funding || 0);
      }
      if (sortBy === "NAME_ASC") {
        return (a.startupName || "").localeCompare(b.startupName || "");
      }
      return 0;
    });

  const formatCurrency = (amount) => {
    if (amount == null) return "Undisclosed";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  return (
    <>
      <Navbar />

      <main className="browse-page animate-fade-in">
        <header className="browse-header">
          <h1 className="browse-title">
            Discover <span className="text-gradient">Breakthrough Ventures</span>
          </h1>
          <p className="browse-subtitle">
            Explore vetted high-growth companies seeking angel and venture backing across emerging sectors.
          </p>
        </header>

        <section className="browse-controls">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, founder, industry, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              aria-label="Filter by Industry"
            >
              <option value="ALL">All Industries</option>
              <option value="AI">AI & Machine Learning</option>
              <option value="Healthcare">Healthcare & BioTech</option>
              <option value="Finance">Fintech</option>
              <option value="Education">EdTech</option>
              <option value="E-Commerce">E-Commerce & Retail</option>
              <option value="CleanTech">CleanTech & Energy</option>
              <option value="SaaS">B2B SaaS</option>
            </select>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort Startups"
            >
              <option value="DEFAULT">Sort By: Featured</option>
              <option value="FUNDING_HIGH">Funding: High to Low</option>
              <option value="FUNDING_LOW">Funding: Low to High</option>
              <option value="NAME_ASC">Name: A to Z</option>
            </select>
          </div>
        </section>

        {loading ? (
          <div className="empty-state">
            <h3>Loading Startups...</h3>
            <p style={{ color: "var(--text-dim)" }}>Fetching live opportunities from the ecosystem.</p>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="empty-state">
            <h3>No Startups Match Your Search</h3>
            <p style={{ color: "var(--text-dim)", marginTop: "8px" }}>
              Try adjusting your search query or filter settings.
            </p>
          </div>
        ) : (
          <div className="startup-grid">
            {filteredStartups.map((startup) => {
              const isSaved = savedIds.includes(startup.id);

              return (
                <article className="startup-card-modern" key={startup.id}>
                  <div>
                    <div className="card-top">
                      <span className="industry-badge">
                        {startup.industry || "General"}
                      </span>
                      <button
                        type="button"
                        className={`btn-bookmark ${isSaved ? "saved" : ""}`}
                        onClick={(e) => handleToggleSave(startup, e)}
                        title={isSaved ? "Remove from bookmarks" : "Save startup"}
                        aria-label="Bookmark startup"
                      >
                        {isSaved ? "★" : "☆"}
                      </button>
                    </div>

                    <h2 className="card-title">
                      {startup.startupName || "Unnamed Venture"}
                    </h2>

                    <div className="card-founder">
                      <span>Founder: <strong>{startup.founderName || "Anonymous"}</strong></span>
                    </div>

                    <p className="card-desc">
                      {startup.description || "No detailed pitch provided yet."}
                    </p>
                  </div>

                  <div>
                    <div className="card-financials">
                      <span className="financial-label">Target Funding</span>
                      <span className="financial-amount">{formatCurrency(startup.funding)}</span>
                    </div>

                    <div className="card-actions">
                      <button
                        type="button"
                        className="btn-view-details"
                        onClick={() => handleViewDetails(startup)}
                      >
                        View Pitch & Contact →
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default BrowseStartups;