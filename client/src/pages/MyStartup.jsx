import Navbar from "../components/Navbar";
import "../styles/MyStartup.css";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAllStartups,
  updateStartup,
  deleteStartup,
} from "../services/StartupService";

function MyStartup() {
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    startupName: "",
    founderName: "",
    email: "",
    industry: "AI",
    stage: "Seed Stage",
    location: "",
    funding: "",
    description: "",
    website: "",
  });

  const savedUserStr = localStorage.getItem("user");
  const user = savedUserStr ? JSON.parse(savedUserStr) : null;

  useEffect(() => {
    const fetchMyStartup = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAllStartups();
        const myFound = (response.data || []).find(
          (s) => s.email && s.email.toLowerCase() === user.email.toLowerCase()
        );

        setStartup(myFound || null);

        if (myFound) {
          setFormData({
            startupName: myFound.startupName || "",
            founderName: myFound.founderName || "",
            email: myFound.email || "",
            industry: myFound.industry || "AI",
            stage: myFound.stage || "Seed Stage",
            location: myFound.location || "",
            funding: myFound.funding != null ? myFound.funding : "",
            description: myFound.description || "",
            website: myFound.website || "",
          });
        }
      } catch (error) {
        console.error("Failed to load startup:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStartup();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        funding: formData.funding !== "" ? Number(formData.funding) : null,
      };

      const response = await updateStartup(startup.id, payload);
      setStartup(response.data);
      setEditing(false);
      alert("Startup profile updated successfully!");
    } catch (error) {
      console.error("Failed to update startup:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your startup profile?")) {
      return;
    }

    try {
      await deleteStartup(startup.id);
      setStartup(null);
      alert("Startup profile deleted.");
      navigate("/startup-dashboard");
    } catch (error) {
      console.error("Failed to delete startup:", error);
      alert("Failed to delete startup.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="profile-container animate-fade-in">
        <div className="profile-card">
          <header className="profile-header">
            <div>
              <h1>My Startup <span className="text-gradient">Profile</span></h1>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Manage your venture presence and investor-facing details.
              </p>
            </div>

            {startup && !editing && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="btn-nav-register"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>

                <Link to={`/startup/${startup.id}`} state={{ startup }}>
                  <button type="button" className="btn-nav-login">
                    View Public Page →
                  </button>
                </Link>
              </div>
            )}
          </header>

          {loading ? (
            <p style={{ textAlign: "center", padding: "40px", color: "var(--text-dim)" }}>
              Loading your profile...
            </p>
          ) : !startup ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <h2>No Startup Profile Found</h2>
              <p style={{ color: "var(--text-muted)", margin: "12px 0 24px" }}>
                You haven't listed your startup yet. Start raising funding today.
              </p>
              <button
                type="button"
                className="btn-submit-form"
                style={{ maxWidth: "260px", margin: "0 auto" }}
                onClick={() => navigate("/create")}
              >
                + Create Startup Profile
              </button>
            </div>
          ) : editing ? (
            <form onSubmit={handleSave}>
              <div className="profile-item">
                <strong>Startup Name</strong>
                <input
                  type="text"
                  name="startupName"
                  value={formData.startupName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-item">
                <strong>Founder Name</strong>
                <input
                  type="text"
                  name="founderName"
                  value={formData.founderName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-item">
                <strong>Contact Email</strong>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-item">
                <strong>Industry</strong>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option value="AI">AI & Machine Learning</option>
                  <option value="Healthcare">Healthcare & BioTech</option>
                  <option value="Finance">Fintech & Banking</option>
                  <option value="Education">EdTech</option>
                  <option value="E-Commerce">E-Commerce & D2C</option>
                  <option value="CleanTech">CleanTech & Energy</option>
                  <option value="SaaS">B2B SaaS</option>
                  <option value="Gaming">Gaming & Web3</option>
                </select>
              </div>

              <div className="profile-item">
                <strong>Funding Target (₹)</strong>
                <input
                  type="number"
                  name="funding"
                  value={formData.funding}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-item">
                <strong>Company Location</strong>
                <input
                  type="text"
                  name="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-item">
                <strong>Website</strong>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-item">
                <strong>Pitch & Description</strong>
                <textarea
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="button-group">
                <button type="submit" className="btn-nav-register">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn-nav-login"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="profile-item">
                <strong>Startup Name</strong>
                <p>{startup.startupName}</p>
              </div>

              <div className="profile-item">
                <strong>Founder</strong>
                <p>{startup.founderName || "Not Provided"}</p>
              </div>

              <div className="profile-item">
                <strong>Contact Email</strong>
                <p>{startup.email}</p>
              </div>

              <div className="profile-item">
                <strong>Industry</strong>
                <p>{startup.industry || "General"}</p>
              </div>

              <div className="profile-item">
                <strong>Funding Required</strong>
                <p style={{ color: "var(--accent-emerald)", fontWeight: "700", fontSize: "18px" }}>
                  {startup.funding != null ? `₹${Number(startup.funding).toLocaleString("en-IN")}` : "Undisclosed"}
                </p>
              </div>

              <div className="profile-item">
                <strong>Pitch Overview</strong>
                <p style={{ whiteSpace: "pre-wrap" }}>{startup.description}</p>
              </div>

              {startup.website && (
                <div className="profile-item">
                  <strong>Website</strong>
                  <p>{startup.website}</p>
                </div>
              )}

              <div className="button-group" style={{ justifyContent: "space-between" }}>
                <button
                  type="button"
                  className="btn-nav-register"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>

                <button
                  type="button"
                  className="btn-nav-logout"
                  onClick={handleDelete}
                >
                  Delete Startup Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default MyStartup;