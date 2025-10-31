import { Bell, ChevronDown, Menu, Plus, Search, Sun, Moon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import ProfileHeaderPopup from "./ProfileHeaderPopup";
import NotificationHeaderPopup from "./NotificationHeaderPopup";
import user_default from "@/assets/images/user_default.jpg";

// Mock data noti
const notifications = [
  {
    name: "Terry Franci",
    message: "requests permission to change Project - Nganter App",
    time: "5 min ago",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    name: "Alena Franci",
    message: "requests permission to change Project - Nganter App",
    time: "8 min ago",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    name: "Jocelyn Kenter",
    message: "requests permission to change Project - Nganter App",
    time: "10 min ago",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    name: "Brandon Philips",
    message: "requests permission to change Project - Nganter App",
    time: "1 hr ago",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
];

function Header({ onToggleSidebar }) {
  const [theme, setTheme] = useState("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();

  // handle close popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfilePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // handle search
  const handleSearch = () => {
    // handle here
    if (!searchQuery.trim()) return;
    // console.log("Searching for:", searchQuery);
  };

  // read theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b
  border-slate-200/50 dark:border-slate-700/50 px-6 py-3.5 relative z-[50]"
    >
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100
         dark:hover:bg-slate-800 cursor-pointer transition-colors"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Center */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            {/* Shortcut icon (⌘K)*/}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm pointer-events-none select-none">
              ⌘K
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search Anything"
              className="w-full pl-10 pr-12 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200
            dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 py-1.5 pl-2.5 pr-1.5
            text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3">
          {/* Quick Action */}
          <button
            onClick={() => navigate("/posts/create")}
            className="hidden lg:flex items-center space-x-2 py-2 px-4 cursor-pointer bg-gradient-to-r 
          from-blue-500 to bg-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Post</span>
          </button>

          {/* Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 
            dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Noti */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            {showNotifications && (
              <NotificationHeaderPopup
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>

          {/* User profile */}
          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700 
            cursor-pointer select-none"
              onClick={() => setShowProfilePopup((prev) => !prev)}
            >
              <img
                src={user_default}
                alt="user"
                className="w-8 h-8 rounded-full ring-2 ring-blue-500 object-cover"
              />
              <p className="hidden md:block">
                <span className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                  Kieu Chinh
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Staff marketing
                </span>
              </p>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  showProfilePopup ? "rotate-180" : ""
                }`}
              />
            </div>
            {/* Popup menu */}
            {showProfilePopup && <ProfileHeaderPopup />}
          </div>
          {/* End User profile */}
        </div>
      </div>
    </div>
  );
}

export default Header;
