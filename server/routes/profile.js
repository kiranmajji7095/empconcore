const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const pool = require("../db");

/* Multer memory storage */
const upload = multer({
  storage: multer.memoryStorage()
});

/* ==============================
   GET LOGGED-IN USER (BASIC INFO)
================================ */
router.get("/me", auth(), async (req, res) => {
  try {

    // ✅ INSERT YOUR QUERY HERE (REPLACE OLD QUERY)
    const [[profile]] = await pool.query(`
      SELECT 
        u.email,
        p.full_name,
        p.phone,
        p.gender,
        p.college,
        p.address,
        p.resume
      FROM register_users u
      LEFT JOIN user_profiles p ON u.email = p.email
      WHERE u.email = ?
    `, [req.user.email]);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ VERY IMPORTANT: RETURN AS profile
    res.json({
      success: true,
      profile
    });

  } catch (err) {
    console.error("GET /profile/me ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


/* ==============================
   CREATE / UPDATE PROFILE
================================ */
router.post(
  "/save",
  auth(),                       // ✅ MUST be auth()
  upload.single("resume"),
  async (req, res) => {
    try {
      const { full_name, age, gender, phone, college, address } = req.body;

      await pool.query(
        `
        INSERT INTO user_profiles
        (email, full_name, age, gender, phone, college, address, resume)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          full_name = VALUES(full_name),
          age = VALUES(age),
          gender = VALUES(gender),
          phone = VALUES(phone),
          college = VALUES(college),
          address = VALUES(address),
          resume = IFNULL(VALUES(resume), resume)
        `,
        [
          req.user.email,
          full_name,
          age,
          gender,
          phone,
          college,
          address,
          req.file ? req.file.buffer : null
        ]
      );

      res.json({
        success: true,
        message: "Profile saved"
      });
    } catch (err) {
      console.error("POST /save ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }
);

module.exports = router;
