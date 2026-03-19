
import React, { useState } from "react";
import "../../styles/candidatecard.css";

// import avatar from "/mnt/data/Generated Image November 20, 2025 - 12_14AM.png";

export default function ProfileCard() {
  const [rating, setRating] = useState(8);
  const [tab, setTab] = useState("overview");

  const renderStars = (score) => {
    const full = Math.floor(score);
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      arr.push(
        <span key={i} className={`pc-star ${i <= full ? "pc-star-on" : ""}`}>
          ★
        </span>
      );
    }
    return <div className="pc-stars">{arr}</div>;
  };

  return (
    <div className="pc-root">
      <div className="pc-wrapper">
        {/* MAIN SECTION */}
        <main className="pc-main">

          {/* HEADER */}
          <section className="pc-card pc-header-card">
            <div className="pc-header">
              {/* <img src={avatar} alt="avatar" className="pc-avatar" /> */}

              <div className="pc-person">
                <h1 className="pc-name">Priya Sharma</h1>
                <p className="pc-role">UX Designer — Bengaluru, India</p>
                <p className="pc-applied">Applied for: Senior UX Designer</p>
              </div>

              <div className="pc-meta">
                <span className="pc-status">Shortlisted</span>
                <div className="pc-score">{rating}</div>
              </div>
            </div>

            {/* TABS */}
            <div className="pc-tabs">
              <button
                className={`pc-tab ${tab === "overview" ? "pc-tab-active" : ""}`}
                onClick={() => setTab("overview")}
              >
                Overview
              </button>

              <button
                className={`pc-tab ${tab === "resume" ? "pc-tab-active" : ""}`}
                onClick={() => setTab("resume")}
              >
                Resume
              </button>

              <button
                className={`pc-tab ${tab === "activity" ? "pc-tab-active" : ""}`}
                onClick={() => setTab("activity")}
              >
                Activity
              </button>
            </div>
          </section>

          {/* RATING + SKILLS */}
          <section className="pc-card pc-section">
            <div className="pc-flex">

              {/* Rating */}
              <div className="pc-rate-box">
                <div className="pc-rate-circle">
                  <span className="pc-rate-num">{rating}</span>
                </div>

                <div className="pc-rate-slider">
                  <input
                    type="range"
                    className="pc-range"
                    value={rating}
                    min="0"
                    max="10"
                    onChange={(e) => setRating(Number(e.target.value))}
                  />

                  <div className="pc-range-labels">
                    <span>0</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="pc-skill-col">
                <div className="pc-skill-card">
                  <h3 className="pc-skill-title">Communication</h3>
                  {renderStars(4.2)}
                  <p className="pc-skill-note">
                    Clear verbal & written communication with stakeholders.
                  </p>
                </div>

                <div className="pc-skill-card">
                  <h3 className="pc-skill-title">Problem Solving</h3>
                  {renderStars(4.6)}
                  <p className="pc-skill-note">
                    Strong at mapping UX problems into MVP solutions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Strengths / Weaknesses */}
          <section className="pc-grid-2">
            <div className="pc-card pc-info-box">
              <h3 className="pc-info-title">Strengths</h3>
              <ul className="pc-list">
                <li>High-fidelity prototyping</li>
                <li>Cross-functional collaboration</li>
                <li>User research & testing</li>
              </ul>
            </div>

            <div className="pc-card pc-info-box">
              <h3 className="pc-info-title">Weaknesses</h3>
              <ul className="pc-list">
                <li>Over-polishing interactions</li>
                <li>Prefers iteration over rapid release cycles</li>
              </ul>
            </div>
          </section>

          {/* RECOMMENDATION */}
          <section className="pc-card pc-reco">
            <div>
              <h3 className="pc-reco-title">Recommendation</h3>
              <p className="pc-reco-note">
                Strong fit for senior UX roles. Recommended for assignment + final round.
              </p>
            </div>

            <div className="pc-reco-actions">
              <button className="pc-btn pc-btn-reject">Reject</button>
              <button className="pc-btn pc-btn-green">Invite</button>
              <button className="pc-btn-main">Proceed</button>
            </div>
          </section>
        </main>

        {/* SIDEBAR */}
        <aside className="pc-side">
          <div className="pc-card pc-side-card">

            <h3 className="pc-side-title">Stage Tracker</h3>

            <div className="pc-stages">

              <div className="pc-stage-item">
                <div className="pc-stage-circle pc-active">1</div>
                <span className="pc-stage-label">Screening</span>
              </div>

              <div className="pc-stage-item">
                <div className="pc-stage-circle">2</div>
                <span className="pc-stage-label">Interview</span>
              </div>

              <div className="pc-stage-item">
                <div className="pc-stage-circle">3</div>
                <span className="pc-stage-label">Offer</span>
              </div>

              <div className="pc-current">Current: Screening</div>
            </div>

            <div className="pc-divider" />

            <label className="pc-field-label">Assign to</label>
            <select className="pc-select">
              <option>Select recruiter</option>
              <option>Neha R</option>
              <option>Vikram P</option>
            </select>

          </div>
        </aside>

      </div>
    </div>
  );
}
