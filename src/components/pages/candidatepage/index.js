import React, { useState } from "react";
import "../../styles/candidatepage.css";

const CandidatesPage = () => {

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const candidates = [
    {
      name: "Software Engineer",
      email: "john.s@email.com",
      exp: "5+ Years",
      score: 92,
      status: "Interview",
      statusColor: "violet",
      skills: "React, Node.js, AWS",
    },
    {
      name: "John Smith",
      email: "priya.s@email.com",
      exp: "4+ Years",
      score: 92,
      status: "Interview",
      statusColor: "violet",
      skills: "React, AWS",
    },
    {
      name: "Priya Sharma",
      email: "priya.s@email.com",
      exp: "3 Years",
      score: 88,
      status: "Shortlisted",
      statusColor: "blue",
      skills: "UI/UX, Design Tools",
    },
    {
      name: "Product Manager",
      email: "raj.p@email.com",
      exp: "7+ Years",
      score: 95,
      status: "Selected",
      statusColor: "green",
      skills: "Leadership, Agile, AWS",
    }
  ];

  return (

    <div className="cand-wrapper">

      {/* TITLE */}
      <h2 className="cand-heading animate-top">All Candidates</h2>

      {/* FILTERS */}
      <div className="cand-filter-row animate-fade">
        <input className="cand-search-input" placeholder="Search" />

        <div className="cand-chip cand-chip-active">Stage</div>
        <div className="cand-chip">Recruiter</div>
        <div className="cand-chip">Skills</div>
        <div className="cand-chip">Date Applied</div>
      </div>

      {/* TABLE */}
      <div className="cand-table-container animate-up">
        <table className="cand-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Experience</th>
              <th>Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((c, i) => (
              <tr key={i}>
                <td className="cand-name">{c.name}</td>
                <td>{c.email}</td>
                <td>{c.exp}</td>
                <td className="cand-score">{c.score}</td>

                <td>
                  <span className={`cand-status cand-status-${c.statusColor}`}>
                    {c.status}
                  </span>
                </td>

                <td>
                  <button className="cand-action-btn">📤 Upload</button>
                  <button className="cand-action-btn">📄 Resume</button>
                  <button
                    className="cand-menu-btn"
                    onClick={() => setSelectedCandidate(c)}
                  >
                    ⋮
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILS POPUP */}
      {selectedCandidate && (
        <div className="cand-popup animate-popup">
          <h3 className="cand-popup-title">Candidate Details</h3>
          <p className="cand-popup-name">{selectedCandidate.name}</p>

          <div className="cand-popup-item">Profile</div>
          <div className="cand-popup-item">Submitted Resume</div>
          <div className="cand-popup-item">
            Skills: {selectedCandidate.skills}
          </div>
          <div className="cand-popup-item">Timeline</div>

          <button
            className="cand-popup-close"
            onClick={() => setSelectedCandidate(null)}
          >
            ✖
          </button>
        </div>
      )}

    </div>
  );
};

export default CandidatesPage;
