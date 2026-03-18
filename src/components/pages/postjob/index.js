import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jobApi from "../../api/jobapi";
import "../../styles/postjob.css";

const PostJob = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    job_title: "",
    company_name: "",
    location: "",
    experience: "",
    salary: "",
    job_type: "",
    description: "",
    skills: "",
    vacancies: "",
    last_date: "",
    email: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      const res = await jobApi.createJob(form);
      if (res.data.success) {
        navigate("/joblist");
      }
    } catch (err) {
      console.error("POST JOB ERROR:", err);
      alert("Server error");
    }
  };

  return (
    <div className="postjob-container">
      <div className="postjob-card">

        <h2 className="postjob-title">📋 Post a New Job</h2>

        <div className="postjob-form">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              value={form[key]}
              placeholder={key.replace("_", " ").toUpperCase()}
              onChange={handleChange}
              className="postjob-input"
            />
          ))}
        </div>

        <button className="postjob-btn" onClick={submit}>
          🚀 Post Job
        </button>

      </div>
    </div>
  );
};

export default PostJob;
