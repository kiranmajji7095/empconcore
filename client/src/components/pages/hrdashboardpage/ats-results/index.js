import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const ATSResults = () => {
  const navigate = useNavigate();
  const [atsList, setAtsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/hr/ats-results")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAtsList(data.rows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="ats-page">
      {/* HEADER */}
      <div className="ats-header">
        <h2 className="ats-title">ATS Qualified Candidates</h2>
        <button
          className="ats-back-btn"
          onClick={() => navigate("/hrdashboard")}
        >
          ← Back
        </button>
      </div>

      {/* TABLE */}
      <div className="ats-table-wrapper">
        <table className="ats-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ATS Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {/* LOADING */}
            {loading && (
              <tr>
                <td colSpan="4" className="ats-empty">
                  Loading ATS data...
                </td>
              </tr>
            )}

            {/* EMPTY */}
            {!loading && atsList.length === 0 && (
              <tr>
                <td colSpan="4" className="ats-empty">
                  No ATS qualified candidates
                </td>
              </tr>
            )}

            {/* ✅ FIXED DATA RENDER */}
            {!loading &&
              atsList.length > 0 &&
              atsList.map((c, i) => (
                <tr key={i}>
                  <td>{c.fullName}</td>
                  <td>{c.email}</td>
                  <td>
                    <span
                      className={`ats-score ${
                        c.ats_score >= 50 ? "high" : "medium"
                      }`}
                    >
                      {c.ats_score}%
                    </span>
                  </td>
                  <td>{c.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ATSResults;