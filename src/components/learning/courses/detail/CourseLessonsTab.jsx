import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Pencil, Trash2, Plus, BookOpen } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

export default function CourseLessonsTab({
  courseId,
  lessons,
  lessonSearch,
  setLessonSearch,
  loading,
  flashcardCountByLesson,
  onDeleteLesson,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={lessonSearch}
          onChange={(e) => setLessonSearch(e.target.value)}
          placeholder="Tìm kiếm bài học..."
          className="max-w-xl"
        />

        <Button
          asChild
          className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
        >
          <Link to={`/bai-hoc/tao-moi?course_id=${courseId}`}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm bài học
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableCell className="px-4 py-3 font-semibold">Tiêu đề</TableCell>
              <TableCell className="px-4 py-3 font-semibold">Thứ tự</TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                Thời lượng
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold">Preview</TableCell>
              <TableCell className="px-4 py-3 font-semibold">Quiz</TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                Flashcards
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                Ngày tạo
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold text-right">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Spinner className="h-5 w-5" />
                    <span>Đang tải bài học...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : lessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                    <BookOpen className="h-6 w-6" />
                    <p>Chưa có bài học nào trong khóa học này.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson) => (
                <TableRow
                  key={lesson.id}
                  className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/30"
                >
                  <TableCell className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                    {lesson.title || "—"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {lesson.order ?? "—"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {lesson.duration ? `${lesson.duration} phút` : "—"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {lesson.is_preview ? "Có" : "Không"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {lesson.has_quiz ? "Có" : "Không"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {flashcardCountByLesson[lesson.id] || 0}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {lesson.created_at
                      ? format(new Date(lesson.created_at), "dd/MM/yyyy HH:mm")
                      : "—"}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="!text-indigo-600 hover:!bg-indigo-50 dark:!text-indigo-400 dark:hover:!bg-indigo-500/10"
                      >
                        <Link to={`/bai-hoc/${lesson.id}/chinh-sua`}>
                          <Pencil className="mr-1 h-4 w-4" />
                          Sửa
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="!text-emerald-600 hover:!bg-emerald-50 dark:!text-emerald-400 dark:hover:!bg-emerald-500/10"
                      >
                        <Link to={`/flashcards/tao-moi?lesson_id=${lesson.id}`}>
                          <Plus className="mr-1 h-4 w-4" />
                          Flashcard
                        </Link>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteLesson(lesson)}
                        className="!text-red-600 hover:!bg-red-50 dark:!text-red-400 dark:hover:!bg-red-500/10"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
