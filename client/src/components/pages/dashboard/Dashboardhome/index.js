import { useEffect, useState } from "react";
import ProfilePopup from "../profilepopup";
import "./index.css";

const DashboardHome = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]); // 🔥 dynamic notifications
  const [error, setError] = useState("");

  // ===============================
  // FETCH USER PROFILE (OLD CODE SAME)
  // ===============================
  useEffect(() => {
    fetch("http://localhost:4000/profile/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setUser(data.profile);
        } else {
          setError("Failed to load user");
        }
      })
      .catch(err => {
        console.error("Dashboard fetch error:", err);
        setError("Unable to load dashboard");
      });
  }, []);

  // ===============================
  // 🔔 FETCH NOTIFICATIONS (NEW)
  // ===============================
  useEffect(() => {
    fetch("http://localhost:4000/hr/notifications/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNotifications(data.notifications);
        }
      })
      .catch(err => console.error("Notification error:", err));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-home">

      {/* Top Section */}
      <div className="dashboard-top">

        {/* LEFT SIDE DATA */}
        <div className="dashboard-left">
          <h1>
            Welcome {user.name || user.full_name || ""}
          </h1>
          <p>
            <b>Email:</b> {user.email}
          </p>
        </div>

        {/* RIGHT SIDE BELL */}
        <div className="dashboard-right">
          <span
            className="bell-icon"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
          </span>

          {/* Notification Popup */}
          {showNotifications && (
            <div className="notification-popup">
              <h4>Notifications</h4>

              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                <ul>
                  {notifications.map((n) => (
                    <li key={n.id}>
                      {n.message}
                      <br />
                      <small>
                        {new Date(n.created_at).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

      </div>

      {/* OLD BUTTON SAME */}
      <button
        className="dashboard-btn"
        onClick={() => setShowPopup(true)}
      >
        Complete Profile
      </button>

      {/* OLD PROFILE POPUP SAME */}
      {showPopup && (
        <ProfilePopup
          onClose={() => setShowPopup(false)}
          onSaved={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default DashboardHome;