import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/forgot_password.css";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1-email | 2-otp | 3-reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
     SEND OTP
  ====================== */
  const sendOtp = async () => {
    if (!email) return alert("Please enter your email");

    setLoading(true);
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.message || "Failed to send OTP");

    alert("OTP sent to your email");
    setStep(2);
  };

  /* ======================
     VERIFY OTP
  ====================== */
  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
if (!otp || otp.length !== 6) {
  return alert("Enter valid 6-digit OTP");
}

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.message || "OTP verification failed");

    alert("OTP verified");
    setStep(3);
  };

  /* ======================
     RESET PASSWORD
  ====================== */
  const resetPassword = async () => {
    if (!newPwd || newPwd !== confirmPwd) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: newPwd }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.message || "Password reset failed");

    alert("Password updated successfully");
    navigate("/login");
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2>Forgot Password</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <p>Enter your registered email address</p>
            <input
              className="forgot-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="forgot-btn" onClick={sendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <p>Enter the OTP sent to your email</p>
            <input
  className="forgot-input"
  placeholder="Enter OTP"
  value={otp}
  onChange={(e) => setOtp(e.target.value.trim())}
/>

            <button className="forgot-btn" onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <p>Set a new password</p>
            <input
              className="forgot-input"
              type="password"
              placeholder="New password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
            <input
              className="forgot-input"
              type="password"
              placeholder="Confirm password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
            <button
              className="forgot-btn"
              onClick={resetPassword}
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        <p className="forgot-back" onClick={() => navigate("/")}>
          ← Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
