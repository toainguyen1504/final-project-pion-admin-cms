import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import axiosInstance from "@/utils/axiosInstance";
import { ADMIN_CMS_ROLES } from "@/constants/roles";
import logo from "@/assets/images/logo_icon_gradient.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState(""); // username or email field
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Xử lý login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/cms/login", {
        login,
        password,
      });

      // Nếu đăng nhập thành công
      const { token, user } = response.data;

      // Lưu token vào localStorage -> optimize: nên nâng cấp bảo mật (làm sau)
      localStorage.setItem("authTokenCms", token);
      localStorage.setItem("userCms", JSON.stringify(user));

      toast.success("Đăng nhập thành công!");

      // Delay trước khi chuyển hướng
      setTimeout(() => {
        window.location.href = "/"; // chuyển về dashboard
      }, 1000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Sai email/username hoặc mật khẩu.");
      } else if (err.response?.status === 403) {
        setError("Tài khoản không có quyền truy cập hệ thống quản trị.");
        toast.error("Bạn không được phép truy cập vào Admin CMS.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập | Pion CMS</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 z-10 relative">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Pion Logo" className="w-14 h-14 rounded-lg" />
          </div>

          <h2 className="text-4xl font-semibold text-center text-gray-800 mb-7 uppercase">
            Pion CMS
          </h2>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Login (email or username) */}
            <div className="space-y-3">
              <Label className="!text-base" htmlFor="login">
                Email hoặc Username
              </Label>
              <Input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="you@example.com hoặc username"
                autoComplete="username"
                required
                className="!py-3 !text-base"
              />
            </div>

            {/* Password */}
            <div className="space-y-3 relative">
              <Label className="!text-base" htmlFor="password">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="!py-3 !text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Lỗi đăng nhập */}
            {error && (
              <p className="text-red-600 text-center font-normal">{error}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full !text-lg rounded-xl !py-6 mt-1 cursor-pointer select-none uppercase font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 transition"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
