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

// Learning Program
import ProgramListPage from "@/components/learning/ProgramListPage";

// User Management
import UserList from "@/components/users/UserList";
import UserCreate from "@/components/users/UserCreate";
import UserEdit from "@/components/users/UserEdit";
import UserRole from "@/components/users/UserRole";
import UserOverview from "@/components/users/UserOverview";

import ConsultationList from "@/components/consultations/ConsultationList";

import NotFound from "@/pages/NotFound"; // 404 page
import Forbidden from "@/pages/auth/Forbidden"; // 404 page
import { ADMIN_CMS_ROLES, USER_MANAGEMENT_ROLES } from "@/constants/roles";

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<Forbidden />} />

      {/* Authenticated */}
      {/* Admin CMS routes - chỉ cho phép ADMIN_CMS_ROLES */}
      <Route element={<ProtectedRoute allowedRoles={ADMIN_CMS_ROLES} />}>
        {/* Admin layout */}
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Category */}
          <Route path="/danh-muc" element={<CategoryList />} />
          <Route path="/danh-muc/tao-moi" element={<CategoryCreate />} />
          <Route path="/danh-muc/:id/chinh-sua" element={<CategoryEdit />} />

          {/* Post */}
          <Route path="/bai-viet" element={<PostList />} />
          <Route path="/bai-viet/tao-moi" element={<PostCreate />} />
          <Route path="/bai-viet/:id/chinh-sua" element={<PostEdit />} />

          {/* Manage Learning - chỉ teacher, admin và super admin*/}
          <Route path="/chuong-trinh-hoc" element={<ProgramListPage />} />

          {/* User - chỉ admin & super admin */}
          <Route
            element={<ProtectedRoute allowedRoles={USER_MANAGEMENT_ROLES} />}
          >
            <Route path="/nguoi-dung" element={<UserList />} />
            <Route path="/nguoi-dung/tao-moi" element={<UserCreate />} />
            <Route path="/nguoi-dung/:id/chinh-sua" element={<UserEdit />} />
            <Route path="/nguoi-dung/quan-li-vai-tro" element={<UserRole />} />
            <Route path="/nguoi-dung/thong-ke" element={<UserOverview />} />
          </Route>

          {/* Consultation */}
          <Route path="/tu-van" element={<ConsultationList />} />

          {/* 404 trong admin */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
