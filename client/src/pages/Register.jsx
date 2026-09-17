import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/UserService";

function Register() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Startup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const user = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: role,
      };

      await registerUser(user);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-glow"></div>

      <div className="auth-card animate-fade-in">
        <header className="auth-header">
          <div className="auth-icon">
            <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="10" fill="#2563EB" />
              <path d="M18 7C14 11 13 18 13 23L18 20L23 23C23 18 22 11 18 7Z" fill="white" />
              <circle cx="18" cy="14" r="2" fill="#2563EB" />
              <path d="M16 23L18 27L20 23Z" fill="#93C5FD" />
              <path d="M26 9L27 11L29 12L27 13L26 15L25 13L23 12L25 11L26 9Z" fill="#60A5FA" />
            </svg>
          </div>
          <h1>Create an Account</h1>
          <p>Join Start-to-Star to raise or invest capital</p>
        </header>

        {errorMessage && (
          <div className="auth-alert auth-alert-error">
            {errorMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>I want to join as</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Startup">Startup Founder (Raising Capital)</option>
              <option value="Investor">Angel / VC Investor (Investing Capital)</option>
            </select>
          </div>

          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <footer className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </footer>
      </div>
    </div>
  );
}

export default Register;