import {
  FolderKanban,
  FileText,
  MessagesSquare,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { fetchCategoryStats } from "@/lib/api/categories";
import { fetchPostStats } from "@/lib/api/posts";
import { fetchUserStats } from "@/lib/api/users";
import { fetchConsultationStats } from "@/lib/api/consultation";
import { useLoadStats } from "@/hooks/useLoadStats";

function StatsGrid() {
  const categoryStat = useLoadStats(fetchCategoryStats, "Tổng Danh Mục");
  const postStat = useLoadStats(fetchPostStats, "Tổng Bài Viết");
  const userStat = useLoadStats(fetchUserStats, "Tổng Người Dùng");
  const consultationStat = useLoadStats(fetchConsultationStats, "Tổng Tư Vấn");

  const stats = [
    {
      ...categoryStat,
      icon: FolderKanban,
      color: "from-yellow-500 to-orange-600",
      bgColor: "from-yellow-50 to-orange-100",
      darkBgColor: "dark:from-yellow-900 dark:to-orange-900",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      ...postStat,
      icon: FileText,
      color: "from-indigo-500 to-purple-600",
      bgColor: "from-indigo-50 to-purple-100",
      darkBgColor: "dark:from-indigo-900 dark:to-purple-900",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      ...consultationStat,
      icon: MessagesSquare,
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-50 to-pink-100",
      darkBgColor: "dark:from-rose-900 dark:to-pink-900",
      textColor: "text-rose-600 dark:text-rose-400",
    },
    {
      ...userStat,
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-100",
      darkBgColor: "dark:from-blue-900 dark:to-cyan-900",
      textColor: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        return (
          <div
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6
      border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20
      dark:hover:shadow-slate-900/20 transition-all duration-300 group"
            key={index}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                  {stat.value}
                </p>

                <div className="flex items-center space-x-2">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}

                  <span
                    className={`text-sm font-semibold ${
                      stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    vs Tháng Trước
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.bgColor} group-hover:scale-110 transition-all duration-300`}
              >
                {<stat.icon className={`w-6 h-6 ${stat.textColor}`} />}
              </div>
            </div>

            {/* Progressbar */}
            <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-100`}
                // style={{ width: stat.trend === "up" ? "75%" : "45%" }}
                style={{ width: stat.progressWidth || "0%" }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsGrid;
