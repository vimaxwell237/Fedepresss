import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

const FedexNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tracking, setTracking] = useState("");
  const navigate = useNavigate();

  const handleTrackSubmit = e => {
    e.preventDefault();
    if (tracking.trim()) {
      navigate(`/track/${tracking.trim()}`);
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Company Logo" className="logo-image" />
        </Link>

        <div className="nav-controls">
          <button
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line top" />
            <span className="hamburger-line middle" />
            <span className="hamburger-line bottom" />
          </button>

          <div className={`nav-content ${menuOpen ? "active" : ""}`}>
            <ul className="nav-menu">
              <li><Link to="/shipping" onClick={() => setMenuOpen(false)} className="nav-link">Shipping</Link></li>
              <li><Link to="/tracking" onClick={() => setMenuOpen(false)} className="nav-link">Tracking</Link></li>
              <li><Link to="/locations" onClick={() => setMenuOpen(false)} className="nav-link">Locations</Link></li>
              <li><Link to="/support" onClick={() => setMenuOpen(false)} className="nav-link">Support</Link></li>
            </ul>

            <form className="tracking-form" onSubmit={handleTrackSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  value={tracking}
                  onChange={e => setTracking(e.target.value)}
                  className="tracking-input"
                />
                <button type="submit" className="track-button">
                  <span>Track</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </form>

            <Link
              to="/get-a-quote"
              className="nav-cta"
              onClick={() => setMenuOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FedexNavbar;