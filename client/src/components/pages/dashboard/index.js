import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./sidebar";
import DashboardHome from "./Dashboardhome";
import Performance from "./performance";
import ProfilePage from "./profilepage"
// import ProfilePopup from "./ProfilePopup";
import JobListPage from "../joblistpage";
import "../../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Routes>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="performance" element={<Performance />} />
          <Route path="profilepage" element={<ProfilePage />} />
          <Route path="joblistpage" element={<JobListPage />} />

        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
