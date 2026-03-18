import { useEffect, useState } from "react";
import "./index.css";

const ITEMS_PER_PAGE = 5;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.users);
        setLoading(false);
      });
  }, []);

  const toggleBlock = async (id, status) => {
    await fetch(`http://localhost:4000/admin/users/${id}/block`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        is_blocked: status ? 0 : 1
      })
    });

    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, is_blocked: status ? 0 : 1 } : u
      )
    );
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) &&
    (roleFilter === "ALL" || u.role === roleFilter.toLowerCase())
  );

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const current = filtered.slice(start, start + ITEMS_PER_PAGE);

  if (loading) return <p className="au-loading">Loading users...</p>;

  return (
    <div className="au-page">
      <h1 className="au-title">Users Management</h1>

      {/* Toolbar */}
      <div className="au-toolbar">
        <input
          className="au-search-input"
          placeholder="Search by email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="au-role-select"
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="HR">HR</option>
          <option value="USER">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="au-table-wrapper">
        <table className="au-table">
          <thead className="au-thead">
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="au-tbody">
            {current.length === 0 ? (
              <tr>
                <td colSpan="4" className="au-empty">
                  No users found
                </td>
              </tr>
            ) : (
              current.map(u => (
                <tr className="au-row" key={u.id}>
                  <td className="au-email">{u.email}</td>
                  <td className="au-role">{u.role}</td>
                  <td
                    className={`au-status ${
                      u.is_blocked ? "au-status-blocked" : "au-status-active"
                    }`}
                  >
                    {u.is_blocked ? "Blocked" : "Active"}
                  </td>
                  <td>
                    <button
                      className={`au-action-btn ${
                        u.is_blocked ? "au-unblock" : "au-block"
                      }`}
                      onClick={() => toggleBlock(u.id, u.is_blocked)}
                    >
                      {u.is_blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;