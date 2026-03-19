import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/hrdashboard.css";

const HrDashboard = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
  });
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showSelectedModal, setShowSelectedModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDate, setInviteDate] = useState("");
  const [inviteTime, setInviteTime] = useState("");
  const [todayInterviews, setTodayInterviews] = useState([]);
  const [tomorrowInterviews, setTomorrowInterviews] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [selectedError, setSelectedError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/hr/interviews/today-tomorrow")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setTodayInterviews(data.today || []);
        setTomorrowInterviews(data.tomorrow || []);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err.message);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/hr/profile/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile((prev) => ({
            ...prev,
            name: data.user.name,
            email: data.user.email,
          }));
        }
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:4000/hr/dashboard-stats")
      .then((res) => res.json())
      .then((data) => {
        console.log("HR DASHBOARD API RESPONSE:", data); // 👈 ADD THIS

        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  const sendOfferLetter = (candidate) => {
    fetch("http://localhost:4000/hr/send-offer-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: candidate.email,
        job_role: candidate.job_role,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(`📨 Offer sent to ${candidate.email}`);
        } else {
          alert("Failed to send offer");
        }
      })
      .catch(() => {
        alert("Server error. Try again later.");
      });
  };

  const sendInterviewInvite = () => {
    if (!inviteEmail || !inviteDate || !inviteTime) {
      alert("Please fill all fields");
      return;
    }

    fetch("http://localhost:4000/hr/send-interview-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: inviteEmail,
        date: inviteDate,
        time: inviteTime,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("📧 Interview invite sent successfully");
          setInviteEmail("");
          setInviteDate("");
          setInviteTime("");
          setShowInterviewModal(false);
        } else {
          alert("Failed to send interview invite");
          alert(data.message);
        }
      })
      .catch(() => {
        alert("Server error. Try again later");
      });
  };

  return (
    <div className="hrdb-container">
      {/* SIDEBAR */}
      <aside className="hrdb-sidebar">
        <h2 className="hrdb-logo">HR Dashboard</h2>
        <nav className="hrdb-menu">
          <button
            className="hrdb-menu-item"
            onClick={() => navigate("/postjob")}
          >
            {" "}
            Post Job
          </button>
          <button
            className="hrdb-menu-item"
            onClick={() => navigate("/joblist")}
          >
            {" "}
            View Jobs
          </button>
          <button
            className="hrdb-menu-item"
            onClick={() => navigate("/manage-applications")}
          >
            {" "}
            Applicants
          </button>
          <button
            className="hrdb-menu-item"
            onClick={() => navigate("/ats-records")}
          >
            {" "}
            ATS Results
          </button>
          <button
            className="hrdb-menu-item"
            onClick={() => navigate("/report")}
          >
            {" "}
            Reports
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="hrdb-main">
        {/* TOPBAR */}
        <div className="hrdb-topbar">
          <h1 className="hrdb-title">Welcome, HR Manager</h1>
          <button
            className="hrdb-profile-btn"
            onClick={() => setShowProfile(true)}
          >
            👤 {profile.name || "Profile"}
          </button>
        </div>

        {/* STATS (DYNAMIC) */}
        <div className="hrdb-stats-grid">
          <div className="hrdb-stat-card jobs">
            <span className="stat-icon"></span>
            <h3>Total Jobs</h3>
            <p>{stats?.totalJobs ?? "-"}</p>
          </div>

          <div className="hrdb-stat-card applicants">
            <span className="stat-icon"></span>
            <h3>Total Applicants</h3>
            <p>{stats?.totalApplicants ?? "-"}</p>
          </div>

          <div
            className="hrdb-stat-card-interview-clickable"
            onClick={() => {
              setShowInterviewModal(true);
              fetch("http://localhost:4000/hr/interviews/today-tomorrow")
                .then((res) => res.json())
                .then((data) => {
                  setTodayInterviews(data.today);
                  setTomorrowInterviews(data.tomorrow);
                });
            }}
          >
            <h3>
              Interviews Scheduled
              {todayInterviews.length > 0 && (
                <span className="notify-badge">{todayInterviews.length}</span>
              )}
            </h3>
            <p>{stats?.totalInterviews ?? "-"}</p>
            {/* <span className="stat-sub">Today & Tomorrow</span> */}
          </div>

          <div
            className="hrdb-stat-card selected clickable"
            onClick={() => {
              setShowSelectedModal(true);
              setLoadingSelected(true);
              setSelectedError(false);

              fetch("http://localhost:4000/hr/selected-candidates")
                .then((res) => {
                  if (!res.ok) throw new Error("API error");
                  return res.json();
                })
                .then((data) => {
                  console.log("✅ FRONTEND RECEIVED:", data);

                  if (data.success) {
                    setSelectedCandidates(data.rows);
                  } else {
                    setSelectedCandidates([]);
                    setSelectedError(true);
                  }
                  setLoadingSelected(false);
                })
                .catch((err) => {
                  console.error("❌ FRONTEND FETCH ERROR:", err);
                  setSelectedCandidates([]);
                  setSelectedError(true);
                  setLoadingSelected(false);
                });
            }}
          >
            <h3>Selected Candidates</h3>
            <p>{stats?.totalSelected ?? "-"}</p>
            {/* <span className="stat-sub">Offer status</span> */}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="hrdb-action-section">
          <h2 className="hrdb-action-title">Quick Actions</h2>
          <div className="hrdb-action-buttons">
            <button
              className="hrdb-action-btn"
              onClick={() => navigate("/postjob")}
            >
              Create New Job
            </button>
            <button
              className="hrdb-action-btn"
              onClick={() => navigate("/joblist")}
            >
              View Job Listings
            </button>
            <button
              className="hrdb-action-btn"
              onClick={() => navigate("/manage-applications")}
            >
              Manage Applicants
            </button>
            <button
              className="hrdb-action-btn"
              onClick={() => navigate("/report")}
            >
              View Reports
            </button>
          </div>
        </div>

        {/* ANALYTICS CARD */}
        <div className="hrdb-analytics-section">
          <div
            className="hrdb-analytics-card"
            onClick={() => navigate("/exam-analytics")}
          >
            <div className="hrdb-analytics-icon"></div>
            <div>
              <h3>Exam Analytics</h3>
              <p>View exam performance, scores & insights</p>
            </div>
          </div>
        </div>
        {showProfile && (
          <div className="profile-modal-overlay">
            <div className="profile-modal">
              <h2>HR Profile</h2>

              <input
                type="text"
                placeholder="Full Name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />

              {/* <input
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              /> */}

              <input
                type="text"
                placeholder="Phone Number"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Designation"
                value={profile.designation}
                onChange={(e) =>
                  setProfile({ ...profile, designation: e.target.value })
                }
              />

              <div className="profile-modal-actions">
                <button
                  className="save-btn"
                  onClick={() => setShowProfile(false)}
                >
                  Save
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setShowProfile(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showInterviewModal && (
          <div className="modal-overlay">
            <div className="modal interview-modal">
              <h2>📅 Interviews</h2>

              {/* TODAY */}
              <h4>📅 Today</h4>
              <div className="calendar-list">
                {todayInterviews.length === 0 && <p>No interviews today</p>}
                {todayInterviews.map((i) => (
                  <div key={i.id} className="calendar-item">
                    <span className="time">{i.time}</span>
                    <span className="name">{i.candidate_name}</span>
                  </div>
                ))}
              </div>

              {/* TOMORROW */}
              <h4>📅 Tomorrow</h4>
              <div className="calendar-list">
                {tomorrowInterviews.length === 0 && (
                  <p>No interviews tomorrow</p>
                )}
                {tomorrowInterviews.map((i) => (
                  <div key={i.id} className="calendar-item">
                    <span className="time">{i.time}</span>
                    <span className="name">{i.candidate_name}</span>
                  </div>
                ))}
              </div>

              <hr />

              {/* SCHEDULE FORM */}
              <h4> Schedule New Interview</h4>

              <input
                type="email"
                placeholder="Candidate Email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />

              <input
                type="date"
                value={inviteDate}
                onChange={(e) => setInviteDate(e.target.value)}
              />

              <input
                type="time"
                value={inviteTime}
                onChange={(e) => setInviteTime(e.target.value)}
              />

              <button className="primary-btn" onClick={sendInterviewInvite}>
                Schedule & Send Invite
              </button>

              <button
                className="back-btn"
                onClick={() => setShowInterviewModal(false)}
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {showSelectedModal && (
          <div className="modal-overlay">
            <div className="modal large">
              <h2>✅ Selected Candidates</h2>

              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Job Role</th>
                    <th>Score</th>
                    <th>Offer Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* LOADER */}
                  {loadingSelected && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        <div className="loader"></div>
                        Loading selected candidates...
                      </td>
                    </tr>
                  )}

                  {/* ERROR */}
                  {!loadingSelected && selectedError && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        Failed to load data
                        <br />
                        <button
                          className="retry-btn"
                          onClick={() => {
                            setShowSelectedModal(false);
                            setTimeout(() => {
                              document
                                .querySelector(".hrdb-stat-card.selected")
                                .click();
                            }, 200);
                          }}
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  )}

                  {/* EMPTY */}
                  {!loadingSelected &&
                    !selectedError &&
                    selectedCandidates.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                          No selected candidates found
                        </td>
                      </tr>
                    )}

                  {/* DATA */}
                  {!loadingSelected &&
                    !selectedError &&
                    selectedCandidates.length > 0 &&
                    selectedCandidates.map((c, idx) => (
                      <tr key={idx}>
                        <td>{c.fullName}</td>
                        <td>{c.email}</td>
                        <td>{c.job_role}</td>
                        <td>{c.score}</td>
                        <td>
                          {c.offer_status === "PENDING" ? (
                            <button
                              className="offer-btn"
                              onClick={() => sendOfferLetter(c)}
                            >
                              Send Offer
                            </button>
                          ) : (
                            c.offer_status
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <button
                className="back-btn"
                onClick={() => setShowSelectedModal(false)}
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HrDashboard;
