import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const Navigate = useNavigate();
  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="navbar">
        <p className="logo">PolicyPal</p>
        <div className="auth-buttons">
          <button className="btn btn-outline" onClick={() => Navigate("/auth")}>
            Sign Up
          </button>
          <button className="btn btn-primary" onClick={() => Navigate("/auth")}>
            Log In
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <h1>Welcome to PolicyPal</h1>
        <p>
          Your trusted assistant for managing and understanding your insurance
          policies effortlessly.
        </p>
        <button
          className="btn btn-primary large-btn"
          onClick={() => Navigate("/auth")}
        >
          Get Started
        </button>
      </main>

      {/* Footer */}
      <footer className="footer">© 2025 PolicyPal. All rights reserved.</footer>
    </div>
  );
};

export default HomePage;
