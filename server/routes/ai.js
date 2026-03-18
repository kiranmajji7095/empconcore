const express = require("express");
const router = express.Router();
const pool = require("../db");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

router.get("/resume-summary/:email", async (req, res) => {
  const { email } = req.params;

  const [[user]] = await pool.query(
    "SELECT resume_text FROM users_data WHERE email=?",
    [email]
  );

  const prompt = `
Create a professional resume summary in 3–4 lines:

${user.resume_text}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  res.json({
    summary: response.choices[0].message.content
  });
});

module.exports = router;
router.get("/admin-insights", async (req, res) => {
  const [[stats]] = await pool.query(`
    SELECT 
      AVG(score) AS avgScore,
      COUNT(*) AS total
    FROM exam_results
  `);

  const prompt = `
Analyze exam performance:
Average Score: ${stats.avgScore}
Total Candidates: ${stats.total}
Give admin-level insights.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  res.json({ insight: response.choices[0].message.content });
});
