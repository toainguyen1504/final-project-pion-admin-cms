import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Languages,
  Clock3,
  Users,
  Pencil,
  Plus,
  Layers3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import IMAGE_DEFAULT from "@/assets/images/placeholder_img.png";
import { formatDurationHuman } from "@/utils/formatDurationHuman";

function getStatusClasses(status) {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300";
    case "pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
    case "inactive":
      return "bg-slate-200 text-slate-700 dark:bg-slate-600/30 dark:text-slate-200";
    case "archived":
      return "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300";
    default:
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300";
  }
}

export default function CourseDetailHeader({ course }) {
  const thumbnailSrc =
    course?.thumbnail_thumb ||
    course?.thumbnail_url ||
    course?.thumbnail ||
    IMAGE_DEFAULT;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-col gap-5 md:flex-row md:items-start">
          <div className="h-40 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 md:h-32 md:w-56 dark:border-slate-700 dark:bg-slate-900">
            <img
              src={thumbnailSrc}
              alt={course?.title || "Course thumbnail"}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = IMAGE_DEFAULT;
              }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(course?.status)}`}
                >
                  {course?.status || "draft"}
                </span>

                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  {course?.is_free ? "Miễn phí" : "Có phí"}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                {course?.title || "Khóa học chưa có tiêu đề"}
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {course?.program?.title
                  ? `Chương trình: ${course.program.title}`
                  : `Program ID: ${course?.program_id || "—"}`}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-3 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                <span>Level: {course?.level ?? "—"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-indigo-500" />
                <span>{course?.language || "Chưa có ngôn ngữ"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                <span>{course?.participants || 0} học viên</span>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span>{course?.total_lessons || 0} bài học</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-indigo-500" />
                <span>{formatDurationHuman(Number(course?.duration || 0))}</span>
              </div>

              <div className="flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-indigo-500" />
                <span>{course?.slug || "Chưa có slug"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <span>
                Tạo lúc:{" "}
                {course?.created_at
                  ? format(new Date(course.created_at), "dd/MM/yyyy HH:mm")
                  : "—"}
              </span>
              <span>
                Cập nhật:{" "}
                {course?.updated_at
                  ? format(new Date(course.updated_at), "dd/MM/yyyy HH:mm")
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[220px] xl:items-end">
          <Button
            asChild
            className="w-full min-w-[200px] rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
          >
            <Link
              to={`/khoa-hoc/${course.id}/chinh-sua`}
              className="flex w-full items-center justify-center"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Sửa khóa học
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full min-w-[200px] rounded-xl border-slate-300 dark:border-slate-600"
          >
            <Link
              to={`/bai-hoc/tao-moi?course_id=${course.id}`}
              className="flex w-full items-center justify-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm bài học
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full min-w-[200px] rounded-xl border-slate-300 dark:border-slate-600"
          >
            <Link
              to={`/flashcards/tao-moi?course_id=${course.id}`}
              className="flex w-full items-center justify-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm flashcard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
