import React from "react";
import { format } from "date-fns";
import {
  Pencil,
  Trash2,
  FolderKanban,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import TablePagination from "@/components/shared/table/TablePagination";

export default function LessonTableBody({
  data,
  visibleColumns,
  selectedIds,
  handleSelectRow,
  page,
  totalPages,
  setPage,
  search,
  setDeleteMode,
  setSelectedLesson,
  setDeleteDialogOpen,
}) {
  const getVisibleColSpan = () => {
    const visibleCount = Object.values(visibleColumns).filter(Boolean).length;
    return visibleCount + 2;
  };

  return (
    <TableBody>
      {!Array.isArray(data) || data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={getVisibleColSpan()} className="py-10">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderKanban className="w-6 h-6" />
                </EmptyMedia>
                <EmptyTitle>Không tìm thấy bài học</EmptyTitle>
                <EmptyDescription>
                  {search && search.trim() !== ""
                    ? "Không có bài học nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác."
                    : "Bạn chưa thêm bài học nào. Hãy bắt đầu bằng cách tạo một bài học mới."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent />
            </Empty>
          </TableCell>
        </TableRow>
      ) : (
        data.map((lesson) => (
          <TableRow
            key={lesson.id}
            className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
          >
            {/* Checkbox */}
            <TableCell className="px-4 py-3 w-4">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedIds.includes(lesson.id)}
                  onCheckedChange={() => handleSelectRow(lesson.id)}
                />
              </div>
            </TableCell>

            {/* Title */}
            {visibleColumns.title && (
              <TableCell className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                {lesson.title ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={`/chuong-trinh-hoc/${lesson.course?.program_id}/khoa-hoc/${lesson.course_id}/bai-hoc/${lesson.id}`}
                        className="text-indigo-600 dark:text-indigo-400 transition-colors underline-offset-2 hover:underline"
                      >
                        {lesson.title}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      Nhấn để xem chi tiết bài học
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  "—"
                )}
              </TableCell>
            )}

            {visibleColumns.slug && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {lesson.slug || "—"}
              </TableCell>
            )}

            {visibleColumns.intro && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {lesson.intro || "—"}
              </TableCell>
            )}

            {visibleColumns.duration && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {lesson.duration ? `${lesson.duration} phút` : "—"}
              </TableCell>
            )}

            {visibleColumns.video_url && (
              <TableCell className="px-4 py-3 text-indigo-600 dark:text-indigo-400">
                {lesson.video_url ? (
                  <a
                    href={lesson.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-indigo-500"
                  >
                    Video
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            )}

            {visibleColumns.order && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {lesson.order || "—"}
              </TableCell>
            )}

            {visibleColumns.is_preview && (
              <TableCell className="px-4 py-3">
                {lesson.is_preview ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Có xem trước</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <XCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Không</span>
                  </div>
                )}
              </TableCell>
            )}

            {visibleColumns.is_quiz && (
              <TableCell className="px-4 py-3">
                {lesson.is_quiz ? (
                  <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Bài kiểm tra</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    —
                  </span>
                )}
              </TableCell>
            )}

            {visibleColumns.created_at && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {lesson.created_at
                  ? format(new Date(lesson.created_at), "dd/MM/yyyy HH:mm")
                  : "—"}
              </TableCell>
            )}

            {/* Actions */}
            <TableCell className="w-auto px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 !text-indigo-600 dark:!text-indigo-500 hover:!bg-indigo-100 dark:!hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <Link
                    to={`/chuong-trinh-hoc/${lesson.course?.program_id}/khoa-hoc/${lesson.course_id}/bai-hoc/${lesson.id}/chinh-sua`}
                  >
                    <Pencil className="w-4 h-4" />
                    Sửa
                  </Link>
                </Button>

                <Button
                  onClick={() => {
                    setDeleteMode("single");
                    setSelectedLesson(lesson);
                    setDeleteDialogOpen(true);
                  }}
                  variant="ghost"
                  size="sm"
                  className="!text-red-600 dark:!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-100 transition-colors duration-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))
      )}

      {/* Pagination */}
      <TableRow>
        <TableCell
          colSpan={getVisibleColSpan()}
          className="px-4 py-3 text-slate-700 dark:text-slate-300 select-none border-t border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
        >
          <div className="flex justify-end">
            <TablePagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
