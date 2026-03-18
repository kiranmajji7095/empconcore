import { NavLink } from "react-router-dom";
import "./index.css";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-sidebar-heading">Admin Panel</h2>

      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive
              ? "admin-sidebar-link active"
              : "admin-sidebar-link"
          }
        >
          <span className="sidebar-icon"></span>
          <span className="sidebar-text">Overview</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "admin-sidebar-link active"
              : "admin-sidebar-link"
          }
        >
          <span className="sidebar-icon"></span>
          <span className="sidebar-text">Users</span>
        </NavLink>

        <NavLink
          to="/admin/create-user"
          className={({ isActive }) =>
            isActive
              ? "admin-sidebar-link active"
              : "admin-sidebar-link"
          }
        >
          <span className="sidebar-icon"></span>
          <span className="sidebar-text">Create User</span>
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            isActive
              ? "admin-sidebar-link active"
              : "admin-sidebar-link"
          }
        >
          <span className="sidebar-icon"></span>
          <span className="sidebar-text">Analytics</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
