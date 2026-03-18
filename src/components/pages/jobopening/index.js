import React, { useState } from "react";
import "../../styles/jobopening.css";
import { useNavigate } from "react-router-dom";

const JobOpeningsPage = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Software Engineer",
      dept: "Engineering",
      exp: "3-5 Years",
      applicants: 125,
      status: "Open",
      isEditing: false,
    },
    {
      id: 2,
      title: "UX Designer",
      dept: "Design",
      exp: "3-5 Years",
      applicants: 180,
      status: "Open",
      isEditing: false,
    },
    {
      id: 3,
      title: "UX Specialist",
      dept: "Design",
      exp: "3-5 Years",
      applicants: 125,
      status: "Open",
      isEditing: false,
    },
    {
      id: 4,
      title: "Product Manager",
      dept: "Engineering",
      exp: "3-5 Years",
      applicants: 125,
      status: "Open",
      isEditing: false,
    },
  ]);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New job inputs
  const [newJob, setNewJob] = useState({
    title: "",
    dept: "",
    exp: "",
    applicants: "",
    status: "Open",
  });

  // Toggle Edit Mode
  const toggleEdit = (id) => {
    setJobs(
      jobs.map((job) =>
        job.id === id ? { ...job, isEditing: !job.isEditing } : job
      )
    );
  };

  // Delete job
  const deleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  // Save New Job with Validation
  const saveNewJob = () => {
    const { title, dept, exp, applicants, status } = newJob;

    // Check if any field is empty
    if (!title || !dept || !exp || !applicants || !status) {
      alert("Please fill all details");
      return;
    }

    setJobs([
      ...jobs,
      {
        id: Date.now(),
        ...newJob,
        applicants: Number(applicants),
        isEditing: false,
      },
    ]);

    // Close modal
    setShowCreateModal(false);

    // Reset form
    setNewJob({
      title: "",
      dept: "",
      exp: "",
      applicants: "",
      status: "Open",
    });
  };

  return (
    <div className="jo-page-container">

      {/* HEADER */}
      <div className="jo-header-section">
        <h1 className="jo-header-title">Job Openings</h1>

        <button
          className="jo-create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          + Create New Job
        </button>
      </div>

      {/* FILTER SECTION */}
      <div className="jo-filter-row">
        <input className="jo-search-input" placeholder="Search by title..." />

        <select className="jo-select-field">
          <option value="">Location</option>
          <option value="india">India</option>
          <option value="remote">Remote</option>
        </select>

        <select className="jo-select-field">
          <option>Status</option>
          <option>Open</option>
          <option>Closed</option>
        </select>

        <select className="jo-select-field">
          <option>Experience</option>
          <option>0-2 Years</option>
          <option>3-5 Years</option>
          <option>6-10 Years</option>
        </select>
      </div>

      {/* JOB GRID */}
      <div className="jo-job-grid">
        {jobs.map((job) => (
          <div className="jo-job-card" key={job.id}>

            {/* VIEW MODE */}
            {!job.isEditing && (
              <>
                <h3 className="jo-job-title">{job.title}</h3>
                <p className="jo-job-info">Department: {job.dept}</p>
                <p className="jo-job-info">Experience: {job.exp}</p>
                <p className="jo-job-applicants">Applicants: {job.applicants}</p>

                <div className="jo-card-icons">
                  <span className="jo-icon" onClick={() => toggleEdit(job.id)}>✏</span>
                  <span className="jo-icon">👁</span>
                  <span className="jo-icon" onClick={() => deleteJob(job.id)}>🗑</span>
                </div>
              </>
            )}

            {/* EDIT MODE */}
            {job.isEditing && (
              <div className="jo-edit-form">
                <input className="jo-edit-input" defaultValue={job.title} />
                <input className="jo-edit-input" defaultValue={job.exp} />

                <select className="jo-edit-input">
                  <option>Open</option>
                  <option>Closed</option>
                </select>

                <div className="jo-edit-actions">
                  <button className="jo-save-btn" onClick={() => toggleEdit(job.id)}>Save</button>
                  <button className="jo-cancel-btn" onClick={() => toggleEdit(job.id)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE JOB MODAL */}
      {showCreateModal && (
        <div className="jo-modal-overlay">
          <div className="jo-modal">
            <h2>Create New Job</h2>

            <input
              className="jo-modal-input"
              placeholder="Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />

            <input
              className="jo-modal-input"
              placeholder="Department"
              value={newJob.dept}
              onChange={(e) => setNewJob({ ...newJob, dept: e.target.value })}
            />

            <input
              className="jo-modal-input"
              placeholder="Experience (e.g. 3-5 Years)"
              value={newJob.exp}
              onChange={(e) => setNewJob({ ...newJob, exp: e.target.value })}
            />

            <input
              className="jo-modal-input"
              placeholder="Applicants"
              type="number"
              value={newJob.applicants}
              onChange={(e) =>
                setNewJob({ ...newJob, applicants: e.target.value })
              }
            />

            <select
              className="jo-modal-input"
              value={newJob.status}
              onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>

            <div className="jo-modal-actions">
              <button className="jo-save-btn" onClick={saveNewJob}>
                Save Job
              </button>

              <button
                className="jo-cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobOpeningsPage;
