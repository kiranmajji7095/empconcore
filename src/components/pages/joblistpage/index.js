import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jobApi from "../../api/jobapi";
import "../../styles/joblist.css";
import UserForm from "../../forms/userloginform"

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const [filters, setFilters] = useState({
    role: "",
    location: "",
    skills: "",
    type: "",
    experience: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const res = await jobApi.getJobs();
    if (res.data.success) {
      setJobs(res.data.jobs);
      setFilteredJobs(res.data.jobs);
    }
  };

  // ⬇️ STORE FILTER INPUT
  const handleInputChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // ⬇️ APPLY FILTER BUTTON
  const applyFilterButton = () => {
  const result = jobs.filter((job) => {
    return (
      (filters.role === "" ||
        job.job_title?.toLowerCase().includes(filters.role.toLowerCase())) &&

      (filters.location === "" ||
        job.location?.toLowerCase().includes(filters.location.toLowerCase())) &&

      (filters.skills === "" ||
        job.skills?.toLowerCase().includes(filters.skills.toLowerCase())) &&

      (filters.type === "" ||
        job.job_type?.toLowerCase() === filters.type.toLowerCase()) &&

      (filters.experience === "" ||
        job.experience?.toLowerCase() === filters.experience.toLowerCase())
    );
  });

  setFilteredJobs(result);
  setCurrentPage(1);
};



  // APPLY JOB
  const applyJob = (job) => {
    navigate("/userloginform", { state: { jobId: job.id, job } });
  };

  // DELETE JOB (ADMIN)
  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const res = await jobApi.deleteJob(id);
    if (res.data.success) loadJobs();
  };

  return (
    <div className="joblist-container">

      {/* 🔥 ANIMATED BANNER */}
      <div className="joblist-banner animate-banner">
        <img
          className="joblist-banner-img"
          src="https://images.unsplash.com/photo-1462396240927-52058a6a84ec?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="job-banner"
        />
        <div className="joblist-banner-text">
          Find your dream job & apply now!
        </div>
      </div>

      {/* 🔍 SEARCH BAR */}
      <div className="joblist-topbar">
        <input
          type="text"
          placeholder="Job Title"
          className="joblist-input"
          onChange={(e) => handleInputChange("role", e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="joblist-input"
          onChange={(e) => handleInputChange("location", e.target.value)}
        />
        <input
          type="text"
          placeholder="Skills"
          className="joblist-input"
          onChange={(e) => handleInputChange("skills", e.target.value)}
        />
        <button className="joblist-applyfilter-btn" onClick={applyFilterButton}>
          Apply Filters
        </button>
      </div>

      <div className="joblist-body">

        {/* 🧊 SIDEBAR FILTER PANEL */}
        <aside className="joblist-sidebar">
          <h3>Filters</h3>

          <h4>Job Type</h4>
          <label><input type="radio" name="type" onChange={() => handleInputChange("type", "full-time")} /> Full-time</label>
          <label><input type="radio" name="type" onChange={() => handleInputChange("type", "part-time")} /> Part-time</label>

          <h4>Experience</h4>
          <label><input type="radio" name="experience" onChange={() => handleInputChange("experience", "junior")} /> Junior</label>
          <label><input type="radio" name="experience" onChange={() => handleInputChange("experience", "mid")} /> Mid</label>
          <label><input type="radio" name="experience" onChange={() => handleInputChange("experience", "senior")} /> Senior</label>

          <button
            className="joblist-clear-btn"
            onClick={() => {
              setFilters({ role: "", location: "", skills: "", type: "", experience: "" });
              setFilteredJobs(jobs);
            }}
          >
            Clear Filters
          </button>
        </aside>

        {/* 🧩 JOB CARDS */}
        <div className="joblist-grid">
          {filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
            .map((job) => (
              <div key={job.id} className="joblist-card">
                <button className="joblist-delete" onClick={() => deleteJob(job.id)}>❌</button>

                <h3>{job.job_title}</h3>
                <p><b>Company:</b> {job.company_name}</p>
                <p><b>Location:</b> {job.location}</p>
                <p><b>Vacancies:</b> {job.vacancies}</p>
                <p><b>Applied:</b> {job.applications}</p>

                <div className="joblist-desc">
                  {job.description
                    ? job.description.substring(0, 120) + "..."
                    : "No description available"}
                </div>


                {job.applications >= job.vacancies ? (
                  <p className="joblist-full">❌ Vacancies Full</p>
                ) : (
                  <button className="joblist-apply-btn" onClick={() => applyJob(job)}>
                    Apply Now
                  </button>
                )}
              </div>
            ))
          }

          {filteredJobs.length === 0 && (
            <h3 className="joblist-noresult">No jobs found 😞</h3>
          )}
        </div>
      </div>

      {/* 🔢 PAGINATION */}
      <div className="joblist-pagination">
        {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`joblist-page-btn ${currentPage === i + 1 ? "active" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobList;
