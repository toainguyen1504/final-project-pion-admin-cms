import React from "react";
import { format } from "date-fns";
import { Pencil, Trash2, FolderKanban } from "lucide-react";
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
import TablePagination from "@/components/shared/table/TablePagination";

export default function FlashcardTableBody({
  data,
  visibleColumns,
  selectedIds,
  handleSelectRow,
  page,
  totalPages,
  setPage,
  search,
  setDeleteMode,
  setSelectedFlashcard,
  setDeleteDialogOpen,
  onEditFlashcard,
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
                <EmptyTitle>Không tìm thấy flashcard</EmptyTitle>
                <EmptyDescription>
                  {search && search.trim() !== ""
                    ? "Không có flashcard nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác."
                    : "Bạn chưa thêm flashcard nào. Hãy bắt đầu bằng cách tạo một flashcard mới."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent />
            </Empty>
          </TableCell>
        </TableRow>
      ) : (
        data.map((flashcard) => (
          <TableRow
            key={flashcard.id}
            className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
          >
            {/* Checkbox */}
            <TableCell className="px-4 py-3 w-4">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedIds.includes(flashcard.id)}
                  onCheckedChange={() => handleSelectRow(flashcard.id)}
                />
              </div>
            </TableCell>

            {/* Từ vựng */}
            {visibleColumns.vocabulary && (
              <TableCell className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                {flashcard.vocabulary || "—"}
              </TableCell>
            )}

            {/* Phiên âm */}
            {visibleColumns.phonetic && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {flashcard.phonetic || "—"}
              </TableCell>
            )}

            {/*Nghĩa tiếng việt */}
            {visibleColumns.translation && (
              <TableCell className="px-4 py-3 text-slate-600 dark:text-slate-400">
                {flashcard.translation || "—"}
              </TableCell>
            )}

            {/* Example sentence */}
            {visibleColumns.example_sentence && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {flashcard.example_sentence || "—"}
              </TableCell>
            )}

            {/* Example translation */}
            {visibleColumns.example_translation && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {flashcard.example_translation || "—"}
              </TableCell>
            )}

            {/* Level */}
            {visibleColumns.level && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {flashcard.level}
              </TableCell>
            )}

            {/* Order */}
            {visibleColumns.order && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {flashcard.order}
              </TableCell>
            )}

            {/* Lesson */}
            {visibleColumns.lesson && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {flashcard.lesson?.title ||
                  `Lesson ID ${flashcard.lesson_id}` ||
                  "—"}
              </TableCell>
            )}

            {/* Course */}
            {visibleColumns.course && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {flashcard.lesson?.course?.title || "—"}
              </TableCell>
            )}

            {/* Program */}
            {visibleColumns.program && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {flashcard.lesson?.course?.program?.title || "—"}
              </TableCell>
            )}
            
            {/* Created at */}
            {visibleColumns.created_at && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {flashcard.created_at
                  ? format(new Date(flashcard.created_at), "dd/MM/yyyy HH:mm")
                  : "—"}
              </TableCell>
            )}

            {/* Actions */}
            <TableCell className="w-auto px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onEditFlashcard(flashcard)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 !text-indigo-600 dark:!text-indigo-500 hover:!bg-indigo-100 dark:!hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  Sửa
                </Button>

                <Button
                  onClick={() => {
                    setDeleteMode("single");
                    setSelectedFlashcard(flashcard);
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
