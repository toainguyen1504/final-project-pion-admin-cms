import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessagesSquare,
  Users,
  ChevronDown,
} from "lucide-react";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";

import toaicdevImg from "@/assets/images/toaicdev.png";
import logo_icon from "@/assets/images/logo_icon.png";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Tổng Quan",
    slug: "",
    path: "/",
  },
  {
    id: "categories",
    icon: FolderKanban,
    label: "Danh Mục",
    slug: "danh-muc",
    submenu: [
      { id: "categories", label: "Tất cả danh mục", path: "/danh-muc" },
      {
        id: "create-category",
        label: "Tạo mới danh mục",
        path: "/danh-muc/tao-moi",
      },
    ],
  },
  {
    id: "posts",
    icon: FileText,
    label: "Bài Viết",
    slug: "bai-viet",
    submenu: [
      { id: "posts", label: "Tất cả bài viết", path: "/bai-viet" },
      {
        id: "create-post",
        label: "Tạo mới bài viết",
        path: "/bai-viet/tao-moi",
      },
    ],
  },
  {
    id: "users",
    icon: Users,
    label: "Người Dùng",
    slug: "nguoi-dung",
    submenu: [
      { id: "users", label: "Tất cả người dùng", path: "/nguoi-dung" },
      {
        id: "create-user",
        label: "Tạo mới người dùng",
        path: "/nguoi-dung/tao-moi",
      },
      {
        id: "role-user",
        label: "Vai trò người dùng",
        path: "/nguoi-dung/quan-li-vai-tro",
      },
      {
        id: "overview-user",
        label: "Thống kê người dùng",
        path: "/nguoi-dung/thong-ke",
      },
    ],
  },
  {
    id: "consultations",
    icon: MessagesSquare,
    label: "Danh Sách Tư Vấn",
    slug: "tu-van",
    badge: "New",
    path: "/tu-van",
  },
];

function Sidebar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [activeId, setActiveId] = useState(null);

  // ======== Helper: create a dynamic pattern for edit/view paths ========
  const getDynamicPatterns = (item) => {
    if (!item.slug) return [];
    return [`/${item.slug}/:id/chinh-sua`, `/${item.slug}/:id`];
  };

  // Determine the active menu/submenu based on the current URL
  useEffect(() => {
    const currentPath = location.pathname;
    let found = false;

    for (const item of menuItems) {
      // 1) check submenu first (exact or prefix)
      if (item.submenu) {
        for (const sub of item.submenu) {
          const matchedSub = matchPath(
            { path: sub.path, end: true },
            currentPath
          );
          if (matchedSub) {
            setActiveId(sub.id);
            setExpandedId(item.id);
            found = true;
            break;
          }
        }
      }
      if (found) break;

      // 2) check direct item.path (e.g. '/consultations' or root '/')
      if (item.path) {
        const isRoot = item.path === "/";
        const matched = matchPath(
          { path: item.path, end: isRoot },
          currentPath
        );
        if (matched) {
          setActiveId(item.id);
          setExpandedId(null);
          found = true;
          break;
        }
      }
      if (found) break;

      // 3) check dynamic patterns (like /categories/:id/edit or /categories/:id) - change /danh-muc/:id/chinh-sua
      const dynamicPatterns = getDynamicPatterns(item);
      for (const pat of dynamicPatterns) {
        const matchedDyn = matchPath({ path: pat, end: false }, currentPath);
        if (matchedDyn) {
          // active parent
          setActiveId(item.id);
          setExpandedId(item.id);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      setActiveId(null);
      setExpandedId(null);
    }
  }, [location.pathname]);

  // Handle click parent menu
  const handleMenuClick = (item) => {
    if (item.submenu) {
      // only toggle expanded
      setExpandedId((prev) => (prev === item.id ? null : item.id));
    } else if (item.path) {
      // force highlight when click
      flushSync(() => {
        setActiveId(item.id);
        setExpandedId(null);
      });
      navigate(item.path);
    }
  };

  // handle click submenu
  const handleSubmenuClick = (sub, parentId) => {
    // Force update the UI right before navigating to avoid race conditions
    flushSync(() => {
      setActiveId(sub.id);
      setExpandedId(parentId);
    });
    navigate(sub.path);
  };

  return (
    <div
      className={`${collapsed ? "w-20" : "w-72"} !transition-all !duration-300 
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 
      dark:border-slate-700/50 flex flex-col`}
    >
      {/* Logo */}
      <div
        className={`${
          collapsed ? "flex items-center justify-center px-4 py-4" : "p-3.5"
        } border-b border-slate-200/50 dark:border-slate-700/50`}
      >
        <div
          className="inline-flex items-center space-x-3 group cursor-pointer select-none"
          onClick={() => {
            flushSync(() => setActiveId("dashboard"));
            navigate("/");
          }}
        >
          <div
            className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600
           rounded-xl flex items-center justify-center shadow-lg"
          >
            <img
              src={logo_icon}
              alt="Logo"
              className="block w-10 h-10 p-1.5 object-contain"
            />
          </div>
          {!collapsed && (
            <div className="h-10 flex flex-col justify-center">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Pion
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trang Quản Lý CMS
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
                className={`w-full flex items-center justify-between p-3 rounded-xl !transition-all !duration-300 cursor-pointer
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  {!collapsed && (
                    <>
                      {/* label */}
                      <span
                        className={`font-medium ${
                          isActive
                            ? "text-white"
                            : "text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {item.label}
                      </span>

                      {/* badge / count */}
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {!collapsed && item.submenu && (
                  <ChevronDown
                    className={`w-4 h-4 !transition-transform !duration-300 ${
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
                      className={`w-full text-left p-2 text-sm rounded-lg transition-all cursor-pointer
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
                FullStack Developer
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
