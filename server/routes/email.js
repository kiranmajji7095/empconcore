const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,        // your email
    pass: process.env.SMTP_PASS    // app password
  }
});

router.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html: message
    });

    res.json({success: true, message:"Email sent successfully!"});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

module.exports = router;
