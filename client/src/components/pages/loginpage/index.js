import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/loginpage.css";
import NewUserModal from "../../forms/newuser";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showNewUser, setShowNewUser] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Forgot password state
  const [step, setStep] = useState(1);
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [fpMsg, setFpMsg] = useState("");

 const handleLogin = async () => {
  if (!email || !password) {
    return setError("Please enter email and password");
  }

  setLoading(true);
  setError("");

  try {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      return setError(data.message || "Invalid credentials");
    }

    // ✅ Save token
    localStorage.setItem("token", data.token);

    // ✅ Role based redirect
    if (data.role === "admin") {
      navigate("/admin");
    } else if (data.role === "hr") {
      navigate("/hrdashboard");
    } else {
      navigate("/dashboard");
    }

  } catch {
    setLoading(false);
    setError("Server error");
  }
};


  const sendOtp = async () => {
    if (!fpEmail) return setFpMsg("Enter email");
    const res = await fetch("http://localhost:4000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fpEmail })
    });
    const data = await res.json();
    if (!res.ok) return setFpMsg(data.message);
    setFpMsg("OTP sent");
    setStep(2);
  };

  const verifyOtp = async () => {
    if (!otp) return setFpMsg("Enter OTP");
    const res = await fetch("http://localhost:4000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fpEmail, otp })
    });
    const data = await res.json();
    if (!res.ok) return setFpMsg(data.message);
    setStep(3);
  };

  const resetPassword = async () => {
    if (newPwd !== confirmPwd) return setFpMsg("Passwords do not match");
    const res = await fetch("http://localhost:4000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fpEmail, password: newPwd })
    });
    const data = await res.json();
    if (!res.ok) return setFpMsg(data.message);
    alert("Password updated");
    setShowForgot(false);
    setStep(1);
  };

  return (
    <div className="vl-auth-wrapper">
      <div className="vl-auth-card animate-scale">

        <div className="vl-auth-logo">
          <div className="vl-auth-logo-icon">↑</div>
          <span className="vl-auth-logo-text">Emp Concor</span>
        </div>

        <h2 className="vl-auth-title">Welcome Back</h2>
        <p className="vl-auth-subtitle">Log in to continue</p>

        <input className="vl-auth-input" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} />

        <input className="vl-auth-input" type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)} />

        {error && <p className="vl-auth-error">{error}</p>}

        <button className="vl-auth-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="vl-auth-links">
          <span className="vl-auth-link" onClick={() => setShowForgot(true)}>Forgot Password?</span>
          <span className="vl-auth-link" onClick={() => setShowNewUser(true)}>New user? Register</span>
        </div>
      </div>

      {showNewUser && <NewUserModal onClose={() => setShowNewUser(false)} />}

      {showForgot && (
  <div className="fp-overlay">
    <div className="fp-card">
      <span
        className="fp-close"
        onClick={() => setShowForgot(false)}
      >
        ✖
      </span>

      <h3 className="fp-title">Forgot Password</h3>

      {fpMsg && <p className="fp-msg">{fpMsg}</p>}

      {/* STEP 1 – EMAIL */}
      {step === 1 && (
        <div className="fp-step">
          <input
            className="fp-input"
            placeholder="Email"
            value={fpEmail}
            onChange={e => setFpEmail(e.target.value)}
          />
          <button
            className="fp-btn"
            onClick={sendOtp}
          >
            Send OTP
          </button>
        </div>
      )}

      {/* STEP 2 – OTP */}
      {step === 2 && (
        <div className="fp-step">
          <input
            className="fp-input"
            placeholder="OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button
            className="fp-btn"
            onClick={verifyOtp}
          >
            Verify OTP
          </button>
        </div>
      )}

      {/* STEP 3 – RESET PASSWORD */}
      {step === 3 && (
        <div className="fp-step">
          <input
            className="fp-input"
            type="password"
            placeholder="New Password"
            value={newPwd}
            onChange={e => setNewPwd(e.target.value)}
          />
          <input
            className="fp-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPwd}
            onChange={e => setConfirmPwd(e.target.value)}
          />
          <button
            className="fp-btn"
            onClick={resetPassword}
          >
            Reset Password
          </button>
        </div>
      )}
    </div>
  </div>
)}


      <div className="vl-auth-shape shape-top"></div>
      <div className="vl-auth-shape shape-bottom"></div>
    </div>
  );
};

export default Login;
