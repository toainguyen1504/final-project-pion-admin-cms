import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import AppBreadcrumb from "@/components/shared/AppBreadcrumb";

function UserCreate() {
  const [formData, setFormData] = useState({
    display_name: "",
    username: "",
    email: "",
    gender: "other",
    phone: "",
    role: "",
    profile_image: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock validation errors
    const newErrors = {};
    if (!formData.display_name.trim()) {
      newErrors.display_name = ["Họ và tên là bắt buộc."];
    }
    if (!formData.email.trim()) {
      newErrors.email = ["Email là bắt buộc."];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ["Email không hợp lệ."];
    }
    if (!formData.phone.trim()) {
      newErrors.phone = ["Số điện thoại là bắt buộc."];
    } else if (!/^[0-9]{9,11}$/.test(formData.phone)) {
      newErrors.phone = ["Số điện thoại không hợp lệ."];
    }
    if (!formData.role) {
      newErrors.role = ["Vai trò là bắt buộc."];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    console.log("User Created:", formData);
    setLoading(false);
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
          disabled={loading}
        >
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
          <div className="space-y-2">
            <Label
              htmlFor="display_name"
              className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
            >
              Họ và tên <span className="text-red-500 text-sm">*</span>
            </Label>
            <Input
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              className="py-5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
              focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
               text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
            />
            {errors.display_name && (
              <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
                {errors.display_name[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
            >
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              disabled
              placeholder="Username sẽ được tự động tạo"
              className="cursor-not-allowed py-5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
              focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
               text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
            />
          </div>
        </div>

        {/* Email + Role + phone*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
            >
              Email <span className="text-red-500 text-sm">*</span>
            </Label>

            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="py-5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
        focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
        text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
            />
            {errors.email && (
              <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
                {errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="role"
              className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
            >
              Vai trò <span className="text-red-500 text-sm">*</span>
            </Label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
        focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
        text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
            >
              <option value="">-- Chọn vai trò --</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="learner">Learner</option>
              <option value="staff">Staff</option>
            </select>
            {errors.role && (
              <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
                {errors.role[0]}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
            >
              Số điện thoại
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0123456789"
              className="py-5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
        focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
        text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
            />
            {errors.phone && (
              <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
                {errors.phone[0]}
              </p>
            )}
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label
            htmlFor="gender"
            className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
          >
            Giới tính
          </Label>
          <RadioGroup
            id="gender"
            name="gender"
            value={formData.gender}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, gender: value }))
            }
            className="flex items-center gap-6 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label
                htmlFor="male"
                className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
              >
                Nam
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label
                htmlFor="female"
                className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
              >
                Nữ
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label
                htmlFor="other"
                className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
              >
                Khác
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Profile Image */}
        <div className="space-y-2">
          <Label htmlFor="profile_image">Ảnh đại diện (URL)</Label>
          <Input
            id="profile_image"
            name="profile_image"
            value={formData.profile_image}
            onChange={handleChange}
            placeholder="https://i.pravatar.cc/150?img=1"
            className="py-5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
              focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
               text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
          />
        </div>
      </form>
    </div>
  );
}

export default UserCreate;
