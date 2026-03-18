// server/routes/adminRole.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

/* ===============================
   UPDATE USER ROLE (ADMIN ONLY)
================================ */
router.put("/update-role", auth(["admin"]), async (req, res) => {
  try {
    const { email, role } = req.body;

    // 1️⃣ Validate role
    if (!["user", "hr", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    // 2️⃣ Update role in register_users
    const [result] = await pool.query(
      "UPDATE register_users SET role = ? WHERE email = ?",
      [role, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User role updated successfully"
    });

  } catch (err) {
    console.error("ROLE UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
