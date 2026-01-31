import { User, Settings, Info, LogOut } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

function ProfileHeaderPopup({ user }) {

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call API logout
      await axiosInstance.post("/logout");
      toast.success("Successfully signed out!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Unable to sign out. Please try again later.");
    } finally {
      // Always clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
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
          <span>Chỉnh sửa hồ sơ</span>
        </button>
        <button
          className="cursor-pointer w-full flex items-center space-x-2 px-4 py-2 text-sm 
          text-slate-600 dark:text-slate-300  hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <Settings className="w-4 h-4" />
          <span>Cài đặt tài khoản</span>
        </button>
        <button
          className="cursor-pointer w-full flex items-center space-x-2 px-4 py-2 text-sm
        text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <Info className="w-4 h-4" />
          <span>Hỗ trợ</span>
        </button>
        <button
          onClick={handleLogout}
          className="cursor-pointer w-full flex items-center space-x-2 px-4 py-2 text-sm
          text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileHeaderPopup;
