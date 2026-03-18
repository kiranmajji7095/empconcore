const express = require("express");
const router = express.Router();
const pool = require("../db");

// ⭐ 1. SUMMARY CARDS
router.get("/summary", async (req, res) => {
  try {
    const [[summary]] = await pool.query(`
      SELECT
        COUNT(*) AS applicants,
        SUM(CASE WHEN er.status = 'PASS' THEN 1 ELSE 0 END) AS qualified,
        SUM(CASE WHEN MONTH(er.created_at) = MONTH(CURRENT_DATE()) THEN 1 ELSE 0 END) AS hiresThisMonth
      FROM exam_results er
      JOIN users_data ud ON ud.email = er.email
      WHERE ud.ats_score >= 70
    `);

    res.json({
      timeToHire: 0,
      acceptanceRate: summary.applicants
        ? Math.round((summary.qualified / summary.applicants) * 100)
        : 0,
      applicants: summary.applicants || 0,
      hiresThisMonth: summary.hiresThisMonth || 0
    });

  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    res.status(500).json({});
  }
});



// ⭐ 2. MONTHLY APPLICATIONS (LINE CHART)
router.get("/monthly-applications", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        DATE_FORMAT(er.created_at, '%b') AS month,
        COUNT(*) AS total
      FROM exam_results er
      JOIN users_data ud ON ud.email = er.email
      WHERE ud.ats_score >= 70
      GROUP BY month
      ORDER BY MIN(er.created_at)
    `);

    res.json({
      months: rows.map(r => r.month),
      values: rows.map(r => r.total)
    });

  } catch (err) {
    console.error("MONTHLY ERROR:", err);
    res.status(500).json({});
  }
});



// ⭐ 3. CANDIDATE STAGES (DONUT CHART)
router.get("/candidate-stages", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        er.status,
        COUNT(*) AS total
      FROM exam_results er
      JOIN users_data ud ON ud.email = er.email
      WHERE ud.ats_score >= 70
      GROUP BY er.status
    `);

    res.json({
      labels: rows.map(r => r.status),
      values: rows.map(r => r.total)
    });

  } catch (err) {
    console.error("STAGES ERROR:", err);
    res.status(500).json({});
  }
});



// ⭐ 4. TOP JOBS PERFORMANCE (TABLE + BAR CHART)
router.get("/top-jobs", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        er.job_role,
        COUNT(*) AS total
      FROM exam_results er
      JOIN users_data ud ON ud.email = er.email
      WHERE ud.ats_score >= 70
        AND er.status = 'PASS'
      GROUP BY er.job_role
      ORDER BY total DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error("TOP JOBS ERROR:", err);
    res.status(500).json({ success: false });
  }
});


module.exports = router;
