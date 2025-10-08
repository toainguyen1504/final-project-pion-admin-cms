import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import CategoriesList from "./components/Categories/CategoriesList";
import CategoryCreate from "./components/Categories/CategoryCreate";

function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500"
    >
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsed={sideBarCollapsed} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
          />
          <div className="p-10 bg-white dark:bg-slate-800 text-black dark:text-white">
            Test dark mode
          </div>

          <main className="flex-1 overflow-y-auto bg-transparent">
            <div className="p-6 space-y-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/categories" element={<CategoriesList />} />
                <Route path="/categories/create" element={<CategoryCreate />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
