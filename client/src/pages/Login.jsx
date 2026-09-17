import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/UserService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const user = {
        email: email.trim().toLowerCase(),
        password: password,
      };

      const response = await loginUser(user);

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));

        if (response.data.role === "Startup") {
          navigate("/startup-dashboard");
        } else if (response.data.role === "Investor") {
          navigate("/investor-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
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
          <h1>Welcome Back</h1>
          <p>Sign in to your Start-to-Star account</p>
        </header>

        {errorMessage && (
          <div className="auth-alert auth-alert-error">
            {errorMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <footer className="auth-footer">
          Don't have an account? <Link to="/register">Create an account</Link>
        </footer>
      </div>
    </div>
  );
}

export default Login;