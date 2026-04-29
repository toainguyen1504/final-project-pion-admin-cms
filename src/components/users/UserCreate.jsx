import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AppBreadcrumb from "@/components/shared/AppBreadcrumb";
import { createUser, resetUserPassword } from "@/lib/api/users";
import { fetchAvailableRoles } from "@/lib/api/roles";

function UserCreate() {
  const [formData, setFormData] = useState({
    display_name: "",
    username: "",
    email: "",
    gender: "other",
    phone: "",
    role: "", // sẽ giữ role_id
    profile_image: "",
    password: "",
  });
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRoles() {
      const roles = await fetchAvailableRoles();
      setRoles(roles);
    }

    loadRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedRole = roles.find(
    (r) => r.id.toString() === formData.role.toString(),
  );

  const previewRoleName =
    selectedRole?.name ||
    (typeof formData.role === "string" && isNaN(Number(formData.role))
      ? formData.role
      : "");

  // create account
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};
    if (!formData.display_name.trim()) {
      newErrors.display_name = ["Họ và tên là bắt buộc."];
    }
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ["Email không hợp lệ."];
    }
    if (formData.phone.trim() && !/^[0-9]{9,11}$/.test(formData.phone)) {
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

    try {
      const payload = {
        display_name: formData.display_name,
        role_id: formData.role, // id
        email: formData.email || null,
        phone: formData.phone || null,
        gender: formData.gender,
        profile_image: formData.profile_image || null,
      };

      const response = await createUser(payload);

      if (response.success) {
        toast.success(response.message);

        setFormData((prev) => ({
          ...prev,
          id: response.data.id,
          username: response.data.username,
          password: response.plain_password,
          role: response.data.role_id || prev.role,
        }));
        setErrors({});
      } else {
        toast.error(response.message || "Tạo user thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo user.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // reset password
  const handleResetPassword = async () => {
    if (!formData.id) return;

    try {
      const result = await resetUserPassword(formData.id);

      if (result.success) {
        toast.success(result.message);
        setFormData((prev) => ({
          ...prev,
          password: result.plain_password,
        }));
      } else {
        toast.error(result.message || "Reset password thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi reset password.");
      console.error(error);
    }
  };

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>Tạo tài khoản | Pion CMS</title>
      </Helmet>

      <AppBreadcrumb module="Người dùng" current="Tạo mới" />

      {/* Header + Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">
            Tạo Tài Khoản
          </h2>
          <p className="text-slate-500 mt-1">
            Trang tạo mới người dùng để thêm thông tin và quản lý tài khoản. Chỉ
            cần nhập Họ và Tên, hệ thống sẽ tự động tạo tài khoản.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Form tạo account */}
        <form
          id="user-form"
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md"
        >
          {/* Display Name + Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display name */}
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
              />
              {errors.display_name && (
                <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
                  {errors.display_name[0]}
                </p>
              )}
            </div>

            {/* Role */}
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
                className="form-select"
              >
                <option value="">-- Chọn vai trò --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              {errors.role && (
                <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
                  {errors.role[0]}
                </p>
              )}
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
                  {errors.email[0]}
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

          {/* Submit button */}
          <Button
            type="submit"
            form="user-form"
            className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
        text-white w-full cursor-pointer select-none transition-all duration-300 mt-2"
            disabled={loading}
          >
            Tạo tại khoản
          </Button>
        </form>

        {/* Render account từ response api */}
        <div className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Thông tin tài khoản
          </h3>
          <div className="space-y-3">
            {/* Username */}
            <div className="flex items-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 w-28">
                Username:
              </p>
              <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
                {formData.username || "Chưa có"}
              </p>
            </div>

            {/* Password */}
            <div className="flex items-center gap-x-9">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 w-28">
                Password:
              </p>
              <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
                {formData.password || "Chưa có"}
              </p>
              <Button
                type="button"
                variant="link"
                onClick={handleResetPassword}
                disabled={!formData.id}
                className="ml-8 text-sm font-medium text-red-600 hover:text-red-500 underline underline-offset-2 
    dark:text-red-400 dark:hover:text-red-300 cursor-pointer disabled:opacity-50 select-none"
              >
                Reset
              </Button>
            </div>

            {/* Display Name */}
            <div className="flex items-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 w-28">
                Họ và tên:
              </p>
              <p className="text-base text-slate-800 dark:text-slate-100">
                {formData.display_name || "Chưa có"}
              </p>
            </div>

            {/* Role */}
            <div className="flex items-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 w-28">
                Vai trò:
              </p>
              <p className="text-base text-slate-800 dark:text-slate-100">
                {previewRoleName || "Chưa có"}
              </p>
            </div>

            {/* Gender */}
            <div className="flex items-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 w-28">
                Giới tính:
              </p>
              <p className="text-base text-slate-800 dark:text-slate-100">
                {formData.gender === "male"
                  ? "Nam"
                  : formData.gender === "female"
                    ? "Nữ"
                    : "Khác"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCreate;
