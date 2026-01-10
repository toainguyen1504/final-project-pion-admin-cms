import { Helmet } from "react-helmet-async";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppBreadcrumb from "@/components/shared/AppBreadcrumb";

// 1. UI: Cần chỉnh lại dùng Label và Input của ui library để đồng bộ (ví dụ như CategoryCreate.jsx)
// 2. UI: Cần set errors validation cho form
// 3: Sau khi done UI cho create user -> copy để làm trang edit user

function UserCreate() {
  const [formData, setFormData] = useState({
    display_name: "",
    username: "",
    email: "",
    gender: "male",
    phone: "",
    role: "",
    profile_image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Created:", formData);
    // TODO: gửi dữ liệu lên API hoặc xử lý logic
  };

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>Tạo Mới Người Dùng | Pion CMS</title>
      </Helmet>

      <AppBreadcrumb module="Người dùng" current="Tạo mới" />

      {/* Header + Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">
            Tạo Mới Người Dùng
          </h2>
          <p className="text-slate-500 mt-1">
            Trang tạo mới người dùng để thêm thông tin và quản lý tài khoản.
          </p>
        </div>

        <Button
          type="submit"
          form="user-form"
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
            text-white min-w-40 cursor-pointer select-none transition-all duration-300"
          // disabled={loading}
        >
          {/* {loading && <Spinner className="w-4 h-4 mr-2 text-white" />} */}
          Lưu Người Dùng
        </Button>
      </div>

      {/* Form */}
      <form
        id="user-form"
        onSubmit={handleSubmit}
        className="space-y-6 mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"
      >
        {/* Display Name + Username */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Họ và tên
            </label>
            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 
                   bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              disabled
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 
                   bg-slate-100 dark:bg-slate-700 px-3 py-2 text-slate-500 dark:text-slate-400 
                   cursor-not-allowed"
              placeholder="Username sẽ được tự động tạo"
            />
          </div>
        </div>

        {/* Email + Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 
                   bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Vai trò
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 
                   bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Chọn vai trò --</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="learner">Learner</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        </div>

        {/* Gender + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Giới tính
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 
                   bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 
                   bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="0123456789"
            />
          </div>
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Ảnh đại diện (URL)
          </label>
          <input
            type="text"
            name="profile_image"
            value={formData.profile_image}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 
                 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 
                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="https://i.pravatar.cc/150?img=1"
          />
        </div>
      </form>
    </div>
  );
}

export default UserCreate;
