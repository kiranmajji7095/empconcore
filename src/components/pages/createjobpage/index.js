import React, { useState } from "react";
import "../../styles/createjobpage.css";

const CreateJobPage = () => {
  // FORM STATES
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("2-5 Years");
  const [department, setDepartment] = useState("Engineering");
  const [status, setStatus] = useState("Open");
  const [applicants] = useState(Math.floor(Math.random() * 200) + 10);

  // SKILLS
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  // PREVIEW JOB LIST
  const [previewJobs, setPreviewJobs] = useState([
    { id: 1, title: "Software Engineer", exp: "3-5 Years", dept: "Engineering", applicants: 190, status: "Open", editing: false },
    { id: 2, title: "Product Manager", exp: "3-5 Years", dept: "Engineering", applicants: 125, status: "Open", editing: false }
  ]);

  // ADD NEW JOB TO PREVIEW LIST
  const publishJob = () => {
    if (jobTitle.trim() === "") return alert("Job Title is required!");

    const newJob = {
      id: Date.now(),
      title: jobTitle,
      exp: experience,
      dept: department,
      applicants: Math.floor(Math.random() * 180) + 20,
      status,
      editing: false,
      skills,
      description: jobDescription
    };

    setPreviewJobs([newJob, ...previewJobs]); // ADD CARD TO TOP

    // CLEAR FORM
    setJobTitle("");
    setJobDescription("");
    setSkills([]);
    setSkillInput("");
    setExperience("2-5 Years");
    setDepartment("Engineering");
    setStatus("Open");
  };

  // DELETE CARD
  const deletePreviewJob = (id) => {
    setPreviewJobs(previewJobs.filter((job) => job.id !== id));
  };

  // EDIT CARD
  const toggleEdit = (id) => {
    setPreviewJobs(
      previewJobs.map((job) =>
        job.id === id ? { ...job, editing: !job.editing } : job
      )
    );
  };

  return (
    <div className="cj2-wrapper">

      <h1 className="cj2-heading animate-cj2-slideDown">Create New Job</h1>

      <div className="cj2-layout">

        {/* LEFT FORM */}
        <div className="cj2-form-card animate-cj2-slideLeft">

          {/* Job Title */}
          <label className="cj2-label">Job Title</label>
          <input
            type="text"
            className="cj2-input"
            placeholder="e.g. Senior Software Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />

          {/* Description */}
          <label className="cj2-label">Job Description</label>
          <textarea
            className="cj2-textarea"
            placeholder="Describe the job role..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>

          {/* Skills */}
          <label className="cj2-label">Skills Required</label>

          <input
            type="text"
            className="cj2-input"
            placeholder="Type and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={addSkill}
          />

          {/* Dynamic Skills */}
          <div className="cj2-skill-box">
            {skills.map((sk, index) => (
              <span key={index} className="cj2-skill-tag">{sk}</span>
            ))}
          </div>

          {/* Experience */}
          <label className="cj2-label">Experience</label>
          <select className="cj2-select" value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option>0-2 Years</option>
            <option>2-5 Years</option>
            <option>5-8 Years</option>
            <option>10+ Years</option>
          </select>

          {/* Department */}
          <label className="cj2-label">Department</label>
          <select className="cj2-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option>Engineering</option>
            <option>Design</option>
            <option>Leadership</option>
          </select>

          {/* Status */}
          <label className="cj2-label">Status</label>
          <select className="cj2-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Open</option>
            <option>Closed</option>
          </select>

          {/* Buttons */}
          <div className="cj2-btn-row">
            <button className="cj2-draft-btn">Save as Draft</button>
            <button className="cj2-publish-btn" onClick={publishJob}>Publish Job</button>
          </div>
        </div>

        {/* RIGHT LIVE PREVIEW */}
        <div className="cj2-preview-card animate-cj2-slideRight">

          <h3 className="cj2-preview-title">Live Preview</h3>

          {previewJobs.map((job) => (
            <div className="cj2-preview-box" key={job.id}>

              {!job.editing ? (
                <>
                  <h3 className="cj2-preview-job-title">{job.title}</h3>
                  <span className="cj2-status-badge">{job.status}</span>

                  <p className="cj2-preview-text">Dept: {job.dept}</p>
                  <p className="cj2-preview-text">Exp: {job.exp}</p>

                  <p className="cj2-preview-app">Applicants: {job.applicants}</p>

                  {/* Skills display */}
                  <div className="cj2-preview-skill-row">
                    {job.skills?.map((sk, i) => (
                      <span className="cj2-preview-skill-tag" key={i}>{sk}</span>
                    ))}
                  </div>

                  <div className="cj2-preview-icons">
                    <span className="cj2-icon-edit" onClick={() => toggleEdit(job.id)}>🖊</span>
                    <span className="cj2-icon-view">🔎</span>
                    <span className="cj2-icon-delete" onClick={() => deletePreviewJob(job.id)}>❌</span>
                  </div>
                </>
              ) : (
                <div className="cj2-edit-box">
                  <input className="cj2-edit-input" defaultValue={job.title} />
                  <input className="cj2-edit-input" defaultValue={job.exp} />
                  <button className="cj2-save-btn" onClick={() => toggleEdit(job.id)}>Save</button>
                </div>
              )}

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default CreateJobPage;
