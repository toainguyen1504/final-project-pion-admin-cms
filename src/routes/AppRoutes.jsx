import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import Dashboard from "@/components/dashboard/Dashboard";
import LoginPage from "@/pages/auth/LoginPage";

import CategoryList from "@/components/categories/CategoryList";
import CategoryCreate from "@/components/categories/CategoryCreate";
import CategoryEdit from "@/components/categories/CategoryEdit";

import PostList from "@/components/posts/PostList";
import PostCreate from "@/components/posts/PostCreate";
import PostEdit from "@/components/posts/PostEdit";

import UserList from "@/components/users/UserList";
import UserCreate from "@/components/users/UserCreate";
import UserEdit from "@/components/users/UserEdit";
import UserRole from "@/components/users/UserRole";
import UserOverview from "@/components/users/UserOverview";

import ConsultationList from "@/components/consultations/ConsultationList";

import NotFound from "@/pages/NotFound"; // 404 page
import { User } from "lucide-react";

function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes with layout */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />

        {/* Category */}
        <Route path="/danh-muc" element={<CategoryList />} />
        <Route path="/danh-muc/tao-moi" element={<CategoryCreate />} />
        <Route path="/danh-muc/:id/chinh-sua" element={<CategoryEdit />} />

        {/* Post */}
        <Route path="/bai-viet" element={<PostList />} />
        <Route path="/bai-viet/tao-moi" element={<PostCreate />} />
        <Route path="/bai-viet/:id/chinh-sua" element={<PostEdit />} />

        {/* Consultation */}
        <Route path="/tu-van" element={<ConsultationList />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />

        {/* User */}
        <Route path="/nguoi-dung" element={<UserList />} />
        <Route path="/nguoi-dung/tao-moi" element={<UserCreate />} />
        <Route path="/nguoi-dung/:id/chinh-sua" element={<UserEdit />} />
        <Route path="/nguoi-dung/quan-li-vai-tro" element={<UserRole />} />
        <Route path="/nguoi-dung/thong-ke" element={<UserOverview />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
