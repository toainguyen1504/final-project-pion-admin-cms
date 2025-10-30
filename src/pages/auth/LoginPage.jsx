import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/images/logo_icon_gradient.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Helmet>
        <title>Đăng nhập | Pion CMS</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
        {/* Overlay đen mờ */}
        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* Form */}
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 z-10 relative">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Pion Logo" className="w-14 h-14 rounded-lg" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-7">
            Đăng nhập Pion CMS
          </h2>

          {/* Form */}
          <div className="space-y-6">
            {/* Email */}
            <div className="space-y-3">
              <Label className="!text-base" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="border !py-5 !text-base border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600 
                focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-xl"
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
                placeholder="••••••••"
                autoComplete="current-password"
                className=" !py-5 !text-base border border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600 
                focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[36px] text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl py-4 mt-1 cursor-pointer select-none uppercase font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 transition"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
