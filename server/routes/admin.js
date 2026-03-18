const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");

/* ===============================
   ADMIN DASHBOARD ANALYTICS
================================ */
router.get("/dashboard", async (req, res) => {
  try {
    const [recent] = await pool.query(`
      SELECT email, score, violations
      FROM exam_results
      ORDER BY created_at DESC
      LIMIT 50
    `);

    // ✅ Calculate PASS / FAIL from SCORE
    const stats = {
      total: recent.length,
      passed: recent.filter(r => r.score >= 10).length,
      failed: recent.filter(r => r.score < 10).length,
      violations: recent.filter(r => (r.violations ?? 0) > 0).length
    };

    res.json({
      success: true,
      stats,
      recent
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN CHART DATA
================================ */
router.get("/chart-data", auth(["admin"]), async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT status, COUNT(*) AS count
      FROM exam_results
      GROUP BY status
    `);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   BLOCK USER
================================ */
router.post("/block-user", auth(["admin"]), async (req, res) => {
  const { email } = req.body;

  await pool.query(
    "UPDATE users_data SET is_blocked = 1 WHERE email = ?",
    [email]
  );

  res.json({ success: true });
});

/* ===============================
   UNBLOCK USER
================================ */
router.post("/unblock-user", auth(["admin"]), async (req, res) => {
  const { email } = req.body;

  await pool.query(
    "UPDATE users_data SET is_blocked = 0 WHERE email = ?",
    [email]
  );

  res.json({ success: true });
});

/* ===============================
   CREATE USER (ADMIN ONLY)
================================ */
router.post("/create-user", auth(["admin"]), async (req, res) => {
  const { email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users_data (email, password, role) VALUES (?, ?, ?)",
    [email, hashedPassword, role]
  );

  res.json({ success: true });
});
// 📁 server/routes/admin.js

router.get("/users", auth(["admin"]), async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        id,
        full_name,
        email,
        role,
        is_blocked
      FROM register_users
      ORDER BY created_at DESC
    `);

    res.json({ success: true, users });
  } catch (err) {
    console.error("ADMIN USERS ERROR:", err);
    res.status(500).json({ success: false });
  }
});
/* ===============================
   GET LOGGED-IN ADMIN PROFILE
================================ */
router.get("/profile/me", auth(["admin"]), async (req, res) => {
  try {
    const email = req.user.email; // from JWT

    const [[user]] = await pool.query(
      `SELECT 
         full_name, 
         email, 
         role 
       FROM register_users 
       WHERE email = ?`,
      [email]
    );

    if (!user) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error("ADMIN PROFILE ERROR:", err);
    res.status(500).json({ success: false });
  }
});
router.put("/users/update-role", auth(["admin"]), async (req, res) => {
  const { email, role } = req.body;

  if (!["user", "hr", "admin"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  const [result] = await pool.query(
    "UPDATE register_users SET role = ? WHERE email = ?",
    [role, email]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true });
});

router.patch("/users/:id/block", auth(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { is_blocked } = req.body;

    await pool.query(
      "UPDATE register_users SET is_blocked = ? WHERE id = ?",
      [is_blocked, id]
    );

    res.json({
      success: true,
      message: is_blocked ? "User blocked" : "User unblocked"
    });
  } catch (err) {
    console.error("BLOCK USER ERROR:", err);
    res.status(500).json({ success: false });
  }
});
module.exports = router;
