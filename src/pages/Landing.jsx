import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const BOROUGHS = [
  { num: "01", name: "Manhattan",    tagline: "The Heart of the City",   accent: "#4a96b4", bg: "#e8f5fc", path: "/manhattan",    icon: "🏙️" },
  { num: "02", name: "Brooklyn",     tagline: "City of Makers",          accent: "#4a9e72", bg: "#e8f7ee", path: "/brooklyn",     icon: "🌉" },
  { num: "03", name: "Queens",       tagline: "The World's Borough",     accent: "#4a96b4", bg: "#e8f5fc", path: "/queens",       icon: "🎵" },
  { num: "04", name: "The Bronx",    tagline: "Birthplace of Hip-Hop",   accent: "#4a9e72", bg: "#e8f7ee", path: "/bronx",        icon: "🎤" },
  { num: "05", name: "Staten Island",tagline: "The Forgotten Borough",   accent: "#4a96b4", bg: "#e8f5fc", path: "/staten-island",icon: "⛴️" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const handleNavigate = (path) => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => navigate(path), 750);
  };

  return (
    <div className="landing-root">
      {/* ── HERO ── */}
      <div className={`hero${leaving ? " hero--leaving" : ""}`}>
        {/* Nav */}
        <nav className="landing-nav">
          <div className="nav-logo">
            <div className="nav-logo-dot">SQ</div>
            <span className="nav-logo-text">Sounds of Queens</span>
          </div>
          <div className="nav-links">
            <button className="nav-link">About</button>
            <button className="nav-link">Boroughs</button>
            <button className="nav-cta" onClick={() => handleNavigate("/map")}>
              Open Map
            </button>
          </div>
        </nav>

        {/* Hero body */}
        <div className="hero-body">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span className="hero-badge-text">New York City · Est. 1898</span>
          </div>

          <h1 className="hero-h1">Five Boroughs.</h1>
          <h1 className="hero-h1-italic">One City.</h1>

          <p className="hero-sub">
            Explore the neighborhoods, culture, and sounds that make each
            borough of New York City uniquely its own.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => handleNavigate("/map")}>
              Explore the Map →
            </button>
            <button className="btn-ghost">
              Learn More
            </button>
          </div>

          <div className="hero-scroll-hint">
            <div className="hero-scroll-line" />
            <span className="hero-scroll-label">Scroll</span>
          </div>
        </div>

        {/* Clouds */}
        <div className="hero-clouds">
          <div className="cloud cloud--1" />
          <div className="cloud cloud--2" />
          <div className="cloud cloud--3" />
          <div className="cloud cloud--4" />
          <div className="cloud cloud--5" />
          <div className="cloud cloud--6" />
        </div>
      </div>

      {/* ── BOROUGHS ── */}
      <div className="boroughs-section">
        <div className="boroughs-header">
          <div className="boroughs-header-left">
            <p className="boroughs-overline">The Five Boroughs</p>
            <h2 className="boroughs-title">
              Choose Where<br />
              <span className="boroughs-title-em">to Begin</span>
            </h2>
          </div>
          <div className="boroughs-divider" />
        </div>

        <div className="borough-grid">
          {BOROUGHS.map((b) => (
            <BoroughCard key={b.name} borough={b} onClick={() => handleNavigate(b.path)} />
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <span className="footer-logo">Sounds of Queens</span>
        <span className="footer-copy">© 2026 · New York City</span>
      </footer>
    </div>
  );
}

function BoroughCard({ borough, onClick }) {
  return (
    <button className="borough-card" onClick={onClick}>
      <div
        className="borough-card-bar"
        style={{
          background: `linear-gradient(90deg, ${borough.accent}, ${borough.accent === "#4a96b4" ? "#4a9e72" : "#4a96b4"})`,
        }}
      />

      <div className="borough-card-top">
        <span className="borough-card-num" style={{ color: borough.accent }}>
          {borough.num}
        </span>
        <div className="borough-card-icon" style={{ background: borough.bg }}>
          {borough.icon}
        </div>
      </div>

      <h3 className="borough-card-name">{borough.name}</h3>
      <p className="borough-card-tagline">{borough.tagline}</p>

      <div className="borough-card-link" style={{ color: borough.accent }}>
        Explore <span className="borough-card-arrow">→</span>
      </div>
    </button>
  );
}
