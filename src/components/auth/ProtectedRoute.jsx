import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Nếu không có token → chuyển hướng đến trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu có token → cho phép vào
  return children;
}
