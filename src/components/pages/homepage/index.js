import React from "react";
import "../../styles/homepage.css";

const HomePage = () => {
  return (
    <div className="hfhp-container">

      {/* HERO BANNER */}
      <section className="hfhp-hero-section animate-hp-slideDown">
        <div className="hfhp-hero-title">Join Our Team</div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/584/584796.png"
          alt="team"
          className="hfhp-hero-image"
        />
      </section>

      {/* TOP FILTER ROW */}
      <div className="hfhp-top-filterbar animate-hp-fadeIn">
        <button className="hfhp-top-btn">Role</button>
        <button className="hfhp-top-btn">Location</button>
        <button className="hfhp-top-btn">Skills</button>
        <button className="hfhp-top-btn-primary">+ Filters</button>
      </div>

      {/* BODY LAYOUT */}
      <div className="hfhp-layout">

        {/* FILTER SIDEBAR */}
        <aside className="hfhp-filter-sidebar animate-hp-slideLeft">
          <h3 className="hfhp-filter-title">Filters</h3>

          <div className="hfhp-filter-box">
            <p className="hfhp-filter-heading">Department</p>
            <label className="hfhp-checkbox-row"><input type="checkbox" /> Engineering</label>
            <label className="hfhp-checkbox-row"><input type="checkbox" /> Marketing</label>
          </div>

          <div className="hfhp-filter-box">
            <p className="hfhp-filter-heading">Employment Type</p>
            <label className="hfhp-checkbox-row"><input type="checkbox" /> Full-time</label>
            <label className="hfhp-checkbox-row"><input type="checkbox" /> Contract</label>
          </div>

          <div className="hfhp-filter-box">
            <p className="hfhp-filter-heading">Experience</p>
            <label className="hfhp-checkbox-row"><input type="checkbox" /> Entry-Level</label>
            <label className="hfhp-checkbox-row"><input type="checkbox" /> Senior</label>
          </div>
        </aside>

        {/* JOB GRID (2 cards per row) */}
        <div className="hfhp-job-grid animate-hp-slideUp">

          <div className="hfhp-job-row">
            <div className="hfhp-job-card">
              <h3 className="hfhp-job-title">Senior Software Engineer</h3>
              <p className="hfhp-job-info">Location: Bangalore, India</p>
              <span className="hfhp-tag">Full-time</span>
            </div>

            <div className="hfhp-job-card">
              <h3 className="hfhp-job-title">Job Title</h3>
              <p className="hfhp-job-info">Location: Bangalore, India</p>
              <span className="hfhp-tag">Full-time</span>
            </div>
          </div>

          <div className="hfhp-job-row">
            <div className="hfhp-job-card">
              <h3 className="hfhp-job-title">Senior Manager</h3>
              <p className="hfhp-job-info">Experience: Mid-Level</p>
              <span className="hfhp-tag">Full-time</span>
            </div>

            <div className="hfhp-job-card">
              <h3 className="hfhp-job-title">Product Manager</h3>
              <p className="hfhp-job-info">Experience: Mid 5 Years</p>
              <button className="hfhp-apply-btn">Apply Now</button>
            </div>
          </div>

          <div className="hfhp-job-row">
            <div className="hfhp-job-card">
              <h3 className="hfhp-job-title">Job Title</h3>
              <p className="hfhp-job-info">Location: Bangalore, India</p>
              <span className="hfhp-tag">Full-time</span>
            </div>

            <div className="hfhp-job-card">
              <h3 className="hfhp-job-title">Product Manager</h3>
              <p className="hfhp-job-info">Experience: 3–5 Years</p>
              <button className="hfhp-apply-btn">Apply Now</button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default HomePage;
