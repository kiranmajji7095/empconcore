const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const sendEmail = require("./mail");
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/* =========================================
   1️⃣ OVERALL EXAM ANALYTICS (CARDS)
========================================= */
router.get("/exam-analytics/summary", async (req, res) => {
  try {
    const [[row]] = await pool.query(`
      SELECT
        COUNT(*) AS applicants,
        SUM(status = 'PASS') AS hiresThisMonth,
        ROUND(AVG(score)) AS avgScore
      FROM exam_results
    `);

    res.json({
  success: true,
  passed: row.hiresThisMonth || 0,
  failed: row.applicants - row.hiresThisMonth || 0,
  applicants: row.applicants
});

  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});
/* =========================================
   2️⃣ MONTHLY APPLICATIONS
========================================= */
router.get("/exam-analytics/monthly-applications", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%b') AS month,
        COUNT(*) AS total
      FROM exam_results
      GROUP BY month
      ORDER BY MIN(created_at)
    `);

    res.json({
      months: rows.map(r => r.month),
      values: rows.map(r => r.total)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});
/* =========================================
   3️⃣ CANDIDATE STAGES
========================================= */
router.get("/exam-analytics/candidate-stages", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT status, COUNT(*) AS total
      FROM exam_results
      GROUP BY status
    `);

    res.json({
      labels: rows.map(r => r.status),
      values: rows.map(r => r.total)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

/* =========================================
   HR DASHBOARD STATS
========================================= */
// 📁 server/routes/hr.js

router.get("/dashboard-stats", async (req, res) => {
  try {
    const [[jobs]] = await pool.query(
      "SELECT COUNT(*) AS totalJobs FROM jobs"
    );

    const [[applicants]] = await pool.query(
      "SELECT COUNT(*) AS totalApplicants FROM users_data"
    );

    const [[interviews]] = await pool.query(
      "SELECT COUNT(*) AS totalInterviews FROM interviews"
    );

    // 🔥 CHANGE ONLY HERE
    const [[selected]] = await pool.query(
      "SELECT COUNT(*) AS totalSelected FROM exam_results WHERE score >= 75"
    );

    res.json({
      success: true,
      stats: {
        totalJobs: jobs.totalJobs,
        totalApplicants: applicants.totalApplicants,
        totalInterviews: interviews.totalInterviews,
        totalSelected: selected.totalSelected
      }
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ success: false });
  }
});

// ===============================
// 📥 DOWNLOAD REPORT (DAY / WEEK / MONTH)
// ===============================
router.get("/reports/download", async (req, res) => {
  try {
    const { type } = req.query;

    let condition = "";

    if (type === "day") {
      condition = "DATE(created_at) = CURDATE()";
    } else if (type === "week") {
      condition = "created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    } else if (type === "month") {
      condition = "MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())";
    } else {
      return res.status(400).send("Invalid type");
    }

    const [rows] = await pool.query(`
      SELECT email, job_role, score, status, created_at
      FROM exam_results
      WHERE ${condition}
      ORDER BY created_at DESC
    `);

    let csv = "Email,Job Role,Score,Status,Date\n";
    rows.forEach(r => {
      csv += `${r.email},${r.job_role},${r.score},${r.status},${r.created_at}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report_${type}.csv`
    );

    res.send(csv);
  } catch (err) {
    console.error("DOWNLOAD REPORT ERROR:", err);
    res.status(500).send("Server Error");
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
   3️⃣ CANDIDATE EXAM DETAILS
========================================= */
/* =========================================
   3️⃣ CANDIDATE EXAM DETAILS
========================================= */
router.get("/exam-analytics/candidates", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        IFNULL(r.full_name, 'Candidate') AS fullName,
        e.email,
        IFNULL(u.resume_text, '') AS skills,
        e.job_role,
        e.score,
        e.status
      FROM exam_results e
      LEFT JOIN register_users r
        ON LOWER(r.email) = LOWER(e.email)
      LEFT JOIN users_data u
        ON LOWER(u.email) = LOWER(e.email)
      ORDER BY e.created_at DESC
    `);

    console.log("CANDIDATE ANALYTICS ROWS:", rows);

    res.json({ success: true, rows });

  } catch (err) {
    console.error("EXAM ANALYTICS CANDIDATES ERROR:", err);
    res.status(500).json({ success: false });
  }
});


/* =========================================
   4️⃣ TOP PERFORMING JOBS
========================================= */
router.get("/exam-analytics/top-jobs", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        job_role,
        COUNT(*) AS total
      FROM exam_results
      WHERE job_role IS NOT NULL
        AND job_role != ''
      GROUP BY job_role
      ORDER BY total DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Top jobs error:", err);
    res.status(500).json({ success: false, data: [] });
  }
});


router.get("/candidate/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query("SELECT * FROM candidates WHERE id=?", [id]);
  res.json(rows[0]);
});
router.get("/interviews/today-tomorrow", async (req, res) => {
  try {

    // 🔹 TODAY INTERVIEWS
    const [today] = await pool.query(`
      SELECT
        i.id,
        r.full_name AS candidate_name,
        TIME(i.interview_date) AS time
      FROM interviews i
      JOIN register_users r ON r.email = i.email
      WHERE DATE(i.interview_date) = CURDATE()
    `);

    // 🔹 TOMORROW INTERVIEWS
    const [tomorrow] = await pool.query(`
      SELECT
        i.id,
        r.full_name AS candidate_name,
        TIME(i.interview_date) AS time
      FROM interviews i
      JOIN register_users r ON r.email = i.email
      WHERE DATE(i.interview_date) = CURDATE() + INTERVAL 1 DAY
    `);

    res.json({ today, tomorrow });

  } catch (err) {
    console.error("Interview fetch error:", err);
    res.status(500).json({ today: [], tomorrow: [] });
  }
});


// ===============================
// SELECTED CANDIDATES (FINAL)
// ===============================
router.get("/selected-candidates", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        IFNULL(r.full_name, 'Candidate') AS fullName,
        e.email,
        e.job_role,
        e.score,
        IFNULL(o.status, 'PENDING') AS offer_status
      FROM exam_results e
      LEFT JOIN register_users r 
        ON LOWER(r.email) = LOWER(e.email)
      LEFT JOIN offers o 
        ON LOWER(o.email) = LOWER(e.email)
      WHERE e.score >= 75
      ORDER BY e.created_at DESC
    `);

    console.log("✅ SELECTED CANDIDATES ROWS:", rows);

    res.json({
      success: true,
      rows
    });
  } catch (err) {
    console.error("❌ SELECTED CANDIDATES ERROR:", err);
    res.status(500).json({ success: false, rows: [] });
  }
});
router.post("/send-interview-invite", async (req, res) => {
  try {
    const { email, date, time } = req.body;

    if (!email || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Missing email, date or time"
      });
    }

    // 🔹 STEP 1: CHECK USER ROLE
    const [[user]] = await pool.query(
      `SELECT role FROM register_users WHERE email = ?`,
      [email]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found in register users"
      });
    }

    if (user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Interview invite can only be sent to USER role"
      });
    }

    // 🔹 STEP 2: SEND EMAIL
    const htmlFile = `
        <h3>Interview Invitation</h3>
        <p>Your interview is scheduled as follows:</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <a href="http://localhost:3000/interview">Click Here</a>
        <br/>
        <p>Best regards,<br/>HR Team</p>
    `;

    await sendEmail(
      email,
      `Interview Scheduled on ${date}`,
      `Interview Scheduled on ${date}`,
      htmlFile
    );

    // 🔹 STEP 3: INSERT INTO interviews table
    await pool.query(
      `INSERT INTO interviews (email, interview_date)
       VALUES (?, ?)`,
      [email, `${date} ${time}`]
    );

    // 🔹 STEP 4: INSERT INTO notifications table
    await pool.query(
      `INSERT INTO notifications (email, message)
       VALUES (?, ?)`,
      [
        email,
        `Your interview is scheduled on ${date} at ${time}`
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("SEND INVITE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
router.get("/test-mail", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "kiranmajji374@gmail.com",
      subject: "Test Mail",
      text: "If you see this, App Password works!"
    });

    res.send("Mail sent");
  } catch (e) {
    res.send(e.message);
  }
});


router.get("/manage-applications", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.full_name,
        r.email,
        e.job_role,
        e.score,
        e.status
      FROM exam_results e
      JOIN register_users r ON r.email = e.email
      ORDER BY e.created_at DESC
    `);

    res.json({ success: true, rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


router.put("/manage-applications/status", async (req, res) => {
  const { email, status } = req.body;

  await pool.query(
    "UPDATE exam_results SET status=? WHERE email=?",
    [status, email]
  );

  res.json({ success: true });
});

router.delete("/manage-applications/delete", async (req, res) => {
  try {
    const { email } = req.body;

    await pool.query(
      "DELETE FROM users_data WHERE email = ?",
      [email]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Delete application error:", err);
    res.status(500).json({ success: false });
  }
});
/* =========================================
   ATS RESULTS (SINGLE PAGE FOR HR)
   ATS SCORE >= 75
========================================= */
/* =========================================
   ATS RESULTS (ATS SCORE ONLY – HR PAGE)
========================================= */
// server/routes/hr.js

/* =========================================
   ATS RESULTS (HR ONLY)
   Resume score >= 75
========================================= */
router.get("/ats-results", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.full_name AS fullName,
        r.email,
        e.score AS ats_score,
        'ATS Qualified' AS status
      FROM eligible_candidates e
      JOIN register_users r 
        ON r.id = e.id
      WHERE e.score >= 75
      ORDER BY e.score DESC
    `);

    res.json({
      success: true,
      rows
    });
  } catch (err) {
    console.error("ATS RESULTS ERROR:", err);
    res.status(500).json({
      success: false
    });
  }
});

router.post("/send-offer-letter", async (req, res) => {
  const { 
  email, 
  job_role, 
  interview_date, 
  interview_time, 
  interview_mode 
} = req.body;


  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"HR Team" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Offer Letter",
     html: `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; padding:25px; border-radius:8px;">

      <h2 style="color:#1565c0; text-align:center;">
        📅 Interview Schedule
      </h2>

      <p>Dear Candidate,</p>

      <p>
        Thank you for applying. We are pleased to inform you that you have been
        <b>shortlisted</b> for the interview for the position of
        <b style="color:#1e88e5;">${job_role}</b>.
      </p>

      <p>
        Please find the interview details below:
      </p>

      <table style="width:100%; margin:20px 0; border-collapse:collapse;">
        <tr style="background:#f1f5f9;">
          <td style="padding:10px; font-weight:bold;">Interview Date</td>
          <td style="padding:10px;">${interview_date}</td>
        </tr>
        <tr>
          <td style="padding:10px; font-weight:bold;">Interview Time</td>
          <td style="padding:10px;">${interview_time}</td>
        </tr>
        <tr style="background:#f1f5f9;">
          <td style="padding:10px; font-weight:bold;">Interview Mode</td>
          <td style="padding:10px;">${interview_mode}</td>
        </tr>
        <tr>
          <td style="padding:10px; font-weight:bold;">Interviewer</td>
          <td style="padding:10px;">HR / Technical Panel</td>
        </tr>
      </table>

      <p>
        Please ensure that you are available at the scheduled time.
        If you are unable to attend, kindly inform us in advance.
      </p>

      <p>
        We wish you all the best for your interview.
      </p>

      <br/>

      <p>
        Best Regards,<br/>
        <b>HR Team</b><br/>
        Emp Concore
      </p>

      <hr style="margin-top:30px;"/>

      <p style="font-size:12px; color:#777;">
        This is an automated interview schedule email. Please do not reply.
      </p>

    </div>
  </div>
`

    });

    // Optional: update offer status
    await pool.query(
      "UPDATE offers SET status='SENT' WHERE email=?",
      [email]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Offer Email Error:", err);
    res.status(500).json({ success: false });
  }
});
/* ===============================
   GET LOGGED-IN HR PROFILE
================================ */
router.get("/profile/me", auth(["hr"]), async (req, res) => {
  try {
    const email = req.user.email;

    const [[user]] = await pool.query(
      `SELECT full_name AS name, email 
       FROM register_users 
       WHERE email = ?`,
      [email]
    );

    if (!user) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("HR PROFILE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   GET ALL APPLICANTS
================================ */
router.get("/applicants", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.full_name AS fullName,
        r.email,
        e.job_role,
        e.score,
        e.status
      FROM exam_results e
      JOIN register_users r ON r.email = e.email
      ORDER BY e.created_at DESC
    `);

    res.json({ success: true, rows });
  } catch (err) {
    console.error("APPLICANTS ERROR:", err);
    res.status(500).json({ success: false });
  }
});
router.get("/interviews/today-tomorrow", async (req, res) => {
  try {
    const [today] = await pool.query(`
      SELECT
        i.id,
        r.full_name AS candidate_name,
        TIME(i.interview_date) AS time
      FROM interviews i
      JOIN register_users r ON r.email = i.email
      WHERE DATE(i.interview_date) = CURDATE()
    `);

    const [tomorrow] = await pool.query(`
      SELECT
        i.id,
        r.full_name AS candidate_name,
        TIME(i.interview_date) AS time
      FROM interviews i
      JOIN register_users r ON r.email = i.email
      WHERE DATE(i.interview_date) = CURDATE() + INTERVAL 1 DAY
    `);

    res.json({ today, tomorrow });
  } catch (err) {
    console.error("Interview fetch error:", err);
    res.status(500).json({ today: [], tomorrow: [] });
  }
});
// ===============================
// GET USER NOTIFICATIONS
// ===============================
router.get("/notifications/me", auth(), async (req, res) => {
  try {
    const email = req.user.email;

    const [rows] = await pool.query(
      `SELECT id, message, created_at
       FROM notifications
       WHERE email = ?
       ORDER BY created_at DESC`,
      [email]
    );

    res.json({
      success: true,
      notifications: rows
    });

  } catch (err) {
    console.error("NOTIFICATION FETCH ERROR:", err);
    res.status(500).json({ success: false });
  }
});
module.exports = router;
