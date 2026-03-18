import React, { useEffect, useState } from "react";
import "../../styles/reportdashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const ReportsDashboard = () => {
  const API = "http://localhost:4000/hr/exam-analytics";
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [summary, setSummary] = useState({});
  const [monthly, setMonthly] = useState(null);
  const [stages, setStages] = useState(null);
  const [topJobs, setTopJobs] = useState([]);

  const [showDownload, setShowDownload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  /* ===============================
     LOAD REPORT DATA
  =============================== */
  useEffect(() => {
    const loadReports = async () => {
      try {
        const [s, m, c, j] = await Promise.all([
          axios.get(`${API}/summary`),
          axios.get(`${API}/monthly-applications`),
          axios.get(`${API}/candidate-stages`),
          axios.get(`${API}/top-jobs`)
        ]);

        setSummary(s.data || {});
        setMonthly(m.data || null);
        setStages(c.data || null);
        setTopJobs(j.data?.data || []);
      } catch (err) {
        console.error("Report load error:", err);
      }
    };

    loadReports();
  }, []);

  /* ===============================
     DOWNLOAD REPORT
  =============================== */
  const downloadReport = async (type) => {
    try {
      setDownloading(true);

      const res = await axios.get(
        `http://localhost:4000/hr/reports/download?type=${type}`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${type}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setShowDownload(false);
    } catch {
      alert("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="report-container">
      {/* BACK */}
      <button className="report-back-btn" onClick={() => navigate("/hrdashboard")}>
        ← Back to Dashboard
      </button>

      <h1 className="report-title">Reports & Analytics</h1>

      <button
        className="report-download-btn"
        onClick={() => setShowDownload(true)}
      >
        ⬇ Download Report
      </button>

      {user?.role === "admin" && (
        <p className="access-msg">🔐 Admin Access</p>
      )}

      {/* SUMMARY */}
      <div className="report-summary-grid">
        <div className="report-card">
          <p className="report-card-label">Total Applicants</p>
          <h2 className="report-card-value">{summary.applicants || 0}</h2>
        </div>

        <div className="report-card">
          <p className="report-card-label">Hires This Month</p>
          <h2 className="report-card-value">{summary.hiresThisMonth || 0}</h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="report-charts-grid">
        <div className="report-card report-chart-card">
          <h3 className="report-card-title">📈 Monthly Applications</h3>
          {monthly?.months ? (
            <Line
              data={{
                labels: monthly.months,
                datasets: [{
                  data: monthly.values,
                  borderColor: "#7a5ef7",
                  backgroundColor: "#7a5ef755",
                  tension: 0.4,
                  pointRadius: 3
                }]
              }}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }}
            />
          ) : <p>No data</p>}
        </div>

        <div className="report-card report-chart-card">
          <h3 className="report-card-title">🟠 Candidate Stages</h3>
          {stages?.labels ? (
            <Doughnut
              data={{
                labels: stages.labels,
                datasets: [{
                  data: stages.values,
                  backgroundColor: [
                    "#7A5EF7",
                    "#4CAF50",
                    "#FFC107",
                    "#FF5252"
                  ]
                }]
              }}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } }
              }}
            />
          ) : <p>No data</p>}
        </div>
      </div>

      {/* TABLE */}
      <div className="report-card">
        <h3 className="report-card-title">⭐ Top Performing Jobs</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>Job Role</th>
              <th>Applicants</th>
            </tr>
          </thead>
          <tbody>
            {topJobs.length ? topJobs.map((j, i) => (
              <tr key={i}>
                <td>{j.job_role}</td>
                <td>{j.total}</td>
              </tr>
            )) : (
              <tr><td colSpan="2">No Data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DOWNLOAD MODAL */}
      {showDownload && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <h3>Download Reports</h3>
            <p>Select duration</p>

            <button onClick={() => downloadReport("day")} disabled={downloading}>
              📅 Daily
            </button>
            <button onClick={() => downloadReport("week")} disabled={downloading}>
              📆 Weekly
            </button>
            <button onClick={() => downloadReport("month")} disabled={downloading}>
              🗓 Monthly
            </button>

            <button className="cancel-btn" onClick={() => setShowDownload(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsDashboard;