import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/userloginform.css";

const UserForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const jobId = location.state?.jobId;
  const selectedJob = location.state?.job;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    college: "",
    address: "",
    bio: "",
    resume: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =============================
  // HANDLE CHANGE
  // =============================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // =============================
  // SUBMIT FORM
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      setError("Resume is mandatory!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, val]) => {
        payload.append(key, val);
      });

      payload.append("jobId", jobId);
      payload.append("job_description", selectedJob.description);

      const res = await fetch("http://localhost:4000/ats/save-user", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: payload,
});

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      // ✅ Navigate correctly
      navigate("/atscore", {
        state: {
          user: formData,
          atsScore: data.atsScore,
          eligible: data.eligible,
          message: data.message,
          job: selectedJob
        }
      });

    } catch (err) {
      console.log(err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uf-container">
      <h2 className="uf-title">Apply for Job</h2>

      <form className="uf-card" onSubmit={handleSubmit}>
        {error && <p className="uf-error">{error}</p>}

        <input
          className="uf-input"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          className="uf-input"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          className="uf-input"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />

        <select
          className="uf-select"
          name="gender"
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input
          className="uf-input"
          name="college"
          placeholder="College"
          onChange={handleChange}
        />

        <textarea
          className="uf-textarea"
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <textarea
          className="uf-textarea"
          name="bio"
          placeholder="Short Bio"
          onChange={handleChange}
        />

        <label>Upload Resume PDF</label>
        <input type="file" name="resume" accept=".pdf" onChange={handleChange} />

        <button className="uf-submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
