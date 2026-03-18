// server/routes/jobs.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

/* ===========================
   GET ALL JOBS
   
=========================== */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM jobs ORDER BY created_at DESC"
    );
    res.json({ success: true, jobs: rows });
  } catch (err) {
    console.error("GET JOBS ERROR:", err);
    res.status(500).json({ success: false });
  }
});
// POST NEW JOB (HR / ADMIN)
router.post("/create", async (req, res) => {
  try {
    const {
      job_title,
      company_name,
      location,
      experience,
      salary,
      job_type,
      description,
      skills,
      vacancies,
      last_date,
      email
    } = req.body;

    await pool.query(
      `
      INSERT INTO jobs
      (job_title, company_name, location, experience, salary, job_type, description, skills, vacancies, last_date, email, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        job_title,
        company_name,
        location,
        experience,
        salary,
        job_type,
        description,
        skills,
        vacancies,
        last_date,
        email
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("CREATE JOB ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===========================
   APPLY FOR JOB
=========================== */
router.post("/apply", auth, async (req, res) => {
  try {
    const { jobId } = req.body;

    const [[exists]] = await pool.query(
      "SELECT id FROM job_applications WHERE email=? AND job_id=?",
      [req.user.email, jobId]
    );

    if (exists) {
      return res.json({
        success: false,
        message: "Already applied for this job"
      });
    }

    await pool.query(
      "INSERT INTO job_applications (email, job_id) VALUES (?, ?)",
      [req.user.email, jobId]
    );

    await pool.query(
      "UPDATE jobs SET applications = applications + 1 WHERE id=?",
      [jobId]
    );

    res.json({
      success: true,
      message: "Applied successfully"
    });

  } catch (err) {
    console.error("APPLY JOB ERROR:", err);
    res.status(500).json({ success: false });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM jobs WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE JOB ERROR:", err);
    res.status(500).json({ success: false });
  }
});


module.exports = router;
