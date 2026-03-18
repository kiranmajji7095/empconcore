import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/hranalytics.css";

// 📊 CHART IMPORTS
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const ExamAnalytics = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // 📄 Pagination
  const [page, setPage] = useState(1);
  const recordsPerPage = 8;

  // 📌 Load Data from Backend
  useEffect(() => {
    loadSummary();
    loadJobs();
    loadCandidates();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await fetch("http://localhost:4000/hr/exam-analytics/summary");
      const data = await res.json();
      setStats(data.stats || data || {});
    } catch {
      console.warn("Summary fetch failed");
      setStats({});
    }
  };
  const uniqueByEmail = (list) => {
  const map = new Map();

  list.forEach(item => {
    if (!item?.email) return;
    map.set(item.email, item); // keep latest
  });

  return Array.from(map.values());
};

  const loadJobs = async () => {
    try {
      const res = await fetch("http://localhost:4000/hr/exam-analytics/jobs");
      const data = await res.json();
      setJobs(Array.isArray(data.rows) ? data.rows : data);
    } catch {
      console.warn("Jobs fetch failed");
      setJobs([]);
    }
  };

  const loadCandidates = async () => {
  try {
    const res = await fetch("http://localhost:4000/hr/exam-analytics/candidates");
    const data = await res.json();

    setCandidates(Array.isArray(data.rows) ? data.rows : []);
  } catch (err) {
    console.warn("Candidate fetch failed", err);
    setCandidates([]);
  }
};


  // 🚦 SAFE Filter + Pagination
  const filteredCandidates = uniqueByEmail(
  Array.isArray(candidates) ? candidates : []
)
  .filter(c =>
    (c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
     c.email?.toLowerCase().includes(search.toLowerCase()) ||
     c.skills?.toLowerCase().includes(search.toLowerCase()))
  )
  .filter(c => roleFilter === "All" ? true : c.job_role === roleFilter)
  .filter(c => statusFilter === "All" ? true : c.status === statusFilter);

  const start = (page - 1) * recordsPerPage;
  const paginatedData = filteredCandidates.slice(start, start + recordsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / recordsPerPage));

  return (
    <div className="hr-analytics-container">

      {/* 🔙 Back */}
      <button className="hr-back-btn" onClick={() => navigate("/hrdashboard")}>
        ← Back to HR Dashboard
      </button>

      {/* 🔍 Filters */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Name, Email or Skills..."
          className="filter-input"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="All">All Job Roles</option>
          {jobs.map((j, i) => (
            <option key={i} value={j.job_role}>{j.job_role}</option>
          ))}
        </select>

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>
      </div>

      {/* 📊 CHARTS */}
      <div className="chart-card">
  <h3>Exam Performance Overview</h3>

  <div className="chart-small">
    <Doughnut
  data={{
    labels: ["Failed", "Passed"],
    datasets: [
      {
        data: [
          stats.hiresThisMonth || 0,
          (stats.applicants || 0) - (stats.hiresThisMonth || 0),
        ],
        backgroundColor: ["#170966", "#44b0ef"],
      },
    ],
  }}
/>

  </div>

</div>
      <div className="chart-card">
        <h3>Job Role vs Average Score</h3>
        <Bar
          data={{
            labels: jobs.map(j => j.job_role),
            datasets: [{
              label: "Avg Score",
              data: jobs.map(j => j.avg_score),
              backgroundColor: "#3b82f6",
            }],
          }}
        />
      </div>

      {/* 📄 TABLE */}
      <h3>Candidate Exam Records</h3>
      <table className="hr-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Skills</th>
            <th>Job Role</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((c, i) => (
              <tr key={i}>
  <td>{c.fullName}</td>
  <td>{c.email}</td>
  <td className="skills-cell">{c.skills?.slice(0, 80)}...</td>
  <td>{c.job_role}</td>
  <td>{c.score}%</td>
  <td className={c.status === "PASS" ? "pass" : "fail"}>
    {c.status}
  </td>
</tr>

            ))
          ) : (
            <tr>
              <td colSpan="6">No candidate records found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ⏳ Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span> Page {page} of {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

    </div>
  );
};

export default ExamAnalytics;
