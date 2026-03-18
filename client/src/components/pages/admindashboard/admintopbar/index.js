import { useEffect, useState } from "react";
import "./index.css";

const AdminTopBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/admin/profile/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user);
      })
      .catch(err => console.error("TOPBAR ERROR:", err));
  }, []);

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <h3>Admin Panel</h3>
      </div>

      <div className="admin-topbar-right">
        <div className="admin-user-info">
          <span className="admin-name">
            {user?.full_name || "Admin"}
          </span>
          <span className="admin-email">
            {user?.email}
          </span>
        </div>

        <button
          className="admin-logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminTopBar;
