// src/pages/AboutPage.jsx
import React from "react";
import "../../styles/aboutpage.css";

const AboutPage = () => {
  return (
    <div className="about-wrapper">

      {/* HERO SECTION */}
      <section className="about-hero-section animate-fade">
        
        <div className="about-hero-content">
          <h1 className="about-title">About EmpConcor</h1>
          <p className="about-subtitle">
            Empowering HR teams with smart tools, intelligent automation,
            candidate insights, and an all-in-one recruitment ecosystem.
          </p>
          <button className="about-hero-btn">Learn More</button>
        </div>

        {/* ❤️ IMAGE ADDED HERE */}
        <div className="about-hero-graphic animate-slide-up">
          <img
            src="https://plus.unsplash.com/premium_photo-1684769160411-ab16f414d1bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJ2aWV3fGVufDB8fDB8fHww"
            alt="EmpConcor illustration"
            className="about-hero-img"
          />
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="about-info-section animate-fade-late">
        <h2 className="about-section-title1">Who We Are</h2>
        <p className="about-section-subtext">
          EmpConcor is a modern recruitment management application designed
          for HR teams to streamline hiring, track candidates, manage interviews,
          and make better decisions using intelligent automation.
        </p>

        <div className="about-cards-grid">

          <div className="about-card animate-pop">
            <h3 className="about-card-title"> Smart Hiring</h3>
            <p className="about-card-text">
              Use advanced filtering, resume ranking, and skill insights to
              identify the right talent instantly.
            </p>
          </div>

          <div className="about-card animate-pop">
            <h3 className="about-card-title"> AI-Driven</h3>
            <p className="about-card-text">
              AI-based suggestions, scoring, and candidate matching for
              faster and accurate recruitment.
            </p>
          </div>

          <div className="about-card animate-pop">
            <h3 className="about-card-title"> Real-Time Analytics</h3>
            <p className="about-card-text">
              View dashboards, reports, hiring funnels, and KPIs in a single
              clean interface.
            </p>
          </div>

        </div>
      </section>

      {/* VISION SECTION */}
      <section className="about-vision-section animate-slide">
        <h2 className="about-section-title">Our Vision</h2>
        <p className="about-section-text">
          To revolutionize recruitment with automation, insights, and intelligent tools—
          making hiring effortless, transparent, and efficient for every organization.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section className="about-team-section animate-fade">
        <h2 className="about-section-second -sub-title">Why Choose EmpConcor?</h2>

        <div className="about-features-list">
          <div className="about-feature-item">🚀 Fast & Modern UI</div>
          <div className="about-feature-item">📂 Centralized Candidate Records</div>
          <div className="about-feature-item">🧩 Easy Job Posting</div>
          <div className="about-feature-item">📅 Interview Scheduling</div>
          <div className="about-feature-item">🔔 Real-time Alerts & Notifications</div>
          <div className="about-feature-item">🔐 Secure Data Management</div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
