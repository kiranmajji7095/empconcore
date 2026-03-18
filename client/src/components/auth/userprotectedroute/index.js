import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  try {
    const user = JSON.parse(atob(token.split(".")[1]));
    if (user.role !== "user") {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  } catch {
    return <Navigate to="/" replace />;
  }
};

export default UserProtectedRoute;
