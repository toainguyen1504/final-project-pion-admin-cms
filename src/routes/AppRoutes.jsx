import { Routes, Route } from "react-router-dom";

import AdminLayout from "@/components/layout/AdminLayout";
import Dashboard from "@/components/dashboard/Dashboard";
import CategoryList from "@/components/categories/CategoryList";
import CategoryCreate from "@/components/categories/CategoryCreate";
import PostList from "@/components/posts/PostList";
import PostCreate from "@/components/posts/PostCreate";
import UserList from "@/components/users/UserList";
import UserCreate from "@/components/users/UserCreate";
import ConsultationList from "@/components/consultations/ConsultationList";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/create" element={<CategoryCreate />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/create" element={<PostCreate />} />
        <Route path="/consultations" element={<ConsultationList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/create" element={<UserCreate />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
