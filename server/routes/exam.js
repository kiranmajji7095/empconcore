const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth"); // ✅ ADD THIS


/* =====================================================
   ROLE BASED QUESTION BANK (10 EACH)
===================================================== */
const QUESTIONS = {
  "Web Developer": [
    { question: "What is React?", optionA: "Library", optionB: "Framework", optionC: "Language", optionD: "Browser", answer: "A" },
    { question: "Which hook handles side effects?", optionA: "useState", optionB: "useEffect", optionC: "useRef", optionD: "useMemo", answer: "B" },
    { question: "What is JSX?", optionA: "Template", optionB: "JS Extension", optionC: "CSS", optionD: "DB", answer: "B" },
    { question: "Which HTTP method updates data?", optionA: "GET", optionB: "POST", optionC: "PUT", optionD: "TRACE", answer: "C" },
    { question: "Node.js is?", optionA: "Browser", optionB: "Runtime", optionC: "Framework", optionD: "IDE", answer: "B" },
    { question: "Which is relational DB?", optionA: "MongoDB", optionB: "MySQL", optionC: "Redis", optionD: "Firebase", answer: "B" },
    { question: "REST is?", optionA: "Language", optionB: "Architecture", optionC: "Protocol", optionD: "IDE", answer: "B" },
    { question: "npm stands for?", optionA: "Node Package Manager", optionB: "Network PM", optionC: "Node Program", optionD: "None", answer: "A" },
    { question: "Git is used for?", optionA: "Hosting", optionB: "Version control", optionC: "Testing", optionD: "Deployment", answer: "B" },
    { question: "Semantic tag?", optionA: "div", optionB: "span", optionC: "section", optionD: "b", answer: "C" }
  ],

  "US IT Recruiter": [
    { question: "ATS stands for?", optionA: "Applicant Tracking System", optionB: "Auto Tech System", optionC: "Advanced Tool", optionD: "None", answer: "A" },
    { question: "W2 means?", optionA: "Contract", optionB: "Payroll employee", optionC: "Invoice", optionD: "Visa", answer: "B" },
    { question: "C2C means?", optionA: "Client to Client", optionB: "Corp to Corp", optionC: "Consultant", optionD: "Cash", answer: "B" },
    { question: "H1B is?", optionA: "Tax", optionB: "Visa", optionC: "Rate", optionD: "Offer", answer: "B" },
    { question: "Boolean search is used for?", optionA: "Filtering resumes", optionB: "Interview", optionC: "Payroll", optionD: "Onboarding", answer: "A" },
    { question: "Sourcing means?", optionA: "Finding candidates", optionB: "Payroll", optionC: "Negotiation", optionD: "Training", answer: "A" },
    { question: "LinkedIn is used for?", optionA: "Gaming", optionB: "Professional networking", optionC: "Chat", optionD: "Mail", answer: "B" },
    { question: "Bill rate means?", optionA: "Salary", optionB: "Client rate", optionC: "Bonus", optionD: "Tax", answer: "B" },
    { question: "Onboarding is?", optionA: "Joining process", optionB: "Interview", optionC: "Hiring", optionD: "Termination", answer: "A" },
    { question: "NDA stands for?", optionA: "New Data Act", optionB: "Non Disclosure Agreement", optionC: "Notice Agreement", optionD: "None", answer: "B" }
  ],

  "Bench Sales": [
    { question: "Bench sales means?", optionA: "Product sales", optionB: "Marketing consultants", optionC: "HR payroll", optionD: "Training", answer: "B" },
    { question: "Requirement means?", optionA: "Job opening", optionB: "Interview", optionC: "Visa", optionD: "Salary", answer: "A" },
    { question: "Submission means?", optionA: "Resume sent", optionB: "Interview", optionC: "Offer", optionD: "Joining", answer: "A" },
    { question: "Vendor is?", optionA: "Client", optionB: "Middle company", optionC: "Candidate", optionD: "Employer", answer: "B" },
    { question: "C2C stands for?", optionA: "Corp to Corp", optionB: "Client to Client", optionC: "Cash to Cash", optionD: "None", answer: "A" },
    { question: "Hotlist is?", optionA: "Candidate list", optionB: "Job list", optionC: "Client list", optionD: "Vendor list", answer: "A" },
    { question: "Rate negotiation done with?", optionA: "Client", optionB: "Vendor", optionC: "Candidate", optionD: "All", answer: "D" },
    { question: "Placement means?", optionA: "Interview", optionB: "Submission", optionC: "Joining", optionD: "Offer", answer: "C" },
    { question: "US time zone important for?", optionA: "Calls", optionB: "Payroll", optionC: "Interview", optionD: "Visa", answer: "A" },
    { question: "H1B means?", optionA: "Visa", optionB: "Salary", optionC: "Tax", optionD: "Rate", answer: "A" }
  ]
};

/* =====================================================
   GET QUESTIONS
===================================================== */
router.get("/ai-questions/:email/:jobRole", (req, res) => {
  const { jobRole } = req.params;
  res.json({
    success: true,
    questions: QUESTIONS[jobRole] || QUESTIONS["Web Developer"]
  });
});

/* =====================================================
   SUBMIT EXAM
===================================================== */
router.post(
  "/submit-exam",
  auth(["user", "admin"]),   // 🔐 Protect
  async (req, res) => {
    try {

      // 🔥 GET EMAIL FROM TOKEN (NOT FROM FRONTEND)
      const email = req.user.email;

      const { answers, questions, jobRole } = req.body;

      if (!questions || !answers) {
        return res.json({ success: false, message: "Missing data" });
      }

      let correct = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
      });

      const percentage = Math.round(
        (correct / questions.length) * 100
      );

      const status = percentage >= 70 ? "PASS" : "FAIL";

      // 1️⃣ Insert exam history
      await pool.query(
        `
        INSERT INTO exam_results (email, job_role, score, status)
        VALUES (?, ?, ?, ?)
        `,
        [email, jobRole, percentage, status]
      );

      // 2️⃣ Update users_data for same logged user
      await pool.query(
        `
        UPDATE users_data
        SET exam_score = ?, exam_status = ?
        WHERE email = ?
        `,
        [percentage, status, email]
      );

      res.json({
        success: true,
        score: percentage,
        status
      });

    } catch (err) {
      console.error("SUBMIT EXAM ERROR:", err);
      res.status(500).json({ success: false });
    }
  }
);
router.get("/result/:email", async (req, res) => {
  const { email } = req.params;

  const [[result]] = await pool.query(
    `SELECT job_role, score, status, created_at
     FROM exam_results
     WHERE email = ?
     ORDER BY id DESC
     LIMIT 1`,
    [email]
  );

  res.json({ success: true, result });
});
router.get(
  "/result/me",
  auth(["user", "admin"]),   // ✅ middleware passed here
  async (req, res) => {
    try {
      // your logic
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
);
module.exports = router;
