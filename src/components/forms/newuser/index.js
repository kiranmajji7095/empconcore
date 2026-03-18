import React, { useState } from "react";
import "../../styles/newuser.css";

const NewUserModal = ({ onClose }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const closeWithAnimation = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPwd) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Registered successfully!");
      closeWithAnimation();

    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div
      className={`new-user-overlay ${isClosing ? "fade-out" : ""}`}
      onClick={closeWithAnimation}
    >
      <div
        className={`new-user-card ${isClosing ? "slide-down" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="new-user-close" onClick={closeWithAnimation}>✖</button>

        <h3 className="new-user-title">Create account</h3>

        {/* ✅ FULL NAME */}
        <input
          className="new-user-input"
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="new-user-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="new-user-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="new-user-input"
          type="password"
          placeholder="Confirm password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
        />

        <button className="new-user-btn" onClick={handleRegister}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewUserModal;
