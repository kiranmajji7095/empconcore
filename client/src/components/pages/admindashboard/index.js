import { Outlet } from "react-router-dom";
import AdminSidebar from "../admindashboard/adminsidebar";
import AdminTopBar from "../../pages/admindashboard/admintopbar";
import "../../styles/admindashboard.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* <AdminTopBar /> */}
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
