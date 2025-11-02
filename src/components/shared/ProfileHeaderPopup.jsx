import { User, Settings, Info, LogOut } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance"; // ✅ Dùng axiosInstance
import { toast } from "sonner";

function ProfileHeaderPopup({ user = {} }) {
  const handleLogout = async () => {
    try {
      // Gọi API logout
      await axiosInstance.post("/logout");

      // Xóa dữ liệu trong localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      toast.success("Đăng xuất thành công!");

      // Delay trước khi chuyển hướng
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Không thể đăng xuất. Vui lòng thử lại sau.");
    }
  };

  return (
    <div
      className="animate-fade-in-scale absolute top-full right-0 mt-5 w-72 bg-white dark:bg-slate-800 border
       border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-[200] transition-all duration-300 ease-out origin-top-right"
    >
      {/* Info */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-800 dark:text-white">
          {user.name || "Quản lý Pion"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {user.email || "quanlypion@gmail.com"}
        </p>
      </div>

      {/* Menu */}
      <div className="p-2 space-y-1">
        <button
          className="cursor-pointer w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-600
         dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <User className="w-4 h-4" />
          <span>Edit profile</span>
        </button>
        <button
          className="cursor-pointer w-full flex items-center space-x-2 px-4 py-2 text-sm 
          text-slate-600 dark:text-slate-300  hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <Settings className="w-4 h-4" />
          <span>Account settings</span>
        </button>
        <button
          className="cursor-pointer w-full flex items-center space-x-2 px-4 py-2 text-sm
        text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <Info className="w-4 h-4" />
          <span>Support</span>
        </button>
        <button
          onClick={handleLogout}
          className="cursor-pointer w-full flex items-center space-x-2 px-4 py-2 text-sm
          text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileHeaderPopup;
