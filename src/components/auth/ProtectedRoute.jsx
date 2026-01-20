import { Navigate, Outlet } from "react-router-dom";
import { getCurrentRole } from "@/utils/auth";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("authToken");
  const role = getCurrentRole();

  // Chưa đăng nhập
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Có token nhưng không đủ quyền

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  // OK -> render route con
  return <Outlet />;
}
