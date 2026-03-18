const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =========================================
   1️⃣ OVERALL EXAM ANALYTICS (SUMMARY)
========================================= */
router.get("/exam-analytics/summary", async (req, res) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT 
        COUNT(*) AS total_attempts,
        SUM(status='PASS') AS passed,
        SUM(status='FAIL') AS failed,
        ROUND(AVG(score)) AS avg_score
      FROM exam_results
    `);

    res.json({ success: true, stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================================
   2️⃣ JOB-WISE ANALYTICS
========================================= */
router.get("/exam-analytics/jobs", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        job_role,
        COUNT(*) AS total,
        ROUND(AVG(score),2) AS avg_score
      FROM exam_results
      GROUP BY job_role
    `);

    res.json({ success: true, rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================================
   3️⃣ CANDIDATE EXAM RECORDS (✅ FIXED)
   👉 Only PASSED candidates
   👉 Includes candidate ID
========================================= */
router.get("/exam-analytics/candidates", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.skills,
        e.job_role,
        e.score,
        e.status
      FROM exam_results e
      JOIN users_data u ON u.email = e.email
      WHERE e.status = 'PASS'
      ORDER BY e.created_at DESC
    `);

    res.json({ success: true, rows });
  } catch (err) {
    console.error("CANDIDATE RECORD ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* =========================================
   4️⃣ SINGLE CANDIDATE DETAIL
========================================= */
router.get("/candidate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [[candidate]] = await pool.query(
      "SELECT * FROM users_data WHERE id = ?",
      [id]
    );

    res.json(candidate || null);
  } catch (err) {
    console.error(err);
    res.status(500).json(null);
  }
});

module.exports = router;
