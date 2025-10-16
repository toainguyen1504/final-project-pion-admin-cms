import { Outlet } from "react-router-dom";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

function AdminLayout() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsed={sideBarCollapsed} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
          />
          <main className="relative z-[10] flex-1 overflow-y-auto bg-transparent">
            <div className="px-6 py-4 space-y-6">
              {/* Routes */}
              <Outlet />
            </div>
          </main>

          <Toaster position="top-right" richColors/>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
