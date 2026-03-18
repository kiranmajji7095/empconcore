import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AttractiveNavbar from "./components/pages/navbar";
import FooterBar from "./components/pages/footer";
import LoginPage from "./components/pages/loginpage";
import DashboardPage from "./components/pages/dashboard";
import HomePage from "./components/pages/homepage";
import CreateJobPage from "./components/pages/createjobpage";
import CandidateProfile from "./components/pages/candidateprofile";
import ProtectedRoute from "./components/auth/protectroute";
import UserForm from "./components/forms/userloginform"
import AboutPage from "./components/pages/aboutpage"
import ATSScreen from "./components/pages/atscore";
import ExamPage from "./components/pages/exampage";
import PostJob from "./components/pages/postjob";
import JobList from "./components/pages/joblistpage"
import HrDashboard from "./components/pages/hrdashboardpage"
import ApplicantTracking from "./components/pages/applicant_tracking"
import AdminDashboard from "./components/pages/admindashboard";
import ExamAnalytics from "./components/pages/hrdashboardpage/hranalyticspage"
// import AdminUsers from "./components/pages/admindashboard/adminuserspage"
import ReportsDashboard from "./components/pages/reportdashboard"
import NewUserModal from "./components/forms/newuser";
import Dashboard from "./components/pages/new"
import ManageApplications from "./components/pages/hrdashboardpage/manage_applications";
import ATSResults from "./components/pages/hrdashboardpage/ats-results";
import UserProtectedRoute from "./components/auth/userprotectedroute";
import Profile from "./components/pages/dashboard/profilepage";
import ForgotPasswordModal from "./components/forms/forgot_password"
import RoleProtectedRoute from "./components/auth/roleprotectedRoute";
import AdminLayout from "./components/pages/admindashboard";
import AdminOverview from "./components/pages/admindashboard/adminoverviewpage";
import AdminUsers from "./components/pages/admindashboard/adminuserspage";
import AdminCreateUser from "./components/pages/admindashboard/admincreatepage";
import AdminChart from "./components/pages/admindashboard/adminchartpage";


const App = () => {
  return (
    <Router>
      <AttractiveNavbar />
      <Routes>

  {/* PUBLIC */}
  <Route path="/" element={<LoginPage />} />
  <Route path="/homepage" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />

  {/* ADMIN */}
  <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminOverview />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="create-user" element={<AdminCreateUser />} />
      <Route path="analytics" element={<AdminChart />} />
    </Route>
  </Route>

  {/* HR */}
  <Route element={<RoleProtectedRoute allowedRoles={["hr"]} />}>
    <Route path="/hrdashboard" element={<HrDashboard />} />
    <Route path="/manage-applications" element={<ManageApplications />} />
    <Route path="/ats-records" element={<ATSResults />} />
    <Route path="/exam-analytics" element={<ExamAnalytics />} />
    <Route path="/report" element={<ReportsDashboard />} />
    <Route path="/jobList" element={<JobList />} />
    <Route path="/postjob" element={<PostJob />} />


  </Route>

  {/* USER */}
  <Route element={<RoleProtectedRoute allowedRoles={["user"]} />}>
    <Route path="/dashboard/*" element={<DashboardPage />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/userloginform" element={<UserForm />} />
    <Route path="/exampage" element={<ExamPage />} />
    <Route path="/atscore" element={<ATSScreen />} />

  </Route>

</Routes>

      <FooterBar />
    </Router>
  );
};

export default App;
