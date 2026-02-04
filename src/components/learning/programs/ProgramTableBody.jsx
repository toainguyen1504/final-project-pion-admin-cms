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

export default function ProgramTableBody({
  data,
  visibleColumns,
  selectedIds,
  handleSelectRow,
  page,
  totalPages,
  setPage,
  search,
  setDeleteMode,
  setSelectedProgram,
  setDeleteDialogOpen,
  onEditProgram,
}) {
  //   const navigate = useNavigate();

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
                <EmptyTitle>Không tìm thấy chương trình học</EmptyTitle>
                <EmptyDescription>
                  {search && search.trim() !== ""
                    ? "Không có chương trình nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác."
                    : "Bạn chưa thêm chương trình học nào. Hãy bắt đầu bằng cách tạo một chương trình mới."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent />
            </Empty>
          </TableCell>
        </TableRow>
      ) : (
        data.map((program) => (
          <TableRow
            key={program.id}
            className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
          >
            {/* Checkbox */}
            <TableCell className="px-4 py-3 w-4">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedIds.includes(program.id)}
                  onCheckedChange={() => handleSelectRow(program.id)}
                />
              </div>
            </TableCell>

            {/* Title */}
            {visibleColumns.title && (
              <TableCell className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                {program.title ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={`/chuong-trinh-hoc/${program.id}`}
                        className="text-indigo-600 dark:text-indigo-400 transition-colors underline-offset-2 hover:underline"
                      >
                        {program.title}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      Nhấn để xem chi tiết chương trình học và danh sách khóa
                      học
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  "—"
                )}
              </TableCell>
            )}

            {visibleColumns.slug && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {program.slug || "—"}
              </TableCell>
            )}

            {visibleColumns.description && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {program.description || "—"}
              </TableCell>
            )}

            {visibleColumns.status && (
              <TableCell className="px-4 py-3">
                {program.status === "active" ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Đang hoạt động</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <XCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Không hoạt động</span>
                  </div>
                )}
              </TableCell>
            )}

            {visibleColumns.user_id && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {program.user?.display_name || `ID ${program.user_id}` || "—"}
              </TableCell>
            )}

            {visibleColumns.created_at && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {program.created_at
                  ? format(new Date(program.created_at), "dd/MM/yyyy HH:mm")
                  : "—"}
              </TableCell>
            )}

            {/* Actions */}
            <TableCell className="w-auto px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                {/* Nút thêm khóa học */}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 !text-green-600 dark:!text-green-500 hover:!bg-green-100 dark:!hover:bg-green-200 transition-colors cursor-pointer"
                >
                  <Link to={`/chuong-trinh-hoc/${program.id}/tao-moi-khoa-hoc`}>
                    <Plus className="w-3 h-3" /> Khóa học
                  </Link>
                </Button>

                <Button
                  onClick={() => onEditProgram(program)} // gọi callback chỉnh sửa
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
                    setSelectedProgram(program);
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
