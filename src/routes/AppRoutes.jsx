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
import ProgramListPage from "@/components/learning/programs/ProgramListPage";
// import ProgramDetailPage from "@/components/learning/programs/ProgramDetailPage";

// Learning global
import CourseListPage from "@/components/learning/courses/CourseListPage";
import CourseCreatePage from "@/components/learning/courses/CourseCreatePage";
import CourseEditPage from "@/components/learning/courses/CourseEditPage";

import LessonListPage from "@/components/learning/lessons/LessonListPage";
import LessonCreatePage from "@/components/learning/lessons/LessonCreatePage";
import LessonEditPage from "@/components/learning/lessons/LessonEditPage";

import FlashcardListPage from "@/components/learning/flashcards/FlashcardListPage";
import FlashcardCreatePage from "@/components/learning/flashcards/FlashcardCreatePage";
// import FlashcardDetailPage from "@/components/learning/flashcards/FlashcardDetailPage";
// import FlashcardEditPage from "@/components/learning/lessons/FlashcardEditPage";

// User Management
import UserList from "@/components/users/UserList";
import UserCreate from "@/components/users/UserCreate";
import UserEdit from "@/components/users/UserEdit";
import UserRole from "@/components/users/UserRole";
import UserOverview from "@/components/users/UserOverview";

import ConsultationList from "@/components/consultations/ConsultationList";

import NotFound from "@/pages/NotFound"; // 404 page
import Forbidden from "@/pages/auth/Forbidden"; // Forbidden page
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
          {/* PROGRAM */}
          <Route path="/chuong-trinh-hoc" element={<ProgramListPage />} />

          {/* Program detail */}
          {/* <Route
            path="/chuong-trinh-hoc/:programId"
            element={<ProgramDetailPage />}
          /> */}

          {/* COURSES */}
          <Route path="/khoa-hoc" element={<CourseListPage />} />
          <Route path="/khoa-hoc/tao-moi" element={<CourseCreatePage />} />
          <Route path="/khoa-hoc/:id/chinh-sua" element={<CourseEditPage />} />

          {/* LESSONS */}
          <Route path="/bai-hoc" element={<LessonListPage />} />
          <Route path="/bai-hoc/tao-moi" element={<LessonCreatePage />} />
          <Route path="/bai-hoc/:id/chinh-sua" element={<LessonEditPage />} />

          {/* Flashcard */}
          <Route path="/flashcards" element={<FlashcardListPage />} />
          <Route path="/flashcards/tao-moi" element={<FlashcardCreatePage />} />
          {/* <Route path="/flashcards/:id" element={<FlashcardDetailPage />} /> */}

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
