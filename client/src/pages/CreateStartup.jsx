import Navbar from "../components/Navbar";
import "../styles/CreateStartup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStartup } from "../services/StartupService";

function CreateStartup() {
  const navigate = useNavigate();
  const savedUserStr = localStorage.getItem("user");
  const user = savedUserStr ? JSON.parse(savedUserStr) : null;

  const [startupName, setStartupName] = useState("");
  const [founderName, setFounderName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [industry, setIndustry] = useState("AI");
  const [stage, setStage] = useState("Seed Stage");
  const [location, setLocation] = useState("");
  const [funding, setFunding] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startupName || !founderName || !email || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      startupName: startupName.trim(),
      founderName: founderName.trim(),
      email: email.trim().toLowerCase(),
      industry,
      stage,
      location: location.trim(),
      funding: funding ? Number(funding) : null,
      description: description.trim(),
      website: website.trim(),
    };

    setLoading(true);

    try {
      const response = await createStartup(payload);
      alert("Startup profile published successfully!");
      navigate(`/startup/${response.data.id}`, { state: { startup: response.data } });
    } catch (error) {
      console.error("Error creating startup:", error);
      alert("Failed to publish startup profile. Please check your data and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="create-container animate-fade-in">
        <form className="create-card" onSubmit={handleSubmit}>
          <header className="form-header">
            <h1>
              Launch Your <span className="text-gradient">Startup Profile</span>
            </h1>
            <p>
              Present your venture to active angel investors and venture capital firms.
            </p>
          </header>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Startup Name *</label>
              <input
                type="text"
                placeholder="e.g. NexusFlow Technologies"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Founder Name *</label>
              <input
                type="text"
                placeholder="e.g. Aisha Patel"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Contact Email *</label>
              <input
                type="email"
                placeholder="founder@venture.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Target Funding (₹) *</label>
              <input
                type="number"
                placeholder="e.g. 5000000"
                value={funding}
                onChange={(e) => setFunding(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Industry Domain *</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
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

            <div className="form-group">
              <label>Current Growth Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option>Idea / Prototype</option>
                <option>Pre-Seed</option>
                <option>Seed Stage</option>
                <option>Early Growth / Pre-Series A</option>
                <option>Series A+</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Location (City / Country)</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Company Website</label>
              <input
                type="text"
                placeholder="https://nexusflow.io"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Pitch Summary & Value Proposition *</label>
            <textarea
              rows="5"
              placeholder="Describe the problem, your solution, current traction, revenue model, and why you are raising capital..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-submit-form"
            disabled={loading}
          >
            {loading ? "Publishing Venture..." : "Publish Startup Profile"}
          </button>
        </form>
      </main>
    </>
  );
}

export default CreateStartup;
