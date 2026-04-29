import { CheckCircle2, XCircle } from "lucide-react";

function HealthItem({ ok, text }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
        ok
          ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300"
          : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
      }`}
    >
      {ok ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0" />
      )}
      <span>{text}</span>
    </div>
  );
}

export default function CourseQuickHealth({
  course,
  lessons,
  lessonsWithoutFlashcards,
}) {
  const hasThumbnail = Boolean(
    course?.thumbnail_thumb || course?.thumbnail_url || course?.thumbnail,
  );
  const hasDescription = Boolean(course?.description?.trim());
  const hasLessons = lessons.length > 0;
  const noMissingFlashcards = lessonsWithoutFlashcards.length === 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Content Health
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Kiểm tra nhanh độ hoàn thiện nội dung của khóa học.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <HealthItem ok={hasThumbnail} text="Có thumbnail" />
        <HealthItem ok={hasDescription} text="Có mô tả khóa học" />
        <HealthItem ok={hasLessons} text="Đã có ít nhất 1 bài học" />
        <HealthItem
          ok={noMissingFlashcards}
          text={
            noMissingFlashcards
              ? "Tất cả bài học đã có flashcards"
              : `${lessonsWithoutFlashcards.length} bài học chưa có flashcards`
          }
        />
      </div>
    </div>
  );
}
