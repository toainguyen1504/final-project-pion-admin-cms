import { Routes, Route } from "react-router-dom";

import AdminLayout from "@/components/layout/AdminLayout";
import Dashboard from "@/components/dashboard/Dashboard";
import LoginPage from "@/pages/auth/LoginPage";
import CategoryList from "@/components/categories/CategoryList";
import CategoryCreate from "@/components/categories/CategoryCreate";
import CategoryEdit from "@/components/categories/CategoryEdit";

import PostList from "@/components/posts/PostList";
import PostCreate from "@/components/posts/PostCreate";
import PostEdit from "@/components/posts/PostEdit";

// import UserList from "@/components/users/UserList";
// import UserCreate from "@/components/users/UserCreate";
import ConsultationList from "@/components/consultations/ConsultationList";

function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes with layout */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />

        {/* Category */}
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/create" element={<CategoryCreate />} />
        <Route path="/categories/:id/edit" element={<CategoryEdit />} />

        {/* Post */}
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/create" element={<PostCreate />} />
        <Route path="/posts/:id/edit" element={<PostEdit />} />

        {/* Consultation */}
        <Route path="/consultations" element={<ConsultationList />} />

        {/* User */}
        {/* <Route path="/users" element={<UserList />} />
        <Route path="/users/create" element={<UserCreate />} /> */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
