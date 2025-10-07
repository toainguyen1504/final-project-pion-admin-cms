import React from "react";

const mockConsultations = [
  {
    id: 101,
    request_content: "Tư vấn về sản phẩm mới",
    status: "Pending",
    date: "2025-10-01",
    user: {
      name: "Nguyễn Văn A",
      email: "nguyena@example.com",
    },
  },
  {
    id: 102,
    request_content: "Hỗ trợ kỹ thuật",
    status: "Resolved",
    date: "2025-10-03",
    user: {
      name: "Trần Thị B",
      email: "tranb@example.com",
    },
  },
  {
    id: 103,
    request_content: "Yêu cầu báo giá",
    status: "In Progress",
    date: "2025-10-05",
    user: {
      name: "Lê Văn C",
      email: "lec@example.com",
    },
  },
];

function TableSection() {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Consultations
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Customer consultation requests
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                ID
              </th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                Customer
              </th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                Email
              </th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                Request
              </th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                Status
              </th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
            {mockConsultations.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                  #{item.id}
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {item.user.name}
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400">
                  {item.user.email}
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {item.request_content}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Resolved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableSection;
