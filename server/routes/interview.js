const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

/* ADMIN SCHEDULE INTERVIEW */
router.post("/schedule", auth(["admin"]), async (req, res) => {
  const { email, job_role, interview_date, mode, meeting_link } = req.body;

  await pool.query(
    `INSERT INTO interviews
     (email, job_role, interview_date, mode, meeting_link, status)
     VALUES (?, ?, ?, ?, ?, 'SCHEDULED')`,
    [email, job_role, interview_date, mode, meeting_link]
  );

  res.json({ success: true, message: "Interview scheduled" });
});

/* USER VIEW INTERVIEW */
router.get("/my/:email", auth(["user", "admin"]), async (req, res) => {
  const { email } = req.params;

  const [rows] = await pool.query(
    "SELECT * FROM interviews WHERE email = ? ORDER BY interview_date DESC",
    [email]
  );

  res.json({ success: true, interviews: rows });
});

module.exports = router;
