import { Routes, Route } from "react-router-dom";
import Dashboard from "@/components/dashboard/Dashboard";
import CategoriesList from "@/components/categories/CategoriesList";
import CategoryCreate from "@/components/categories/CategoryCreate";
import AdminLayout from "@/components/layout/AdminLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/create" element={<CategoryCreate />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
