import { BookCopy, Layers3, Users, Clock3 } from "lucide-react";
import { formatDurationHuman } from "@/utils/formatDurationHuman";

const cards = [
  {
    key: "lessons",
    label: "Bài học",
    icon: BookCopy,
  },
  {
    key: "flashcards",
    label: "Flashcards",
    icon: Layers3,
  },
  {
    key: "participants",
    label: "Học viên",
    icon: Users,
  },
  {
    key: "duration",
    label: "Thời lượng",
    icon: Clock3,
  },
];

export default function CourseStatsCards({
  totalLessons,
  totalFlashcards,
  participants,
  duration,
}) {
  const values = {
    lessons: totalLessons,
    flashcards: totalFlashcards,
    participants,
    duration,
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;
        const value = values[item.key] ?? 0;

        const displayValue =
          item.key === "duration"
            ? formatDurationHuman(Number(value || 0))
            : value;

        return (
          <div
            key={item.key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {displayValue}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
