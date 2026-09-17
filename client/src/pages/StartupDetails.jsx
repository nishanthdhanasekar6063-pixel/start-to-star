import Navbar from "../components/Navbar";
import "../styles/StartupDetails.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { getStartupById, deleteStartup } from "../services/StartupService";

function StartupDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [startup, setStartup] = useState(location.state?.startup || null);
  const [loading, setLoading] = useState(!location.state?.startup);
  const [error, setError] = useState(null);

  const [isSaved, setIsSaved] = useState(false);

  const savedUserStr = localStorage.getItem("user");
  const currentUser = savedUserStr ? JSON.parse(savedUserStr) : null;

  useEffect(() => {
    const fetchDetails = async () => {
      if (startup) {
        checkIfSaved(startup.id);
        return;
      }

      try {
        setLoading(true);
        const response = await getStartupById(id);
        if (response.data) {
          setStartup(response.data);
          checkIfSaved(response.data.id);
        } else {
          setError("Startup record not found.");
        }
      } catch (err) {
        console.error("Failed to load startup:", err);
        setError("Unable to load startup details.");
      } finally {
        setLoading(false);
      }
    };

    const checkIfSaved = (startupId) => {
      try {
        const saved = JSON.parse(localStorage.getItem("savedStartups")) || [];
        setIsSaved(saved.some((s) => s.id === startupId));
      } catch {
        setIsSaved(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleToggleSave = () => {
    if (!startup) return;
    try {
      let saved = JSON.parse(localStorage.getItem("savedStartups")) || [];
      const alreadySaved = saved.some((s) => s.id === startup.id);

      if (alreadySaved) {
        saved = saved.filter((s) => s.id !== startup.id);
        setIsSaved(false);
      } else {
        saved.push(startup);
        setIsSaved(true);
      }

      localStorage.setItem("savedStartups", JSON.stringify(saved));
    } catch (err) {
      console.error("Error saving bookmark:", err);
    }
  };

  const handleContactStartup = () => {
    if (!currentUser) {
      alert("Please log in to contact this startup.");
      navigate("/login");
      return;
    }

    if (!startup.email) {
      alert("This startup has not listed a contact email address.");
      return;
    }

    navigate("/messages", {
      state: {
        receiverEmail: startup.email,
        prefillSubject: `Investment Inquiry: ${startup.startupName}`,
      },
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this startup profile?")) {
      return;
    }

    try {
      await deleteStartup(startup.id);
      alert("Startup deleted successfully.");
      navigate("/browse");
    } catch (err) {
      console.error("Failed to delete startup:", err);
      alert("Failed to delete startup.");
    }
  };

  const isOwner = currentUser && startup && currentUser.email === startup.email;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="details-page animate-fade-in">
          <div className="details-card-modern" style={{ textAlign: "center", padding: "80px 20px" }}>
            <h2>Loading Startup Profile...</h2>
            <p style={{ color: "var(--text-dim)", marginTop: "10px" }}>Retrieving verified records.</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !startup) {
    return (
      <>
        <Navbar />
        <main className="details-page animate-fade-in">
          <div className="details-card-modern" style={{ textAlign: "center", padding: "60px 20px" }}>
            <h2>Startup Not Found</h2>
            <p style={{ color: "var(--text-dim)", margin: "12px 0 24px" }}>
              The startup you are looking for does not exist or may have been removed.
            </p>
            <button type="button" className="btn-back" onClick={() => navigate("/browse")}>
              ← Back to All Startups
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="details-page animate-fade-in">
        <div className="details-card-modern">
          <div className="details-header">
            <div className="details-title-group">
              <h1>{startup.startupName || "Unnamed Venture"}</h1>
              <div className="details-meta-tags">
                <span className="industry-badge">{startup.industry || "General"}</span>
                {startup.stage && <span className="badge-pill badge-purple">{startup.stage}</span>}
                {startup.location && <span className="badge-pill badge-amber">{startup.location}</span>}
              </div>
            </div>

            <div className="details-actions-top">
              <button
                type="button"
                className={`btn-save-toggle ${isSaved ? "active" : ""}`}
                onClick={handleToggleSave}
              >
                <span>{isSaved ? "Saved" : "Save Venture"}</span>
              </button>
            </div>
          </div>

          <div className="details-grid">
            <div className="details-main-content">
              <h2 className="details-section-title">Venture Pitch & Overview</h2>
              <div className="details-pitch">
                {startup.description || "The founder has not provided a detailed overview yet."}
              </div>
            </div>

            <aside className="details-sidebar">
              <div className="sidebar-box">
                <div className="sidebar-item">
                  <small>Funding Target</small>
                  <div className="amount-highlight">
                    {startup.funding != null
                      ? `₹${Number(startup.funding).toLocaleString("en-IN")}`
                      : "Undisclosed"}
                  </div>
                </div>

                <div className="sidebar-item">
                  <small>Founder / Leadership</small>
                  <p>{startup.founderName || "Anonymous"}</p>
                </div>

                <div className="sidebar-item">
                  <small>Contact Email</small>
                  <p>{startup.email || "Private"}</p>
                </div>

                {startup.website && (
                  <div className="sidebar-item">
                    <small>Official Website</small>
                    <a
                      href={startup.website.startsWith("http") ? startup.website : `https://${startup.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--primary)", wordBreak: "break-all" }}
                    >
                      {startup.website}
                    </a>
                  </div>
                )}
              </div>
            </aside>
          </div>

          <footer className="details-buttons-bar">
            <button type="button" className="btn-contact" onClick={handleContactStartup}>
              Contact Founder Directly
            </button>

            {isOwner && (
              <>
                <Link to="/my-startup">
                  <button type="button" className="btn-back">
                    Edit Profile
                  </button>
                </Link>

                <button type="button" className="btn-delete-startup" onClick={handleDelete}>
                  Delete Startup
                </button>
              </>
            )}

            <button type="button" className="btn-back" onClick={() => navigate("/browse")}>
              ← Back to Startups
            </button>
          </footer>
        </div>
      </main>
    </>
  );
}

export default StartupDetails;