const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [[user]] = await pool.query(
    "SELECT id, email, password_hash, role FROM register_users WHERE email = ?",
    [email]
  );

  if (!user)
    return res.status(401).json({ message: "Invalid email" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match)
    return res.status(401).json({ message: "Invalid password" });

  // ✅ JWT with role
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    token,
    role: user.role
  });
});

module.exports = router;
