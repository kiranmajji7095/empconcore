import React, { useState } from "react";
import "../../styles/settingpage.css";

const Tabs = ["Profile", "Users", "Email", "Security", "API Keys"];

const initialTeam = [
  { id: 1, name: "Jane Doe (HR Manager)", role: "Recruiter" },
  { id: 2, name: "John Smith", role: "Engineer" },
];

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [company, setCompany] = useState({
    name: "Setum",
    industry: "",
    website: "",
    address: "",
  });
  const [notifications, setNotifications] = useState({
    newApplicant: true,
    interviewReminder: true,
  });
  const [team, setTeam] = useState(initialTeam);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", role: "" });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role) {
      alert("Please fill member name and role");
      return;
    }
    setTeam([...team, { id: Date.now(), ...newMember }]);
    setNewMember({ name: "", role: "" });
    setShowAddMember(false);
  };

  const handleCompanyChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="setting-shell">
      <div className="setting-top-hero" aria-hidden="true" />
      <div className="setting-container">
        <h1 className="setting-title">Settings</h1>

        <div className="setting-tabs">
          {Tabs.map((t) => (
            <button
              key={t}
              className={`setting-tab ${activeTab === t ? "setting-tab--active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="setting-card animate-fade-in">
          <div className="setting-grid">

            {/* Left column - Company Profile & Email Templates */}
            <div className="setting-col setting-col--left">
              <section className="setting-section">
                <h2 className="setting-section-title">Company Profile</h2>

                <label className="setting-label">
                  Company Name
                  <input
                    name="name"
                    value={company.name}
                    onChange={handleCompanyChange}
                    className="setting-input"
                    placeholder="Company name"
                  />
                </label>

                <label className="setting-label">
                  Industry
                  <input
                    name="industry"
                    value={company.industry}
                    onChange={handleCompanyChange}
                    className="setting-input"
                    placeholder="Industry"
                  />
                </label>

                <label className="setting-label">
                  Website
                  <input
                    name="website"
                    value={company.website}
                    onChange={handleCompanyChange}
                    className="setting-input"
                    placeholder="https://example.com"
                  />
                </label>

                <label className="setting-label">
                  Company Address
                  <input
                    name="address"
                    value={company.address}
                    onChange={handleCompanyChange}
                    className="setting-input"
                    placeholder="Address"
                  />
                </label>
              </section>

              <section className="setting-section setting-section--spaced">
                <h3 className="setting-subtitle">Email Templates</h3>
                <div className="setting-list-item">
                  <div>Interview Confirmation</div>
                  <button className="setting-edit-btn">Edit</button>
                </div>
                <div className="setting-list-item">
                  <div>Offer Letter</div>
                  <button className="setting-edit-btn">Edit</button>
                </div>
              </section>

              <section className="setting-section setting-section--spaced">
                <h3 className="setting-subtitle">Notifications Settings</h3>
                <div className="setting-notif-row">
                  <div>New applicant alert</div>
                  <label className="setting-switch">
                    <input
                      type="checkbox"
                      checked={notifications.newApplicant}
                      onChange={() => toggleNotification("newApplicant")}
                    />
                    <span className="setting-slider" />
                  </label>
                </div>

                <div className="setting-notif-row">
                  <div>Interview reminder</div>
                  <label className="setting-switch">
                    <input
                      type="checkbox"
                      checked={notifications.interviewReminder}
                      onChange={() => toggleNotification("interviewReminder")}
                    />
                    <span className="setting-slider" />
                  </label>
                </div>
              </section>
            </div>

            {/* Right column - Team Members and templates */}
            <div className="setting-col setting-col--right">
              <div className="setting-right-header">
                <h2 className="setting-section-title">Team Members</h2>
                <button
                  className="setting-add-btn"
                  onClick={() => setShowAddMember(true)}
                >
                  + Add Member
                </button>
              </div>

              <div className="setting-team-card">
                <table className="setting-team-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((m) => (
                      <tr key={m.id}>
                        <td>{m.name}</td>
                        <td>{m.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <section className="setting-section setting-section--spaced">
                <h3 className="setting-subtitle">Email Templates</h3>
                <div className="setting-list-item">
                  <div>Interview Confirmation</div>
                  <button className="setting-edit-btn">Edit</button>
                </div>
                <div className="setting-list-item">
                  <div>Offer Letter</div>
                  <button className="setting-edit-btn">Edit</button>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Add Member Modal */}
        {showAddMember && (
          <div className="setting-modal-overlay" role="dialog" aria-modal="true">
            <div className="setting-modal animate-scale">
              <h3 className="setting-modal-title">Add Team Member</h3>

              <input
                className="setting-input"
                placeholder="Full name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />

              <select
                className="setting-input"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              >
                <option value="">Select role</option>
                <option value="Recruiter">Recruiter</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Engineer">Engineer</option>
              </select>

              <div className="setting-modal-actions">
                <button className="setting-save-btn" onClick={handleAddMember}>Add</button>
                <button className="setting-cancel-btn" onClick={() => setShowAddMember(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
