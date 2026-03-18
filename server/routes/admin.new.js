const express = require("express");
const pool = require("../db");
const authRole = require("../middleware/authRole");

const router = express.Router();

/* ADMIN DASHBOARD */
router.get("/dashboard", authRole(["admin"]), async (req, res) => {
  const [[stats]] = await pool.query(`
    SELECT
      COUNT(*) AS total,
      SUM(status='PASS') AS passed,
      SUM(status='FAIL') AS failed,
      SUM(violations > 0) AS violations
    FROM exam_results
  `);

  const [recent] = await pool.query(`
    SELECT email, score, status, violations
    FROM exam_results
    ORDER BY created_at DESC
    LIMIT 10
  `);

  res.json({ success: true, stats, recent });
});

module.exports = router;
