const express = require("express");
const authRole = require("../middleware/authRole");

const router = express.Router();

router.get("/dashboard", authRole(["user"]), (req, res) => {
  res.json({
    success: true,
    message: "Welcome User",
    user: req.user
  });
});

module.exports = router;
