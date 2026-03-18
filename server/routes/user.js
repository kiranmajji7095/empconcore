const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// ✅ IMPORT MULTER FIRST
const multer = require("multer");

// ✅ THEN CREATE upload
const upload = multer({
  storage: multer.memoryStorage()
});

/* =================================
   PROFILE: CURRENT LOGGED-IN USER
================================= */
router.get("/profile/me", auth(["user", "admin"]), async (req, res) => {
  try {
    const email = req.user.email;

    // 1️⃣ Try profile table
    const [[profile]] = await pool.query(
      "SELECT * FROM user_profiles WHERE email = ?",
      [email]
    );

    // 2️⃣ Fallback to register_users
    const [[account]] = await pool.query(
      "SELECT full_name FROM register_users WHERE email = ?",
      [email]
    );

    res.json({
      success: true,
      user: {
        email,
        full_name: profile?.full_name || account?.full_name || "",
        age: profile?.age || "",
        gender: profile?.gender || "",
        phone: profile?.phone || "",
        college: profile?.college || "",
        address: profile?.address || ""
      }
    });

  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* =================================
   SAVE / UPDATE PROFILE
================================= */
router.post(
  "/profile",
  auth(["user"]),
  upload.single("resume"),
  async (req, res) => {
    try {
      const email = req.user.email;
      const { full_name, age, gender, phone, college, address } = req.body;

      const resume = req.file ? req.file.buffer : null;

      await pool.query(
        `
        INSERT INTO user_profiles
        (email, full_name, age, gender, phone, college, address, resume, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
          full_name = VALUES(full_name),
          age = VALUES(age),
          gender = VALUES(gender),
          phone = VALUES(phone),
          college = VALUES(college),
          address = VALUES(address),
          resume = IFNULL(VALUES(resume), resume),
          updated_at = NOW()
        `,
        [email, full_name, age, gender, phone, college, address, resume]
      );

      res.json({ success: true });

    } catch (err) {
      console.error("PROFILE SAVE ERROR:", err);
      res.status(500).json({ success: false });
    }
  }
);

/* =================================
   DASHBOARD DATA (OPTIONAL)
================================= */
router.get("/dashboard/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const [[user]] = await pool.query(
      `
      SELECT phone, gender, college, resume_text, exam_score, exam_status
      FROM users_data
      WHERE email = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [email]
    );

    if (!user) {
      return res.json({ success: false });
    }

    if (user.exam_score < 7) {
      return res.json({ success: false, blocked: true });
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ success: false });
  }
});
/* ==========================================
   USER PERFORMANCE (ATS + EXAM)
   NEW ROUTE — SAFE TO ADD
========================================== */

router.get(
  "/performance/me",
  auth(["user", "admin"]),
  async (req, res) => {
    try {
      const email = req.user.email;

      console.log("Logged user email:", email);

      // ✅ Get ATS + Exam score from users_data (single source)
      const [[row]] = await pool.query(
        `
        SELECT ats_score, exam_score
        FROM users_data
        WHERE email = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [email]
      );

      console.log("PERFORMANCE FETCH:", row);

      res.json({
        success: true,
        ats_score: row?.ats_score || 0,
        exam_score: row?.exam_score || 0
      });

    } catch (err) {
      console.error("PERFORMANCE ERROR:", err);
      res.status(500).json({ success: false });
    }
  }
);
module.exports = router;
