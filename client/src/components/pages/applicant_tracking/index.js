import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/applicant_tracking.css";

const ApplicantTracking = () => {
  const [applicants, setApplicants] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobFilter, setJobFilter] = useState(""); // optional jobId

  const load = async (pg = 1) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/ats/applicants", {
        params: { page: pg, limit, q: query, jobId: jobFilter },
      });
      if (res.data.success) {
        setApplicants(res.data.applicants);
        setTotal(res.data.total);
        setPage(res.data.page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [query, jobFilter]);

  const viewApplicant = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4000/ats/applicant/${id}`);
      if (res.data.success) setSelected(res.data.applicant);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.post(`http://localhost:4000/ats/applicant/${id}/status`, { status });
      // refresh list and selected
      load(page);
      if (selected && selected.id === id) viewApplicant(id);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadResume = (id) => {
    window.open(`http://localhost:4000/ats/download-resume/${id}`, "_blank");
  };

  return (
    <div className="ats-track-wrapper">
  {/* LEFT PANEL */}
  <div className="ats-track-left">

    {/* SEARCH */}
    <div className="ats-track-search">
      <input
        className="ats-search-input"
        placeholder="Search applicant name / email / resume..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="ats-search-btn" onClick={() => load(1)}>
        Search
      </button>
    </div>

    {/* LIST */}
    <div className="ats-list">
      {loading && <p className="muted">Loading...</p>}

      {applicants.map((a) => (
        <div
          key={a.id}
          className="ats-card"
          onClick={() => viewApplicant(a.id)}
        >
          <div className="ats-card-left">
            <h4 className="ats-name">{a.fullName}</h4>
            <p className="muted">{a.email}</p>
          </div>

          <div className="ats-card-right">
            <div className={`score ${a.ats_score >= 70 ? "good" : "bad"}`}>
              {a.ats_score ?? "N/A"}%
            </div>
            <div className="status">{a.status || "applied"}</div>
          </div>
        </div>
      ))}

      {applicants.length === 0 && !loading && (
        <p className="muted">No applicants</p>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => load(page - 1)}>
          Prev
        </button>
        <span>{page} / {Math.ceil(total / limit) || 1}</span>
        <button disabled={page * limit >= total} onClick={() => load(page + 1)}>
          Next
        </button>
      </div>
    </div>
  </div>

  {/* RIGHT PANEL */}
  <div className="ats-track-right">
    {!selected ? (
      <div className="placeholder">
        <p>Select an applicant to view details</p>
      </div>
    ) : (
      <div className="detail-card">
        <h2>{selected.fullName}</h2>

        <p><b>Email:</b> {selected.email}</p>
        <p><b>Phone:</b> {selected.phone}</p>
        <p><b>ATS Score:</b> {selected.ats_score}%</p>
        <p><b>Status:</b> {selected.status}</p>

        <div className="detail-actions">
          <button onClick={() => updateStatus(selected.id, "shortlisted")}>Shortlist</button>
          <button onClick={() => updateStatus(selected.id, "interview")}>Interview</button>
          <button onClick={() => updateStatus(selected.id, "rejected")}>Reject</button>
          <button onClick={() => updateStatus(selected.id, "hired")}>Mark Hired</button>
          <button onClick={() => downloadResume(selected.id)}>Download Resume</button>
        </div>

        <hr />

        <h3>Extracted Resume Text</h3>
        <pre className="resume-text">
          {selected.resume_text || "No extracted text"}
        </pre>
      </div>
    )}
  </div>
</div>

  );
};

export default ApplicantTracking;
