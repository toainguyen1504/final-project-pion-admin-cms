import {
  Zap,
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessagesSquare,
  Users,
  Tags,
  GraduationCap,
  Settings,
  Activity,
  BookOpen,
  ListChecks,
  ChevronDown,
} from "lucide-react";
import toaicdevImg from "../../assets/images/toaicdev.png";
import logo_icon from "../../assets/images/logo_icon.png";
import { useState } from "react";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    active: true,
    badge: "New",
  },
  {
    id: "categories",
    icon: FolderKanban,
    label: "Categories",
    submenu: [
      { id: "post-categories", label: "Post Categories", icon: Tags },
      { id: "course-categories", label: "Course Categories", icon: BookOpen },
    ],
    count: "9",
  },
  {
    id: "posts",
    icon: FileText,
    label: "Posts",
    submenu: [
      { id: "all-posts", label: "All Posts", icon: FileText },
      { id: "seo-settings", label: "SEO Settings", icon: Settings },
      { id: "drafts", label: "Drafts", icon: ListChecks },
      { id: "tags", label: "Tags & Keywords", icon: Tags },
    ],
    count: "20",
  },
  {
    id: "consultations",
    icon: MessagesSquare,
    label: "Consultations",
    submenu: [
      {
        id: "consult-requests",
        label: "Consult Requests",
        icon: MessagesSquare,
      },
      { id: "consult-topics", label: "Consult Topics", icon: BookOpen },
      { id: "consult-history", label: "Consult History", icon: Activity },
    ],
    count: "999",
  },
  {
    id: "users",
    icon: Users,
    label: "Users",
    submenu: [
      { id: "all-users", label: "All Users", icon: Users },
      { id: "roles", label: "Roles & Permissions", icon: Settings },
      { id: "activity", label: "User Activity", icon: Activity },
      { id: "feedback", label: "User Feedback", icon: MessagesSquare },
    ],
    count: "12",
  },
];

function Sidebar({ collapsed, currentPage, onPageChange }) {
  const [expandedItems, setExpandedItems] = useState(new Set(["categories"]));

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);

    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }

    setExpandedItems(newExpanded);
  };

  return (
    <div
      className={`${collapsed ? "w-20" : "w-72"}
      transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80
    backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10`}
    >
      {/* Logo */}
      <div
        className={`${
          collapsed ? "flex items-center justify-center px-4 py-6" : "p-6"
        } border-b border-slate-200/50 dark:border-slate-700/50`}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl
             flex items-center justify-center shadow-lg shrink-0"
          >
            <img
              src={logo_icon}
              alt="Logo Pion"
              className="w-10 h-10 p-1.5 object-contain"
            />
            {/* <Zap className="w-6 h-6 text-white" /> */}
          </div>

          {/* Conditional rendering */}
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white<">
                Pion
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cms panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation - display dynamic menus */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
                ${
                  currentPage === item.id || item.active
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              onClick={() => {
                if (item.submenu) {
                  toggleExpanded(item.id);
                } else {
                  onPageChange(item.id);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5`} />
                {/* Conditional rendering */}

                {!collapsed && (
                  <>
                    <span className="font-medium ml-2">{item.label}</span>

                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}

                    {item.count && (
                      <span
                        className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600
                     dark:text-slate-300 rounded-full"
                      >
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </div>

              {!collapsed && item.submenu && (
                <ChevronDown className={`w-4 h-4 transition-transform`} />
              )}
            </button>

            {/* Sub menus */}
            {!collapsed && item.submenu && expandedItems.has(item.id) && (
              <div className="ml-8 mt-2 space-y-1">
                {item.submenu.map((sub) => (
                  <button
                    key={sub.id}
                    className="w-full text-left p-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800
                   dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-all"
                  >
                    {/* <sub.icon className={`w-4 h-4`} /> */}
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User profile */}
      {!collapsed && (
        <div className="p-4 border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <img
              src={toaicdevImg}
              alt="ToaiCDev Admin"
              className="w-10 h-10 rounded-full ring-2 ring-blue-500 object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  ToaiCDev
                </p>
                <p className="text xs text-slate-500 dark:text-slate-400 truncate">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
