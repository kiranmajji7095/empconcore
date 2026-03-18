import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.includes(path) ? "us-nav-active" : "";

  return (
    <aside className="us-sidebar">
      <h2 className="us-logo">User Dashboard</h2>

      <ul className="us-nav">
        <li
          className={`us-nav-item ${isActive("/dashboard/home")}`}
          onClick={() => navigate("/dashboard/home")}
        >
          <span className="us-icon">🏠</span>
          Dashboard
        </li>

        <li
          className={`us-nav-item ${isActive("/dashboard/performance")}`}
          onClick={() => navigate("/dashboard/performance")}
        >
          <span className="us-icon">📊</span>
          Performance
        </li>

        <li
          className={`us-nav-item ${isActive("/dashboard/joblistpage")}`}
          onClick={() => navigate("/dashboard/joblistpage")}
        >
          <span className="us-icon">💼</span>
          Jobs
        </li>

        <li
          className={`us-nav-item ${isActive("/dashboard/profilepage")}`}
          onClick={() => navigate("/dashboard/profilepage")}
        >
          <span className="us-icon">👤</span>
          Profile
        </li>
      </ul>
    </aside>
  );
};

export default UserSidebar;
