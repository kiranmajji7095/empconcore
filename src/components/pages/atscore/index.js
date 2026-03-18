import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./index.css";

const ATSScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const user = state?.user || {};
  const atsScore = state?.atsScore || 0;
  const eligible = state?.eligible || false;

  // ✅ JOB ROLE COMING FROM JOBLIST
  const jobRole = state?.job?.job_title || "Web Developer";

  const [popup, setPopup] = useState(false);

  // ✅ DOWNLOAD PDF FUNCTION
  const downloadPDF = () => {
    window.open(
      `http://localhost:4000/ats/download-pdf/${user.email}`,
      "_blank"
    );
  };

  return (
    <div className="ats-wrapper">

      {/* BACK */}
      <button className="ats-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* ATS SCORE CARD */}
      <div className="ats-simple-card">
        <h1 className="ats-simple-title">ATS Result</h1>

        {/* CIRCLE SCORE */}
<div
  className="ats-simple-circle"
  style={{
    background: `conic-gradient(
      ${atsScore < 70 ? "#ef4444" : atsScore < 80 ? "#f59e0b" : "#22c55e"} 0% ${atsScore}%,
      #e5e7eb ${atsScore}% 100%
    )`,
  }}
>
  <div className="ats-simple-inner">
    <span
      className="ats-simple-score"
      style={{
        color:
          atsScore < 70
            ? "#ef4444"
            : atsScore < 80
            ? "#f59e0b"
            : "#22c55e",
      }}
    >
      {atsScore}%
    </span>
    <span className="ats-simple-label">ATS Score</span>
  </div>
</div>

        <p className="ats-simple-status">
          {eligible
            ? "Eligible for Exam 🎉"
            : "Not Eligible ❌"}
        </p>

        {/* POPUP */}
        {eligible && (
          <button
            className="ats-simple-btn"
            onClick={() => setPopup(true)}
          >
            Download Resume PDF
          </button>
        )}
      </div>

      {/* POPUP BOX */}
      {popup && (
        <div className="ats-popup-overlay">
          <div className="ats-popup-box">

            <h2>Resume Download</h2>

            {/* DOWNLOAD BUTTON */}
            <button
              className="ats-popup-download"
              onClick={downloadPDF}
            >
              Download PDF
            </button>

            {/* START EXAM BUTTON */}
            <button
              className="ats-popup-exam"
              onClick={() =>
                navigate("/exampage", {
                  state: {
                    email: user.email,
                    jobRole: jobRole, // ✅ Pass Correct Role
                  },
                })
              }
            >
              Start Skill Exam
            </button>

            {/* CLOSE */}
            <button
              className="ats-popup-close"
              onClick={() => setPopup(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScreen;
