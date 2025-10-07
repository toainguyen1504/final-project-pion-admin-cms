import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessagesSquare,
  Users,
  ChevronDown,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toaicdevImg from "../../assets/images/toaicdev.png";
import logo_icon from "../../assets/images/logo_icon.png";

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", badge: "New" },
  {
    id: "categories",
    icon: FolderKanban,
    label: "Categories",
    submenu: [
      {
        id: "all-categories",
        label: "All Categories",
        path: "/categories",
      },
      {
        id: "create-category",
        label: "Create Category",
        path: "/categories/create",
      },
    ],
  },
  {
    id: "posts",
    icon: FileText,
    label: "Posts",
    submenu: [
      { id: "all-posts", label: "All Posts" },
      { id: "seo-settings", label: "SEO Settings" },
      { id: "drafts", label: "Drafts" },
      { id: "tags", label: "Tags & Keywords" },
    ],
  },
  {
    id: "consultations",
    icon: MessagesSquare,
    label: "Consultations",
    submenu: [
      { id: "consult-requests", label: "Consult Requests" },
      { id: "consult-topics", label: "Consult Topics" },
      { id: "consult-history", label: "Consult History" },
    ],
  },
  {
    id: "users",
    icon: Users,
    label: "Users",
    submenu: [
      { id: "all-users", label: "All Users" },
      { id: "roles", label: "Roles & Permissions" },
      { id: "activity", label: "User Activity" },
      { id: "feedback", label: "User Feedback" },
    ],
  },
];

function Sidebar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [activeId, setActiveId] = useState(null);

  // active menu
  useEffect(() => {
    const current = location.pathname.split("/")[1] || "dashboard";
    const parent = menuItems.find((item) =>
      item.submenu?.some((sub) => sub.id === current)
    );

    if (parent) {
      setExpandedId(parent.id);
      setActiveId(current);
    } else {
      setExpandedId(null);
      setActiveId(current);
    }
  }, [location.pathname]);

  const handleMenuClick = (item) => {
    if (item.submenu) {
      setExpandedId(expandedId === item.id ? null : item.id);
      setActiveId(item.id);
    } else {
      if (item.id === "dashboard") {
        navigate("/");
      } else {
        navigate(`/${item.id}`);
      }
      setActiveId(item.id);
      setExpandedId(null);
    }
  };

  const handleSubmenuClick = (sub, parentId) => {
    navigate(`/${sub.id}`);
    setActiveId(sub.id);
    setExpandedId(parentId);
  };

  return (
    <div
      className={`${collapsed ? "w-20" : "w-72"} transition-all duration-300 
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 
      dark:border-slate-700/50 flex flex-col`}
    >
      {/* Logo */}
      <div
        className={`${
          collapsed ? "flex items-center justify-center px-4 py-6" : "p-6"
        } border-b border-slate-200/50 dark:border-slate-700/50`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <img
              src={logo_icon}
              alt="Logo"
              className="w-10 h-10 p-1.5 object-contain"
            />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Pion
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                CMS panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            activeId === item.id ||
            item.submenu?.some((sub) => sub.id === activeId);

          return (
            <div key={item.id}>
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </div>
                {!collapsed && item.submenu && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      expandedId === item.id ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Submenu */}
              {!collapsed && item.submenu && (
                <div
                  ref={(el) => (item.ref = el)}
                  style={{
                    height:
                      expandedId === item.id
                        ? `${item.ref?.scrollHeight}px`
                        : "0px",
                    opacity: expandedId === item.id ? 1 : 0,
                  }}
                  className="ml-8 mt-2 space-y-1 overflow-hidden transition-all duration-400 ease-in-out"
                >
                  {item.submenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubmenuClick(sub, item.id)}
                      className={`w-full text-left p-2 text-sm rounded-lg transition-all
                       ${
                         activeId === sub.id
                           ? "bg-blue-100 dark:bg-slate-800 text-blue-600"
                           : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                       }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <img
              src={toaicdevImg}
              alt="Admin"
              className="w-10 h-10 rounded-full ring-2 ring-blue-500 object-cover"
            />
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                ToaiCDev
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administrator
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
