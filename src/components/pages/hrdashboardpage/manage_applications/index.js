import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const ManageApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("http://localhost:4000/hr/manage-applications")
      .then(res => res.json())
      .then(data => {
        if (data.success) setApplications(data.rows);
      });
  }, []);

  const updateStatus = (email, status) => {
    fetch("http://localhost:4000/hr/manage-applications/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, status })
    }).then(() => {
      setApplications(prev =>
        prev.map(a =>
          a.email === email ? { ...a, status } : a
        )
      );
    });
  };

  const filteredApps =
    filter === "ALL"
      ? applications
      : applications.filter(a => a.status === filter);
  const deleteApplication = (email) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    fetch("http://localhost:4000/hr/manage-applications/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApplications(prev =>
            prev.filter(app => app.email !== email)
          );
        }
      });
  };

  return (
    <div className="manage-container">

      {/* HEADER */}
      <div className="manage-header">
        <h2>📂 Manage Applications</h2>
        <button
          className="manage-back-btn"
          onClick={() => navigate("/hrdashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* FILTER */}
      <div className="manage-filter">
        <select
          className="manage-filter-select"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="APPLIED">Applied</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="INTERVIEW">Interview</option>
          <option value="PASS">Selected</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="manage-table">
        <thead className="manage-table-head">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Job Role</th>
            <th>Score</th>
            <th>Status</th>
            <th>Action</th>
            <th>Delete</th>

          </tr>
        </thead>

        <tbody className="manage-table-body">
          {filteredApps.length === 0 && (
            <tr>
              <td colSpan="6" className="manage-empty">
                No applications found
              </td>
            </tr>
          )}

          {filteredApps.map((app, i) => (
            <tr key={i}>
              <td>{app.fullName}</td>
              <td>{app.email}</td>
              <td>{app.job_role}</td>
              <td>{app.score}</td>
              <td>
                <span className={`status-badge ${app.status}`}>
                  {app.status}
                </span>
              </td>
              <td>
                <select
                  className="status-select"
                  value={app.status}
                  onChange={e =>
                    updateStatus(app.email, e.target.value)
                  }
                >
                  <option value="APPLIED">Applied</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="PASS">Selected</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteApplication(app.email)}
                >
                  🗑 Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default ManageApplications;
