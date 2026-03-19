import { useEffect, useState, useRef } from "react";
import "../../../styles/topbar.css";

const Topbar = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotify, setShowNotify] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifyRef = useRef(null);
  const profileRef = useRef(null);

  /* ===============================
     FETCH DATA
  =============================== */
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:4000/user/profile/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user);
      });

    fetch("http://localhost:4000/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setNotifications(data.notifications);
      });
  }, [token]);

  /* ===============================
     CLOSE POPUPS ON OUTSIDE CLICK
  =============================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifyRef.current &&
        !notifyRef.current.contains(e.target)
      ) {
        setShowNotify(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===============================
     LOGOUT
  =============================== */
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="topbar">
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        className="topbar-search"
      />

      {/* RIGHT ACTIONS */}
      <div className="topbar-actions">

        {/* 🔔 NOTIFICATION */}
        <div
          className="topbar-notification"
          ref={notifyRef}
        >
          <span
            className="topbar-bell"
            onClick={() => {
              setShowNotify(!showNotify);
              setShowProfile(false);
            }}
          >
            🔔
            {notifications.length > 0 && (
              <span className="topbar-badge">
                {notifications.length}
              </span>
            )}
          </span>

          {showNotify && (
            <div className="topbar-popup">
              <h4>Notifications</h4>

              {notifications.length === 0 ? (
                <p className="popup-empty">
                  No notifications
                </p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className="popup-item"
                  >
                    {n.text}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 👤 PROFILE */}
        <div
          className="topbar-profile"
          ref={profileRef}
        >
          <img
            src="https://randomuser.me/api/portraits/men/45.jpg"
            alt="profile"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotify(false);
            }}
          />

          {showProfile && (
            <div className="topbar-popup profile-popup">
              <p className="profile-name">
                {user?.full_name}
              </p>

              <button
                className="logout-btn"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Topbar;
