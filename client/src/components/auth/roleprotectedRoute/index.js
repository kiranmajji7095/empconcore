import { Navigate, Outlet } from "react-router-dom";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (!allowedRoles.includes(payload.role)) {
      return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
  } catch (err) {
    return <Navigate to="/" />;
  }
};

export default RoleProtectedRoute;
