import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Pencil, Trash2, Plus, Layers3 } from "lucide-react";

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

export default function CourseFlashcardsTab({
  courseId,
  lessons,
  flashcards,
  flashcardSearch,
  setFlashcardSearch,
  flashcardLessonFilter,
  setFlashcardLessonFilter,
  loading,
  lessonIdToName,
  onDeleteFlashcard,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
          <Input
            value={flashcardSearch}
            onChange={(e) => setFlashcardSearch(e.target.value)}
            placeholder="Tìm kiếm vocabulary / meaning / phonetic..."
          />

          <select
            value={flashcardLessonFilter}
            onChange={(e) => setFlashcardLessonFilter(e.target.value)}
            className="form-select w-full"
          >
            <option value="all">Tất cả bài học</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>

        <Button
          asChild
          className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
        >
          <Link to={`/flashcards/tao-moi?course_id=${courseId}`}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm flashcard
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableCell className="px-4 py-3 font-semibold">
                Vocabulary
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold">Meaning</TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                Phonetic
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold">Lesson</TableCell>
              <TableCell className="px-4 py-3 font-semibold">Order</TableCell>
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
                <TableCell colSpan={7} className="py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Spinner className="h-5 w-5" />
                    <span>Đang tải flashcards...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : flashcards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Layers3 className="h-6 w-6" />
                    <p>Chưa có flashcard nào trong khóa học này.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              flashcards.map((card) => (
                <TableRow
                  key={card.id}
                  className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/30"
                >
                  <TableCell className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                    {card.vocabulary || "—"}
                  </TableCell>

                  <TableCell className="max-w-[320px] px-4 py-3 text-slate-500 dark:text-slate-400">
                    <span className="line-clamp-2">{card.meaning || "—"}</span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {card.phonetic || "—"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {lessonIdToName[card.lesson_id] ||
                      `Lesson #${card.lesson_id}`}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {card.order ?? "—"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {card.created_at
                      ? format(new Date(card.created_at), "dd/MM/yyyy HH:mm")
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
                        <Link to={`/flashcards/${card.id}/chinh-sua`}>
                          <Pencil className="mr-1 h-4 w-4" />
                          Sửa
                        </Link>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteFlashcard(card)}
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
