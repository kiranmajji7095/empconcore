import { useEffect, useState } from "react";
import "./index.css";

const ITEMS_PER_PAGE = 5;

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("http://localhost:4000/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setRecent(data.recent || []);
      });
  }, []);

  if (!stats) return <p className="admin-loading">Loading...</p>;

  /* =====================
     DERIVED COUNTS (TRUTH)
  ===================== */
  const totalCount = recent.length;

  // ✅ NEW (score-based, matches backend)
const passedCount = recent.filter((r) => r.score >= 10).length;
const failedCount = recent.filter((r) => r.score < 10).length;

  const violationCount = recent.filter((r) => (r.violations ?? 0) > 0).length;

  /* =====================
     FILTER DATA
  ===================== */
  const filteredData = recent.filter((r) => {
  if (filter === "PASSED") return r.score >= 10;
  if (filter === "FAILED") return r.score < 10;
  if (filter === "VIOLATIONS") return (r.violations ?? 0) > 0;
  return true;
});

  /* =====================
     PAGINATION (AFTER FILTER)
  ===================== */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRows = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="admin-main">
      <h1 className="admin-title">Exam Analytics</h1>

      {/* KPI CARDS */}
      <div className="admin-cards">
        <div
          className={`admin-card total-card ${
            filter === "ALL" ? "active-card" : ""
          }`}
          onClick={() => {
            setFilter("ALL");
            setCurrentPage(1);
          }}
        >
          <span className="card-label">Total</span>
          <span className="card-value">{totalCount}</span>
        </div>

        <div
          className={`admin-card passed-card ${
            filter === "PASSED" ? "active-card" : ""
          }`}
          onClick={() => {
            setFilter("PASSED");
            setCurrentPage(1);
          }}
        >
          <span className="card-label">Passed</span>
          <span className="card-value">{passedCount}</span>
        </div>

        <div
          className={`admin-card failed-card ${
            filter === "FAILED" ? "active-card" : ""
          }`}
          onClick={() => {
            setFilter("FAILED");
            setCurrentPage(1);
          }}
        >
          <span className="card-label">Failed</span>
          <span className="card-value">{failedCount}</span>
        </div>

        <div
          className={`admin-card violation-card ${
            filter === "VIOLATIONS" ? "active-card" : ""
          }`}
          onClick={() => {
            setFilter("VIOLATIONS");
            setCurrentPage(1);
          }}
        >
          <span className="card-label">User Issues</span>
          <span className="card-value">{violationCount}</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Score</th>
              <th>Status</th>
              <th>User Issues</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-records">
                  No records found
                </td>
              </tr>
            ) : (
              currentRows.map((r, i) => (
                <tr key={i} className="admin-table-row">
                  <td>{r.email}</td>
                  <td>{r.score}</td>
                  <td className={r.score >= 10 ? "status-pass" : "status-fail"}>
  {r.score >= 10 ? "PASS" : "FAIL"}
</td>

                  <td>{r.violations ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
