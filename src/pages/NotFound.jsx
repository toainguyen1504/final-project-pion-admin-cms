import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-semibold text-slate-800 dark:text-white mb-2">
        Oops! Trang không tồn tại
      </h1>

      <p className="text-base text-slate-600 dark:text-slate-300 mb-6 max-w-md">
        Có thể đường dẫn bạn nhập không đúng hoặc trang đã bị xoá. Hãy quay về
        <strong> Tổng Quan </strong> để tiếp tục.
      </p>

      <Link
        to="/"
        className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Quay về
      </Link>
    </div>
  );
}

export default NotFound;
