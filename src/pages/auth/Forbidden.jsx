import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import logo_icon from "@/assets/images/logo_icon.png";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 bg-white dark:bg-slate-900">
      {/* Logo + Icon */}
      <div className="flex items-center gap-3 mb-12">
        <div
          className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600
                 rounded-xl flex items-center justify-center shadow-lg"
        >
          <img
            src={logo_icon}
            alt="Logo"
            className="block w-12 h-12 p-1.5 object-contain"
          />
        </div>
        <h2 className="ml-2 text-3xl font-semibold uppercase text-slate-800 dark:text-white">
          Pion CMS
        </h2>
      </div>

      {/* Alert Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
        <Lock className="w-8 h-8" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400 mb-2">
        Truy cập bị từ chối
      </h1>

      {/* Message */}
      <p className="text-base text-slate-600 dark:text-slate-300 mb-6 max-w-md">
        Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại quyền
        hoặc quay về <strong>Trang chủ</strong> để tiếp tục sử dụng hệ thống.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="inline-flex items-center px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
      >
        Quay về Trang chủ
      </Link>
    </div>
  );
}
