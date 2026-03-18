// server/routes/ats.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const pool = require("../db");

const PDFDocument = require("pdfkit");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// const upload = multer({ storage });
const upload = multer({
  storage: multer.memoryStorage(),
});

// ==========================
// ATS SCORE FUNCTION
// ==========================
function calculateATS(resumeText, jobDesc) {
  if (!resumeText || !jobDesc) return 0;

  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const resumeClean = normalize(resumeText);
  const jobClean = normalize(jobDesc);

  const jobWords = [...new Set(jobClean.split(" ").filter((w) => w.length > 3))];

  if (jobWords.length === 0) return 0;

  let matchCount = 0;
  jobWords.forEach((word) => {
    if (resumeClean.includes(word)) matchCount++;
  });

  return Math.min(100, Math.round((matchCount / jobWords.length) * 100));
}

// Multer memory storage (we store uploaded files in memory and write to DB as buffer)
// const upload = multer({ storage: multer.memoryStorage() });

/* ===================================================================
   Helper: safely read job description from many possible field names
   =================================================================== */
function extractJobDescription(body) {
  return (
    body.job_description ||
    body.jobDesc ||
    body.jobdescription ||
    body.job_desc ||
    ""
  );
}

/* ===================================================================
   POST /ats/save-user
   - Accepts multipart/form-data with resume (PDF), image (optional), and text fields
   - Expects jobId (optional) OR job_description (preferred)
   - If jobId present and no job_description, fetches JD from jobs table
   - Computes ATS score (keyword overlap) and saves user only if score >= 70
   =================================================================== */
router.post(
  "/save-user",
  auth(["user", "admin"]),
  upload.fields([{ name: "resume" }, { name: "image" }]),
  // console.log("Saving ATS for:", data.email);
  async (req, res) => {
    try {
      console.log("\n=== ATS SAVE USER CALLED ===");

      const data = req.body || {};
      const files = req.files || {};
      // const data = req.body || {};

      // ============================
      // Resume Buffer
      // ============================
      const resumeBuffer = files.resume?.[0]?.buffer;

      if (!resumeBuffer) {
        return res.status(400).json({
          success: false,
          message: "Resume missing",
        });
      }

      // ============================
      // Job Description
      // ============================
      let jobDescription = extractJobDescription(data);

      if (!jobDescription && data.jobId) {
        const [rows] = await pool.query(
          "SELECT description FROM jobs WHERE id = ?",
          [data.jobId]
        );

        if (rows.length > 0) {
          jobDescription = rows[0].description;
        }
      }

      if (!jobDescription) {
        return res.status(400).json({
          success: false,
          message: "Job description not found",
        });
      }

      // ============================
      // Extract Resume Text
      // ============================
      // ============================
      // Extract Resume Text SAFELY ✅
      // ============================

      let resumeText = "";

      try {
        const pdfData = await pdfParse(resumeBuffer);
        resumeText = pdfData.text || "";
      } catch (err) {
        console.error("PDF Parse Error:", err.message);

        return res.status(400).json({
          success: false,
          atsScore: 0,
          eligible: false,
          message:
            "Resume PDF cannot be read. Please upload a valid PDF file.",
        });
      }

      if (!resumeText.trim()) {
        return res.status(400).json({
          success: false,
          atsScore: 0,
          eligible: false,
          message: "Resume text extraction failed",
        });
      }


      // ============================
      // Calculate ATS Score
      // ============================
      const atsScore = calculateATS(resumeText, jobDescription);

      console.log("ATS SCORE =", atsScore);

      const eligible = atsScore >= 70;
      const status = eligible ? "ATS_PASS" : "ATS_FAIL";

      // ============================
      // Save User to Database
      // ============================
      
      // ============================
// Save User to Database (FIXED EMAIL)
// ============================
const email = req.user.email;

if (!email) {
  return res.status(400).json({
    success: false,
    message: "Email missing"
  });
}

await pool.query(
  `
  INSERT INTO users_data
  (email, jobId, phone, gender, role, college,
   resume_text, ats_score, address, bio, status, created_at)

  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())

  ON DUPLICATE KEY UPDATE
    resume_text = VALUES(resume_text),
    ats_score = VALUES(ats_score),
    status = VALUES(status)
  `,
  [
  email,
  data.jobId || null,
  data.phone || "",
  data.gender || "",
  data.role || "User",
  data.college || "",
  resumeText,
  atsScore,
  data.address || "",
  data.bio || "",
  status,
]
);

console.log("✅ ATS saved for:", email);

      // ============================
      // Response
      // ============================
      return res.json({
        success: true,
        atsScore,
        eligible,
        email: data.email,
        message: eligible
          ? "Eligible for Exam 🎉"
          : "ATS Score too low ❌",
      });
    } catch (error) {
      console.error("SAVE USER ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/* ===================================================================
   POST /ats/check-score
   - Requires JSON body: { email } or { id }
   - Returns saved ATS score (if user exists)
   =================================================================== */

router.get("/exam-analytics/candidates", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.full_name,
        r.email,
        u.resume_text AS skills,
        e.job_role,
        e.score,
        e.status
      FROM exam_results e
      JOIN register_users r ON r.email = e.email
      JOIN users_data u ON u.email = e.email
      ORDER BY e.created_at DESC
    `);

    res.json({ success: true, rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post("/check-score", express.json(), async (req, res) => {
  try {
    const { email, id } = req.body || {};

    let q = "";
    let params = [];
    if (email) {
      q = "SELECT ats_score FROM users_data WHERE email = ?";
      params = [email];
    } else if (id) {
      q = "SELECT ats_score FROM users_data WHERE id = ?";
      params = [id];
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Provide email or id" });
    }

    const [rows] = await pool.query(q, params);
    if (!rows.length)
      return res.json({ success: false, message: "User not found" });

    const score = rows[0].ats_score || 0;
    const eligible = score >= 70;
    res.json({ success: true, score, eligible });
  } catch (err) {
    console.error("CHECK SCORE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===================================================================
   GET /ats/get-user/:email
   - Returns applicant public details (no BLOBs)
   =================================================================== */
router.get("/get-user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const [rows] = await pool.query(
      `SELECT id, jobId, fullName, phone, gender, email, age, role, college, ats_score, address, joinDate, bio, status, created_at
       FROM users_data WHERE email = ? LIMIT 1`,
      [email],
    );

    if (!rows.length)
      return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===================================================================
   GET /ats/resume-text/:email
   - Returns extracted resume_text for a user
   =================================================================== */
router.get("/resume-text/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const [rows] = await pool.query(
      "SELECT resume_text FROM users_data WHERE email = ? LIMIT 1",
      [email],
    );

    if (!rows.length) return res.json({ success: false, resumeText: "" });

    res.json({ success: true, resumeText: rows[0].resume_text || "" });
  } catch (err) {
    console.error("RESUME TEXT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===================================================================
   GET /ats/download-pdf/:email
   - Downloads the saved resume PDF blob if present,
     otherwise generates a simple PDF from extracted resume_text
   =================================================================== */
router.get("/download-pdf/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const [rows] = await pool.query(
      "SELECT fullName, resume, resume_text, email, phone, address FROM users_data WHERE email = ? LIMIT 1",
      [email],
    );

    if (!rows.length) return res.status(404).send("User not found");
    const user = rows[0];

    if (user.resume && Buffer.isBuffer(user.resume)) {
      // Send stored PDF blob
      res.setHeader(
        "Content-disposition",
        `attachment; filename=${user.fullName || "resume"}.pdf`,
      );
      res.setHeader("Content-type", "application/pdf");
      return res.send(user.resume);
    }

    // Fallback: generate PDF from resume_text
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader(
      "Content-disposition",
      `attachment; filename=${user.fullName || "resume"}.pdf`,
    );
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(20).text(user.fullName || "Name", { underline: true });
    doc.moveDown();
    if (user.email) doc.fontSize(12).text(`Email: ${user.email}`);
    if (user.phone) doc.text(`Phone: ${user.phone}`);
    if (user.address) doc.text(`Address: ${user.address}`);
    doc.moveDown();
    doc.fontSize(14).text("Extracted Resume Text:");
    doc.moveDown();
    doc
      .fontSize(11)
      .text(user.resume_text || "No extracted text available", { width: 500 });

    doc.end();
  } catch (err) {
    console.error("DOWNLOAD PDF ERROR:", err);
    res.status(500).send("Error generating PDF");
  }
});
router.get("/ai-questions/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const [rows] = await pool.query(
      "SELECT resume_text FROM users_data WHERE email = ?",
      [email],
    );

    if (!rows.length || !rows[0].resume_text) {
      return res.json({ success: false, message: "Resume not found" });
    }

    const resumeText = rows[0].resume_text.toLowerCase();

    // 🔍 SIMPLE AI LOGIC (Skill detection)
    const skills = [];
    if (resumeText.includes("react")) skills.push("react");
    if (resumeText.includes("node")) skills.push("node");
    if (resumeText.includes("javascript")) skills.push("javascript");

    // 🎯 Generate questions based on detected skills
    const questions = [];

    if (skills.includes("react")) {
      questions.push({
        question: "Which hook is used for side effects in React?",
        optionA: "useState",
        optionB: "useEffect",
        optionC: "useRef",
        optionD: "useMemo",
        answer: "B",
      });
    }

    if (skills.includes("node")) {
      questions.push({
        question: "Which module is used to create a server in Node.js?",
        optionA: "http",
        optionB: "fs",
        optionC: "path",
        optionD: "os",
        answer: "A",
      });
    }

    if (skills.includes("javascript")) {
      questions.push({
        question: "Which keyword declares a constant in JavaScript?",
        optionA: "var",
        optionB: "let",
        optionC: "const",
        optionD: "static",
        answer: "C",
      });
    }

    res.json({ success: true, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});
router.post("/submit-exam", async (req, res) => {
  const { email, answers } = req.body;

  const [rows] = await pool.query(
    "SELECT resume_text FROM users_data WHERE email = ? ORDER BY id DESC LIMIT 1",
    [email],
  );

  if (!rows.length) {
    return res.json({ success: false, message: "User not found" });
  }

  const resumeText = rows[0].resume_text.toLowerCase();

  let correct = 0;
  const correctAnswers = [];

  if (resumeText.includes("react")) correctAnswers.push("B");
  if (resumeText.includes("node")) correctAnswers.push("A");
  if (resumeText.includes("javascript")) correctAnswers.push("C");

  correctAnswers.forEach((ans, i) => {
    if (answers[i] === ans) correct++;
  });

  const status = correct >= 7 ? "PASS" : "FAIL";

  await pool.query(
    `UPDATE users_data
     SET exam_score=?, exam_status=?
     WHERE email=?`,
    [correct, status, email],
  );

  res.json({
    success: true,
    score: correct,
    status,
    redirect: status === "PASS",
  });
});

router.post("/evaluate", upload.single("resume"), async (req, res) => {
  try {
    const { email, fullName, jobRole, jobDescription } = req.body;

    if (!email || !req.file || !jobDescription) {
      return res.json({ success: false, message: "Missing data" });
    }

    // 1️⃣ Extract resume text
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text.toLowerCase();
    const jdText = jobDescription.toLowerCase();

    // 2️⃣ Normalize
    const normalize = (t) =>
      t.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ");

    const jdWords = [
      ...new Set(normalize(jdText).split(" ").filter(w => w.length > 3))
    ];

    let match = 0;
    jdWords.forEach(word => {
      if (resumeText.includes(word)) match++;
    });

    const atsScore = Math.min(
      100,
      Math.round((match / jdWords.length) * 100)
    );

    const status = atsScore >= 70 ? "ATS_PASS" : "ATS_FAIL";

    // 3️⃣ SAVE OR UPDATE USER (EMAIL IS KEY)
    await pool.query(
      `
      INSERT INTO users_data
      (email, fullName, job_role, resume_text, ats_score, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        resume_text = VALUES(resume_text),
        ats_score = VALUES(ats_score),
        status = VALUES(status),
        updated_at = NOW()
      `,
      [email, fullName, jobRole, resumeText, atsScore, status]
    );

    res.json({
      success: true,
      atsScore,
      eligible: atsScore >= 70,
      message:
        atsScore >= 70
          ? "You passed ATS screening"
          : "ATS score too low"
    });

  } catch (err) {
    console.error("ATS EVALUATE ERROR:", err);
    res.status(500).json({ success: false });
  }
});
router.get("/ats-results", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.full_name,
        r.email,
        u.resume_text,
        u.status,
        u.created_at
      FROM users_data u
      JOIN register_users r ON r.email = u.email
      WHERE u.status = 'ATS_PASS'
      ORDER BY u.created_at DESC
    `);

    res.json({ success: true, rows });
  } catch (err) {
    console.error("ATS RESULTS ERROR:", err);
    res.status(500).json({ success: false });
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

module.exports = router;
