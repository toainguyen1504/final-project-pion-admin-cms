import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function SalesChart() {
  const data = [
    { name: "Electronics", value: 450, color: "#3b82f6" }, // blue-500
    { name: "Clothing", value: 300, color: "#9333ea" }, // purple-600
    { name: "Books", value: 150, color: "#22c55e" }, // green-500
    { name: "Other", value: 100, color: "#f97316" }, // orange-500
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-b-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          Sales by Category DEMO
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Production Distribution
        </p>
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              label={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Customize Legend */}
      <div className="mt-6 space-y-3">
        {data.map((item, index) => {
          const percent = ((item.value / total) * 100).toFixed(0);
          return (
            <div
              key={index}
              className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.name}</span>
              </div>
              <span>{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SalesChart;
