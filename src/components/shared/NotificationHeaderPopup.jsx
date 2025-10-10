import { X } from "lucide-react";

function NotificationHeaderPopup({ notifications = [], onClose }) {
  return (
    <div className="animate-fade-in-scale absolute top-full right-0 mt-5 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-[200] transition-all duration-300 ease-out origin-top-right">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800 dark:text-white">
          Notifications
        </p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer pl-2 py-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-96 overflow-y-auto">
        {notifications.map((item, index) => (
          <div
            key={index}
            className="px-4 py-3 flex items-start space-x-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <img
              src={item.avatar}
              alt={item.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-medium">{item.name}</span> {item.message}
              </p>
              <p className="text-xs text-slate-400 mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 text-center">
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View All Notifications
        </button>
      </div>
    </div>
  );
}

export default NotificationHeaderPopup;
