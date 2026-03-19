import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

const ECNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]); // 🔥 update on page change

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="ec-navbar">
      <div className="ec-navbar-left" onClick={() => navigate("/homepage")}>
        <div className="ec-navbar-logo">EC</div>
        <span className="ec-navbar-title">EmpConcor</span>
      </div>

      <ul className="ec-navbar-links">
        <li onClick={() => navigate("/homepage")}>Home</li>
        <li onClick={() => navigate("/careers")}>Careers</li>
        <li onClick={() => navigate("/jobs")}>Jobs</li>
        <li onClick={() => navigate("/candidates")}>Candidates</li>
        <li onClick={() => navigate("/about")}>About</li>
      </ul>

      <div className="ec-navbar-right">
        {!isLoggedIn ? (
          <button
            className="ec-navbar-btn login-btn"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        ) : (
          <button
            className="ec-navbar-btn logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default ECNavbar;