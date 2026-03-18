const express = require("express");
const authRole = require("../middleware/authRole");

const router = express.Router();

router.get("/dashboard", authRole(["hr"]), (req, res) => {
  res.json({
    success: true,
    message: "Welcome HR",
    user: req.user
  });
});

module.exports = router;
