import React from "react";
import { format } from "date-fns";
import {
  Pencil,
  Trash2,
  FolderKanban,
  CheckCircle2,
  XCircle,
  Plus,
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

export default function CourseTableBody({
  data,
  visibleColumns,
  selectedIds,
  handleSelectRow,
  page,
  totalPages,
  setPage,
  search,
  setDeleteMode,
  setSelectedCourse,
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
                <EmptyTitle>Không tìm thấy khóa học</EmptyTitle>
                <EmptyDescription>
                  {search && search.trim() !== ""
                    ? "Không có khóa học nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác."
                    : "Bạn chưa thêm khóa học nào. Hãy bắt đầu bằng cách tạo một khóa học mới."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent />
            </Empty>
          </TableCell>
        </TableRow>
      ) : (
        data.map((course) => (
          <TableRow
            key={course.id}
            className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
          >
            {/* Checkbox */}
            <TableCell className="px-4 py-3 w-4">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedIds.includes(course.id)}
                  onCheckedChange={() => handleSelectRow(course.id)}
                />
              </div>
            </TableCell>

            {/* Title */}
            {visibleColumns.title && (
              <TableCell className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                {course.title ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={`/chuong-trinh-hoc/${course.program_id}/khoa-hoc/${course.id}`}
                        className="text-indigo-600 dark:text-indigo-400 transition-colors underline-offset-2 hover:underline"
                      >
                        {course.title}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      Nhấn để xem chi tiết khóa học và danh sách bài học (Unit)
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  "—"
                )}
              </TableCell>
            )}

            {visibleColumns.slug && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.slug || "—"}
              </TableCell>
            )}

            {visibleColumns.description && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.description || "—"}
              </TableCell>
            )}

             {visibleColumns.benefits && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.benefits || "—"}
              </TableCell>
            )}

            {visibleColumns.language && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.language || "—"}
              </TableCell>
            )}

            {visibleColumns.price && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.is_free ? "Miễn phí" : `${course.price} đ`}
              </TableCell>
            )}

            {visibleColumns.discount_price && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.discount_price ? `${course.discount_price} đ` : "—"}
              </TableCell>
            )}

            {visibleColumns.level && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.level}
              </TableCell>
            )}

            {visibleColumns.status && (
              <TableCell className="px-4 py-3">
                {course.status === "published" ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Đã xuất bản</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <XCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">{course.status}</span>
                  </div>
                )}
              </TableCell>
            )}

            {/* {visibleColumns.is_free && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.is_free ? "Miễn phí" : "Có phí"}
              </TableCell>
            )} */}

            {visibleColumns.duration && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.duration ? `${course.duration} phút` : "—"}
              </TableCell>
            )}

            {visibleColumns.participants && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.participants}
              </TableCell>
            )}

            {visibleColumns.total_lessons && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.total_lessons}
              </TableCell>
            )}

            {visibleColumns.program_id && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.program?.title || `ID ${course.program_id}` || "—"}
              </TableCell>
            )}

            {visibleColumns.category_id && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.category?.name || `ID ${course.category_id}` || "—"}
              </TableCell>
            )}

            {visibleColumns.user_id && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.user?.display_name || `ID ${course.user_id}` || "—"}
              </TableCell>
            )}

            {visibleColumns.created_at && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {course.created_at
                  ? format(new Date(course.created_at), "dd/MM/yyyy HH:mm")
                  : "—"}
              </TableCell>
            )}

            {/* Actions */}
            <TableCell className="w-auto px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                {/* Nút thêm bài học */}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 !text-green-600 dark:!text-green-500 hover:!bg-green-100 dark:!hover:bg-green-200 transition-colors cursor-pointer"
                >
                  <Link
                    to={`/chuong-trinh-hoc/${course.program_id}/khoa-hoc/${course.id}/bai-hoc/tao-moi`}
                  >
                    <Plus className="w-3 h-3" /> Bài học
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 !text-indigo-600 dark:!text-indigo-500 hover:!bg-indigo-100 dark:!hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <Link
                    to={`/chuong-trinh-hoc/${course.program_id}/khoa-hoc/${course.id}/chinh-sua`}
                  >
                    <Pencil className="w-4 h-4" />
                    Sửa
                  </Link>
                </Button>

                <Button
                  onClick={() => {
                    setDeleteMode("single");
                    setSelectedCourse(course);
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
