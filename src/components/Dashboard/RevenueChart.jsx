import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

function RevenueChart() {
  const data = [
    { month: "Jan", revenue: 45000, expenses: 32000 },
    { month: "Feb", revenue: 52000, expenses: 38000 },
    { month: "Mar", revenue: 47000, expenses: 36000 },
    { month: "Apr", revenue: 51000, expenses: 40000 },
    { month: "May", revenue: 55000, expenses: 44000 },
    { month: "Jun", revenue: 62000, expenses: 47000 },
    { month: "Jul", revenue: 67000, expenses: 49000 },
    { month: "Aug", revenue: 72000, expenses: 52000 },
    { month: "Sep", revenue: 74000, expenses: 53000 },
    { month: "Oct", revenue: 78000, expenses: 55000 },
    { month: "Nov", revenue: 82000, expenses: 55000 },
    { month: "Dec", revenue: 89000, expenses: 58000 },
  ];

  return (
    <div
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-b-2xl border
     border-slate-200/50 dark:border-slate-700/50 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Revenue Chart DEMO
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Month revenue and expenses
          </p>
        </div>

        {/* Customize Legend */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to bg-purple-600 rounded-full"></div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span>Revenus</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full"></div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span>Expenses</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#9333ea" /> {/* purple-600 */}
                <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
              </linearGradient>

              <linearGradient id="expensesGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#62748e" /> {/* slate-500 */}
                <stop offset="100%" stopColor="#cbd5e1" /> {/* slate-300 */}
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                fontSize: "0.875rem",
                color: "#374151",
              }}
              labelStyle={{
                color: "#374151",
                fontWeight: "500",
                fontSize: "0.875rem",
              }}
            />
            {/* <Legend
              wrapperStyle={{
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            /> */}
            <Bar
              dataKey="revenue"
              fill="url(#revenueGradient)"
              name="Revenue"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              fill="url(#expensesGradient)"
              name="Expenses"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;
