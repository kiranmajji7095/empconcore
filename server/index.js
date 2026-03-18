const express = require("express");
const cors = require("cors");
// require("dotenv").config();

const app = express();

// 📌 ROUTES IMPORT
const authRoutes = require("./routes/auth");
const atsRoutes = require("./routes/ats");
const examRoutes = require("./routes/exam");
const hrRoutes = require("./routes/hr");
const reportRoutes = require("./routes/reports");
const jobRoutes = require("./routes/jobs");
const applicantsRoutes = require("./routes/applicants");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user")
const profileRoutes = require("./routes/profile");
const adminRoleRoutes = require("./routes/adminRole");

// 📌 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 📌 USE ROUTES
app.use("/api/auth", authRoutes);
app.use("/ats", atsRoutes);
app.use("/exam", examRoutes);
app.use("/jobs", jobRoutes);
app.use("/ats", applicantsRoutes);
app.use("/hr", hrRoutes);
app.use("/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/user", userRoutes)
app.use("/profile", profileRoutes);
app.use("/api/auth", require("./routes/auth.new"));
app.use("/api/admin", require("./routes/admin.new"));
app.use("/api/hr", require("./routes/hr.new"));
app.use("/api/user", require("./routes/user.new"));
app.use("/admin/role", adminRoleRoutes);



// 📌 DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("API Running Successfully 👍");
});
require("dotenv").config();

console.log("MAIL CHECK:", {
  user: process.env.MAIL_USER,
  passLength: process.env.MAIL_PASS?.length
});


// 📌 SERVER LISTEN
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on PORT ${process.env.PORT || 5000}`);
});
