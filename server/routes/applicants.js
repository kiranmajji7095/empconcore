// server/routes/applicants.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const PDFDocument = require("pdfkit");

// GET /ats/applicants?jobId=&page=&limit=&q=
router.get("/applicants", async (req, res) => {
  try {
    const jobId = req.query.jobId || null;
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "20");
    const q = (req.query.q || "").trim();

    const offset = (page - 1) * limit;

    // Build where clause
    let where = [];
    let params = [];

    if (jobId) {
      where.push("jobId = ?");
      params.push(jobId);
    }
    if (q) {
      where.push("(fullName LIKE ? OR email LIKE ? OR resume_text LIKE ?)");
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // Total count
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM users_data ${whereSQL}`,
      params
    );
    const total = countRows[0].total || 0;

    // Fetch page rows (exclude resume blob to save bandwidth)
    const [rows] = await pool.query(
      `SELECT id, jobId, fullName, email, phone, ats_score, resume_text, status, created_at, joinDate
       FROM users_data
       ${whereSQL}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      success: true,
      total,
      page,
      limit,
      applicants: rows,
    });
  } catch (err) {
    console.error("APPPLICANTS LIST ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /ats/applicant/:id
router.get("/applicant/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query(
      `SELECT id, jobId, fullName, email, phone, ats_score, resume_text, status, address, bio, created_at
       FROM users_data WHERE id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Applicant not found" });
    res.json({ success: true, applicant: rows[0] });
  } catch (err) {
    console.error("GET APPLICANT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /ats/applicant/:id/status  { status: 'shortlisted' }
router.post("/applicant/:id/status", express.json(), async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const allowed = ["applied", "shortlisted", "interview", "rejected", "hired"];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    await pool.query("UPDATE users_data SET status = ? WHERE id = ?", [status, id]);
    res.json({ success: true, message: "Status updated", status });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /ats/download-resume/:id  -> streams PDF generated on the fly (text-based)
router.get("/download-resume/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query("SELECT fullName, email, phone, resume, resume_text FROM users_data WHERE id = ?", [id]);

    if (!rows.length) return res.status(404).send("Applicant not found");

    const user = rows[0];

    // If resume BLOB exists, stream it as a file (prefer this)
    if (user.resume) {
      // resume assumed to be PDF binary stored in BLOB
      res.setHeader("Content-disposition", `attachment; filename=${user.fullName}_resume.pdf`);
      res.setHeader("Content-type", "application/pdf");
      return res.send(user.resume);
    }

    // Fallback: create PDF from extracted text
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-disposition", `attachment; filename=${user.fullName}_resume.pdf`);
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(20).text(user.fullName || "Name", { underline: true });
    doc.moveDown();
    if (user.email) doc.fontSize(12).text(`Email: ${user.email}`);
    if (user.phone) doc.text(`Phone: ${user.phone}`);
    doc.moveDown();
    doc.fontSize(14).text("Resume Extracted Text:");
    doc.moveDown();
    doc.fontSize(11).text(user.resume_text || "No resume text available", { width: 500 });

    doc.end();
  } catch (err) {
    console.error("DOWNLOAD RESUME ERROR:", err);
    res.status(500).send("Error generating download");
  }
});

module.exports = router;
