// server/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();
const SALT_ROUNDS = 10;

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),

  // ✅ safest secure logic
  secure: Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  tls: {
    rejectUnauthorized: false, // dev only
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

/* ✅ VERIFY SMTP ON SERVER START */
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP CONNECTION FAILED:", err.message);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

/* =========================
   OTP EMAIL HELPER
========================= */
async function sendOtpEmail(to, otp) {
  return transporter.sendMail({
    from: `"EmpConcor" <${process.env.SMTP_USER}>`,
    to,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family:Arial; padding:20px">
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p style="color:#555">Valid for 10 minutes</p>
      </div>
    `,
  });
}


router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // 1️⃣ Validation
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 2️⃣ Check user exists
    const [[existing]] = await pool.query(
      "SELECT id FROM register_users WHERE email = ?",
      [email]
    );

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert user
    await pool.query(
      `INSERT INTO register_users 
       (full_name, email, password_hash, role, created_at)
       VALUES (?, ?, ?, 'user', NOW())`,
      [full_name, email, hashedPassword]
    );

    res.json({
      success: true,
      message: "User registered successfully"
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [[user]] = await pool.query(
      "SELECT * FROM register_users WHERE email = ?",
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email"
      });
    }

    // 🔴 BLOCK CHECK (NEW)
    if (user.is_blocked === 1) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked by admin"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      role: user.role
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const [[user]] = await pool.query(
      "SELECT id FROM register_users WHERE email = ?",
      [email]
    );

    if (!user)
      return res.status(400).json({ message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query("DELETE FROM otps WHERE email = ?", [email]);
    await pool.query(
      "INSERT INTO otps (email, otp, expires_at, created_at) VALUES (?, ?, ?, NOW())",
      [email, otp, expires]
    );

    try {
      await sendOtpEmail(email, otp);
    } catch (mailErr) {
      console.error("MAIL ERROR:", mailErr);
      return res.status(500).json({
        message: "Failed to send email. Try again later.",
      });
    }

    res.json({ success: true, message: "OTP sent" });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   VERIFY OTP
========================= */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  console.log("VERIFY OTP HIT");
  console.log("EMAIL:", email);
  console.log("OTP FROM FRONTEND:", otp);

  if (!email || !otp) {
    return res.status(400).json({ message: "Missing email or otp" });
  }

  try {
    const [[rec]] = await pool.query(
      "SELECT * FROM otps WHERE email = ? ORDER BY id DESC LIMIT 1",
      [email]
    );

    console.log("OTP FROM DB:", rec?.otp);

    if (!rec) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (new Date() > rec.expires_at) {
      return res.status(400).json({ message: "OTP expired" });
    }
    console.log("VERIFY PAYLOAD:", { email, otp });


    // 🔥 FIXED COMPARISON
    if (String(rec.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await pool.query("DELETE FROM otps WHERE id = ?", [rec.id]);

    return res.json({ success: true, message: "OTP verified" });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing data" });

  if (password.length < 6)
    return res.status(400).json({ message: "Password too short" });

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      "UPDATE register_users SET password_hash = ? WHERE email = ?",
      [hash, email]
    );

    if (result.affectedRows === 0)
      return res.status(400).json({ message: "Email not found" });

    res.json({ success: true, message: "Password updated" });

  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
