import React, { useState, useEffect } from "react";
import "../../styles/candidateprofile.css";
import { useParams, useNavigate } from "react-router-dom";

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const [stage, setStage] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // ====================
  // 📌 FETCH CANDIDATE DATA
  // ====================
  useEffect(() => {
    fetch(`http://localhost:4000/hr/candidate/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCandidate(data);
        setStage(data.status);
      })
      .catch(() => alert("Error loading candidate data"));
  }, [id]);

  if (!candidate) return <h2 className="loading">Loading Candidate...</h2>;

  // Timeline handling if stored as text/json
  let timeline = [];
  try {
    timeline = candidate.experience ? JSON.parse(candidate.experience) : [];
  } catch {
    timeline = [];
  }

  // Skills from comma separated list
  const skills = candidate.skills ? candidate.skills.split(",") : [];

  // Helper for stage update
  const handleSetStage = (newStage) => {
    setStage(newStage);
    // 🔥 FUTURE: Hit update API
  };

  return (
    <div className="cp-wrapper">

      {/* BACK BUTTON */}
      <button className="cp-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* MAIN GRID */}
      <div className="cp-main-grid">
        
        {/* LEFT SECTION */}
        <div className="cp-card cp-card-left animate-cp-slideIn">

          {/* HEADER */}
          <div className="cp-header">
            <div className="cp-leftmeta">
              <img
                className="cp-avatar"
                src={candidate.photo || "/default-user.png"}
                alt="avatar"
              />

              <div className="cp-personal">
                <h1 className="cp-name">{candidate.full_name}</h1>

                <div className="cp-contact">
                  <div className="cp-email">{candidate.email}</div>
                  <div className="cp-phone">{candidate.phone || "No Phone"}</div>
                </div>

                <div className="cp-appliedFor">
                  Job Applied For: <strong>{candidate.job_role}</strong>
                </div>
              </div>
            </div>

            <div className="cp-rightmeta">
              <div className="cp-meta-row">
                <div className="cp-meta-label">Status</div>
                <div className="cp-status-badge cp-status-violet">
                  {candidate.status}
                </div>
              </div>

              <div className="cp-meta-row cp-score-row">
                <div className="cp-meta-label">Score</div>
                <div className="cp-score-badge">{candidate.score}%</div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="cp-tabs">
            {["overview", "resume", "comments", "activity"].map((t) => (
              <button
                key={t}
                className={`cp-tab ${activeTab === t ? "cp-tab-active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="cp-tab-content">

            {/* ================= OVERVIEW TAB ================= */}
            {activeTab === "overview" && (
              <div className="cp-section cp-overview">

                <div className="cp-grid-two">
                  
                  <div className="cp-section-block">
                    <h4 className="cp-section-title">Experience Timeline</h4>
                    {timeline.length > 0 ? (
                      timeline.map((it, idx) => (
                        <div key={idx} className="cp-timeline-row">
                          <div className="cp-timeline-dot" />
                          <div className="cp-timeline-text">
                            <div className="cp-timeline-title">{it.title}</div>
                            <div className="cp-timeline-years">{it.years}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No experience timeline available</p>
                    )}
                  </div>

                  <div className="cp-section-block">
                    <h4 className="cp-section-title">AI Resume Summary</h4>
                    <div className="cp-ai-summary">
                      {candidate.ai_summary || "No AI summary available"}
                    </div>
                  </div>

                </div>

                <div className="cp-grid-three">

                  <div className="cp-small-block">
                    <h5 className="cp-small-title">Skills</h5>
                    <div className="cp-skill-box">
                      {skills.length > 0 ? (
                        skills.map((s, i) => (
                          <span key={i} className="cp-skill-tag">{s.trim()}</span>
                        ))
                      ) : (
                        <p>No skills added</p>
                      )}
                    </div>
                  </div>

                  <div className="cp-small-block">
                    <h5 className="cp-small-title">Education</h5>
                    <div className="cp-education">
                      {candidate.education || "No education details"}
                    </div>
                  </div>

                  <div className="cp-small-block">
                    <h5 className="cp-small-title">HR Notes</h5>
                    <textarea
                      className="cp-notes-input"
                      placeholder="Add notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= RESUME TAB ================= */}
            {activeTab === "resume" && (
              <div className="cp-section cp-resume">
                <h4 className="cp-section-title">Resume</h4>

                {candidate.resume_url ? (
                  <iframe
                    src={candidate.resume_url}
                    className="cp-resume-viewer"
                    title="Resume"
                  />
                ) : (
                  <p>No resume available</p>
                )}
              </div>
            )}

            {/* ================= COMMENTS TAB ================= */}
            {activeTab === "comments" && (
              <div className="cp-section cp-comments">
                <h4 className="cp-section-title">Comments</h4>
                <p>Feedback tools will be added here.</p>
              </div>
            )}

            {/* ================= ACTIVITY TAB ================= */}
            {activeTab === "activity" && (
              <div className="cp-section cp-activity">
                <h4 className="cp-section-title">Activity</h4>
                <ul className="cp-activity-list">
                  <li>Applied — {candidate.applied_date}</li>
                  <li>Status Update — {candidate.status}</li>
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="cp-card cp-card-right animate-cp-slideInRight">

          <h3 className="cp-sidebar-title">Assigned To</h3>
          <select
            className="cp-select"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option>Jane Doe</option>
            <option>Ravi Kumar</option>
            <option>Mahesh Patel</option>
          </select>

          <div className="cp-divider" />

          <h3 className="cp-sidebar-title">Stage</h3>

          {["Applied", "Interview", "Offer"].map((s) => (
            <div key={s} className="cp-stage-node">
              <div
                className={`cp-stage-circle ${stage === s ? "cp-active" : ""}`}
                onClick={() => handleSetStage(s)}
              >
                {stage === s ? "✓" : ""}
              </div>
              <div className="cp-stage-label">{s}</div>
            </div>
          ))}

          <div className="cp-current-stage">
            Current: <strong>{stage}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
